const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

// Send a message (tenant or landlord)
router.post("/", authenticate, async (req, res) => {
  const pool = req.app.get("pool");
  const { message_text, recipient_id } = req.body;
  const sender_id = req.user.id;

  try {
    // Ensure recipient_id is provided
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

// Fetch contacts (landlord or tenants) - must be above property_id route!
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
      // Landlord: Get all tenants they have chats with
      const tenantsRes = await pool.query(
        `SELECT c.id AS chat_id,
                c.recipient_id AS account_id, -- Tenant's account ID
                a.first_name || ' ' || a.last_name AS display_name,
                COUNT(CASE WHEN s.is_read = FALSE AND m.sender_id != $1 THEN 1 END) AS unread_count
         FROM chat c
         JOIN account a ON c.recipient_id = a.id
         LEFT JOIN chat_message m ON c.id = m.chat_id
         LEFT JOIN chat_message_status s ON m.id = s.chat_message_id AND s.account_id = $1
         WHERE c.sender_id = $1
         GROUP BY c.id, c.recipient_id, a.first_name, a.last_name`,
        [account_id]
      );
      contacts = tenantsRes.rows;
    } else if (role === "tenant") {
      // Tenant: Get the landlord they have a chat with
      const landlordRes = await pool.query(
        `SELECT c.id AS chat_id,
                c.sender_id AS account_id, -- Landlord's account ID
                a.first_name || ' ' || a.last_name AS display_name,
                COUNT(CASE WHEN s.is_read = FALSE AND m.sender_id != $1 THEN 1 END) AS unread_count
         FROM chat c
         JOIN account a ON c.sender_id = a.id
         LEFT JOIN chat_message m ON c.id = m.chat_id
         LEFT JOIN chat_message_status s ON m.id = s.chat_message_id AND s.account_id = $1
         WHERE c.recipient_id = $1
         GROUP BY c.id, c.sender_id, a.first_name, a.last_name`,
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