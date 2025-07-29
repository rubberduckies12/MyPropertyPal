import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaEnvelope, FaBuilding, FaFileAlt, FaGavel, FaRobot, FaCog, FaSignOutAlt } from "react-icons/fa";

function Sidebar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutModal(false);
    window.location.href = "https://www.mypropertypal.com/"; // Redirect to the landing page
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const toggleDropdown = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  return (
    <aside className="bg-blue-700 text-white h-screen w-64 flex flex-col fixed">
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
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3 rounded-lg transition ${
              isActive ? "bg-blue-800" : "hover:bg-blue-600"
            }`
          }
        >
          <FaHome className="text-xl" />
          <span>Dashboard</span>
        </NavLink>

        {/* Messages */}
        <NavLink
          to="/messages"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3 rounded-lg transition ${
              isActive ? "bg-blue-800" : "hover:bg-blue-600"
            }`
          }
        >
          <FaEnvelope className="text-xl" />
          <span>Messages</span>
        </NavLink>

        {/* Property Manager */}
        <div>
          <button
            className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-blue-600 transition"
            onClick={() => toggleDropdown("property")}
          >
            <div className="flex items-center gap-4">
              <FaBuilding className="text-xl" />
              <span>Property Manager</span>
            </div>
            <span>{openDropdown === "property" ? "▲" : "▼"}</span>
          </button>
          {openDropdown === "property" && (
            <div className="ml-6 mt-2 space-y-2">
              <NavLink
                to="/properties"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-blue-800" : "hover:bg-blue-600"
                  }`
                }
              >
                Properties
              </NavLink>
              <NavLink
                to="/tenants"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-blue-800" : "hover:bg-blue-600"
                  }`
                }
              >
                Tenants
              </NavLink>
              <NavLink
                to="/incidents"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-blue-800" : "hover:bg-blue-600"
                  }`
                }
              >
                Maintenance
              </NavLink>
              <NavLink
                to="/contractors"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-blue-800" : "hover:bg-blue-600"
                  }`
                }
              >
                Contractors
              </NavLink>
            </div>
          )}
        </div>

        {/* Financial Manager */}
        <div>
          <button
            className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-blue-600 transition"
            onClick={() => toggleDropdown("financial")}
          >
            <div className="flex items-center gap-4">
              <FaFileAlt className="text-xl" />
              <span>Financial Manager</span>
            </div>
            <span>{openDropdown === "financial" ? "▲" : "▼"}</span>
          </button>
          {openDropdown === "financial" && (
            <div className="ml-6 mt-2 space-y-2">
              <NavLink
                to="/finances"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-blue-800" : "hover:bg-blue-600"
                  }`
                }
              >
                Finances
              </NavLink>
              <NavLink
                to="/documents"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-blue-800" : "hover:bg-blue-600"
                  }`
                }
              >
                Documents
              </NavLink>
            </div>
          )}
        </div>

        {/* Legal Manager */}
        <div>
          <button
            className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-blue-600 transition"
            onClick={() => toggleDropdown("legal")}
          >
            <div className="flex items-center gap-4">
              <FaGavel className="text-xl" />
              <span>Legal Manager</span>
            </div>
            <span>{openDropdown === "legal" ? "▲" : "▼"}</span>
          </button>
          {openDropdown === "legal" && (
            <div className="ml-6 mt-2 space-y-2">
              <NavLink
                to="/compliance"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-blue-800" : "hover:bg-blue-600"
                  }`
                }
              >
                Compliance
              </NavLink>
            </div>
          )}
        </div>

        {/* AI Chatbot */}
        <NavLink
          to="/chatbot"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3 rounded-lg transition ${
              isActive ? "bg-blue-800" : "hover:bg-blue-600"
            }`
          }
        >
          <FaRobot className="text-xl" />
          <span>AI Chatbot</span>
        </NavLink>

        {/* Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3 rounded-lg transition ${
              isActive ? "bg-blue-800" : "hover:bg-blue-600"
            }`
          }
        >
          <FaCog className="text-xl" />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Logout */}
      <button
        className="flex items-center gap-4 px-4 py-3 mt-auto text-red-500 hover:text-red-700 transition"
        onClick={handleLogoutClick}
      >
        <FaSignOutAlt className="text-xl" />
        <span>Log Out</span>
      </button>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg">
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
    </aside>
  );
}

export default Sidebar;

