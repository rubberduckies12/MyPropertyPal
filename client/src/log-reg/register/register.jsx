import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./register.css";

const ROLES = [
  { label: "Landlord", value: "landlord" },
  { label: "Tenant", value: "tenant" },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Move register function here
async function register(data) {
  const res = await fetch('http://localhost:5001/register', { // <-- full URL
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Registration failed');
  return res.json();
}

export default function Register() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(ROLES[0].value);
  const [propertyId, setPropertyId] = useState(""); // <-- use propertyId instead of landlordId
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [inviteMode, setInviteMode] = useState(false);
  const [inviteToken, setInviteToken] = useState("");
  const navigate = useNavigate();
  const query = useQuery();

  useEffect(() => {
    const invite = query.get("invite");
    if (invite) {
      setInviteMode(true);
      setInviteToken(invite);
      fetch(`http://localhost:5001/api/tenants/invite/${invite}`)
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setEmail(data.email);
          setRole(data.role);
        })
        .catch(() => setError("Invalid or expired invite link."));
    }
  }, [query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!firstName || !lastName) {
      setError("First name and last name are required.");
      return;
    }
    try {
      if (inviteMode) {
        // Only invited tenants can register as tenant
        await register({
          password,
          invite: inviteToken,
        });
      } else {
        // Only landlords can self-register
        await register({
          email,
          firstName,
          lastName,
          password,
          role: "landlord",
        });
      }
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="register-root">
      <div className="register-popup">
        <h2>Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            disabled={inviteMode}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
            disabled={inviteMode}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={inviteMode}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          {/* Only show role selector if NOT invite mode, and only allow landlord */}
          {!inviteMode && (
            <label>
              Role:
              <select value={role} onChange={e => setRole(e.target.value)} disabled>
                <option value="landlord">Landlord</option>
              </select>
            </label>
          )}
          <button type="submit">Register</button>
        </form>
        {error && <div className="register-error">{error}</div>}
        {success && <div className="register-success">{success}</div>}
      </div>
    </div>
  );
}