import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/sidebar.jsx";
import "./settings.css";

const BACKEND_URL = "https://mypropertypal-3.onrender.com";

export default function Settings() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ password: "", confirm: "" });
  const [plan, setPlan] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");

  // Fetch user data from backend on mount
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/account/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setEmail(data.email || "");
        setPlan(data.plan || "basic");
        setNewEmail(data.email || "");
      });
  }, []);

  if (!email) {
    return (
      <div className="settings-page" style={{ display: "flex" }}>
        <Sidebar />
        <main className="settings-main">
          <h1 className="finances-title">Account Settings</h1>
          <div style={{ textAlign: "center", marginTop: "48px" }}>Loading...</div>
        </main>
      </div>
    );
  }

  // Update email
  const handleSaveEmail = async () => {
    const res = await fetch(`${BACKEND_URL}/api/account/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ email: newEmail })
    });
    if (res.ok) {
      setEmail(newEmail);
      setEditingEmail(false);
    } else {
      alert("Failed to update email");
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((p) => ({ ...p, [name]: value }));
  };

  // Update password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirm) {
      alert("Passwords do not match!");
      return;
    }
    const res = await fetch(`${BACKEND_URL}/api/account/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ password: passwords.password })
    });
    if (res.ok) {
      alert("Password changed!");
      setShowPasswordModal(false);
      setPasswords({ password: "", confirm: "" });
    } else {
      alert("Failed to change password");
    }
  };

  const handlePlanChange = (e) => setPlan(e.target.value);

  // Replace handleSavePlan with Stripe checkout logic
  const handleSavePlan = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_name: plan,
          billing_cycle: billingCycle,
          email,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        alert(data.error || "Failed to start checkout");
      }
    } catch (err) {
      alert("Failed to start checkout");
    }
  };

  return (
    <div className="settings-page" style={{ display: "flex" }}>
      <Sidebar />
      <main className="settings-main" style={{ flex: 1, padding: "32px 24px" }}>
        <h1 className="finances-title">Account Settings</h1>
        <div className="settings-form" style={{ maxWidth: 540 }}>
          {/* Name */}
          <label>
            Name
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="text"
                value={firstName}
                readOnly
                style={{ flex: 1 }}
              />
              <input
                type="text"
                value={lastName}
                readOnly
                style={{ flex: 1 }}
              />
            </div>
          </label>

          {/* Email */}
          <label>
            Email
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {editingEmail ? (
                <>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="settings-save-btn" onClick={handleSaveEmail}>
                    Save
                  </button>
                  <button type="button" className="settings-cancel-btn" onClick={() => setEditingEmail(false)}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="settings-save-btn" onClick={() => setEditingEmail(true)}>
                    Change
                  </button>
                </>
              )}
            </div>
          </label>

          {/* Password */}
          <label>
            Password
            <button
              type="button"
              className="settings-save-btn"
              style={{ marginTop: 6, width: "100%" }}
              onClick={() => setShowPasswordModal(true)}
            >
              Reset Password
            </button>
          </label>

          {/* Plan */}
          <label>
            Plan
            <div style={{ display: "flex", gap: "10px" }}>
              <select name="plan" value={plan} onChange={e => setPlan(e.target.value)} style={{ flex: 1 }}>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="organisation">Organisation</option>
              </select>
              <select name="billing" value={billingCycle} onChange={e => setBillingCycle(e.target.value)}>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <button type="button" className="settings-save-btn" onClick={handleSavePlan}>
                Change
              </button>
            </div>
          </label>
        </div>

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="settings-modal-overlay">
            <div className="settings-modal">
              <h3>Reset Password</h3>
              <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input
                  type="password"
                  name="password"
                  value={passwords.password}
                  onChange={handlePasswordChange}
                  placeholder="New password"
                  required
                />
                <input
                  type="password"
                  name="confirm"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  required
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" className="settings-save-btn">Change Password</button>
                  <button type="button" className="settings-cancel-btn" onClick={() => setShowPasswordModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}