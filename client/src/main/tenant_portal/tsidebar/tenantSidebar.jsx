import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './tenantSidebar.css';

function TenantSidebar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutModal(false);
    navigate('/'); // Redirect to landing page
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-logo">
        <img
          src="/publicassets/LogoBB.png"
          alt="MyPropertyPal Logo"
          className="sidebar-logo-img"
          style={{ height: "100px", width: "auto", marginBottom: "12px" }}
        />
      </div>
      <nav className="dashboard-nav">
        {/* Home */}
        <div className="sidebar-section">
          <NavLink to="/tenant-home" className="dashboard-nav-link">Home</NavLink>
        </div>
        {/* Maintenance Requests */}
        <div className="sidebar-section">
          <NavLink to="/tenant-maintenance" className="dashboard-nav-link">Maintenance Requests</NavLink>
        </div>
        {/* Messages */}
        <div className="sidebar-section">
          <NavLink to="/tenant-messages" className="dashboard-nav-link">Messages</NavLink>
        </div>
        {/* Calendar */}
        <div className="sidebar-section">
          <NavLink to="/tenant-calendar" className="dashboard-nav-link">Calendar</NavLink>
        </div>
        {/* Rent */}
        <div className="sidebar-section">
          <NavLink to="/tenant-rent" className="dashboard-nav-link">Rent</NavLink>
        </div>
        {/* AI Chatbot */}
        <div className="sidebar-section">
          <NavLink to="/tenant-ai" className="dashboard-nav-link">AI Chatbot</NavLink>
        </div>
      </nav>
      <span
        className="dashboard-nav-link dashboard-logout-link"
        style={{ cursor: 'pointer' }}
        onClick={handleLogoutClick}
      >
        Log Out
      </span>
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <p>Are you sure you want to log out?</p>
            <div className="logout-modal-actions">
              <button onClick={handleLogout} className="logout-confirm-btn">Yes, log out</button>
              <button onClick={() => setShowLogoutModal(false)} className="logout-cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default TenantSidebar;