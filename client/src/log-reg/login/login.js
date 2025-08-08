const API_BASE = "https://api.mypropertypal.com/";

export async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      credentials: 'include', // <-- Add this line!
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
    // Remove localStorage usage, cookie will be used for auth
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