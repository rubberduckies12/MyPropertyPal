const API_BASE = "http://localhost:5001";

export async function fetchProperties() {
  const res = await fetch(`${API_BASE}/api/properties`);
  if (!res.ok) throw new Error("Failed to fetch properties");
  return res.json();
}

export async function addProperty(property) {
  const res = await fetch(`${API_BASE}/api/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(property),
  });
  if (!res.ok) throw new Error("Failed to add property");
  return res.json();
}

export async function fetchUser() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/api/dashboard/user`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}
