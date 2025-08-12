import React, { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { NavLink, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // Get the current route

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <NavLink to="/">MyPropertyPal</NavLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <NavLink
            to="/dashboard"
            className={`hover:text-blue-200 ${
              isActive("/dashboard") ? "font-bold underline" : ""
            }`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/finances"
            className={`hover:text-blue-200 ${
              isActive("/finances") ? "font-bold underline" : ""
            }`}
          >
            Finances
          </NavLink>
          <NavLink
            to="/jobs"
            className={`hover:text-blue-200 ${
              isActive("/jobs") ? "font-bold underline" : ""
            }`}
          >
            Jobs
          </NavLink>
          <NavLink
            to="/leads"
            className={`hover:text-blue-200 ${
              isActive("/leads") ? "font-bold underline" : ""
            }`}
          >
            Leads
          </NavLink>
          <NavLink
            to="/marketing"
            className={`hover:text-blue-200 ${
              isActive("/marketing") ? "font-bold underline" : ""
            }`}
          >
            Marketing
          </NavLink>
          <NavLink
            to="/productivity"
            className={`hover:text-blue-200 ${
              isActive("/productivity") ? "font-bold underline" : ""
            }`}
          >
            Productivity
          </NavLink>
          <NavLink
            to="/users"
            className={`hover:text-blue-200 ${
              isActive("/users") ? "font-bold underline" : ""
            }`}
          >
            Users
          </NavLink>
        </nav>

        {/* Mobile Hamburger Icon */}
        <button
          className="md:hidden text-3xl focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-blue-700">
          <ul className="flex flex-col space-y-4 p-4">
            <li>
              <NavLink
                to="/dashboard"
                className={`block hover:text-blue-300 ${
                  isActive("/dashboard") ? "font-bold underline" : ""
                }`}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/finances"
                className={`block hover:text-blue-300 ${
                  isActive("/finances") ? "font-bold underline" : ""
                }`}
              >
                Finances
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/jobs"
                className={`block hover:text-blue-300 ${
                  isActive("/jobs") ? "font-bold underline" : ""
                }`}
              >
                Jobs
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/leads"
                className={`block hover:text-blue-300 ${
                  isActive("/leads") ? "font-bold underline" : ""
                }`}
              >
                Leads
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/marketing"
                className={`block hover:text-blue-300 ${
                  isActive("/marketing") ? "font-bold underline" : ""
                }`}
              >
                Marketing
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/productivity"
                className={`block hover:text-blue-300 ${
                  isActive("/productivity") ? "font-bold underline" : ""
                }`}
              >
                Productivity
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/users"
                className={`block hover:text-blue-300 ${
                  isActive("/users") ? "font-bold underline" : ""
                }`}
              >
                Users
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;