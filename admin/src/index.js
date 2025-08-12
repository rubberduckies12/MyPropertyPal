import React from "react";
import ReactDOM from "react-dom/client"; // Import from react-dom/client
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLogin from "./adminLogin/adminLogin";
import AdminRegistration from "./adminLogin/adminRegistration"; // Import Admin Registration
import Dashboard from "./AdminPages/dashboard"; // Import Dashboard
import Users from "./AdminPages/users"; // Import Users Page
import ProtectedRoute from "./ProtectedRoute"; // Import ProtectedRoute
import Header from "./components/header"; // Import Header
import "./index.css"; // Import Tailwind CSS styles

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route for Admin Login */}
        <Route path="/" element={<AdminLogin />} />

        {/* Public Route for Admin Registration */}
        <Route path="/adminregister" element={<AdminRegistration />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Header /> {/* Header is included for all protected routes */}
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Header />
              <Users /> {/* Include the Users page */}
            </ProtectedRoute>
          }
        />
        {/* Add other protected routes here */}
        <Route
          path="/finances"
          element={
            <ProtectedRoute>
              <Header />
              <div>Finances Page</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Header />
              <div>Jobs Page</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <Header />
              <div>Leads Page</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing"
          element={
            <ProtectedRoute>
              <Header />
              <div>Marketing Page</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/productivity"
          element={
            <ProtectedRoute>
              <Header />
              <div>Productivity Page</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

// Use ReactDOM.createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

