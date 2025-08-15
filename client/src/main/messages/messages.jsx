import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/sidebar.jsx";
import { HiArrowLeft } from "react-icons/hi";

function formatTimestamp(ts) {
  return new Date(ts).toLocaleString();
}

const BACKEND_URL = "https://api.mypropertypal.com";

export default function Messages() {
  const [contacts, setContacts] = useState([]); // List of contacts
  const [selectedContact, setSelectedContact] = useState(null); // Currently selected contact
  const [messages, setMessages] = useState([]); // Chat messages
  const [newMsg, setNewMsg] = useState(""); // New message input
  const [loading, setLoading] = useState(false); // Loading state for messages
  const [isMobileView, setIsMobileView] = useState(false); // Mobile view state

  // Detect screen size to toggle mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024); // Mobile view for screens < 1024px
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch contacts (landlords for tenants or tenants for landlords)
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/messages/contacts`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setContacts(data.contacts || []);
      })
      .catch((err) => console.error("Failed to fetch contacts:", err));
  }, []);

  // Fetch chat history for the selected contact
  useEffect(() => {
    if (!selectedContact) return;

    const fetchMessagesAndMarkAsRead = async () => {
      try {
        setLoading(true);

        // Fetch messages
        const res = await fetch(
          `${BACKEND_URL}/api/messages/${selectedContact.account_id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setMessages(data.messages || []);
        setLoading(false);

        // Mark all unread messages as read
        const unreadIds = (data.messages || [])
          .filter((m) => !m.is_read)
          .map((m) => m.id);

        if (unreadIds.length) {
          await fetch(`${BACKEND_URL}/api/messages/read`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message_ids: unreadIds }),
          });
        }
      } catch (err) {
        console.error("Failed to fetch or mark messages as read:", err);
        setLoading(false);
      }
    };

    fetchMessagesAndMarkAsRead();
  }, [selectedContact]);

  // Handle sending a new message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedContact) return;

    const body = {
      message_text: newMsg.trim(),
      recipient_id: selectedContact.account_id,
    };

    const res = await fetch(`${BACKEND_URL}/api/messages`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setNewMsg("");
      fetch(`${BACKEND_URL}/api/messages/${selectedContact.account_id}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setMessages(data.messages || []));
    } else {
      console.error("Failed to send message:", await res.json());
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-blue-50">
      {/* Sidebar */}
      <div className="hidden lg:block w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Mobile View: Show Contacts or Chat */}
        {isMobileView ? (
          selectedContact ? (
            <main className="flex-1 flex flex-col bg-white p-4 pt-16">
              {/* Back Button */}
              <button
                className="flex items-center gap-2 text-blue-700 mb-4"
                onClick={() => setSelectedContact(null)}
              >
                <HiArrowLeft className="text-xl" />
                <span className="font-semibold">Back to Contacts</span>
              </button>

              {/* Chat Header */}
              <div className="flex flex-col border-b border-blue-100 pb-4 mb-4">
                <h4 className="text-xl font-bold text-blue-700">
                  Chat with {selectedContact.display_name}
                </h4>
                <div className="text-sm text-gray-500 mt-1">
                  Property: {selectedContact.property_address}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-2">
                {loading ? (
                  <div className="text-blue-700 font-semibold">Loading...</div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-xl ${
                        msg.sender_id === selectedContact.account_id
                          ? "self-start items-start"
                          : "self-end items-end"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl shadow text-base ${
                          msg.sender_id === selectedContact.account_id
                            ? "bg-gray-200 text-gray-800"
                            : "bg-blue-800 text-white"
                        }`}
                      >
                        {msg.message_text}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>{formatTimestamp(msg.sent_timestamp)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form className="flex gap-2 mt-auto" onSubmit={handleSend}>
                <input
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
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
            </main>
          ) : (
            <aside className="w-full bg-white p-4 pt-16">
              <h3 className="text-xl font-bold text-blue-700 mb-4">Chats</h3>
              <ul>
                {contacts.map((c) => (
                  <li
                    key={`contact-${c.account_id}`}
                    className="flex flex-col gap-1 p-4 rounded-lg cursor-pointer mb-2 transition hover:bg-blue-50"
                    onClick={() => setSelectedContact(c)}
                  >
                    <span className="font-semibold text-blue-700">{c.display_name}</span>
                    <span className="text-sm text-gray-500">{c.property_address}</span>
                    {c.unread_count > 0 && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full self-start mt-1">
                        {c.unread_count} unread
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </aside>
          )
        ) : (
          <>
            {/* Desktop View */}
            <aside className="w-full lg:w-80 bg-white border-r border-blue-100 p-4 lg:p-6 flex-shrink-0 lg:sticky top-0 h-screen overflow-y-auto">
              <h3 className="text-xl font-bold text-blue-700 mb-4 lg:mb-6">
                Chats
              </h3>
              <ul>
                {contacts.map((c) => (
                  <li
                    key={`contact-${c.account_id}`}
                    className={`flex flex-col gap-1 p-4 rounded-lg cursor-pointer mb-2 transition ${
                      selectedContact && selectedContact.account_id === c.account_id
                        ? "bg-blue-100"
                        : "hover:bg-blue-50"
                    }`}
                    onClick={() => setSelectedContact(c)}
                  >
                    <span className="font-semibold text-blue-700">{c.display_name}</span>
                    <span className="text-sm text-gray-500">{c.property_address}</span>
                    {c.unread_count > 0 && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full self-start mt-1">
                        {c.unread_count} unread
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </aside>

            <main className="flex-1 flex flex-col bg-white p-4 lg:p-8">
              {selectedContact ? (
                <>
                  {/* Chat Header */}
                  <div className="flex flex-col border-b border-blue-100 pb-4 mb-4">
                    <h4 className="text-xl lg:text-2xl font-bold text-blue-700">
                      Chat with {selectedContact.display_name}
                    </h4>
                    <div className="text-sm text-gray-500 mt-1">
                      Property: {selectedContact.property_address}
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-2">
                    {loading ? (
                      <div className="text-blue-700 font-semibold">Loading...</div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col max-w-xl ${
                            msg.sender_id === selectedContact.account_id
                              ? "self-start items-start"
                              : "self-end items-end"
                          }`}
                        >
                          <div
                            className={`px-4 py-2 rounded-2xl shadow text-base ${
                              msg.sender_id === selectedContact.account_id
                                ? "bg-gray-200 text-gray-800"
                                : "bg-blue-800 text-white"
                            }`}
                          >
                            {msg.message_text}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <span>{formatTimestamp(msg.sent_timestamp)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  <form className="flex gap-2 mt-auto" onSubmit={handleSend}>
                    <input
                      type="text"
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
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
          </>
        )}
      </div>
    </div>
  );
}