const express = require("express");
const multer = require("multer");
const sanitize = require("sanitize-filename");
const { createClient } = require("@supabase/supabase-js");
const AWS = require("aws-sdk");

// Configure AWS S3 for Supabase Free Tier
const s3 = new AWS.S3({
  endpoint: process.env.SUPABASE_S3_ENDPOINT,
  accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
  region: process.env.SUPABASE_S3_REGION || "eu-west-2",
});

// Define S3_BUCKET from environment variables
const S3_BUCKET = process.env.SUPABASE_S3_BUCKET;

// Supabase admin/service client (optional, if you later add a service role key)
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || null;
const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) : null;

// helper to convert stream to buffer for GetObject
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

const router = express.Router();

// multer memory storage so we can send buffer to Supabase
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

// helper: get DB pool from app
function getPool(req) {
  return req.app.get("pool");
}

// helper: determine calling account id from auth middleware (adaptable)
function getAccountIdFromReq(req) {
  // common possibilities: req.account, req.user, req.userId, req.account_id
  return (
    (req.user && (req.user.id || req.user.account_id)) ||
    (req.account && (req.account.id || req.account_id)) ||
    req.account_id ||
    req.user_id ||
    null
  );
}

// helper: check if account is landlord owner of landlord_id
async function isAccountLandlordOf(pool, accountId, landlordId) {
  if (!accountId || !landlordId) return false;
  const res = await pool.query("SELECT 1 FROM public.landlord WHERE id = $1 AND account_id = $2 LIMIT 1", [landlordId, accountId]);
  return res.rowCount > 0;
}

// helper: build storage path
function buildStoragePath({ landlord_id, property_id, document_id, filename }) {
  const safe = sanitize(filename).replace(/\s+/g, "_").slice(0, 200);
  const propSegment = property_id ? `property_${property_id}` : "property_none";
  const landlordSegment = landlord_id ? `landlord_${landlord_id}` : "landlord_none";
  return `documents/${landlordSegment}/${propSegment}/document_${document_id}-${safe}`;
}

// POST /upload
// expects multipart/form-data with field "file" and optional fields:
// landlord_id, property_id, tenant_id, category, shared_with_tenant, custom_name
router.post("/upload", upload.single("file"), async (req, res) => {
  const pool = getPool(req);
  const accountId = getAccountIdFromReq(req);
  if (!accountId) return res.status(401).json({ success: false, error: "Not authenticated" });

  const file = req.file;
  if (!file) return res.status(400).json({ success: false, error: "No file uploaded (field name must be 'file')" });

  const {
    landlord_id: landlordIdInput,
    property_id: propertyIdInput,
    tenant_id: tenantIdInput,
    category,
    shared_with_tenant: sharedWithTenantInput,
    custom_name: customName,
  } = req.body;

  const shared_with_tenant = sharedWithTenantInput === "true" || sharedWithTenantInput === "1" || sharedWithTenantInput === true;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // determine landlord_id:
    let landlord_id = landlordIdInput ? parseInt(landlordIdInput, 10) : null;
    let property_id = propertyIdInput ? parseInt(propertyIdInput, 10) : null;
    let tenant_id = tenantIdInput ? parseInt(tenantIdInput, 10) : null;

    if (!landlord_id && property_id) {
      // look up landlord from property
      const r = await client.query("SELECT landlord_id FROM public.property WHERE id = $1 LIMIT 1", [property_id]);
      if (r.rowCount === 1) landlord_id = r.rows[0].landlord_id;
    }

    // permission check: if landlord_id provided, uploader must be that landlord's account
    const isLandlordOwner = landlord_id ? await isAccountLandlordOf(client, accountId, landlord_id) : false;
    if (landlord_id && !isLandlordOwner) {
      await client.query("ROLLBACK");
      return res.status(403).json({ success: false, error: "Insufficient permissions for landlord" });
    }
    // proceed - accountId will be recorded as uploader
    // Insert placeholder DB row to get document id
    const insertText = `
      INSERT INTO public.documents
        (account_id, landlord_id, property_id, tenant_id, file_name, file_type, file_size, file_url, shared_with_tenant, category, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,'', $8, $9, now(), now())
      RETURNING id
    `;
    const originalFilename = customName ? String(customName) : file.originalname;
    const insertValues = [
      accountId,
      landlord_id,
      property_id,
      tenant_id,
      originalFilename,
      file.mimetype,
      file.size,
      shared_with_tenant,
      category || null,
    ];
    const insertRes = await client.query(insertText, insertValues);
    const documentId = insertRes.rows[0].id;

    // build path and upload to Supabase storage
    const path = buildStoragePath({
      landlord_id: landlord_id,
      property_id: property_id,
      document_id: documentId,
      filename: originalFilename,
    });

    // upload buffer to storage (prefer supabaseAdmin, fallback to S3)
    const bucket = S3_BUCKET;
    if (supabaseAdmin) {
      const { error: uploadError } = await supabaseAdmin.storage.from(bucket).upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

      if (uploadError) {
        // cleanup DB row
        await client.query("DELETE FROM public.documents WHERE id = $1", [documentId]);
        await client.query("COMMIT");
        return res.status(500).json({ success: false, error: "Upload to storage failed", details: uploadError.message || uploadError });
      }
    } else if (s3) {
      try {
        await s3.upload({
          Bucket: bucket,
          Key: path,
          Body: file.buffer,
          ContentType: file.mimetype,
        }).promise();
      } catch (err) {
        await client.query("DELETE FROM public.documents WHERE id = $1", [documentId]);
        await client.query("COMMIT");
        return res.status(500).json({ success: false, error: "S3 upload failed", details: err.message });
      }
    } else {
      await client.query("ROLLBACK");
      return res.status(500).json({ success: false, error: "No storage client configured on server. Provide file_url from frontend or configure S3/service key." });
    }

    // update DB row with final metadata and file_url
    const fileUrl = path; // store storage path; generate signed URL for download if needed on server
    await client.query(
      `UPDATE public.documents SET file_url = $1, file_name = $2, file_type = $3, file_size = $4, updated_at = now() WHERE id = $5`,
      [fileUrl, originalFilename, file.mimetype, file.size, documentId]
    );

    await client.query("COMMIT");

    // return metadata
    return res.json({
      success: true,
      document: {
        id: documentId,
        account_id: accountId,
        landlord_id,
        property_id,
        tenant_id,
        file_name: originalFilename,
        file_type: file.mimetype,
        file_size: file.size,
        file_url: fileUrl,
        shared_with_tenant,
        category: category || null,
        created_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Document upload error:", err);
    return res.status(500).json({ success: false, error: err.message || "Upload failed" });
  } finally {
    client.release();
  }
});

// DELETE /:id - delete document (storage + DB)
router.delete("/:id", async (req, res) => {
  const pool = getPool(req);
  const accountId = getAccountIdFromReq(req);
  if (!accountId) return res.status(401).json({ success: false, error: "Not authenticated" });

  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ success: false, error: "Invalid document id" });

  const client = await pool.connect();
  try {
    // find document
    const { rows } = await client.query("SELECT * FROM public.documents WHERE id = $1 LIMIT 1", [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, error: "Document not found" });
    const doc = rows[0];

    // permission check: uploader or landlord owner
    const isUploader = String(doc.account_id) === String(accountId);
    const isLandlordOwner = await isAccountLandlordOf(client, accountId, doc.landlord_id);
    if (!isUploader && !isLandlordOwner) return res.status(403).json({ success: false, error: "Insufficient permissions" });

    // delete file from storage (supabaseAdmin or S3)
    const bucket = S3_BUCKET;
    if (doc.file_url) {
      if (supabaseAdmin) {
        const { error: removeError } = await supabaseAdmin.storage.from(bucket).remove([doc.file_url]);
        if (removeError) console.warn("Supabase remove error:", removeError);
      } else if (s3) {
        try {
          await s3.deleteObject({ Bucket: bucket, Key: doc.file_url }).promise();
        } catch (err) {
          console.warn("S3 delete error:", err.message || err);
        }
      } else {
        console.warn("No storage client: metadata will be deleted but file may remain in storage.");
      }
    }

    await client.query("DELETE FROM public.documents WHERE id = $1", [id]);
    return res.json({ success: true, id });
  } catch (err) {
    console.error("Delete document error:", err);
    return res.status(500).json({ success: false, error: err.message || "Delete failed" });
  } finally {
    client.release();
  }
});

// PATCH /:id/rename - rename file metadata (and optionally move storage if move=true)
router.patch("/:id/rename", async (req, res) => {
  const pool = getPool(req);
  const accountId = getAccountIdFromReq(req);
  if (!accountId) return res.status(401).json({ success: false, error: "Not authenticated" });

  const id = parseInt(req.params.id, 10);
  const { new_name: newName, move_storage: moveStorageFlag } = req.body;
  if (!id || !newName) return res.status(400).json({ success: false, error: "Missing id or new_name" });

  const moveStorage = moveStorageFlag === "true" || moveStorageFlag === true;

  const client = await pool.connect();
  try {
    const { rows } = await client.query("SELECT * FROM public.documents WHERE id = $1 LIMIT 1", [id]);
    if (!rows.length) return res.status(404).json({ success: false, error: "Document not found" });
    const doc = rows[0];

    // permission check
    const isUploader = String(doc.account_id) === String(accountId);
    const isLandlordOwner = await isAccountLandlordOf(client, accountId, doc.landlord_id);
    if (!isUploader && !isLandlordOwner) return res.status(403).json({ success: false, error: "Insufficient permissions" });

    const bucket = "documents";
    const oldPath = doc.file_url;
    const sanitized = sanitize(String(newName)).replace(/\s+/g, "_").slice(0, 200);

    if (moveStorage && oldPath) {
      // build new path using same landlord/property/document id
      const newPath = buildStoragePath({
        landlord_id: doc.landlord_id,
        property_id: doc.property_id,
        document_id: id,
        filename: sanitized,
      });

      if (supabaseAdmin) {
        const { data: downloadData, error: downloadError } = await supabaseAdmin.storage.from(bucket).download(oldPath);
        if (downloadError) {
          console.warn("Download error during rename move:", downloadError);
          return res.status(500).json({ success: false, error: "Failed to download existing file for move" });
        }
        const arrayBuffer = await downloadData.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const { error: uploadError } = await supabaseAdmin.storage.from(bucket).upload(newPath, buffer, {
          contentType: doc.file_type || undefined,
          upsert: false,
        });
        if (uploadError) return res.status(500).json({ success: false, error: "Failed to upload moved file", details: uploadError.message });
        const { error: removeError } = await supabaseAdmin.storage.from(bucket).remove([oldPath]);
        if (removeError) console.warn("Failed to remove old file after move:", removeError);
      } else if (s3) {
        try {
          const getResp = await s3.getObject({ Bucket: bucket, Key: oldPath }).promise();
          const buffer = getResp.Body;
          await s3.upload({ Bucket: bucket, Key: newPath, Body: buffer, ContentType: doc.file_type || undefined }).promise();
          await s3.deleteObject({ Bucket: bucket, Key: oldPath }).promise();
        } catch (err) {
          console.warn("S3 move error:", err);
          return res.status(500).json({ success: false, error: "S3 move failed", details: err.message });
        }
      } else {
        return res.status(500).json({ success: false, error: "No storage client configured to move file. Provide file_url changes from client instead." });
      }

      // update DB file_url and file_name
      await client.query("UPDATE public.documents SET file_url = $1, file_name = $2, updated_at = now() WHERE id = $3", [newPath, newName, id]);
      return res.json({ success: true, id, file_name: newName, file_url: newPath });
    }

    // only update metadata
    await client.query("UPDATE public.documents SET file_name = $1, updated_at = now() WHERE id = $2", [newName, id]);
    return res.json({ success: true, id, file_name: newName, file_url: oldPath });
  } catch (err) {
    console.error("Rename error:", err);
    return res.status(500).json({ success: false, error: err.message || "Rename failed" });
  } finally {
    client.release();
  }
});

// PATCH /:id/update - update category, shared_with_tenant, property assignment
// body may include: category, shared_with_tenant, property_id, move_storage (boolean)
router.patch("/:id/update", async (req, res) => {
  const pool = getPool(req);
  const accountId = getAccountIdFromReq(req);
  if (!accountId) return res.status(401).json({ success: false, error: "Not authenticated" });

  const id = parseInt(req.params.id, 10);
  const { category, shared_with_tenant, property_id: propertyIdInput, move_storage: moveStorageFlag } = req.body;
  const moveStorage = moveStorageFlag === "true" || moveStorageFlag === true;

  if (!id) return res.status(400).json({ success: false, error: "Invalid document id" });

  const client = await pool.connect();
  try {
    const { rows } = await client.query("SELECT * FROM public.documents WHERE id = $1 LIMIT 1", [id]);
    if (!rows.length) return res.status(404).json({ success: false, error: "Document not found" });
    const doc = rows[0];

    const isUploader = String(doc.account_id) === String(accountId);
    const isLandlordOwner = await isAccountLandlordOf(client, accountId, doc.landlord_id);
    if (!isUploader && !isLandlordOwner) return res.status(403).json({ success: false, error: "Insufficient permissions" });

    let property_id = propertyIdInput ? parseInt(propertyIdInput, 10) : doc.property_id;
    let landlord_id = doc.landlord_id;

    if (propertyIdInput) {
      // get landlord for new property if exists
      const r = await client.query("SELECT landlord_id FROM public.property WHERE id = $1 LIMIT 1", [property_id]);
      if (r.rowCount === 0) return res.status(400).json({ success: false, error: "Property not found" });
      landlord_id = r.rows[0].landlord_id;
    }

    const updates = [];
    const params = [];
    let idx = 1;

    if (typeof category !== "undefined") {
      updates.push(`category = $${idx++}`);
      params.push(category);
    }
    if (typeof shared_with_tenant !== "undefined") {
      const val = shared_with_tenant === "true" || shared_with_tenant === true;
      updates.push(`shared_with_tenant = $${idx++}`);
      params.push(val);
    }
    if (typeof propertyIdInput !== "undefined") {
      updates.push(`property_id = $${idx++}`);
      params.push(property_id);
      updates.push(`landlord_id = $${idx++}`);
      params.push(landlord_id);
    }

    if (updates.length === 0) return res.status(400).json({ success: false, error: "No fields to update" });

    // if property changed and moveStorage requested, move object in storage
    const bucket = S3_BUCKET;
    let newFileUrl = doc.file_url;
    if (moveStorage && propertyIdInput && doc.file_url) {
      const newPath = buildStoragePath({
        landlord_id,
        property_id,
        document_id: id,
        filename: doc.file_name,
      });

      // download + re-upload + remove: support supabaseAdmin OR S3
      if (supabaseAdmin) {
        const { data: downloadData, error: downloadError } = await supabaseAdmin.storage.from(bucket).download(doc.file_url);
        if (downloadError) {
          console.warn("Download error during update move:", downloadError);
          return res.status(500).json({ success: false, error: "Failed to download existing file for move" });
        }
        const arrayBuffer = await downloadData.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const { error: uploadError } = await supabaseAdmin.storage.from(bucket).upload(newPath, buffer, {
          contentType: doc.file_type || undefined,
          upsert: false,
        });
        if (uploadError) return res.status(500).json({ success: false, error: "Failed to upload moved file", details: uploadError.message });
        const { error: removeError } = await supabaseAdmin.storage.from(bucket).remove([doc.file_url]);
        if (removeError) console.warn("Failed to remove old file after move:", removeError);
      } else if (s3) {
        try {
          const getResp = await s3.getObject({ Bucket: bucket, Key: doc.file_url }).promise();
          const buffer = getResp.Body;
          await s3.upload({ Bucket: bucket, Key: newPath, Body: buffer, ContentType: doc.file_type || undefined }).promise();
          await s3.deleteObject({ Bucket: bucket, Key: doc.file_url }).promise();
        } catch (err) {
          console.warn("S3 move error:", err);
          return res.status(500).json({ success: false, error: "S3 move failed", details: err.message });
        }
      } else {
        return res.status(500).json({ success: false, error: "No storage client configured to move file. Provide file_url changes from client instead." });
      }

      newFileUrl = newPath;
      updates.push(`file_url = $${idx++}`);
      params.push(newFileUrl);
    }

    params.push(id);
    const updateQuery = `UPDATE public.documents SET ${updates.join(", ")}, updated_at = now() WHERE id = $${idx} RETURNING *`;
    const updRes = await client.query(updateQuery, params);

    return res.json({ success: true, document: updRes.rows[0] });
  } catch (err) {
    console.error("Update document error:", err);
    return res.status(500).json({ success: false, error: err.message || "Update failed" });
  } finally {
    client.release();
  }
});

// GET /api/file-explorer - Fetch all uploaded documents
router.get("/", async (req, res) => {
  const pool = getPool(req);
  const accountId = getAccountIdFromReq(req);
  if (!accountId) return res.status(401).json({ success: false, error: "Not authenticated" });

  try {
    const query = `
      SELECT 
        d.id,
        d.file_name,
        d.file_url,
        d.category,
        d.shared_with_tenant,
        d.created_at,
        d.updated_at,
        p.name AS property_name,
        CONCAT_WS(', ', p.address, p.city, p.county, p.postcode) AS property_address,
        CONCAT(a.first_name, ' ', a.last_name) AS tenant_name
      FROM public.documents d
      LEFT JOIN public.property p ON d.property_id = p.id
      LEFT JOIN public.tenant t ON d.tenant_id = t.id
      LEFT JOIN public.account a ON t.account_id = a.id
      WHERE d.account_id = $1
      ORDER BY d.created_at DESC
    `;

    const { rows } = await pool.query(query, [accountId]);

    // Generate signed URLs for private buckets
    const documents = await Promise.all(
      rows.map(async (doc) => {
        let signedUrl = null;
        try {
          const url = s3.getSignedUrl("getObject", {
            Bucket: process.env.SUPABASE_S3_BUCKET,
            Key: doc.file_url, // Relative path inside the bucket
            Expires: 3600, // 1 hour
          });
          signedUrl = url;
        } catch (err) {
          console.error("Error generating signed URL for file:", doc.file_url, err.message);
        }

        return {
          ...doc,
          file_url: signedUrl || `${process.env.SUPABASE_S3_ENDPOINT}/storage/v1/object/public/${S3_BUCKET}/${doc.file_url}`, // Fallback to public URL
        };
      })
    );

    res.json({ documents });
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ success: false, error: "Failed to fetch documents" });
  }
});

// GET /download/:id - Generate signed URL for a document
router.get("/download/:id", async (req, res) => {
  const pool = getPool(req);
  const accountId = getAccountIdFromReq(req);
  if (!accountId) return res.status(401).json({ success: false, error: "Not authenticated" });

  const documentId = parseInt(req.params.id, 10);
  if (!documentId) return res.status(400).json({ success: false, error: "Invalid document ID" });

  try {
    // Fetch the document from the database
    const { rows } = await pool.query(
      "SELECT file_url FROM public.documents WHERE id = $1 AND account_id = $2",
      [documentId, accountId]
    );

    if (rows.length === 0) return res.status(404).json({ success: false, error: "Document not found" });

    const filePath = rows[0].file_url; // Must be the relative path inside the bucket

    // Generate signed URL using AWS S3
    const url = s3.getSignedUrl("getObject", {
      Bucket: process.env.SUPABASE_S3_BUCKET, // Your bucket name
      Key: filePath,                          // Path inside the bucket
      Expires: 3600,                          // URL valid for 1 hour
    });

    res.json({ success: true, signedUrl: url });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;