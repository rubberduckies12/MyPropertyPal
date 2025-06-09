import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Path imports
import Landing from './landing/landing.jsx';
import Dashboard from './dashboard/dashboard.jsx'; // Import the dashboard

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Add dashboard route */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);