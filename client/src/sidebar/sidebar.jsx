import React from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css';

function Sidebar() {
  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-logo">Logo</div>
      <nav className="dashboard-nav">
        <NavLink to="/dashboard" className="dashboard-nav-link">Dashboard</NavLink>
        <NavLink to="/properties" className="dashboard-nav-link">Properties</NavLink>
        <NavLink to="/tenants" className="dashboard-nav-link">Tenants</NavLink>
        <NavLink to="/incidents" className="dashboard-nav-link">Incidents</NavLink>
        <NavLink to="/messages" className="dashboard-nav-link">Messages</NavLink>
        <NavLink to="/chatbot" className="dashboard-nav-link">Chatbot</NavLink>
        <NavLink to="/settings" className="dashboard-nav-link">Settings</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;

