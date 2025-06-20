import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Path imports
import Landing from './webpage/landing/landing.jsx';
import About from './webpage/about/about.jsx';
import Features from './webpage/features/features.jsx';
import Dashboard from './dashboard/dashboard.jsx';
import Chatbot from './chatbot/chatbot.jsx';
import Login from './login/login.jsx';
import Register from './register/register.jsx';
import Admin from './admin/admin.jsx'; 
import Properties from './properties/properties.jsx';
import Tenants from './tenants/tenants.jsx';
import Incidents from './incidents/incidents.jsx';
import Footer from './webpage/footer/footer.jsx'; // <-- Import Footer
import Contact from './webpage/contact/contact.jsx'; // <-- Import Contact
import MTD from './webpage/mtd/mtd.jsx';
import ContractorsPage from './contractors/contractors.jsx';
import Tos from './webpage/tos/tos.jsx';
import Privacy from './webpage/privacy/privacy.jsx';
import Blog from './webpage/blog/blog.jsx';

function PublicPageWithFooter({ Component }) {
  return (
    <>
      <Component />
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public pages (with footer) */}
        <Route path="/" element={<PublicPageWithFooter Component={Landing} />} />
        <Route path="/about" element={<PublicPageWithFooter Component={About} />} />
        <Route path="/features" element={<PublicPageWithFooter Component={Features} />} />
        <Route path="/contact" element={<PublicPageWithFooter Component={Contact} />} />
        <Route path="/mtd" element={<PublicPageWithFooter Component={MTD} />} />
        <Route path="/tos" element={<PublicPageWithFooter Component={Tos} />} />
        <Route path="/privacy" element={<PublicPageWithFooter Component={Privacy} />} />
        <Route path="/blog" element={<PublicPageWithFooter Component={Blog} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App pages (no footer) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/contractors" element={<ContractorsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);