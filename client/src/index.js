import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';

// Path imports
import Landing from './webpage/landing/landing.jsx';
import Dashboard from './dashboard/dashboard.jsx';
import Chatbot from './chatbot/chatbot.jsx';
import Login from './login/login.jsx';
import Register from './register/register.jsx';
import Admin from './admin/admin.jsx'; 
import Properties from './properties/properties.jsx';
import Tenants from './tenants/tenants.jsx';
import Incidents from './incidents/incidents.jsx';
import About from './webpage/about/about.jsx';
import Features from './webpage/features/features.jsx';
import Sidebar from './sidebar/sidebar.jsx';

function AppLayout() {
  const location = useLocation();
  // Hide sidebar on login and register pages
  const hideSidebar = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';

  return (
    <div style={{ display: 'flex' }}>
      {!hideSidebar && <Sidebar />}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
        </Routes>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  </React.StrictMode>
);