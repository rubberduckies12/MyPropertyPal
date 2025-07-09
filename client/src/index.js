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
import TenantHome from './main/tenant_portal/home/home.jsx';
import ProtectedRoute from './ProtectedRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Landlord App pages (protected) */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["landlord"]}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/chatbot" element={
          <ProtectedRoute allowedRoles={["landlord"]}>
            <Chatbot />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["landlord"]}>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/properties" element={
          <ProtectedRoute allowedRoles={["landlord"]}>
            <Properties />
          </ProtectedRoute>
        } />
        <Route path="/tenants" element={
          <ProtectedRoute allowedRoles={["landlord"]}>
            <Tenants />
          </ProtectedRoute>
        } />
        <Route path="/incidents" element={
          <ProtectedRoute allowedRoles={["landlord"]}>
            <Incidents />
          </ProtectedRoute>
        } />
        <Route path="/contractors" element={
          <ProtectedRoute allowedRoles={["landlord"]}>
            <ContractorsPage />
          </ProtectedRoute>
        } />
        <Route path="/finances" element={
          <ProtectedRoute allowedRoles={["landlord"]}>
            <Finances />
          </ProtectedRoute>
        } />
        <Route path="/documents" element={
          <ProtectedRoute allowedRoles={["landlord"]}>
            <Documents />
          </ProtectedRoute>
        } />
        <Route path="/compliance" element={
          <ProtectedRoute allowedRoles={["landlord"]}>
            <Compliance />
          </ProtectedRoute>
        } />

        {/* Tenant App page (protected) */}
        <Route path="/tenant-home" element={
          <ProtectedRoute allowedRoles={["tenant"]}>
            <TenantHome />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);