import React from "react";
import ReactDOM from "react-dom/client"; // Import from react-dom/client
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLogin from "./adminLogin/adminLogin";
import AdminRegistration from "./adminLogin/adminRegistration"; // Import Admin Registration
import "./index.css"; // Import Tailwind CSS styles

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route for Admin Login */}
        <Route path="/" element={<AdminLogin />} />

        {/* Public Route for Admin Registration */}
        <Route path="/adminregister" element={<AdminRegistration />} />

        {/* Add other routes here */}
        {/* Example: <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
};

// Use ReactDOM.createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

