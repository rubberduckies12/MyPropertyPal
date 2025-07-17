import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './sidebar.css';

function Sidebar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutModal(false);
    navigate('/'); // Redirect to landing page
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const toggleDropdown = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
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

        {/* Dashboard Link */}
        <div className="sidebar-section">
          <NavLink to="/dashboard" className="dashboard-nav-link">Dashboard</NavLink>
        </div>

        {/* Messages */}
        <div className="sidebar-section">
          <NavLink to="/messages" className="dashboard-nav-link">Messages</NavLink>
        </div>

        {/* Property Manager */}
        <div className="sidebar-section">
          <button
            className="sidebar-section-btn"
            onClick={() => toggleDropdown('property')}
            aria-expanded={openDropdown === 'property'}
          >
            Property Manager
            <span className={`sidebar-dropdown-arrow${openDropdown === 'property' ? ' open' : ''}`}>▼</span>
          </button>
          {openDropdown === 'property' && (
            <div className="sidebar-dropdown">
              <NavLink to="/properties" className="dashboard-nav-link">Properties</NavLink>
              <NavLink to="/tenants" className="dashboard-nav-link">Tenants</NavLink>
              <NavLink to="/incidents" className="dashboard-nav-link">Maintenance</NavLink>
              <NavLink to="/contractors" className="dashboard-nav-link">Contractors</NavLink>
            </div>
          )}
        </div>

        {/* Financial Manager */}
        <div className="sidebar-section">
          <button
            className="sidebar-section-btn"
            onClick={() => toggleDropdown('financial')}
            aria-expanded={openDropdown === 'financial'}
          >
            Financial Manager
            <span className={`sidebar-dropdown-arrow${openDropdown === 'financial' ? ' open' : ''}`}>▼</span>
          </button>
          {openDropdown === 'financial' && (
            <div className="sidebar-dropdown">
              <NavLink to="/finances" className="dashboard-nav-link">Finances</NavLink>
              <NavLink to="/documents" className="dashboard-nav-link">Documents</NavLink>
            </div>
          )}
        </div>

        {/* Legal Manager */}
        <div className="sidebar-section">
          <button
            className="sidebar-section-btn"
            onClick={() => toggleDropdown('legal')}
            aria-expanded={openDropdown === 'legal'}
          >
            Legal Manager
            <span className={`sidebar-dropdown-arrow${openDropdown === 'legal' ? ' open' : ''}`}>▼</span>
          </button>
          {openDropdown === 'legal' && (
            <div className="sidebar-dropdown">
              <NavLink to="/compliance" className="dashboard-nav-link">Compliance</NavLink>
              {/* Contracts link removed */}
            </div>
          )}
        </div>

        {/* AI Chatbot */}
        <div className="sidebar-section">
          <NavLink to="/chatbot" className="dashboard-nav-link">AI Chatbot</NavLink>
        </div>

        {/* Settings */}
        <div className="sidebar-section">
          <NavLink to="/settings" className="dashboard-nav-link">Settings</NavLink>
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

export default Sidebar;

