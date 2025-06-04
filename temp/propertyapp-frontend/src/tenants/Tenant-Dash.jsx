import React, { useState } from "react";

/**
 * TenantDashboard
 * Dashboard for tenants showing next rent due, upcoming events, recent messages, and rent summary.
 * Expects all data to be passed as props (API calls handled in App.jsx).
 */
const TenantDashboard = ({
  tenant,
  landlord,
  property,
  messages = [],
  events = [],
}) => {
  // Calculate rent amounts
  const monthlyRent = property?.monthlyRent || property?.rent || 0; // Try monthlyRent first
  const yearlyRent = monthlyRent * 12;

  // Find next rent due date
  const nextRentDue = property?.nextRentDue
    ? new Date(property.nextRentDue)
    : null;

  // Sort messages by timestamp (descending)
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
  const mostRecentMessage = sortedMessages[0];

  // Sort events by date (ascending) and filter for upcoming
  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 2);

  // Toggle for monthly/yearly rent view
  const [showYearly, setShowYearly] = useState(false);

  return (
    <main className="flex-1 p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {tenant?.name || tenant?.fullName}
          </h1>
          <p className="text-gray-500">
            Your landlord: {landlord?.name || landlord?.email}
          </p>
        </div>
        <div className="text-right">
          <span className="text-gray-700 font-semibold">
            Your tenant ID: <span className="text-blue-700">{tenant?.userId}</span>
          </span>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Next Rent Due Card */}
        <div className="bg-gray-100 rounded-2xl p-6 flex flex-col items-start shadow-lg">
          <h3 className="text-gray-900 text-lg font-semibold mb-2">Next Rent Due</h3>
          <div className="text-2xl font-bold mb-1 text-blue-700">
            {nextRentDue ? nextRentDue.toLocaleDateString() : "N/A"}
          </div>
          <div className="text-black text-sm">
            {property?.address || "No property assigned"}
          </div>
          <div className="mt-2 text-gray-600 text-sm">
            Amount Due: <span className="font-semibold">£{monthlyRent}</span>
          </div>
        </div>

        {/* Rent Summary Card */}
        <div className="bg-gray-100 rounded-2xl p-6 flex flex-col items-start shadow-lg relative">
          {/* Toggle for monthly/yearly */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className={`text-xs font-semibold ${!showYearly ? 'text-blue-700' : 'text-gray-400'}`}>Monthly</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showYearly}
                onChange={() => setShowYearly(v => !v)}
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition"></div>
              <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full shadow transition-transform ${showYearly ? 'translate-x-4' : ''}`}></div>
            </label>
            <span className={`text-xs font-semibold ${showYearly ? 'text-blue-700' : 'text-gray-400'}`}>Yearly</span>
          </div>
          <h3 className="text-gray-900 text-lg font-semibold mb-2">Rent Summary</h3>
          <div className="text-green-700 text-3xl font-bold mb-1">
            £{showYearly ? yearlyRent.toLocaleString() : monthlyRent.toLocaleString()}
          </div>
          <div className="text-black text-sm">
            {showYearly ? "Total yearly rent" : "Monthly rent"}
          </div>
        </div>

        {/* Recent Messages Card */}
        <div className="bg-gray-100 rounded-2xl p-6 flex flex-col items-start shadow-lg">
          <h3 className="text-gray-900 text-lg font-semibold mb-2">Recent Message</h3>
          <div className="w-full">
            {mostRecentMessage ? (
              <div className="mb-2 border-b border-gray-200 pb-2">
                <div className="text-sm text-gray-800 font-semibold">
                  {mostRecentMessage.fromName || mostRecentMessage.fromUserId}
                </div>
                <div className="text-xs text-gray-600">{mostRecentMessage.content}</div>
                <div className="text-xs text-gray-400">
                  {new Date(mostRecentMessage.timestamp).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm mb-2">No messages yet.</div>
            )}
          </div>
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            onClick={() => window.location.href = '/messages'}
          >
            View All Messages
          </button>
        </div>

        {/* Upcoming Events Card */}
        <div className="bg-gray-100 rounded-2xl p-6 flex flex-col items-start shadow-lg">
          <h3 className="text-gray-900 text-lg font-semibold mb-2">Upcoming Events</h3>
          <div className="w-full">
            {upcomingEvents.length === 0 ? (
              <div className="text-gray-500 text-sm mb-2">No upcoming events.</div>
            ) : (
              upcomingEvents.map(event => (
                <div key={event.id} className="mb-3 border-b border-gray-200 pb-2">
                  <div className="text-sm text-gray-800 font-semibold">{event.title}</div>
                  <div className="text-xs text-gray-600">
                    {event.date ? new Date(event.date).toLocaleString() : "-"}
                  </div>
                  <div className="text-xs text-gray-500">{event.description}</div>
                </div>
              ))
            )}
          </div>
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            onClick={() => window.location.href = '/calendar'}
          >
            View Calendar
          </button>
        </div>
      </div>
    </main>
  );
};

export default TenantDashboard;