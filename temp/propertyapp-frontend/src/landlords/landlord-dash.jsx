import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Severity color mapping for incidents
const severityColors = {
  red: 'bg-red-500 text-white',
  yellow: 'bg-yellow-400 text-gray-900',
  green: 'bg-green-500 text-white',
};

/**
 * LandlordDashboard
 * Main dashboard for landlords showing tenants, income, messages, incidents, etc.
 */
const LandlordDashboard = ({
  user,
  tenantCount,
  recentMessages = [],
  incidents = [],
  properties = [],
}) => {
  const navigate = useNavigate();
  const [showYearly, setShowYearly] = useState(false);

  // Filter and sort incoming messages (from tenants)
  const incomingMessages = recentMessages.filter(
    msg => msg.fromRole === 'tenant' || msg.fromUserId !== user?.userId
  );
  const sorted = [...incomingMessages].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
  const mostRecent = sorted[0];

  // Get the 2 most recent incidents
  const sortedIncidents = [...(incidents || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const recentIncidents = sortedIncidents.slice(0, 2);

  // Helper: Get property label from propertyId
  const getPropertyLabel = (propertyId) => {
    const property = properties.find(
      p => p._id === propertyId || p.propertyId === propertyId
    );
    if (!property) return propertyId;
    return property.name
      ? `${property.name} (${property.address})`
      : property.address || propertyId;
  };

  // Calculate monthly and yearly income from occupied properties
  const monthlyIncome = properties
    .filter(p => !!p.tenantId)
    .reduce((sum, p) => sum + Number(p.rent || 0), 0);
  const yearlyIncome = monthlyIncome * 12;

  // -------------------- Render --------------------
  return (
    <main className="flex-1 p-10">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hello, {user?.name}</h1>
          <p className="text-gray-500">Welcome back!</p>
        </div>
        {/* Landlord ID on the top right */}
        <div className="text-right">
          <span className="text-gray-700 font-semibold">
            Your landlord ID is: <span className="text-blue-700">{user?.userId}</span>
          </span>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tenants Card */}
        <div className="bg-gray-100 rounded-2xl p-6 flex flex-col items-start shadow-lg">
          <h3 className="text-gray-900 text-lg font-semibold mb-2">Tenants</h3>
          <div className="text-gray-900 text-3xl font-bold mb-1">{tenantCount}</div>
          <div className="text-black text-sm">Current Tenants</div>
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            onClick={() => navigate('/tenants')}
          >
            View Tenants
          </button>
        </div>

        {/* Monthly/Yearly Income Card with Switch */}
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
          <h3 className="text-gray-900 text-lg font-semibold mb-2">Income</h3>
          <div className="text-green-700 text-3xl font-bold mb-1">
            £{(showYearly ? yearlyIncome : monthlyIncome).toLocaleString()}
          </div>
          <div className="text-black text-sm">
            From occupied properties ({showYearly ? 'Yearly' : 'Monthly'})
          </div>
        </div>

        {/* Messages Card */}
        <div className="bg-gray-100 rounded-2xl p-6 flex flex-col items-start shadow-lg">
          <h3 className="text-gray-900 text-lg font-semibold mb-2">Messages</h3>
          <div className="w-full">
            {mostRecent ? (
              <div className="mb-2 border-b border-gray-200 pb-2">
                <div className="text-sm text-gray-800 font-semibold">{mostRecent.fromName || mostRecent.fromUserId}</div>
                <div className="text-xs text-gray-600">{mostRecent.content}</div>
                <div className="text-xs text-gray-400">{new Date(mostRecent.timestamp).toLocaleString()}</div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm mb-2">No new messages.</div>
            )}
          </div>
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            onClick={() => navigate('/messages')}
          >
            View Messages
          </button>
        </div>

        {/* Recent Incidents Card */}
        <div className="bg-gray-100 rounded-2xl p-6 flex flex-col items-start shadow-lg">
          <h3 className="text-gray-900 text-lg font-semibold mb-2">Recent Incidents</h3>
          <div className="w-full">
            {recentIncidents.length === 0 ? (
              <div className="text-gray-500 text-sm mb-2">No incidents reported.</div>
            ) : (
              recentIncidents.map(incident => (
                <div key={incident.incidentId} className="mb-3 border-b border-gray-200 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${severityColors[incident.severity] || 'bg-gray-300 text-gray-700'}`}>
                      {incident.severity ? incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1) : '-'}
                    </span>
                    <span className="text-xs text-gray-600">
                      {incident.status ? incident.status.charAt(0).toUpperCase() + incident.status.slice(1) : '-'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-800 font-semibold">{getPropertyLabel(incident.propertyId)}</div>
                  <div className="text-xs text-gray-600">{incident.description}</div>
                  <div className="text-xs text-gray-400">{incident.createdAt ? new Date(incident.createdAt).toLocaleString() : '-'}</div>
                </div>
              ))
            )}
          </div>
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            onClick={() => navigate('/incidents')}
          >
            View All Incidents
          </button>
        </div>
        {/* Add your other cards here (Properties, Payments, etc.) */}
      </div>
      {/* Add your other dashboard sections here */}
    </main>
  );
};

export default LandlordDashboard;