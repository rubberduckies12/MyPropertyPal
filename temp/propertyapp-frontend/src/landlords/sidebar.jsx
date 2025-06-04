import React from 'react';

/**
 * Sidebar
 * Renders the main sidebar navigation for landlord dashboard.
 * Accepts an array of sidebarLinks with label, icon, onClick, active, and isLogout.
 */
const Sidebar = ({ sidebarLinks }) => (
  <aside className="w-64 bg-gray-100 flex flex-col justify-between py-8 px-6 rounded-r-3xl shadow-lg">
    <div>
      {/* Logo Section */}
      <div className="flex items-center mb-10">
        <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
      </div>
      {/* Navigation Links */}
      <nav className="space-y-2">
        {sidebarLinks.map(link => (
          <button
            key={link.label}
            onClick={link.onClick}
            type="button"
            className={`flex items-center w-full px-4 py-3 rounded-xl text-left text-lg font-medium transition border border-transparent
              ${link.isLogout
                ? "text-red-600 hover:bg-red-50"
                : link.active
                ? "border-blue-500 text-blue-700 bg-blue-50 shadow"
                : "text-blue-700 hover:bg-blue-50"
            }`}
          >
            {/* Optional Icon */}
            <span className="mr-3">{link.icon}</span>
            {link.label}
          </button>
        ))}
      </nav>
    </div>
    {/* You can add footer or additional sidebar content here if needed */}
  </aside>
);

export default Sidebar;