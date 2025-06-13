import React from "react";
import "./admin.css";

export default function Admin() {
  // Placeholder values
  const totalUsers = 124;
  const usersByPlan = [
    { name: "Starter", count: 60 },
    { name: "Pro", count: 40 },
    { name: "Premium", count: 20 },
    { name: "Enterprise", count: 4 },
  ];
  const monthlyEarnings = "£2,000,000";
  const leads = {
    meta: 32,
    linkedin: 18,
    google: 44,
  };
  const recentSignups = [
    { name: "Alice Smith", email: "alice@email.com", plan: "Pro" },
    { name: "Bob Jones", email: "bob@email.com", plan: "Starter" },
    { name: "Carol Lee", email: "carol@email.com", plan: "Premium" },
  ];
  const formResults = [
    { form: "Contact Us", submissions: 12 },
    { form: "Book Demo", submissions: 7 },
  ];

  return (
    <div className="admin-root">
      <h1>Admin Dashboard</h1>
      <div className="admin-stats">
        <div className="admin-card">
          <h2>Total Users</h2>
          <p>{totalUsers}</p>
        </div>
        <div className="admin-card">
          <h2>Monthly Earnings</h2>
          <p>{monthlyEarnings}</p>
        </div>
        <div className="admin-card">
          <h2>Leads from Ads</h2>
          <ul>
            <li>Meta: {leads.meta}</li>
            <li>LinkedIn: {leads.linkedin}</li>
            <li>Google: {leads.google}</li>
          </ul>
        </div>
      </div>

      <div className="admin-section">
        <h2>Users by Plan</h2>
        <ul>
          {usersByPlan.map(plan => (
            <li key={plan.name}>
              {plan.name}: {plan.count}
            </li>
          ))}
        </ul>
      </div>

      <div className="admin-section">
        <h2>Recent Signups</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Plan</th>
            </tr>
          </thead>
          <tbody>
            {recentSignups.map((user, i) => (
              <tr key={i}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.plan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-section">
        <h2>Form Submissions</h2>
        <ul>
          {formResults.map(form => (
            <li key={form.form}>
              {form.form}: {form.submissions}
            </li>
          ))}
        </ul>
      </div>

      <div className="admin-section">
        <h2>Ad Campaign Management</h2>
        <div className="ad-campaigns">
          <div className="ad-campaign-card">
            <h3>Meta (Facebook/Instagram)</h3>
            <button disabled /* TODO: Connect Meta API */>
              Deploy New Campaign
            </button>
            <button disabled /* TODO: Connect Meta API */>
              Manage Campaigns
            </button>
            <p className="ad-campaign-note">Integration coming soon</p>
          </div>
          <div className="ad-campaign-card">
            <h3>Google Ads</h3>
            <button disabled /* TODO: Connect Google Ads API */>
              Deploy New Campaign
            </button>
            <button disabled /* TODO: Connect Google Ads API */>
              Manage Campaigns
            </button>
            <p className="ad-campaign-note">Integration coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}