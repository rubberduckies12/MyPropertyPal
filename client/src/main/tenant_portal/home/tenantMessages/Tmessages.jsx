import React, { useState, useEffect } from "react";
import TenantSidebar from "../../tsidebar/tenantSidebar.jsx";

function formatTimestamp(ts) {
  return new Date(ts).toLocaleString();
}

const BACKEND_URL = "https://mypropertypal-3.onrender.com";

export default function Tmessages() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/messages/contacts`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => setContacts(data.contacts || []));
  }, []);

  useEffect(() => {
    if (!selectedContact) return;
    setLoading(true);
    fetch(`${BACKEND_URL}/api/messages/${selectedContact.property_id}`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || []);
        setLoading(false);
        const unreadIds = (data.messages || [])
          .filter(m => !m.is_read && m.sender_id !== getAccountId())
          .map(m => m.id);
        if (unreadIds.length) {
          fetch(`${BACKEND_URL}/api/messages/read`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ message_ids: unreadIds }),
          });
        }
      });
  }, [selectedContact]);

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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedContact) return;
    const res = await fetch(`${BACKEND_URL}/api/messages`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        property_id: selectedContact.property_id,
        message_text: newMsg.trim(),
      }),
    });
    if (res.ok) {
      setNewMsg("");
      fetch(`${BACKEND_URL}/api/messages/${selectedContact.property_id}`, {
        credentials: "include"
      })
        .then((res) => res.json())
        .then((data) => setMessages(data.messages || []));
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      <TenantSidebar />
      <div className="flex flex-1 ml-64">
        <aside className="w-80 bg-white border-r border-blue-100 p-6 flex-shrink-0">
          <h3 className="text-xl font-bold text-blue-700 mb-6">Chats</h3>
          <ul>
            {contacts.map((c) => (
              <li
                key={c.property_id}
                className={`flex flex-col gap-1 p-4 rounded-lg cursor-pointer mb-2 transition ${
                  selectedContact && selectedContact.property_id === c.property_id
                    ? "bg-blue-100"
                    : "hover:bg-blue-50"
                }`}
                onClick={() => setSelectedContact(c)}
              >
                <span className="font-semibold text-blue-700">{c.display_name}</span>
                <span className="text-sm text-gray-500">{c.property_address}</span>
                {c.unread_count > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full self-start mt-1">
                    {c.unread_count}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </aside>
        <main className="flex-1 flex flex-col bg-white p-8">
          {selectedContact ? (
            <>
              <div className="flex flex-col border-b border-blue-100 pb-4 mb-4">
                <h4 className="text-2xl font-bold text-blue-700">
                  Chat with {selectedContact.display_name}
                </h4>
                <div className="text-sm text-gray-500 mt-1">
                  Property: {selectedContact.property_address}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-2">
                {loading ? (
                  <div className="text-blue-700 font-semibold">Loading...</div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-xl ${
                        msg.sender_id === getAccountId()
                          ? "self-end items-end"
                          : "self-start items-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl shadow text-base ${
                          msg.sender_id === getAccountId()
                            ? "bg-blue-600 text-white"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {msg.message_text}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>{formatTimestamp(msg.sent_timestamp)}</span>
                        {msg.sender_id === getAccountId() ? (
                          <span
                            className={`ml-2 ${
                              msg.is_read
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          >
                            {msg.is_read ? "Read" : "Delivered"}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <form className="flex gap-2 mt-auto" onSubmit={handleSend}>
                <input
                  type="text"
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-bold rounded-lg px-6 py-2 hover:bg-blue-700 transition"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-lg">
              Select a chat to start messaging.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}