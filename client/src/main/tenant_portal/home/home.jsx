import React, { useState, useEffect } from "react";
import TenantSidebar from "../tsidebar/tenantSidebar.jsx";
import "./home.css";

const API_BASE = "https://api.mypropertypal.com";

// --- API Calls ---
async function fetchTenantRent() {
  const res = await fetch(`${API_BASE}/api/tenant/rent`, {
    credentials: "include",
  });
  if (!res.ok) return { rent_amount: 0, rent_due_date: null };
  return res.json();
}

async function fetchContacts() {
  const res = await fetch(`${API_BASE}/api/messages/contacts`, {
    credentials: "include",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.contacts || [];
}

async function fetchTenantIncidents() {
  const res = await fetch(`${API_BASE}/api/maintenance`, {
    credentials: "include",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.incidents || [];
}

async function fetchTenantUser() {
  const res = await fetch(`${API_BASE}/api/dashboard/user`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  return res.json();
}

async function fetchUnreadMessages() {
  const res = await fetch(`${API_BASE}/api/messages/unread/count`, {
    credentials: "include", // Include cookies for authentication
  });
  if (!res.ok) {
    console.error("Failed to fetch unread messages");
    return 0;
  }
  const data = await res.json();
  return data.unread_count || 0;
}

export default function TenantHome() {
  const [rent, setRent] = useState({ rent_amount: 0, rent_due_date: null });
  const [contacts, setContacts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [user, setUser] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

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

  useEffect(() => {
    async function loadUnreadMessages() {
      setUnreadMessages(await fetchUnreadMessages());
    }
    loadUnreadMessages();
  }, []);

  async function markMessagesAsRead(messageIds) {
    const res = await fetch(`${API_BASE}/api/messages/read`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message_ids: messageIds }),
    });

    if (res.ok) {
      setUnreadMessages(await fetchUnreadMessages()); // Refresh unread message count
    } else {
      console.error("Failed to mark messages as read");
    }
  }

  return (
    <div className="tenant-home-container">
      <TenantSidebar />
      <main className="tenant-dashboard-main">
        <header className="tenant-dashboard-header">
          <h1>
            Hey{user && user.first_name ? `, ${user.first_name}` : ""}!
          </h1>
          <p>
            Here you can view your tenancy details, report issues, download
            documents, and contact your landlord.
          </p>
        </header>
        <div className="tenant-dashboard-grid">
          {/* Rent Amount Card */}
          <div className="tenant-dashboard-card">
            <h3>Rent Amount</h3>
            <div className="tenant-dashboard-card-main">
              £
              {rent && rent.rent_amount !== undefined && rent.rent_amount !== null
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
                  <span>{incident.progress ? incident.progress : "Open"}</span>
                </div>
              ))}
              {incidents.length === 0 && (
                <div className="tenant-dashboard-list-empty">
                  No open requests.
                </div>
              )}
            </div>
            <button className="tenant-dashboard-btn">View All Requests</button>
          </div>

          {/* Messages Card */}
          <div className="tenant-dashboard-card">
            <h3>Messages</h3>
            <div className="tenant-dashboard-card-main">
              {unreadMessages} {/* Display unread message count */}
            </div>
            <div className="tenant-dashboard-card-label">New Messages</div>
          </div>
        </div>
      </main>
    </div>
  );
}