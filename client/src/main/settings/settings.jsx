import React, { useState } from "react";
import Sidebar from "../sidebar/sidebar.jsx";
import "./settings.css";

export default function Settings() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    plan: "basic",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add API call to update user settings
    alert("Settings updated!");
  };

  return (
    <div className="settings-page" style={{ display: "flex" }}>
      <Sidebar />
      <main className="settings-main" style={{ flex: 1, padding: "32px 24px" }}>
        <h2 style={{ color: "#2563eb", marginBottom: 24 }}>Account Settings</h2>
        <form className="settings-form" onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="New password"
            />
          </label>
          <label>
            Plan
            <select name="plan" value={form.plan} onChange={handleChange}>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </label>
          <button type="submit" className="settings-save-btn" style={{ marginTop: 18 }}>
            Save Changes
          </button>
        </form>
      </main>
        </div>
      );
    }