import React, { useState } from 'react';

const Login = ({ onLogin, onRegisterClick, onRequestReset }) => {
  // -------------------- State --------------------
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  // -------------------- Handlers --------------------
  // Handle login form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onLogin({ email, password });
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  // Handle password reset form submit
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetMsg('');
    try {
      if (onRequestReset) {
        const msg = await onRequestReset(resetEmail);
        setResetMsg(msg || 'If this email exists, a reset link has been sent.');
      } else {
        setResetMsg('Reset link feature is currently unavailable.');
      }
    } catch (err) {
      setResetMsg('Error sending reset email.');
    }
  };

  // -------------------- Render --------------------
  return (
    <div className="w-full max-w-md">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-8 py-10">
        {/* Logo */}
        <img 
          src="/logo.png" 
          alt="MyPropertyPal Logo" 
          className="mx-auto mb-6 w-[180px]"
        />
        {/* Error message */}
        {error && (
          <p className="text-center text-red-500 text-sm mb-3">{error}</p>
        )}
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold text-sm transition"
          >
            Log In
          </button>
        </form>
        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-4 text-gray-400 text-sm font-medium">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
        {/* Register Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={onRegisterClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold text-sm transition"
          >
            Don’t have an account? Sign up
          </button>
        </div>
        {/* Forgot Password */}
        <div className="text-right mt-2">
          <button
            type="button"
            className="text-blue-600 hover:underline text-sm"
            onClick={() => setShowReset(true)}
          >
            Forgot password?
          </button>
        </div>
        {/* Password Reset Form */}
        {showReset && (
          <div className="mt-4 bg-gray-50 p-4 rounded">
            <form onSubmit={handleResetSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm mb-2"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold text-sm"
              >
                Send Reset Link
              </button>
              {resetMsg && <div className="text-sm mt-2 text-center text-gray-600">{resetMsg}</div>}
            </form>
            <button
              className="mt-2 text-gray-500 text-xs underline"
              onClick={() => setShowReset(false)}
            >
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
