import React, { useState, useEffect } from "react";

/**
 * LandlordAccountSettings
 * Allows landlord to update profile, change password, update plan, or delete account.
 */
const LandlordAccountSettings = ({
  user,
  onUpdateProfile,
  onDeleteAccount,
  onUpdatePlan,
  onChangePassword,
}) => {
  // -------------------- State --------------------
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.address || "",
    plan: user?.plan || "basic",
  });
  const [loading, setLoading] = useState(false);

  // Password change state
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passwordMsg, setPasswordMsg] = useState("");

  // Delete account confirmation state
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  // Update form when user prop changes
  useEffect(() => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      address: user?.address || "",
      plan: user?.plan || "basic",
    });
  }, [user]);

  // -------------------- Handlers --------------------
  // Handle profile form field changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle profile form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onUpdateProfile(form);
    setLoading(false);
  };

  // Handle plan change
  const handlePlanChange = async (e) => {
    setForm({ ...form, plan: e.target.value });
    await onUpdatePlan(e.target.value);
  };

  // Show delete confirmation popup
  const handleDelete = () => {
    setShowDeleteWarning(true);
  };

  // Confirm account deletion
  const confirmDelete = () => {
    setShowDeleteWarning(false);
    onDeleteAccount();
  };

  // Cancel account deletion
  const cancelDelete = () => {
    setShowDeleteWarning(false);
  };

  // Handle password change form submit
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    if (passwords.new !== passwords.confirm) {
      setPasswordMsg("New passwords do not match.");
      return;
    }
    try {
      await onChangePassword(passwords.current, passwords.new);
      setPasswordMsg("Password changed successfully.");
      setPasswords({ current: "", new: "", confirm: "" });
      setShowPassword(false);
    } catch (err) {
      setPasswordMsg(err.message || "Failed to change password.");
    }
  };

  // -------------------- Render --------------------
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-10">
        <h2 className="text-3xl font-bold mb-8 text-blue-700">Account Settings</h2>
        {/* Profile Update Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Home Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Plan</label>
            <select
              name="plan"
              value={form.plan}
              onChange={handlePlanChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              {/* Add more plans as needed */}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <hr className="my-10" />

        {/* Change Password Section */}
        <div className="mb-10">
          <button
            className="text-blue-600 underline mb-2"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? "Hide Change Password" : "Change Password"}
          </button>
          {showPassword && (
            <form onSubmit={handlePasswordChange} className="space-y-4 mt-2">
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Current Password</label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">New Password</label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              {passwordMsg && (
                <div className={`text-sm ${passwordMsg.includes("success") ? "text-green-600" : "text-red-600"}`}>
                  {passwordMsg}
                </div>
              )}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Change Password
              </button>
            </form>
          )}
        </div>

        <hr className="my-10" />

        {/* Delete Account Button */}
        <div className="flex justify-end">
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-semibold transition"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Account Warning Popup */}
      {showDeleteWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4 text-red-600">Delete Account</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordAccountSettings;