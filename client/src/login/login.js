export function login(email, password) {
  // Mock login functionality
  // Replace with real API call in production
  return email === "admin@example.com" && password === "password";
}

export function requestPasswordReset(email) {
  // Mock password reset functionality
  // Replace with real API call in production
  return !!email;
}