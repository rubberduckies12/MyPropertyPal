import React, { useState } from 'react';

const Registration = ({ onRegister, onLoginClick }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [landlordId, setLandlordId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Password validation
    const passwordRequirements = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRequirements.test(password)) {
      setError('Password must be at least 8 characters, include an uppercase letter, a number, and a special character.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (role === 'tenant' && !landlordId.trim()) {
      setError('Landlord ID is required for tenants');
      return;
    }

    // Prepare registration data
    const registrationData = { 
      name: fullName,
      email,
      role,
      password
    };
    if (role === 'tenant') {
      registrationData.linkedLandlordId = landlordId;
    }

    try {
      await onRegister(registrationData);
      setSuccess('Registration successful! Please check your email to verify your account.');
    } catch {
      setError('Registration failed');
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-8 py-10">
        {/* Logo */}
        <img 
          src="/logo.png" 
          alt="MyPropertyPal Logo" 
          className="mx-auto mb-6 w-[180px]"
        />
        {/* Feedback messages */}
        {error && (
          <p className="text-center text-red-500 text-sm mb-3">{error}</p>
        )}
        {success && (
          <p className="text-center text-green-500 text-sm mb-3">{success}</p>
        )}
        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select your role</option>
            <option value="tenant">I am a tenant</option>
            <option value="landlord">I am a landlord</option>
          </select>
          {role === 'tenant' && (
            <input
              type="text"
              placeholder="Landlord ID"
              value={landlordId}
              onChange={(e) => setLandlordId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold text-sm transition"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onLoginClick}
            className="text-blue-600 hover:underline text-sm"
          >
            Already have an account? Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registration;