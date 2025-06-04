// filepath: /Users/tommyrowe/Documents/mypropertypal/propertyapp-frontend/src/Shared/ResetPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      await axios.post('http://localhost:5001/api/users/reset-password', { token, password });
      setMsg('Password reset! You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Reset failed. The link may have expired.');
    }
  };

  if (!token) return <div>Invalid or missing reset token.</div>;

  return (
    <div className="w-full max-w-md mx-auto mt-20 bg-white border border-gray-200 rounded-xl shadow-sm px-8 py-10">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold text-sm"
        >
          Reset Password
        </button>
      </form>
      {msg && <div className="text-green-600 mt-4">{msg}</div>}
      {error && <div className="text-red-600 mt-4">{error}</div>}
    </div>
  );
};

export default ResetPassword;