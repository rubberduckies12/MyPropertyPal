import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './sidebar.css';

function Sidebar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth tokens or user state here if needed
    // localStorage.removeItem('token');
    setShowLogoutModal(false);
    navigate('/'); // Redirect to landing page
  };

  const handleLogoutClick = (e) => {
    e.preventDefault(); // Prevent navigation
    setShowLogoutModal(true);
  };

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
        <span
          className="dashboard-nav-link dashboard-logout-link"
          style={{ marginTop: 'auto', cursor: 'pointer' }}
          onClick={handleLogoutClick}
        >
          Log Out
        </span>
      </nav>
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

