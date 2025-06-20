export async function register({ email, firstName, lastName, password, role, landlordId }) {
  const response = await fetch('http://localhost:5001/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, firstName, lastName, password, role, landlordId }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Registration failed');
  }
  return await response.json();
}