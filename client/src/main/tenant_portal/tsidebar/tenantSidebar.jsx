import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaTools, FaEnvelope, FaRobot, FaSignOutAlt, FaBars, FaTimes, FaFileAlt } from "react-icons/fa"; // Import FaFileAlt for documents icon


function TenantSidebar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutModal(false);
    navigate("/"); // Redirect to landing page
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`${showLogoutModal ? "pointer-events-none" : ""}`}>
      {/* Hamburger Icon for Mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-700 text-white p-3 rounded-full shadow-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
      </button>

      {/* Sidebar Component */}
      <aside
        className={`bg-blue-700 text-white h-screen w-64 flex flex-col fixed z-40 transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center py-6">
          <img
            src="/publicassets/LogoBB.png"
            alt="MyPropertyPal Logo"
            className="h-16 w-auto"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2">
          {/* Home */}
          <NavLink
            to="/tenant-home"
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                isActive ? "bg-blue-800" : "hover:bg-blue-600"
              }`
            }
          >
            <FaHome className="text-xl" />
            <span>Home</span>
          </NavLink>

          {/* Maintenance Requests */}
          <NavLink
            to="/tenant-maintenance"
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                isActive ? "bg-blue-800" : "hover:bg-blue-600"
              }`
            }
          >
            <FaTools className="text-xl" />
            <span>Maintenance Requests</span>
          </NavLink>

          {/* Messages */}
          <NavLink
            to="/tenant-messages"
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                isActive ? "bg-blue-800" : "hover:bg-blue-600"
              }`
            }
          >
            <FaEnvelope className="text-xl" />
            <span>Messages</span>
          </NavLink>

          {/* AI Chatbot */}
          <NavLink
            to="/tenant-ai"
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                isActive ? "bg-blue-800" : "hover:bg-blue-600"
              }`
            }
          >
            <FaRobot className="text-xl" />
            <span>AI Chatbot</span>
          </NavLink>

          {/* Tenant Documents */}
          <NavLink
            to="/tenant-documents"
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                isActive ? "bg-blue-800" : "hover:bg-blue-600"
              }`
            }
          >
            <FaFileAlt className="text-xl" />
            <span>Documents</span>
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="mt-auto px-4 py-3">
          <button
            className="flex items-center gap-4 w-full text-red-500 hover:text-red-700 transition"
            onClick={handleLogoutClick}
          >
            <FaSignOutAlt className="text-xl" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center pointer-events-auto"
        >
          <div className="bg-white rounded-lg p-6 shadow-lg z-[10000]">
            <p className="text-gray-800 mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Yes, log out
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TenantSidebar;