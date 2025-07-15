import React, { useState, useEffect } from "react";
import "./messages.css";
import Sidebar from "../sidebar/sidebar.jsx";

function formatTimestamp(ts) {
  return new Date(ts).toLocaleString();
}

const BACKEND_URL = "https://mypropertypal-3.onrender.com";

export default function Messages() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch contacts (tenants for landlord, landlord for tenant)
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${BACKEND_URL}/api/messages/contacts`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((res) => res.json())
      .then((data) => setContacts(data.contacts || []));
  }, []);

  // Fetch messages for selected contact/property
  useEffect(() => {
    if (!selectedContact) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch(`${BACKEND_URL}/api/messages/${selectedContact.property_id}`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || []);
        setLoading(false);
        // Mark unread messages as read
        const unreadIds = (data.messages || [])
          .filter(m => !m.is_read && m.sender_id !== getAccountId())
          .map(m => m.id);
        if (unreadIds.length) {
          fetch(`${BACKEND_URL}/api/messages/read`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify({ message_ids: unreadIds }),
          });
        }
      });
  }, [selectedContact]);

  // Helper to get current account id from token (decode JWT)
  function getAccountId() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch {
      return null;
    }
  }

  // Send a new message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedContact) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        property_id: selectedContact.property_id,
        message_text: newMsg.trim(),
      }),
    });
    if (res.ok) {
      setNewMsg("");
      // Refresh messages
      fetch(`${BACKEND_URL}/api/messages/${selectedContact.property_id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      })
        .then((res) => res.json())
        .then((data) => setMessages(data.messages || []));
    }
  };

  return (
    <div className="messages-app">
      <Sidebar />
      <div className="messages-content">
        <main className="messages-main">
          {selectedContact ? (
            <>
              <div className="messages-header">
                <h4>
                  Chat with {selectedContact.display_name}
                </h4>
                <div className="chat-property-address">
                  Property: {selectedContact.property_address}
                </div>
              </div>
              <div className="messages-history">
                {loading ? (
                  <div className="loading">Loading...</div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={
                        "message-bubble " +
                        (msg.sender_id === getAccountId() ? "sent" : "received")
                      }
                    >
                      <div className="message-text">{msg.message_text}</div>
                      <div className="message-meta">
                        <span className="timestamp">{formatTimestamp(msg.sent_timestamp)}</span>
                        {msg.sender_id === getAccountId() ? (
                          <span className={"read-receipt " + (msg.is_read ? "read" : "unread")}>
                            {msg.is_read ? "Read" : "Delivered"}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <form className="messages-input" onSubmit={handleSend}>
                <input
                  type="text"
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  placeholder="Type a message..."
                />
                <button type="submit">Send</button>
              </form>
            </>
          ) : (
            <div className="messages-placeholder">Select a chat to start messaging.</div>
          )}
        </main>
        <aside className="messages-contacts">
          <h3>Chats</h3>
          <ul>
            {contacts.map((c) => (
              <li
                key={c.property_id}
                className={selectedContact && selectedContact.property_id === c.property_id ? "selected" : ""}
                onClick={() => setSelectedContact(c)}
              >
                <span className="contact-name">{c.display_name}</span>
                <span className="contact-address">{c.property_address}</span>
                {c.unread_count > 0 && (
                  <span className="unread-badge">{c.unread_count}</span>
                )}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

//wassup