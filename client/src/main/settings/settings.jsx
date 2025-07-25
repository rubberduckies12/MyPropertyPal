import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/sidebar.jsx";

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
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);

  // Fetch user data from backend on mount
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/account/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setEmail(data.email || "");
        setPlan(data.plan || "basic");
        setBillingCycle(data.billingCycle || "monthly");
        setSubscriptionId(data.subscriptionId || null); // Fetch subscription ID
        setNewEmail(data.email || "");
      });
  }, []);

  // Cancel subscription
  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription? You will retain access until the end of your billing cycle.")) {
      return;
    }

    if (!subscriptionId) {
      alert("No active subscription found to cancel.");
      return;
    }

    setIsCanceling(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/subscriptions/${subscriptionId}/cancel`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        alert("Subscription canceled. You will retain access until the end of your billing cycle.");
        setPlan("canceled"); // Update UI to reflect cancellation
      } else {
        const data = await res.json();
        alert(data.error || "Failed to cancel subscription.");
      }
    } catch (err) {
      alert("An error occurred while canceling the subscription.");
    } finally {
      setIsCanceling(false);
    }
  };

  // Update email
  const handleSaveEmail = async () => {
    const res = await fetch(`${BACKEND_URL}/api/account/settings`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: newEmail }),
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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirm) {
      alert("Passwords do not match!");
      return;
    }
    const res = await fetch(`${BACKEND_URL}/api/account/settings`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: passwords.password }),
    });
    if (res.ok) {
      alert("Password changed!");
      setShowPasswordModal(false);
      setPasswords({ password: "", confirm: "" });
    } else {
      alert("Failed to change password");
    }
  };

  if (!email) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <div className="text-center mt-12">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        <div className="max-w-lg space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <div className="flex gap-4 mt-1">
              <input
                type="text"
                value={firstName}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <input
                type="text"
                value={lastName}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="flex items-center gap-4 mt-1">
              {editingEmail ? (
                <>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={handleSaveEmail}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    onClick={() => setEditingEmail(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => setEditingEmail(true)}
                  >
                    Change
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Plan</label>
            <div className="flex gap-4 mt-1">
              <select
                name="plan"
                value={plan}
                disabled
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              >
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="organisation">Organisation</option>
                <option value="canceled">Canceled</option>
              </select>
              <select
                name="billing"
                value={billingCycle}
                disabled
                className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Cancel Subscription Button */}
          <button
            type="button"
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            onClick={handleCancelSubscription}
            disabled={isCanceling}
          >
            {isCanceling ? "Canceling..." : "Cancel Subscription"}
          </button>
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