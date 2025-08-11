import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLogin from "./adminLogin/adminLogin";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route for Admin Login */}
        <Route path="/adminlogin" element={<AdminLogin />} />

        {/* Add other routes here */}
        {/* Example: <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

