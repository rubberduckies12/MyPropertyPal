import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";
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
import MaintenanceRequestsTenant from './main/tenant_portal/maintenanceRequestsTenant/mrt.jsx';
import ProtectedRoute from './ProtectedRoute';
import Messages from './main/messages/messages.jsx';
import Tmessages from './main/tenant_portal/home/tenantMessages/Tmessages.jsx';
import Tai from './main/tenant_portal/TenantAi/Tai.jsx';
import Settings from './main/settings/settings.jsx';
import Sidebar from './main/sidebar/sidebar.jsx';
import TenantSidebar from './main/tenant_portal/tsidebar/tenantSidebar.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

function AnimatedRoute({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.4 }}
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
}

// Layout component that chooses sidebar based on route
function AppLayout({ children }) {
  const location = useLocation();
  // All tenant routes start with "/tenant-"
  const isTenant = location.pathname.startsWith("/tenant-");
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {isTenant ? <TenantSidebar /> : <Sidebar />}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public pages (no sidebar) */}
        <Route path="/" element={<AnimatedRoute><Login /></AnimatedRoute>} />
        <Route path="/login" element={<AnimatedRoute><Login /></AnimatedRoute>} />
        <Route path="/register" element={<AnimatedRoute><Register /></AnimatedRoute>} />

        {/* Landlord App pages (with landlord sidebar) */}
        <Route path="/dashboard" element={
          <AppLayout>
            <AnimatedRoute>
              <ProtectedRoute allowedRoles={["landlord"]}>
                <Dashboard />
              </ProtectedRoute>
            </AnimatedRoute>
          </AppLayout>
        } />
        <Route path="/chatbot" element={
          <AppLayout>
            <AnimatedRoute>
              <ProtectedRoute allowedRoles={["landlord", "tenant"]}>
                <Chatbot />
              </ProtectedRoute>
            </AnimatedRoute>
          </AppLayout>
        } />
        <Route path="/admin" element={
          <AppLayout>
            <AnimatedRoute>
              <ProtectedRoute allowedRoles={["landlord"]}>
                <Admin />
              </ProtectedRoute>
            </AnimatedRoute>
          </AppLayout>
        } />
        <Route path="/properties" element={
          <AppLayout>
            <AnimatedRoute>
              <ProtectedRoute allowedRoles={["landlord"]}>
                <Properties />
              </ProtectedRoute>
            </AnimatedRoute>
          </AppLayout>
        } />
        <Route path="/tenants" element={
          <AppLayout>
            <AnimatedRoute>
              <ProtectedRoute allowedRoles={["landlord"]}>
                <Tenants />
              </ProtectedRoute>
            </AnimatedRoute>
          </AppLayout>
        } />
        <Route path="/incidents" element={
          <AppLayout>
            <AnimatedRoute>
              <ProtectedRoute allowedRoles={["landlord"]}>
                <Incidents />
              </ProtectedRoute>
            </AnimatedRoute>
          </AppLayout>
        } />
        <Route path="/contractors" element={
          <AppLayout>
            <AnimatedRoute>
              <ProtectedRoute allowedRoles={["landlord"]}>
                <ContractorsPage />
              </ProtectedRoute>
            </AnimatedRoute>
          </AppLayout>
        } />
        <Route path="/finances" element={
          <AppLayout>
            <AnimatedRoute>
              <ProtectedRoute allowedRoles={["landlord"]}>
                <Finances />
              </ProtectedRoute>
            </AnimatedRoute>
          </AppLayout>
        } />
        <Route path="/documents" element={
          <AppLayout>
            <AnimatedRoute>
              <ProtectedRoute allowedRoles={["landlord"]}>
                <Documents />
              </ProtectedRoute>
            </AnimatedRoute>
          </AppLayout>
        } />
        <Route path="/compliance" element={
          <AppLayout>
            <AnimatedRoute>
              <ProtectedRoute allowedRoles={["landlord"]}>
                <Compliance />
              </ProtectedRoute>
            </AnimatedRoute>
          </AppLayout>
        } />
        <Route path="/messages" element={
          <AppLayout>
            <AnimatedRoute>
              <ProtectedRoute allowedRoles={["landlord"]}>
                <Messages />
              </ProtectedRoute>
            </AnimatedRoute>
          </AppLayout>
        } />
        <Route path="/settings" element={
          <AppLayout>
            <AnimatedRoute>
              <ProtectedRoute allowedRoles={["landlord"]}>
                <Settings />
              </ProtectedRoute>
            </AnimatedRoute>
          </AppLayout>
        } />

        {/* Tenant App pages (with tenant sidebar) */}
        <Route path="/tenant-home" element={
          <AppLayout>
            <AnimatedRoute>
              <ProtectedRoute allowedRoles={["tenant"]}>
                <TenantHome />
              </ProtectedRoute>
            </AnimatedRoute>
          </AppLayout>
        } />
        <Route path="/tenant-maintenance" element={
          <AppLayout>
            <AnimatedRoute>
              <ProtectedRoute allowedRoles={["tenant"]}>
                <MaintenanceRequestsTenant />
              </ProtectedRoute>
            </AnimatedRoute>
          </AppLayout>
        } />
        <Route path="/tenant-messages" element={
          <AppLayout>
            <AnimatedRoute>
              <ProtectedRoute allowedRoles={["tenant"]}>
                <Tmessages />
              </ProtectedRoute>
            </AnimatedRoute>
          </AppLayout>
        } />
        <Route path="/tenant-ai" element={
          <AppLayout>
            <AnimatedRoute>
              <ProtectedRoute allowedRoles={["tenant"]}>
                <Tai />
              </ProtectedRoute>
            </AnimatedRoute>
          </AppLayout>
        } />
      </Routes>
    </AnimatePresence>
  );
}

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
);