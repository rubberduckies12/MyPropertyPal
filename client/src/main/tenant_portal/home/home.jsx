import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import TenantSidebar from "../tsidebar/tenantSidebar.jsx";

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
    credentials: "include",
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
  const navigate = useNavigate(); // Initialize useNavigate

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
      setUnreadMessages(await fetchUnreadMessages());
    } else {
      console.error("Failed to mark messages as read");
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <TenantSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-10 pt-16">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          {/* Sidebar Icon */}
          <div className="lg:hidden mr-4">
            {/* The sidebar icon is already handled in TenantSidebar */}
          </div>

          {/* Page Title */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">
              Hey{user && user.first_name ? `, ${user.first_name}` : ""}!
            </h1>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Rent Amount Card */}
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">
              Rent Amount
            </h3>
            <p className="text-4xl font-bold text-blue-600">
              £
              {rent && rent.rent_amount !== undefined && rent.rent_amount !== null
                ? Number(rent.rent_amount).toLocaleString()
                : "0"}
            </p>
            <p className="text-gray-600 mt-2">
              {rent && rent.rent_due_date
                ? `Next Due: ${new Date(rent.rent_due_date).toLocaleDateString()}`
                : "No upcoming due date"}
            </p>
          </div>

          {/* Maintenance Requests Card */}
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">
              Maintenance Requests
            </h3>
            <p className="text-4xl font-bold text-blue-600">{incidents.length}</p>
            <p className="text-gray-600 mt-2">Open Requests</p>
            <div className="mt-4 space-y-2">
              {incidents.slice(0, 3).map((incident, idx) => (
                <div
                  key={idx}
                  className="bg-gray-100 rounded-lg px-4 py-2 flex justify-between items-center"
                >
                  <strong className="text-blue-700">
                    {incident.title || "Request"}
                  </strong>
                  <span className="text-gray-500">
                    {incident.progress ? incident.progress : "Open"}
                  </span>
                </div>
              ))}
              {incidents.length === 0 && (
                <div className="text-gray-500">No open requests.</div>
              )}
            </div>
            <button
              className="mt-auto bg-blue-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-700 transition"
              onClick={() => navigate("/tenant-maintenance")} // Navigate to mrt page
            >
              View All Requests
            </button>
          </div>

          {/* Messages Card */}
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">Messages</h3>
            <p className="text-4xl font-bold text-blue-600">{unreadMessages}</p>
            <p className="text-gray-600 mt-2">New Messages</p>
          </div>
        </div>
      </main>
    </div>
  );
}