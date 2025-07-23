const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

// Send a message (tenant or landlord)
router.post("/", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  const { property_id, message_text, recipient_id } = req.body;
  const sender_id = req.user.id;

  try {
    // Find or create chat for this property
    let chatRes = await pool.query(
      "SELECT id FROM chat WHERE property_id = $1",
      [property_id]
    );
    let chat_id;
    if (chatRes.rows.length === 0) {
      const newChat = await pool.query(
        "INSERT INTO chat (property_id) VALUES ($1) RETURNING id",
        [property_id]
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

    let unreadFor;
    if (recipient_id) {
      // Direct message: only recipient
      unreadFor = [recipient_id];
    } else {
      // Property-wide: all participants except sender
      const participantsRes = await pool.query(
        `SELECT a.id AS account_id
           FROM property p
           JOIN landlord l ON p.landlord_id = l.id
           JOIN account a ON l.account_id = a.id
           WHERE p.id = $1
         UNION
         SELECT a.id AS account_id
           FROM property_tenant pt
           JOIN tenant t ON pt.tenant_id = t.id
           JOIN account a ON t.account_id = a.id
           WHERE pt.property_id = $1`,
        [property_id]
      );
      const participants = participantsRes.rows.map(r => r.account_id);
      unreadFor = participants.filter(id => id !== sender_id);
    }

    // Mark as unread for intended recipients
    for (const account_id of unreadFor) {
      await pool.query(
        `INSERT INTO chat_message_status (chat_message_id, account_id, is_read)
         VALUES ($1, $2, FALSE)`,
        [msgRes.rows[0].id, account_id]
      );
    }

    res.status(201).json({ message: msgRes.rows[0] });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ error: "Failed to send message." });
  }
});

// Fetch contacts (landlord or tenants) - must be above property_id route!
router.get("/contacts", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  const account_id = req.user.id;

  try {
    // Get role for current user
    const roleRes = await pool.query(
      `SELECT r.role FROM account a JOIN account_role r ON a.role_id = r.id WHERE a.id = $1`,
      [account_id]
    );
    const role = roleRes.rows[0]?.role;

    let contacts = [];
    if (role === "landlord") {
      // Landlord: get all tenants for their properties
      const tenantsRes = await pool.query(
        `SELECT pt.property_id,
               p.address AS property_address,
               a.first_name || ' ' || a.last_name AS display_name,
               COUNT(CASE WHEN s.is_read = FALSE AND m.sender_id != $1 THEN 1 END) AS unread_count
          FROM property_tenant pt
          JOIN tenant t ON pt.tenant_id = t.id
          JOIN account a ON t.account_id = a.id
          JOIN property p ON pt.property_id = p.id
          LEFT JOIN chat c ON pt.property_id = c.property_id
          LEFT JOIN chat_message m ON c.id = m.chat_id
          LEFT JOIN chat_message_status s ON m.id = s.chat_message_id AND s.account_id = $1
          WHERE pt.property_id IN (
            SELECT id FROM property WHERE landlord_id = (
              SELECT id FROM landlord WHERE account_id = $1
            )
          )
          GROUP BY pt.property_id, p.address, a.first_name, a.last_name`
        , [account_id]
      );
      contacts = tenantsRes.rows;
    } else {
      // Tenant: get landlord for their property
      const landlordRes = await pool.query(
        `SELECT p.id AS property_id,
               p.address AS property_address,
               a.first_name || ' ' || a.last_name AS display_name,
               COUNT(CASE WHEN s.is_read = FALSE AND m.sender_id != $1 THEN 1 END) AS unread_count
          FROM property_tenant pt
          JOIN property p ON pt.property_id = p.id
          JOIN landlord l ON p.landlord_id = l.id
          JOIN account a ON l.account_id = a.id
          LEFT JOIN chat c ON p.id = c.property_id
          LEFT JOIN chat_message m ON c.id = m.chat_id
          LEFT JOIN chat_message_status s ON m.id = s.chat_message_id AND s.account_id = $1
          WHERE pt.tenant_id = (
            SELECT id FROM tenant WHERE account_id = $1
          )
          GROUP BY p.id, p.address, a.first_name, a.last_name`
        , [account_id]
      );
      contacts = landlordRes.rows;
    }

    res.json({ contacts });
  } catch (err) {
    console.error("Fetch contacts error:", err);
    res.status(500).json({ error: "Failed to fetch contacts." });
  }
});

// Fetch chat history for a property (with read/unread status)
router.get("/:property_id", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  const { property_id } = req.params;
  const account_id = req.user.id;

  try {
    // Get chat id for property
    const chatRes = await pool.query(
      "SELECT id FROM chat WHERE property_id = $1",
      [property_id]
    );
    if (chatRes.rows.length === 0) return res.json({ messages: [] });
    const chat_id = chatRes.rows[0].id;

    // Get messages and read status for this user
    const messagesRes = await pool.query(
      `SELECT m.id, m.sender_id, m.message_text, m.sent_timestamp,
              s.is_read
         FROM chat_message m
         LEFT JOIN chat_message_status s
           ON m.id = s.chat_message_id AND s.account_id = $2
         WHERE m.chat_id = $1
         ORDER BY m.sent_timestamp ASC`,
      [chat_id, account_id]
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
  const { message_ids } = req.body; // array of message ids
  const account_id = req.user.id;

  try {
    for (const msg_id of message_ids) {
      await pool.query(
        `UPDATE chat_message_status SET is_read = TRUE
         WHERE chat_message_id = $1 AND account_id = $2`,
        [msg_id, account_id]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ error: "Failed to mark messages as read." });
  }
});

module.exports = router;