const API_BASE = "http://localhost:5001";

export async function fetchUser() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/api/dashboard/user`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
}

export async function fetchTenantCount() {
  const res = await fetch(`${API_BASE}/api/dashboard/tenants/count`);
  const data = await res.json();
  return data.count;
}

export async function fetchMessages() {
  const res = await fetch(`${API_BASE}/api/dashboard/messages`);
  return res.json();
}

export async function fetchIncidents() {
  const res = await fetch(`${API_BASE}/api/dashboard/incidents`);
  return res.json();
}

export async function fetchProperties() {
  const res = await fetch(`${API_BASE}/api/dashboard/properties`);
  return res.json();
}