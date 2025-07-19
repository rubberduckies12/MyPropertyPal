import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import Sidebar from '../sidebar/sidebar.jsx';

// Hardcoded backend URLs
const API_BASE = "https://mypropertypal-3.onrender.com";
const MAINTENANCE_URL = `${API_BASE}/api/maintenance/landlord`; // Use landlord endpoint
const MESSAGES_CONTACTS_URL = `${API_BASE}/api/messages/contacts`;
const TENANTS_COUNT_URL = `${API_BASE}/api/tenants/count`;
const DASHBOARD_USER_URL = `${API_BASE}/api/dashboard/user`;
const DASHBOARD_PROPERTIES_URL = `${API_BASE}/api/dashboard/properties`;
const DASHBOARD_MESSAGES_URL = `${API_BASE}/api/dashboard/messages`;
const TENANTS_URL = `${API_BASE}/api/tenants`;

// --- API Calls ---
async function fetchUser() {
  const token = localStorage.getItem('token');
  const res = await fetch(DASHBOARD_USER_URL, {
    headers: { Authorization: token ? `Bearer ${token}` : "" }
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

async function fetchTenantCount() {
  const token = localStorage.getItem('token');
  const res = await fetch(TENANTS_COUNT_URL, {
    headers: { Authorization: token ? `Bearer ${token}` : "" }
  });
  const data = await res.json();
  return data.count;
}

// Fetch contacts for mini contacts list in messages card
async function fetchContacts() {
  const token = localStorage.getItem('token');
  const res = await fetch(MESSAGES_CONTACTS_URL, {
    headers: { Authorization: token ? `Bearer ${token}` : "" }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.contacts || [];
}

// Fetch unread messages for each contact
async function fetchUnreadMessages() {
  const token = localStorage.getItem('token');
  const res = await fetch(DASHBOARD_MESSAGES_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return [];
  return res.json();
}

async function fetchIncidents() {
  const token = localStorage.getItem('token');
  const res = await fetch(MAINTENANCE_URL, {
    headers: { Authorization: token ? `Bearer ${token}` : "" }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.incidents || [];
}

async function fetchProperties() {
  const token = localStorage.getItem('token');
  const res = await fetch(DASHBOARD_PROPERTIES_URL, {
    headers: { Authorization: token ? `Bearer ${token}` : "" }
  });
  if (!res.ok) throw new Error("Failed to fetch properties");
  return res.json();
}

async function fetchTenants() {
  const token = localStorage.getItem('token');
  const res = await fetch(TENANTS_URL, {
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

// Utility to get compliance events that are due soon (within 30 days) OR overdue
function getUpcomingComplianceEvents(deadlines) {
  const today = new Date();
  return (Array.isArray(deadlines) ? deadlines : []).filter(event => {
    if (!event.due_date) return false;
    const dueDate = new Date(event.due_date);
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    // Include overdue (diffDays < 0) and due soon (diffDays <= 30)
    return diffDays <= 30;
  });
}

// --- Main Dashboard Component ---
function Dashboard() {
  const [showYearly, setShowYearly] = useState(false);
  const [user, setUser] = useState(null);
  const [tenantCount, setTenantCount] = useState(0);
  const [tenants, setTenants] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [properties, setProperties] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [deadlines, setDeadlines] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      setUser(await fetchUser());
      setTenantCount(await fetchTenantCount());
      setTenants(await fetchTenants());
      setContacts(await fetchContacts());
      setMessages(await fetchUnreadMessages());
      setIncidents(await fetchIncidents());
      setProperties(await fetchProperties());
      // setUpcomingEvents(await fetchEvents()); // Uncomment when backend is ready

      // Fetch compliance deadlines
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/compliance/events`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });
      const data = await res.json();
      setDeadlines(Array.isArray(data) ? data : []);
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
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  const recentIncidents = sortedIncidents.slice(0, 2);

  // Get upcoming compliance events (due in next 30 days)
  const upcomingCompliance = getUpcomingComplianceEvents(deadlines);

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
            <button
              className="dashboard-btn"
              onClick={() => navigate('/tenants')}
            >
              View Tenants
            </button>
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
            <div className="dashboard-card-main">
              {contacts.reduce((sum, c) => sum + (Number(c.unread_count) || 0), 0)}
            </div>
            <div className="dashboard-card-label">New Messages</div>
            <div className="dashboard-messages-list">
              {contacts.length === 0 ? (
                <div className="dashboard-message-empty">No new messages.</div>
              ) : (
                contacts.slice(0, 3).map((c, idx) => (
                  <div key={idx} className="dashboard-message-item">
                    <strong>{c.display_name}</strong>
                    <span className="dashboard-message-property">
                      {c.property_address ? `(${c.property_address})` : ""}
                    </span>
                    {Number(c.unread_count) > 0 && (
                      <span className="dashboard-message-unread">
                        {Number(c.unread_count)} new
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
            <button className="dashboard-btn" onClick={() => navigate('/messages')}>
              View All Messages
            </button>
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

          {/* Urgent Compliance Deadlines Card (was "Upcoming Compliance Deadlines") */}
          <div className="dashboard-card">
            <h3>Urgent Compliance Deadlines</h3>
            <div>
              {upcomingCompliance.length === 0 ? (
                <div className="dashboard-message-empty">
                  You're all caught up!
                </div>
              ) : (
                upcomingCompliance.slice(0, 3).map(event => (
                  <div key={event.id || event.name} className="dashboard-event">
                    <div className="dashboard-event-title">{event.name}</div>
                    <div className="dashboard-event-date">
                      Due: {new Date(event.due_date).toLocaleDateString("en-GB")}
                    </div>
                    <div className="dashboard-event-desc">
                      {event.description}
                    </div>
                    <div className="dashboard-event-property">
                      Property: {event.property_name}
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="dashboard-btn" onClick={() => navigate('/compliance')}>
              View All Compliance
            </button>
          </div>

          {/* Maintenance Requests (Wide Card) */}
          <div className="dashboard-card dashboard-card-wide">
            <h3>Maintenance Requests</h3>
            <div className="dashboard-activity-table">
              {recentIncidents.length === 0 ? (
                <div className="dashboard-activity-empty">
                  No recent incidents to display.
                </div>
              ) : (
                <table className="maintenance-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Description</th>
                      <th>Severity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentIncidents.map(incident => (
                      <tr key={incident.id || incident.incidentId}>
                        <td>{incident.property_address || getPropertyLabel(incident.propertyId)}</td>
                        <td>{incident.description}</td>
                        <td>
                          <span className={`dashboard-severity ${severityColors[incident.severity] || ''}`}>
                            {incident.severity ? capitalize(incident.severity) : '-'}
                          </span>
                        </td>
                        <td>
                          <span className="dashboard-status">
                            {incident.progress ? capitalize(incident.progress) : '-'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <button className="dashboard-btn" onClick={() => navigate('/incidents')}>
              View All Maintenance Requests
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;