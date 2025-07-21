import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const BACKEND_URL = "https://mypropertypal-3.onrender.com";

function Login({ onRegisterClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const navigate = useNavigate();

  // Login function moved from login.js
  const login = async (email, password) => {
    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
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

      const data = await response.json();
      return data;
    } catch (err) {
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      setMessage("Login successful!");
      localStorage.setItem("token", user.token);
      localStorage.setItem("role", user.role);

      if (user.role === "tenant" || user.type === "tenant") {
        navigate("/tenant-home");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setMessage("Invalid email or password.");
    }
  };

  // Password reset function moved from login.js
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/account/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      if (res.ok) {
        setResetMsg("If this email exists, a reset link has been sent.");
      } else {
        setResetMsg("Unable to send reset link. Please try again.");
      }
    } catch {
      setResetMsg("Unable to send reset link. Please try again.");
    }
  };

  // Add this function for the main back button
  const handleMainBack = () => {
    window.location.href = "https://my-property-pal-ucto.vercel.app/";
  };

  return (
    <div className="login-popup-container">
      <div className="login-popup">
        <button
          type="button"
          className="login-main-back"
          style={{
            position: "absolute",
            left: 24,
            top: 24,
            background: "none",
            border: "none",
            color: "#2563eb",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer"
          }}
          onClick={handleMainBack}
        >
          ← Back
        </button>
        <img src="/publicassets/LogoWB.png" alt="MyPropertyPal Logo" className="login-logo" />
        {message && <p className="login-error">{message}</p>}
        {!showReset ? (
          <>
            <form onSubmit={handleSubmit} className="login-form">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Log In</button>
            </form>
            <div className="login-forgot">
              <button
                type="button"
                className="login-forgot-btn"
                onClick={() => setShowReset(true)}
              >
                Forgot password?
              </button>
            </div>
          </>
        ) : (
          <div className="login-reset">
            <form onSubmit={handleResetSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <button type="submit">Send Reset Link</button>
              {resetMsg && <div className="login-reset-msg">{resetMsg}</div>}
            </form>
            <button
              className="login-back-btn"
              onClick={() => setShowReset(false)}
            >
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;