import React, { useState, useEffect } from "react";
import TenantSidebar from "../tsidebar/tenantSidebar.jsx";
import "./home.css";

const API_BASE = "https://mypropertypal-3.onrender.com";

// --- API Calls ---
async function fetchTenantRent() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/api/tenant/rent`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" }
  });
  if (!res.ok) return { rent_amount: 0, rent_due_date: null };
  return res.json();
}

async function fetchContacts() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/api/messages/contacts`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.contacts || [];
}

async function fetchTenantIncidents() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/api/maintenance`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.incidents || [];
}

async function fetchTenantUser() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/api/dashboard/user`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" }
  });
  if (!res.ok) return null;
  return res.json();
}

export default function TenantHome() {
  const [rent, setRent] = useState({ rent_amount: 0, rent_due_date: null });
  const [contacts, setContacts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadData() {
      const rentData = await fetchTenantRent();
      setRent(rentData);
      setContacts(await fetchContacts());
      setIncidents(await fetchTenantIncidents());
      setUser(await fetchTenantUser());
    }
    loadData();
  }, []);

  return (
    <div className="tenant-home-container">
      <TenantSidebar />
      <main className="tenant-dashboard-main">
        <header className="tenant-dashboard-header">
          <h1>
            Hey{user && user.first_name ? `, ${user.first_name}` : ""}!
          </h1>
          <p>
            Here you can view your tenancy details, report issues, download documents, and contact your landlord.
          </p>
        </header>
        <div className="tenant-dashboard-grid">
          {/* Rent Amount Card */}
          <div className="tenant-dashboard-card">
            <h3>Rent Amount</h3>
            <div className="tenant-dashboard-card-main">
              £{rent && rent.rent_amount !== undefined && rent.rent_amount !== null
                ? Number(rent.rent_amount).toLocaleString()
                : "0"}
            </div>
            <div className="tenant-dashboard-card-label">
              {rent && rent.rent_due_date
                ? `Next Due: ${new Date(rent.rent_due_date).toLocaleDateString()}`
                : "No upcoming due date"}
            </div>
          </div>

          {/* Maintenance Requests Card */}
          <div className="tenant-dashboard-card">
            <h3>Maintenance Requests</h3>
            <div className="tenant-dashboard-card-main">{incidents.length}</div>
            <div className="tenant-dashboard-card-label">Open Requests</div>
            <div className="tenant-dashboard-list">
              {incidents.slice(0, 3).map((incident, idx) => (
                <div key={idx} className="tenant-dashboard-list-item">
                  <strong>{incident.title || "Request"}</strong>
                  <span>
                    {incident.progress ? incident.progress : "Open"}
                  </span>
                </div>
              ))}
              {incidents.length === 0 && (
                <div className="tenant-dashboard-list-empty">No open requests.</div>
              )}
            </div>
            <button className="tenant-dashboard-btn">View All Requests</button>
          </div>

          {/* Messages Card */}
          <div className="tenant-dashboard-card">
            <h3>Messages</h3>
            <div className="tenant-dashboard-card-main">
              {contacts.reduce((sum, c) => sum + (Number(c.unread_count) || 0), 0)}
            </div>
            <div className="tenant-dashboard-card-label">New Messages</div>
            <div className="tenant-dashboard-list">
              {contacts.length === 0 ? (
                <div className="tenant-dashboard-list-empty">No new messages.</div>
              ) : (
                contacts.slice(0, 3).map((c, idx) => (
                  <div key={idx} className="tenant-dashboard-list-item">
                    <strong>{c.display_name}</strong>
                    <span className="tenant-dashboard-message-property">
                      {c.property_address ? `(${c.property_address})` : ""}
                    </span>
                    {Number(c.unread_count) > 0 && (
                      <span className="tenant-dashboard-message-unread">
                        {Number(c.unread_count)} new
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
            <button className="tenant-dashboard-btn" onClick={() => window.location.href = '/tenant-messages'}>
              View All Messages
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}