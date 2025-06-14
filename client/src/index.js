import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Path imports
import Landing from './landing/landing.jsx';
import Dashboard from './dashboard/dashboard.jsx';
import Chatbot from './chatbot/chatbot.jsx';
import Login from './login/login.jsx';
import Register from './register/register.jsx';
import Admin from './admin/admin.jsx'; 
import Properties from './properties/properties.jsx';
import Tenants from './tenants/tenants.jsx';
import Incidents from './incidents/incidents.jsx'; // <-- Add this import

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/incidents" element={<Incidents />} /> {/* <-- Add this line */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);