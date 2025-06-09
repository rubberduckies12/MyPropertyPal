import React, { useState, useEffect } from 'react';
import './dashboard.css';
import Sidebar from '../sidebar/sidebar.jsx';
import {
  fetchUser,
  fetchTenantCount,
  fetchMessages,
  fetchIncidents,
  fetchProperties,
} from './dashboard.js';

const severityColors = {
  red: 'dashboard-severity-red',
  yellow: 'dashboard-severity-yellow',
  green: 'dashboard-severity-green',
};

function Dashboard() {
  const [showYearly, setShowYearly] = useState(false);
  const [user, setUser] = useState(null);
  const [tenantCount, setTenantCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // These will be async API calls in the future
    setUser(fetchUser());
    setTenantCount(fetchTenantCount());
    setMessages(fetchMessages());
    setIncidents(fetchIncidents());
    setProperties(fetchProperties());
  }, []);

  const incomingMessages = messages.filter(
    msg => msg.fromRole === 'tenant' || msg.fromUserId !== user?.userId
  );
  const sorted = [...incomingMessages].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
  const mostRecent = sorted[0];

  const sortedIncidents = [...(incidents || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const recentIncidents = sortedIncidents.slice(0, 2);

  const getPropertyLabel = (propertyId) => {
    const property = properties.find(
      p => p._id === propertyId || p.propertyId === propertyId
    );
    if (!property) return propertyId;
    return property.name
      ? `${property.name} (${property.address})`
      : property.address || propertyId;
  };

  const monthlyIncome = properties
    .filter(p => !!p.tenantId)
    .reduce((sum, p) => sum + Number(p.rent || 0), 0);
  const yearlyIncome = monthlyIncome * 12;

  return (
    <div className="dashboard-container">
      {/* Sidebar is now its own component */}
      <Sidebar />

      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-welcome">
            <h1>Welcome, {user?.name || "User"}</h1>
          </div>
          <div className="dashboard-user-info">
            <span>User ID: <strong>{user?.userId || "—"}</strong></span>
          </div>
        </header>

        {/* Dashboard Grid with Cards */}
        <div className="dashboard-grid">
          {/* Card 1: Tenants */}
          <div className="dashboard-card">
            <h3>Tenants</h3>
            <div className="dashboard-card-main">{tenantCount}</div>
            <div className="dashboard-card-label">Current Tenants</div>
            <button className="dashboard-btn">View Tenants</button>
          </div>

          {/* Card 2: Income */}
          <div className="dashboard-card dashboard-card-income">
            <div className="dashboard-toggle">
              <span className={!showYearly ? "active" : ""}>Monthly</span>
              <label className="dashboard-switch">
                <input
                  type="checkbox"
                  checked={showYearly}
                  onChange={() => setShowYearly(v => !v)}
                />
                <span className="dashboard-slider"></span>
              </label>
              <span className={showYearly ? "active" : ""}>Yearly</span>
            </div>
            <h3>Income</h3>
            <div className="dashboard-card-main dashboard-income">
              £{(showYearly ? yearlyIncome : monthlyIncome).toLocaleString()}
            </div>
            <div className="dashboard-card-label">
              From occupied properties ({showYearly ? 'Yearly' : 'Monthly'})
            </div>
          </div>

          {/* Card (Formerly Properties) - Now Messages (Tall Card) */}
          <div className="dashboard-card dashboard-card-tall">
            <h3>Messages</h3>
            <div className="dashboard-card-main">{messages.length}</div>
            <div className="dashboard-card-label">New Messages</div>
            <div className="dashboard-messages-list">
              {messages.slice(0, 3).map((msg, index) => (
                <div key={index} className="dashboard-message-item">
                  <strong>{msg.fromName || msg.fromUserId}</strong>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
            <button className="dashboard-btn">View All Messages</button>
          </div>

          {/* Card (Formerly Messages) - Now Properties */}
          <div className="dashboard-card">
            <h3>Properties</h3>
            <div className="dashboard-card-main">{properties.length}</div>
            <div className="dashboard-card-label">Total Properties</div>
            <div className="dashboard-properties-list">
              {properties.slice(0, 3).map((property, index) => (
                <div key={index} className="dashboard-property-item">
                  <div>
                    {property.name || property.address || `Property ${index + 1}`}
                  </div>
                  {property.tenantId && (
                    <div className="dashboard-property-status occupied">Occupied</div>
                  )}
                  {!property.tenantId && (
                    <div className="dashboard-property-status vacant">Vacant</div>
                  )}
                </div>
              ))}
            </div>
            <button className="dashboard-btn">View All Properties</button>
          </div>

          {/* Card 4: Recent Incidents (unchanged) */}
          <div className="dashboard-card">
            <h3>Recent Incidents</h3>
            <div>
              {recentIncidents.length === 0 ? (
                <div className="dashboard-message-empty">No incidents reported.</div>
              ) : (
                recentIncidents.map(incident => (
                  <div key={incident.incidentId} className="dashboard-incident">
                    <div className="dashboard-incident-row">
                      <span className={`dashboard-severity ${severityColors[incident.severity] || ''}`}>
                        {incident.severity ? incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1) : '-'}
                      </span>
                      <span className="dashboard-status">
                        {incident.status ? incident.status.charAt(0).toUpperCase() + incident.status.slice(1) : '-'}
                      </span>
                    </div>
                    <div className="dashboard-incident-prop">
                      {getPropertyLabel(incident.propertyId)}
                    </div>
                    <div className="dashboard-incident-desc">
                      {incident.description}
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="dashboard-btn">View All Incidents</button>
          </div>

          {/* Card (Formerly Recent Activity) - Now Recent Incidents (Wide Card) */}
          <div className="dashboard-card dashboard-card-wide">
            <h3>Recent Incidents</h3>
            <div className="dashboard-activity-list">
              {recentIncidents.length === 0 ? (
                <div className="dashboard-activity-empty">
                  No recent incidents to display.
                </div>
              ) : (
                recentIncidents.map(incident => (
                  <div key={incident.incidentId} className="dashboard-incident">
                    <div className="dashboard-incident-row">
                      <span className={`dashboard-severity ${severityColors[incident.severity] || ''}`}>
                        {incident.severity ? incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1) : '-'}
                      </span>
                      <span className="dashboard-status">
                        {incident.status ? incident.status.charAt(0).toUpperCase() + incident.status.slice(1) : '-'}
                      </span>
                    </div>
                    <div className="dashboard-incident-prop">
                      {getPropertyLabel(incident.propertyId)}
                    </div>
                    <div className="dashboard-incident-desc">
                      {incident.description}
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="dashboard-btn">View All Incidents</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;