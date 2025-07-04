import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import Sidebar from '../sidebar/sidebar.jsx';

const API_BASE = "http://localhost:5001";

// --- API Calls ---
async function fetchUser() {
  const res = await fetch(`${API_BASE}/api/dashboard/user`);
  return res.json();
}

async function fetchTenantCount() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/api/tenants/count`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" }
  });
  const data = await res.json();
  return data.count;
}

async function fetchMessages() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/api/dashboard/messages`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

async function fetchIncidents() {
  const res = await fetch(`${API_BASE}/api/dashboard/incidents`);
  return res.json();
}

async function fetchProperties() {
  const res = await fetch(`${API_BASE}/api/dashboard/properties`);
  return res.json();
}

async function fetchTenants() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/api/tenants`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" }
  });
  const data = await res.json();
  return data.tenants || [];
}

// --- Utility ---
const severityColors = {
  red: 'dashboard-severity-red',
  yellow: 'dashboard-severity-yellow',
  green: 'dashboard-severity-green',
};

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Main Dashboard Component ---
function Dashboard() {
  const [showYearly, setShowYearly] = useState(false);
  const [user, setUser] = useState(null);
  const [tenantCount, setTenantCount] = useState(0);
  const [tenants, setTenants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [properties, setProperties] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      setUser(await fetchUser());
      setTenantCount(await fetchTenantCount());
      setTenants(await fetchTenants());
      setMessages(await fetchMessages());
      setIncidents(await fetchIncidents());
      setProperties(await fetchProperties());
      // setUpcomingEvents(await fetchEvents()); // Uncomment when backend is ready
    }
    loadData();
  }, []);

  // Get property label by ID
  const getPropertyLabel = (propertyId) => {
    const property = properties.find(
      p => p._id === propertyId || p.propertyId === propertyId
    );
    if (!property) return propertyId;
    return property.name
      ? `${property.name} (${property.address})`
      : property.address || propertyId;
  };

  // Income: sum rent_amount for all tenants
  const occupiedTenants = tenants.filter(
    t => typeof t.rent_amount !== "undefined" && t.rent_amount !== null
  );
  const monthlyIncome = occupiedTenants.reduce((sum, t) => {
    const rent = typeof t.rent_amount === "string"
      ? Number(t.rent_amount.replace(/[£,]/g, ""))
      : Number(t.rent_amount || 0);
    return sum + (isNaN(rent) ? 0 : rent);
  }, 0);
  const yearlyIncome = monthlyIncome * 12;

  // Recent incidents (show 2 most recent)
  const sortedIncidents = [...incidents].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const recentIncidents = sortedIncidents.slice(0, 2);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-welcome">
            <h1>
              Welcome, {user ? capitalize(user.first_name) : "User"}
            </h1>
          </div>
          <div className="dashboard-user-info">
            <span>User ID: <strong>{user?.id || "—"}</strong></span>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Tenants Card */}
          <div className="dashboard-card">
            <h3>Tenants</h3>
            <div className="dashboard-card-main">{tenantCount}</div>
            <div className="dashboard-card-label">Current Tenants</div>
            <button className="dashboard-btn">View Tenants</button>
          </div>

          {/* Income Card */}
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

          {/* Messages Card */}
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

          {/* Properties Card */}
          <div className="dashboard-card">
            <h3>Properties</h3>
            <div className="dashboard-card-main">{properties.length}</div>
            <div className="dashboard-card-label">Total Properties</div>
            <button
              className="dashboard-btn"
              onClick={() => navigate('/properties')}
            >
              View All Properties
            </button>
          </div>

          {/* Upcoming Events Card */}
          <div className="dashboard-card">
            <h3>Upcoming Events</h3>
            <div>
              {(!Array.isArray(upcomingEvents) || upcomingEvents.length === 0) ? (
                <div className="dashboard-message-empty">No upcoming events.</div>
              ) : (
                upcomingEvents.slice(0, 3).map(event => (
                  <div key={event.id || event.title} className="dashboard-event">
                    <div className="dashboard-event-title">{event.title}</div>
                    <div className="dashboard-event-date">{event.date}</div>
                    <div className="dashboard-event-desc">{event.description}</div>
                  </div>
                ))
              )}
            </div>
            <button className="dashboard-btn">View Calender</button>
          </div>

          {/* Recent Incidents (Wide Card) */}
          <div className="dashboard-card dashboard-card-wide">
            <h3>Maintenance Requests</h3>
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
                        {incident.severity ? capitalize(incident.severity) : '-'}
                      </span>
                      <span className="dashboard-status">
                        {incident.status ? capitalize(incident.status) : '-'}
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