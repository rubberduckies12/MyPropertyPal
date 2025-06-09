import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

function Sidebar() {
  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-logo">Logo</div>
      <nav className="dashboard-nav">
        <Link to="/dashboard" className="dashboard-nav-link">Dashboard</Link>
        <Link to="/dashboard" className="dashboard-nav-link">Properties</Link>
        <Link to="/dashboard" className="dashboard-nav-link">Tenants</Link>
        <Link to="/dashboard" className="dashboard-nav-link">Incidents</Link>
        <Link to="/dashboard" className="dashboard-nav-link">Messages</Link>
        <Link to="/chatbot" className="dashboard-nav-link">Chatbot</Link>
        <Link to="/dashboard" className="dashboard-nav-link">Settings</Link>
      </nav>
    </aside>
  );
}

export default Sidebar;

