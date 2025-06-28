const API_BASE = "http://localhost:5001";

export async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    // On success, return the user data
    const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  } catch (err) {
    // Handle error (e.g., show message to user)
    throw err;
  }
}

export async function requestPasswordReset(email) {
  // Implement this if you add a password reset endpoint to your backend
  return !!email;
}