import React, { useState } from "react";
import { login, requestPasswordReset } from "./login";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login({ onRegisterClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      setMessage("Login successful!");
      navigate("/"); // Redirect to home or dashboard
    } else {
      setMessage("Invalid email or password.");
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (requestPasswordReset(resetEmail)) {
      setResetMsg("If this email exists, a reset link has been sent.");
    } else {
      setResetMsg("Reset link feature is currently unavailable.");
    }
  };

  return (
    <div className="login-popup-container">
      <div className="login-popup">
        <button
          className="login-back-btn"
          style={{ marginBottom: 16 }}
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
        <img src="/logo.png" alt="Logo" className="login-logo" />
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
            <div className="login-divider">
              <div className="login-divider-line" />
              <span>OR</span>
              <div className="login-divider-line" />
            </div>
            <button
              type="button"
              className="login-register-btn"
              onClick={onRegisterClick}
            >
              Don’t have an account? Sign up
            </button>
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