export async function login(email, password) {
  try {
    const response = await fetch('http://localhost:5001/login', {
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
    const userData = await response.json();

    // --- Store the JWT token for future requests ---
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }

    return userData;
  } catch (err) {
    // Handle error (e.g., show message to user)
    throw err;
  }
}

export async function requestPasswordReset(email) {
  // Implement this if you add a password reset endpoint to your backend
  return !!email;
}