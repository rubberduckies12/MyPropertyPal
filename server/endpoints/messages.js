const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

// Send a message (tenant or landlord)
router.post("/", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  const { message_text, recipient_id } = req.body;
  const sender_id = req.user.id;

  try {
    if (!recipient_id) {
      return res.status(400).json({ error: "Recipient ID is required." });
    }

    // Find or create chat between sender and recipient
    let chatRes = await pool.query(
      `SELECT id FROM chat WHERE (sender_id = $1 AND recipient_id = $2)
                                OR (sender_id = $2 AND recipient_id = $1)`,
      [sender_id, recipient_id]
    );
    let chat_id;
    if (chatRes.rows.length === 0) {
      const newChat = await pool.query(
        "INSERT INTO chat (sender_id, recipient_id) VALUES ($1, $2) RETURNING id",
        [sender_id, recipient_id]
      );
      chat_id = newChat.rows[0].id;
    } else {
      chat_id = chatRes.rows[0].id;
    }

    // Insert message
    const msgRes = await pool.query(
      `INSERT INTO chat_message (chat_id, sender_id, message_text)
       VALUES ($1, $2, $3) RETURNING *`,
      [chat_id, sender_id, message_text]
    );

    // Mark as unread for the recipient
    await pool.query(
      `INSERT INTO chat_message_status (chat_message_id, account_id, is_read)
       VALUES ($1, $2, FALSE)`,
      [msgRes.rows[0].id, recipient_id]
    );

    res.status(201).json({ message: msgRes.rows[0] });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ error: "Failed to send message." });
  }
});

// Fetch contacts (landlord or tenants)
router.get("/contacts", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  const account_id = req.user.id; // Current user's account ID

  try {
    // Get role for current user
    const roleRes = await pool.query(
      `SELECT r.role FROM account a 
       JOIN account_role r ON a.role_id = r.id 
       WHERE a.id = $1`,
      [account_id]
    );
    const role = roleRes.rows[0]?.role;

    let contacts = [];
    if (role === "landlord") {
      // Landlord: Get all tenants associated with their properties
      const tenantsRes = await pool.query(
        `SELECT DISTINCT a.id AS account_id,
                a.first_name || ' ' || a.last_name AS display_name,
                p.address AS property_address,
                COUNT(CASE WHEN s.is_read = FALSE AND m.sender_id != $1 THEN 1 END) AS unread_count
         FROM property p
         JOIN property_tenant pt ON p.id = pt.property_id
         JOIN tenant t ON pt.tenant_id = t.id
         JOIN account a ON t.account_id = a.id
         LEFT JOIN chat c ON c.sender_id = $1 AND c.recipient_id = a.id
         LEFT JOIN chat_message m ON c.id = m.chat_id
         LEFT JOIN chat_message_status s ON m.id = s.chat_message_id AND s.account_id = $1
         WHERE p.landlord_id = (
           SELECT id FROM landlord WHERE account_id = $1
         )
         GROUP BY a.id, a.first_name, a.last_name, p.address`,
        [account_id]
      );
      contacts = tenantsRes.rows;
    } else if (role === "tenant") {
      // Tenant: Get the landlord associated with their property
      const landlordRes = await pool.query(
        `SELECT DISTINCT a.id AS account_id,
                a.first_name || ' ' || a.last_name AS display_name,
                p.address AS property_address,
                COUNT(CASE WHEN s.is_read = FALSE AND m.sender_id != $1 THEN 1 END) AS unread_count
         FROM property_tenant pt
         JOIN property p ON pt.property_id = p.id
         JOIN landlord l ON p.landlord_id = l.id
         JOIN account a ON l.account_id = a.id
         LEFT JOIN chat c ON c.sender_id = a.id AND c.recipient_id = $1
         LEFT JOIN chat_message m ON c.id = m.chat_id
         LEFT JOIN chat_message_status s ON m.id = s.chat_message_id AND s.account_id = $1
         WHERE pt.tenant_id = (
           SELECT id FROM tenant WHERE account_id = $1
         )
         GROUP BY a.id, a.first_name, a.last_name, p.address`,
        [account_id]
      );
      contacts = landlordRes.rows;
    }

    res.json({ contacts });
  } catch (err) {
    console.error("Fetch contacts error:", err);
    res.status(500).json({ error: "Failed to fetch contacts." });
  }
});

// Fetch chat history between current user and a recipient
router.get("/:recipient_id", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  const { recipient_id } = req.params;
  const account_id = req.user.id;

  try {
    const chatRes = await pool.query(
      `SELECT id FROM chat 
       WHERE (sender_id = $1 AND recipient_id = $2)
          OR (sender_id = $2 AND recipient_id = $1)`,
      [account_id, recipient_id]
    );

    if (chatRes.rows.length === 0) {
      return res.json({ messages: [] });
    }

    const chat_id = chatRes.rows[0].id;

    // Fetch messages for the chat
    const messagesRes = await pool.query(
      `SELECT m.id, m.sender_id, m.message_text, m.sent_timestamp,
              COALESCE(s.is_read, FALSE) AS is_read
         FROM chat_message m
         LEFT JOIN chat_message_status s
           ON m.id = s.chat_message_id AND s.account_id = $1
         WHERE m.chat_id = $2
         ORDER BY m.sent_timestamp ASC`,
      [account_id, chat_id]
    );

    res.json({ messages: messagesRes.rows });
  } catch (err) {
    console.error("Fetch messages error:", err);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});

// Mark messages as read
router.post("/read", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  const { message_ids } = req.body;
  const account_id = req.user.id;

  try {
    if (!message_ids || message_ids.length === 0) {
      return res.status(400).json({ error: "No message IDs provided." });
    }

    // Use a single query to update all message IDs
    const query = `
      UPDATE chat_message_status
      SET is_read = TRUE
      WHERE chat_message_id = ANY($1::int[]) AND account_id = $2
    `;
    await pool.query(query, [message_ids, account_id]);

    res.json({ success: true });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ error: "Failed to mark messages as read." });
  }
});

// Count unread messages
router.get("/unread/count", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  const account_id = req.user.id;

  try {
    const result = await pool.query(
      `SELECT COUNT(*) AS unread_count
       FROM chat_message_status
       WHERE account_id = $1 AND is_read = FALSE`,
      [account_id]
    );

    res.json({ unread_count: Number(result.rows[0].unread_count) });
  } catch (err) {
    console.error("Failed to fetch unread message count:", err);
    res.status(500).json({ error: "Failed to fetch unread message count." });
  }
});

module.exports = router;