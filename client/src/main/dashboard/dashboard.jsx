import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar.jsx';
import { HiUsers, HiCurrencyPound, HiMail, HiHome, HiExclamationCircle, HiCog } from "react-icons/hi";

// Hardcoded backend URLs
const API_BASE = "https://mypropertypal-3.onrender.com";
const MAINTENANCE_URL = `${API_BASE}/api/maintenance/landlord`;
const MESSAGES_CONTACTS_URL = `${API_BASE}/api/messages/contacts`;
const TENANTS_COUNT_URL = `${API_BASE}/api/tenants/count`;
const DASHBOARD_USER_URL = `${API_BASE}/api/dashboard/user`;
const DASHBOARD_PROPERTIES_URL = `${API_BASE}/api/dashboard/properties`;
const DASHBOARD_MESSAGES_URL = `${API_BASE}/api/dashboard/messages`;
const TENANTS_URL = `${API_BASE}/api/tenants`;

const severityColors = {
  red: 'bg-red-500 text-white',
  yellow: 'bg-yellow-200 text-yellow-800',
  green: 'bg-blue-500 text-white',
};

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getUpcomingComplianceEvents(deadlines) {
  const today = new Date();
  return (Array.isArray(deadlines) ? deadlines : []).filter(event => {
    if (!event.due_date) return false;
    const dueDate = new Date(event.due_date);
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  });
}

// --- API Calls ---
async function fetchUser() {
  const res = await fetch(DASHBOARD_USER_URL, {
    credentials: 'include'
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

async function fetchTenantCount() {
  const res = await fetch(TENANTS_COUNT_URL, {
    credentials: 'include'
  });
  const data = await res.json();
  return data.count;
}

async function fetchContacts() {
  const res = await fetch(MESSAGES_CONTACTS_URL, {
    credentials: 'include'
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.contacts || [];
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

async function fetchIncidents() {
  const res = await fetch(MAINTENANCE_URL, {
    credentials: 'include'
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.incidents || [];
}

async function fetchProperties() {
  const res = await fetch(DASHBOARD_PROPERTIES_URL, {
    credentials: 'include'
  });
  if (!res.ok) throw new Error("Failed to fetch properties");
  return res.json();
}

async function fetchTenants() {
  const res = await fetch(TENANTS_URL, {
    credentials: 'include'
  });
  const data = await res.json();
  return data.tenants || [];
}

function Dashboard() {
  const [showYearly, setShowYearly] = useState(false);
  const [user, setUser] = useState(null);
  const [tenantCount, setTenantCount] = useState(0);
  const [tenants, setTenants] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0); // Added state for unread messages
  const [incidents, setIncidents] = useState([]);
  const [properties, setProperties] = useState([]);
  const [deadlines, setDeadlines] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      setUser(await fetchUser());
      setTenantCount(await fetchTenantCount());
      setTenants(await fetchTenants());
      setContacts(await fetchContacts());
      setMessages(await fetchUnreadMessages()); // Update unread messages count
      setIncidents(await fetchIncidents());
      setProperties(await fetchProperties());

      // Fetch compliance deadlines
      const res = await fetch(`${API_BASE}/api/compliance/events`, {
        credentials: 'include',
      });
      const data = await res.json();
      setDeadlines(Array.isArray(data) ? data : []);
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadUnreadMessages() {
      setUnreadMessages(await fetchUnreadMessages()); // Fetch unread messages count
    }
    loadUnreadMessages();
  }, []);

  const getPropertyLabel = (propertyId) => {
    const property = properties.find(
      p => p._id === propertyId || p.propertyId === propertyId
    );
    if (!property) return propertyId;
    return property.name
      ? `${property.name} (${property.address})`
      : property.address || propertyId;
  };

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

  const sortedIncidents = [...incidents].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  const recentIncidents = sortedIncidents.slice(0, 2);

  const upcomingCompliance = getUpcomingComplianceEvents(deadlines);

  return (
    <div className="flex h-screen bg-blue-50 overflow-auto">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 px-2 sm:px-4 py-4">
        {/* Header */}
        <header className="flex justify-between items-center mb-4 border-b border-blue-100 pb-2">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-700">Welcome, {user ? capitalize(user.first_name) : "User"}</h1>
          </div>
          <div className="text-sm text-gray-700">
            User ID: <strong>{user?.id || "—"}</strong>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2 gap-4 min-h-0 overflow-auto pb-10">
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

export default Dashboard;