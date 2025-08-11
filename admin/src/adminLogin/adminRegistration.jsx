import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AdminRegistration = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    pin_number: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { email, password, pin_number, first_name, last_name } = formData;

    if (!email || !password || !pin_number || !first_name || !last_name) {
      setError("All fields are required.");
      return;
    }

    if (pin_number.length !== 4 || isNaN(pin_number)) {
      setError("PIN number must be a 4-digit number.");
      return;
    }

    try {
      // Convert email, first_name, and last_name to lowercase
      const lowerCaseData = {
        email: email.toLowerCase(),
        password,
        pin_number,
        first_name: first_name.toLowerCase(),
        last_name: last_name.toLowerCase(),
      };

      const response = await fetch("https://api.mypropertypal.com/api/admin/adminregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lowerCaseData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed.");
      }

      setSuccess("Registration successful. Redirecting to login...");
      setTimeout(() => {
        navigate("/"); // Redirect to Admin Login after 2 seconds
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-extrabold text-blue-700 text-center mb-6">
          Admin Registration
        </h1>
        {error && <div className="text-red-600 text-sm text-center mb-4">{error}</div>}
        {success && <div className="text-green-600 text-sm text-center mb-4">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="First Name"
            />
          </div>
          <div>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Last Name"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Email"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Password"
            />
          </div>
          <div>
            <input
              type="text"
              name="pin_number"
              value={formData.pin_number}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="4-Digit PIN"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegistration;