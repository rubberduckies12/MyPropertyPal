import React from "react";

/**
 * TenantMessages
 * Simple messaging UI for tenants to chat with their landlord.
 */
const TenantMessages = ({
  user,
  landlord,
  messages = [],
  input,
  onInputChange,
  onSend,
}) => (
  <main className="flex-1 p-10">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500">Chat with your landlord</p>
      </div>
      <div className="text-right">
        <span className="text-gray-700 font-semibold">
          Your tenant ID: <span className="text-blue-700">{user?.userId}</span>
        </span>
      </div>
    </div>
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg flex flex-col h-[60vh]">
      {/* Chat Header */}
      <div className="p-4 border-b rounded-t-2xl bg-gray-50">
        <h2 className="text-xl font-bold text-gray-900">
          {landlord ? `Chat with ${landlord.name || landlord.email}` : "No landlord linked"}
        </h2>
      </div>
      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 rounded-b-2xl">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 flex ${msg.fromUserId === user.userId ? "justify-end" : "justify-start"}`}
            >
              <span className={`inline-block px-4 py-2 rounded-xl shadow ${
                msg.fromUserId === user.userId
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}>
                <strong>
                  {msg.fromUserId === user.userId ? user.name : landlord?.name || "Landlord"}:
                </strong> {msg.content}
              </span>
            </div>
          ))
        ) : (
          <div className="text-gray-400">No messages yet.</div>
        )}
      </div>
      {/* Message Input */}
      <div className="p-4 border-t bg-white flex rounded-b-2xl">
        <input
          className="flex-1 border rounded-lg px-3 py-2 mr-2"
          value={input}
          onChange={onInputChange}
          placeholder="Type a message..."
          onKeyDown={e => e.key === "Enter" && onSend()}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          onClick={onSend}
        >
          Send
        </button>
      </div>
    </div>
  </main>
);

export default TenantMessages;