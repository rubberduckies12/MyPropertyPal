import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const BACKEND_URL = "https://api.mypropertypal.com";

function isPasswordValid(password) {
  // At least 8 chars, 1 uppercase, 1 number, 1 special char
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = searchParams.get("token");

    if (!token) {
      setMessage("Invalid or missing token.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!isPasswordValid(newPassword)) {
      setMessage(
        "Password must be at least 8 characters, include 1 uppercase letter, 1 number, and 1 special character."
      );
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/account/reset-password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      setSuccess(true);
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.message || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 relative">
      {/* Back to Login link */}
      <a
        href="https://app.mypropertypal.com/"
        className="absolute top-6 right-8 text-blue-600 font-semibold hover:underline"
      >
        Back to Login
      </a>
      <div className="bg-white border border-blue-100 rounded-2xl shadow-lg p-8 w-full max-w-md relative">
        <img
          src="/publicassets/LogoWB.png"
          alt="MyPropertyPal Logo"
          className="block mx-auto mb-6 w-40"
        />
        <h2 className="text-2xl font-extrabold text-blue-700 mb-4 text-center">
          Reset Your Password
        </h2>
        {message && (
          <div className={`text-center mb-4 ${success ? "text-green-600" : "text-red-600"}`}>
            {message}
          </div>
        )}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}