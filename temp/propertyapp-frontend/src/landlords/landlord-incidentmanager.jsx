import React from 'react';

// Severity color mapping for incident badges
const severityColors = {
  red: 'bg-red-500 text-white',
  yellow: 'bg-yellow-400 text-gray-900',
  green: 'bg-green-500 text-white',
};

/**
 * LandlordIncidentManager
 * Displays a table of incidents for landlord properties, allows closing incidents.
 */
const LandlordIncidentManager = ({
  incidents = [],
  properties = [],
  onCloseIncident,
}) => {
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

  return (
    <main className="flex-1 p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Incident Manager</h1>
        <p className="text-gray-500">
          View and track incidents reported by tenants for your properties.
        </p>
      </div>
      {/* Incidents Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Property</th>
              <th className="py-3 px-4 text-left">Timestamp</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Severity</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* No incidents row */}
            {incidents.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400">
                  No incidents reported.
                </td>
              </tr>
            )}
            {/* Incident rows */}
            {incidents.map(incident => (
              <tr key={incident.incidentId} className="border-b last:border-none">
                <td className="py-3 px-4">{incident.description}</td>
                <td className="py-3 px-4">{getPropertyLabel(incident.propertyId)}</td>
                <td className="py-3 px-4">
                  {incident.createdAt
                    ? new Date(incident.createdAt).toLocaleString()
                    : '-'}
                </td>
                <td className="py-3 px-4">
                  <span className={incident.status === 'open' ? 'text-green-700 font-semibold' : 'text-gray-500'}>
                    {incident.status
                      ? incident.status.charAt(0).toUpperCase() + incident.status.slice(1)
                      : '-'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${severityColors[incident.severity] || 'bg-gray-300 text-gray-700'}`}>
                    {incident.severity
                      ? incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)
                      : '-'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {/* Show close button only for open incidents */}
                  {incident.status === 'open' && (
                    <button
                      className="bg-blue-600 hover:bg-blue-800 text-white px-3 py-1 rounded transition"
                      onClick={() => onCloseIncident && onCloseIncident(incident.incidentId)}
                    >
                      Close
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default LandlordIncidentManager;