import React from 'react';

/**
 * LandlordMessages
 * Allows landlord to select a tenant and chat with them.
 */
const LandlordMessages = ({
  landlord,
  tenants,
  selectedTenant,
  messages,
  onSelectTenant,
  input,
  onInputChange,
  onSend,
}) => (
  <main className="flex-1 p-10">
    {/* Top Bar */}
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500">Chat with your tenants</p>
      </div>
      <div className="text-right">
        <span className="text-gray-700 font-semibold">
          Your landlord ID is: <span className="text-blue-700">{landlord?.userId}</span>
        </span>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Tenants List */}
      <div className="bg-gray-100 rounded-2xl p-4 shadow-lg flex flex-col">
        <h3 className="text-gray-900 text-lg font-semibold mb-4">Tenants</h3>
        <ul className="flex-1 overflow-y-auto">
          {tenants.map(tenant => (
            <li
              key={tenant.userId}
              className={`p-2 mb-2 rounded-lg cursor-pointer transition ${
                selectedTenant && selectedTenant.userId === tenant.userId
                  ? 'bg-blue-200 font-semibold'
                  : 'hover:bg-blue-50'
              }`}
              onClick={() => onSelectTenant(tenant)}
            >
              {tenant.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="col-span-2 bg-white rounded-2xl shadow-lg flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b rounded-t-2xl bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">
            {selectedTenant ? `Chat with ${selectedTenant.name}` : 'Select a tenant to chat'}
          </h2>
          <div className="text-sm text-gray-500">
            Landlord: {landlord.name} (ID: {landlord.userId})
          </div>
        </div>
        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 rounded-b-2xl">
          {selectedTenant ? (
            messages.length > 0 ? (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 flex ${msg.fromUserId === landlord.userId ? 'justify-end' : 'justify-start'}`}
                >
                  <span className={`inline-block px-4 py-2 rounded-xl shadow ${
                    msg.fromUserId === landlord.userId
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}>
                    <strong>
                      {msg.fromUserId === landlord.userId ? landlord.name : selectedTenant.name}:
                    </strong> {msg.content}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No messages yet.</div>
            )
          ) : (
            <div className="text-gray-400">No tenant selected.</div>
          )}
        </div>
        {/* Message Input */}
        {selectedTenant && (
          <div className="p-4 border-t bg-white flex rounded-b-2xl">
            <input
              className="flex-1 border rounded-lg px-3 py-2 mr-2"
              value={input}
              onChange={onInputChange}
              placeholder="Type a message..."
              onKeyDown={e => e.key === 'Enter' && onSend()}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
              onClick={onSend}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  </main>
);

export default LandlordMessages;