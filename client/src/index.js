import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Path imports
import Landing from './landing/landing.jsx';
import Dashboard from './dashboard/dashboard.jsx';
import Chatbot from './chatbot/chatbot.jsx';
import Login from './login/login.jsx'; // <-- Import Login component
import Register from './register/register.jsx'; // <-- Import Register component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} /> {/* <-- Add Login route */}
        <Route path="/register" element={<Register />} /> {/* <-- Add Register route */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);