import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/sidebar.jsx";
import { HiMail } from "react-icons/hi";

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
    <div className="flex min-h-screen bg-blue-50">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex flex-1">
        {/* Contacts Sidebar */}
        <aside className="w-72 bg-blue-50 border-r border-blue-100 flex flex-col">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-blue-100 h-20">
            <HiMail className="text-blue-500 text-xl" />
            <h3 className="text-base font-bold text-blue-700">Chats</h3>
          </div>
          <ul className="flex-1 overflow-y-auto px-2 py-2">
            {contacts.length === 0 ? (
              <div className="text-blue-400 text-center mt-10">No chats yet.</div>
            ) : (
              contacts.map((c) => (
                <li
                  key={c.property_id}
                  className={`group cursor-pointer flex items-center gap-3 px-2 py-2 rounded-lg transition
                    ${selectedContact && selectedContact.property_id === c.property_id
                      ? "bg-blue-100"
                      : "hover:bg-blue-50"
                    }`}
                  onClick={() => setSelectedContact(c)}
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-200 text-blue-700 font-bold text-lg">
                    {c.display_name ? c.display_name[0].toUpperCase() : "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-semibold text-blue-700 group-hover:text-blue-900">{c.display_name}</div>
                    <div className="truncate text-xs text-blue-400">{c.property_address}</div>
                  </div>
                  {c.unread_count > 0 && (
                    <span className="bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs font-bold ml-2">
                      {c.unread_count}
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        </aside>
        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-blue-50 relative">
          {selectedContact ? (
            <>
              <div className="border-b border-blue-100 px-6 py-4 h-20 flex flex-col justify-center">
                <h4 className="text-lg font-bold text-blue-700">
                  Chat with {selectedContact.display_name}
                </h4>
                <div className="text-sm text-blue-500">
                  Property: {selectedContact.property_address}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 pb-24">
                {loading ? (
                  <div className="text-center text-blue-500">Loading...</div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`max-w-lg rounded-xl px-4 py-2 shadow
                        ${msg.sender_id === getAccountId()
                          ? "bg-blue-600 text-white ml-auto"
                          : "bg-white text-blue-700 mr-auto border border-blue-100"
                        }`}
                    >
                      <div className="">{msg.message_text}</div>
                      <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                        <span>{formatTimestamp(msg.sent_timestamp)}</span>
                        {msg.sender_id === getAccountId() ? (
                          <span className={msg.is_read ? "text-green-200" : "text-gray-200"}>
                            {msg.is_read ? "Read" : "Delivered"}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* Floating message bar */}
              <form
                className="absolute bottom-6 left-6 right-6 flex gap-2 shadow-lg rounded-xl bg-blue-50 px-4 py-3"
                style={{ maxWidth: "calc(100vw - 22rem)", marginLeft: "0" }}
                onSubmit={handleSend}
              >
                <input
                  type="text"
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-blue-400">
              <HiMail className="text-6xl mb-4" />
              <div className="text-lg font-semibold">Select a chat to start messaging.</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}