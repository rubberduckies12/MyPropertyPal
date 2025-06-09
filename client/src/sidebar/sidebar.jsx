import React from 'react';
import './sidebar.css'; // now importing sidebar-specific styles

function Sidebar() {
  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-logo">Logo</div>
      <nav className="dashboard-nav">
        <a href="#" className="dashboard-nav-link active">Dashboard</a>
        <a href="#" className="dashboard-nav-link">Properties</a>
        <a href="#" className="dashboard-nav-link">Tenants</a>
        <a href="#" className="dashboard-nav-link">Incidents</a>
        <a href="#" className="dashboard-nav-link">Messages</a>
        <a href="#" className="dashboard-nav-link">Settings</a>
      </nav>
    </aside>
  );
}

export default Sidebar;

