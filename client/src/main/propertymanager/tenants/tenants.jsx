import React, { useState, useEffect } from "react";
import Sidebar from "../../sidebar/sidebar.jsx";

const API_BASE = "https://api.mypropertypal.com";

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [showYearly, setShowYearly] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    property_id: "",
    rent_due_date: "",
    rent_amount: "",
    rent_schedule_type: "monthly",
    rent_schedule_value: "",
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addError, setAddError] = useState("");
  const [editTenant, setEditTenant] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [inviteMessage, setInviteMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/tenants`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        setTenants(data.tenants || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load tenants");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/properties`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => setProperties(data.properties || []));
  }, []);

  // Utility
  function daysLeft(tenant) {
    if (!tenant || !tenant.rent_due_date) return "";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(tenant.rent_due_date);
    dueDate.setHours(0, 0, 0, 0);
    return Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
  }
  function getLastFriday(year, month) {
    let d = new Date(year, month + 1, 0);
    while (d.getDay() !== 5) {
      d.setDate(d.getDate() - 1);
    }
    return d;
  }
  function getNextDueDate(tenant) {
    if (!tenant || !tenant.rent_due_date) return "";
    const dueDate = new Date(tenant.rent_due_date);
    return !isNaN(dueDate) ? dueDate.toLocaleDateString("en-GB") : "";
  }
  function formatSchedule(tenant) {
    switch (tenant.rent_schedule_type) {
      case "monthly":
        return `Day ${tenant.rent_schedule_value} of each month`;
      case "weekly":
        return `Every week on ${["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][tenant.rent_schedule_value]}`;
      case "biweekly":
        return `Every two weeks on ${["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][tenant.rent_schedule_value]}`;
      case "last_friday":
        return "Last Friday of each month";
      default:
        return "";
    }
  }

  // Handlers
  const handleRowClick = (tenant) => setSelectedTenant(tenant);
  const handleCloseModal = () => setSelectedTenant(null);

  const handleRemoveTenant = async (id) => {
    try {
      await fetch(`${API_BASE}/api/tenants/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      setTenants((prev) => prev.filter((t) => t.id !== id));
      setSelectedTenant(null);
    } catch {
      alert("Failed to remove tenant.");
    }
  };

  const handleAddTenant = async (e) => {
    e.preventDefault();
    setAddError("");
    setInviteMessage(""); // Reset message
    try {
      const res = await fetch(`${API_BASE}/api/tenants`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          first_name: addForm.first_name,
          last_name: addForm.last_name,
          email: addForm.email,
          property_id: addForm.property_id,
          rent_due_date: addForm.rent_schedule_type === "monthly" && addForm.rent_due_date ? addForm.rent_due_date : null,
          rent_amount: addForm.rent_amount,
          rent_schedule_type: addForm.rent_schedule_type,
          rent_schedule_value: addForm.rent_schedule_value !== "" ? addForm.rent_schedule_value : null,
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add tenant");
      }
      // Refresh tenants list
      const tenantsRes = await fetch(`${API_BASE}/api/tenants`, {
        credentials: "include"
      });
      const tenantsData = await tenantsRes.json();
      setTenants(tenantsData.tenants || []);
      setShowAddModal(false);
      setAddForm({
        first_name: "",
        last_name: "",
        email: "",
        property_id: "",
        rent_due_date: "",
        rent_amount: "",
        rent_schedule_type: "monthly",
        rent_schedule_value: "",
      });
      setInviteMessage("An invite email has been sent to your tenant."); // Set message
    } catch (err) {
      setAddError(err.message);
    }
  };

  // Open edit modal
  const handleEditTenant = (tenant) => {
    setEditTenant(tenant);
    setEditForm({
      first_name: tenant.first_name,
      last_name: tenant.last_name,
      email: tenant.email,
      property_id: tenant.property_id,
      rent_amount: tenant.rent_amount,
      rent_schedule_type: tenant.rent_schedule_type,
      rent_schedule_value: tenant.rent_schedule_value,
      rent_due_date: tenant.rent_due_date ? tenant.rent_due_date.split("T")[0] : "",
    });
  };

  // Submit edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/tenants/${editTenant.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...editForm,
          rent_due_date: editForm.rent_schedule_type === "monthly" && editForm.rent_due_date ? editForm.rent_due_date : null,
          rent_schedule_value: editForm.rent_schedule_value !== "" ? editForm.rent_schedule_value : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update tenant");
      }
      // Refresh tenants list
      const tenantsRes = await fetch(`${API_BASE}/api/tenants`, {
        credentials: "include"
      });
      const tenantsData = await tenantsRes.json();
      setTenants(tenantsData.tenants || []);
      setEditTenant(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Render
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0 h-screen">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-10 pt-16 overflow-y-auto">
        <div className="flex items-center justify-between mb-6 border-b border-blue-100 pb-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-700 tracking-tight">
            Tenants
          </h1>
          <div className="flex items-center gap-4">
            {/* Hide Show Yearly Rent Option on Mobile */}
            <label className="font-semibold text-blue-700 flex items-center gap-2 hidden sm:flex">
              <input
                type="checkbox"
                checked={showYearly}
                onChange={() => setShowYearly((v) => !v)}
                className="accent-blue-600"
              />
              Show yearly rent
            </label>
            <button
              className="bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 text-sm sm:text-base hover:bg-blue-700 transition"
              onClick={() => setShowAddModal(true)}
            >
              + Add Tenant
            </button>
          </div>
        </div>

        {loading && <div>Loading tenants...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {!loading && !error && (
          <>
            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
              {tenants.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No tenants added yet
                </div>
              ) : (
                tenants.map((tenant) => (
                  <div
                    key={tenant.id}
                    className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2 cursor-pointer"
                    onClick={() => setSelectedTenant(tenant)} // Open tenant details modal
                  >
                    <h3 className="text-lg font-bold text-blue-700">
                      {tenant.first_name} {tenant.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">{tenant.address}</p>
                    <div className="text-sm">
                      <strong>Rental Income:</strong> £
                      {showYearly
                        ? (tenant.rent_amount * 12).toLocaleString()
                        : tenant.rent_amount.toLocaleString()}
                      /{showYearly ? "yr" : "mo"}
                    </div>
                    <div className="text-sm">
                      <strong>Rent Due:</strong> {getNextDueDate(tenant)}
                    </div>
                    <div className="text-sm">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`px-4 py-1 rounded-xl font-semibold text-sm ${
                          tenant.is_pending
                            ? "bg-yellow-100 text-yellow-800"
                            : tenant.pays_rent
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {tenant.is_pending
                          ? "Unconfirmed"
                          : tenant.pays_rent
                          ? "Active"
                          : "Not Active"}
                      </span>
                    </div>
                    <div className="text-sm">
                      <strong>Days Left:</strong> {daysLeft(tenant)} days
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden lg:block w-full overflow-x-auto mt-8">
              <table className="min-w-[900px] w-full bg-white rounded-2xl text-base divide-y divide-blue-100">
                <thead>
                  <tr>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">
                      Name
                    </th>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">
                      Property Address
                    </th>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">
                      Rental Income
                    </th>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">
                      Rent Due
                    </th>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-center">
                      Status
                    </th>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">
                      Days Left
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-400 py-8">
                        No tenants added yet
                      </td>
                    </tr>
                  ) : (
                    tenants.map((tenant) => (
                      <tr
                        key={tenant.id}
                        className="hover:bg-blue-50 transition cursor-pointer"
                        onClick={() => setSelectedTenant(tenant)} // Open tenant details modal
                      >
                        <td className="py-4 px-3">
                          {tenant.first_name} {tenant.last_name}
                        </td>
                        <td className="py-4 px-3">{tenant.address}</td>
                        <td className="py-4 px-3">
                          £
                          {showYearly
                            ? (tenant.rent_amount * 12).toLocaleString()
                            : tenant.rent_amount.toLocaleString()}
                          /{showYearly ? "yr" : "mo"}
                        </td>
                        <td className="py-4 px-3">{getNextDueDate(tenant)}</td>
                        <td className="py-4 px-3 text-center">
                          <span
                            className={`px-4 py-1 rounded-xl font-semibold text-sm ${
                              tenant.is_pending
                                ? "bg-yellow-100 text-yellow-800"
                                : tenant.pays_rent
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {tenant.is_pending
                              ? "Unconfirmed"
                              : tenant.pays_rent
                              ? "Active"
                              : "Not Active"}
                          </span>
                        </td>
                        <td className="py-4 px-3">{daysLeft(tenant)} days</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Add Tenant Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-lg flex flex-col gap-4 sm:gap-5 border border-blue-100">
              <h2 className="text-xl sm:text-2xl font-extrabold text-blue-700 text-center mb-4">
                Add Tenant
              </h2>
              <form onSubmit={handleAddTenant} className="flex flex-col gap-4 sm:gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="font-semibold text-sm sm:text-base text-black flex flex-col">
                    First Name
                    <input
                      required
                      value={addForm.first_name}
                      onChange={(e) =>
                        setAddForm((f) => ({ ...f, first_name: e.target.value }))
                      }
                      className="mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                    />
                  </label>
                  <label className="font-semibold text-sm sm:text-base text-black flex flex-col">
                    Last Name
                    <input
                      required
                      value={addForm.last_name}
                      onChange={(e) =>
                        setAddForm((f) => ({ ...f, last_name: e.target.value }))
                      }
                      className="mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                    />
                  </label>
                </div>
                <label className="font-semibold text-sm sm:text-base text-black flex flex-col">
                  Email
                  <input
                    type="email"
                    required
                    value={addForm.email}
                    onChange={(e) =>
                      setAddForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                  />
                </label>
                <label className="font-semibold text-sm sm:text-base text-black flex flex-col">
                  Property Address
                  <select
                    required
                    value={addForm.property_id}
                    onChange={(e) =>
                      setAddForm((f) => ({ ...f, property_id: e.target.value }))
                    }
                    className="mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                  >
                    <option value="">Select property</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.address}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="font-semibold text-sm sm:text-base text-black flex flex-col">
                    Rent Amount (£)
                    <input
                      type="number"
                      required
                      min="0"
                      value={addForm.rent_amount || ""}
                      onChange={(e) =>
                        setAddForm((f) => ({ ...f, rent_amount: e.target.value }))
                      }
                      className="mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                    />
                  </label>
                  <label className="font-semibold text-sm sm:text-base text-black flex flex-col">
                    Rent Schedule
                    <select
                      value={addForm.rent_schedule_type || "monthly"}
                      onChange={(e) => {
                        const type = e.target.value;
                        setAddForm((f) => ({
                          ...f,
                          rent_schedule_type: type,
                          rent_schedule_value:
                            type === "last_friday" ? null : "",
                        }));
                      }}
                      required
                      className="mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                    >
                      <option value="monthly">Specific day of month</option>
                      <option value="weekly">Weekly (choose weekday)</option>
                      <option value="biweekly">Every two weeks (choose weekday)</option>
                      <option value="last_friday">Last Friday of the month</option>
                    </select>
                  </label>
                </div>
                {addForm.rent_schedule_type === "monthly" && (
                  <label className="font-semibold text-sm sm:text-base text-black flex flex-col relative">
                    Rent Due Date
                    <input
                      type="date"
                      value={addForm.rent_due_date || ""}
                      onChange={(e) =>
                        setAddForm((f) => ({ ...f, rent_due_date: e.target.value }))
                      }
                      required
                      className="mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                    />
                  </label>
                )}
                {["weekly", "biweekly"].includes(addForm.rent_schedule_type) && (
                  <label className="font-semibold text-sm sm:text-base text-black flex flex-col">
                    Weekday
                    <select
                      value={addForm.rent_schedule_value || ""}
                      onChange={(e) =>
                        setAddForm((f) => ({
                          ...f,
                          rent_schedule_value: e.target.value,
                        }))
                      }
                      required
                      className="mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                    >
                      <option value="">Select weekday</option>
                      <option value="1">Monday</option>
                      <option value="2">Tuesday</option>
                      <option value="3">Wednesday</option>
                      <option value="4">Thursday</option>
                      <option value="5">Friday</option>
                      <option value="6">Saturday</option>
                      <option value="0">Sunday</option>
                    </select>
                  </label>
                )}
                {addForm.rent_schedule_type === "last_friday" && (() => {
                  const today = new Date();
                  const lastFriday = getLastFriday(
                    today.getFullYear(),
                    today.getMonth()
                  );
                  return (
                    <div className="font-semibold text-sm sm:text-base text-black mt-2">
                      Next rent due date: {lastFriday.toLocaleDateString("en-GB")}
                    </div>
                  );
                })()}
                {addError && (
                  <div className="text-red-500 text-center text-sm sm:text-base">
                    {addError}
                  </div>
                )}
                <div className="flex gap-4 mt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white font-bold rounded-lg px-3 py-2 text-sm sm:text-base hover:bg-blue-700 transition flex-1"
                  >
                    Add Tenant
                  </button>
                  <button
                    type="button"
                    className="bg-gray-100 text-gray-700 font-bold rounded-lg px-3 py-2 text-sm sm:text-base border border-blue-100 hover:bg-gray-200 transition flex-1"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tenant Details Modal */}
        {selectedTenant && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-start justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg my-8 flex flex-col gap-6 border border-blue-100">
              <h2 className="text-2xl font-extrabold text-blue-700 mb-2">
                Details for {selectedTenant.first_name} {selectedTenant.last_name}
              </h2>
              <div className="bg-blue-50 rounded-lg p-4 mb-2 text-base text-gray-700 flex flex-col gap-2">
                <div>
                  <strong className="text-blue-700">Property:</strong> {selectedTenant.address}
                </div>
                <div>
                  <strong className="text-blue-700">Rental Income:</strong> £
                  {showYearly
                    ? (selectedTenant.rent_amount * 12).toLocaleString()
                    : selectedTenant.rent_amount.toLocaleString()}
                  /{showYearly ? "yr" : "mo"}
                </div>
                <div>
                  <strong className="text-blue-700">Rent Due:</strong> {getNextDueDate(selectedTenant)}
                </div>
                <div>
                  <strong className="text-blue-700">Status:</strong>{" "}
                  <span
                    className={`px-4 py-1 rounded-xl font-semibold text-sm ${
                      selectedTenant.pays_rent
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedTenant.pays_rent ? "Active" : "Not Active"}
                  </span>
                </div>
                <div>
                  <strong className="text-blue-700">Days Left:</strong> {daysLeft(selectedTenant)} days
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-100 text-gray-700 font-bold rounded-lg px-4 py-2 text-sm border border-blue-100 hover:bg-gray-200 transition flex-1"
                >
                  Close
                </button>
                <button
                  className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition flex-1"
                  onClick={() => handleEditTenant(selectedTenant)} // Open edit tenant modal
                >
                  Edit Tenant
                </button>
                <button
                  className="bg-red-600 text-white font-bold rounded-lg px-4 py-2 text-sm hover:bg-red-700 transition flex-1"
                  onClick={() => handleRemoveTenant(selectedTenant.id)}
                >
                  Delete Tenant
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Tenant Modal */}
        {editTenant && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-lg flex flex-col gap-4 sm:gap-5 border border-blue-100">
              <h2 className="text-xl sm:text-2xl font-extrabold text-blue-700 text-center mb-4">
                Edit Tenant
              </h2>
              <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 sm:gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="font-semibold text-sm sm:text-base text-black flex flex-col">
                    First Name
                    <input
                      required
                      value={editForm.first_name}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, first_name: e.target.value }))
                      }
                      className="mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                    />
                  </label>
                  <label className="font-semibold text-sm sm:text-base text-black flex flex-col">
                    Last Name
                    <input
                      required
                      value={editForm.last_name}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, last_name: e.target.value }))
                      }
                      className="mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                    />
                  </label>
                </div>
                <label className="font-semibold text-sm sm:text-base text-black flex flex-col">
                  Email
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                  />
                </label>
                <label className="font-semibold text-sm sm:text-base text-black flex flex-col">
                  Property Address
                  <select
                    required
                    value={editForm.property_id}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, property_id: e.target.value }))
                    }
                    className="mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                  >
                    <option value="">Select property</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.address}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="font-semibold text-sm sm:text-base text-black flex flex-col">
                    Rent Amount (£)
                    <input
                      type="number"
                      required
                      min="0"
                      value={editForm.rent_amount || ""}
                      onChange={(e) => setEditForm(f => ({ ...f, rent_amount: e.target.value }))}
                      className="mt-1 px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400"
                    />
                  </label>
                  <label className="font-semibold text-sm sm:text-base text-black flex flex-col">
                    Rent Schedule
                    <select
                      value={editForm.rent_schedule_type || "monthly"}
                      onChange={e => {
                        const type = e.target.value;
                        setEditForm(f => ({
                          ...f,
                          rent_schedule_type: type,
                          rent_schedule_value: (type === "last_friday") ? null : ""
                        }));
                      }}
                      required
                      className="mt-1 px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="monthly">Specific day of month</option>
                      <option value="weekly">Weekly (choose weekday)</option>
                      <option value="biweekly">Every two weeks (choose weekday)</option>
                      <option value="last_friday">Last Friday of the month</option>
                    </select>
                  </label>
                </div>
                <label className="font-semibold text-sm sm:text-base text-black flex flex-col">
                  Rent Due Date
                  <input
                    type="date"
                    value={editForm.rent_due_date || ""}
                    onChange={e => setEditForm(f => ({ ...f, rent_due_date: e.target.value }))}
                    required
                    className="mt-1 px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400"
                  />
                </label>
                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-700 transition flex-1"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="bg-gray-100 text-gray-700 font-bold rounded-lg px-4 py-2 border border-blue-100 hover:bg-gray-200 transition flex-1"
                    onClick={() => setEditTenant(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invite Message */}
        {inviteMessage && (
          <div className="text-green-500 mb-4 font-semibold">{inviteMessage}</div>
        )}
      </main>
    </div>
  );
}