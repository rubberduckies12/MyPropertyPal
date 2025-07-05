import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Path imports
import Dashboard from './main/dashboard/dashboard.jsx';
import Chatbot from './main/chatbot/chatbot.jsx';
import Login from './log-reg/login/login.jsx';
import Register from './log-reg/register/register.jsx';
import Admin from './admin/admin.jsx'; 
import Properties from './main/propertymanager/properties/properties.jsx';
import Tenants from './main/propertymanager/tenants/tenants.jsx';
import Incidents from './main/propertymanager/incidents/incidents.jsx';
import ContractorsPage from './main/propertymanager/contractors/contractors.jsx';
import Finances from './main/financialmanager/finances/finances.jsx';
import Documents from './main/financialmanager/documents/documents.jsx';
import Compliance from './main/legalmanager/compliance/compliance.jsx';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Only public pages: Login (default) and Register */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/contractors" element={<ContractorsPage />} />
        <Route path="/finances" element={<Finances />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/compliance" element={<Compliance />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);