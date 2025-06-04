export function login(username, password) {
    // Mock login functionality
    if (username === 'admin' && password === 'password') {
      return true; // Login successful
    }
    return false; // Login failed
}