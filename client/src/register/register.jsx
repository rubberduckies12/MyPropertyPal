import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "./register.js";
import "./register.css";

const ROLES = [
  { label: "Landlord", value: "landlord" },
  { label: "Tenant", value: "tenant" },
];

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // <-- Add state
  const [role, setRole] = useState(ROLES[0].value);
  const [landlordId, setLandlordId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      if (role === "tenant" && !landlordId) {
        setError("Please enter your landlord's user ID.");
        return;
      }
      await register({
        email,
        password,
        role,
        landlordId: role === "tenant" ? landlordId : null,
      });
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
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
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
          <label>
            Role:
            <select value={role} onChange={e => setRole(e.target.value)}>
              {ROLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </label>
          {role === "tenant" && (
            <input
              type="text"
              placeholder="Landlord's User ID"
              value={landlordId}
              onChange={e => setLandlordId(e.target.value)}
              required
            />
          )}
          <button type="submit">Register</button>
        </form>
        {error && <div className="register-error">{error}</div>}
        {success && <div className="register-success">{success}</div>}
      </div>
    </div>
  );
}