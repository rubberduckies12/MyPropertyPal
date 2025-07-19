import React, { useState, useEffect } from "react";
import "./tenants.css";
import Sidebar from "../../sidebar/sidebar.jsx";

// Utility: Calculate days until next rent due date
function daysLeft(tenant) {
    if (!tenant || !tenant.rent_due_date) return "";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(tenant.rent_due_date);
    dueDate.setHours(0, 0, 0, 0);
    return Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
}

// Utility: Get the last Friday of a given month/year
function getLastFriday(year, month) {
    let d = new Date(year, month + 1, 0); // Last day of month
    while (d.getDay() !== 5) { // 5 = Friday
        d.setDate(d.getDate() - 1);
    }
    return d;
}

// Utility: Get the next due date as a string for the table (always use stored value)
function getNextDueDate(tenant) {
    if (!tenant || !tenant.rent_due_date) return "";
    const dueDate = new Date(tenant.rent_due_date);
    return dueDate.toLocaleDateString();
}

const API_BASE = "https://mypropertypal-3.onrender.com";

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
    const [inviteMessage, setInviteMessage] = useState(""); // Add this state

    // Fetch tenants
    useEffect(() => {
        const token = localStorage.getItem("token");
        setLoading(true);
        fetch(`${API_BASE}/api/tenants`, {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
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

    // Fetch properties for dropdown
    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${API_BASE}/api/properties`, {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
        })
            .then((res) => res.json())
            .then((data) => setProperties(data.properties || []));
    }, []);

    // Handlers
    const handleRowClick = (tenant) => setSelectedTenant(tenant);
    const handleCloseModal = () => setSelectedTenant(null);

    const handleRemoveTenant = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await fetch(`${API_BASE}/api/tenants/${id}`, {
                method: "DELETE",
                headers: { Authorization: token ? `Bearer ${token}` : "" },
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
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE}/api/tenants`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
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
                headers: { Authorization: token ? `Bearer ${token}` : "" },
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
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE}/api/tenants/${editTenant.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
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
                headers: { Authorization: token ? `Bearer ${token}` : "" },
            });
            const tenantsData = await tenantsRes.json();
            setTenants(tenantsData.tenants || []);
            setEditTenant(null);
        } catch (err) {
            alert(err.message);
        }
    };

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

    // Render
    return (
        <div className="properties-page">
            <Sidebar />
            <main className="properties-main">
                <div className="properties-header">
                    <h2 className="properties-title">Tenants</h2>
                    <div>
                        <label style={{ fontWeight: 600, marginRight: 8 }}>
                            Show yearly rent
                        </label>
                        <input
                            type="checkbox"
                            checked={showYearly}
                            onChange={() => setShowYearly((v) => !v)}
                        />
                        <button
                            className="add-tenant-btn"
                            style={{ marginLeft: 18 }}
                            onClick={() => setShowAddModal(true)}
                        >
                            + Add Tenant
                        </button>
                    </div>
                </div>
                {loading ? (
                    <div>Loading tenants...</div>
                ) : error ? (
                    <div style={{ color: "red" }}>{error}</div>
                ) : (
                    <div className="tenants-table-container">
                        <table className="tenants-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Property Address</th>
                                    <th>Rental Income</th>
                                    <th>Rent Due</th>
                                    <th>Status</th>
                                    <th>Days Left</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenants.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: "center", color: "#888" }}>
                                            No tenants added yet
                                        </td>
                                    </tr>
                                ) : (
                                    tenants.map((tenant) => (
                                        <tr
                                            key={tenant.id}
                                            className="tenant-row"
                                            onClick={() => handleRowClick(tenant)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <td>
                                                {tenant.first_name} {tenant.last_name}
                                            </td>
                                            <td>{tenant.address}</td>
                                            <td>
                                                £
                                                {showYearly
                                                    ? (tenant.rent_amount * 12).toLocaleString()
                                                    : tenant.rent_amount.toLocaleString()}
                                                /{showYearly ? "yr" : "mo"}
                                            </td>
                                            <td>{getNextDueDate(tenant)}</td>
                                            <td>
                                                <span className={
                                                    "tenant-status " +
                                                    (tenant.is_pending
                                                        ? "status-pending"
                                                        : (tenant.pays_rent ? "status-active" : "status-overdue"))
                                                }>
                                                    {tenant.is_pending
                                                        ? "Pending"
                                                        : (tenant.pays_rent ? "Active" : "Overdue")}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="countdown">
                                                    {daysLeft(tenant)}
                                                    {" days"}
                                                </span>
                                            </td>
                                            <td>
                                                <button onClick={e => { e.stopPropagation(); handleEditTenant(tenant); }}>
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Tenant Details Modal */}
                {selectedTenant && (
                    <div className="tenant-modal-backdrop" onClick={handleCloseModal}>
                        <div className="tenant-modal" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close" onClick={handleCloseModal}>
                                &times;
                            </button>
                            <h3>
                                {selectedTenant.first_name} {selectedTenant.last_name}
                            </h3>
                            <p>
                                <b>Property:</b> {selectedTenant.address}
                            </p>
                            <p>
                                <b>Rental Income:</b> £
                                {showYearly
                                    ? (selectedTenant.rent_amount * 12).toLocaleString()
                                    : selectedTenant.rent_amount.toLocaleString()}
                                /{showYearly ? "yr" : "mo"}
                            </p>
                            <p>
                                <b>Rent Due:</b>{" "}
                                {getNextDueDate(selectedTenant)}
                            </p>
                            <p>
                                <b>Status:</b>{" "}
                                <span
                                    className={
                                        "tenant-status " +
                                        (selectedTenant.pays_rent
                                            ? "status-active"
                                            : "status-overdue")
                                    }
                                >
                                    {selectedTenant.pays_rent ? "Active" : "Overdue"}
                                </span>
                            </p>
                            <p>
                                <b>Days Left:</b> {daysLeft(selectedTenant)} days
                            </p>
                            <button
                                className="remove-tenant-btn"
                                style={{ marginTop: 16, background: "#d9534f", color: "#fff" }}
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this tenant?")) {
                                        handleRemoveTenant(selectedTenant.id);
                                    }
                                }}
                            >
                                Delete Tenant
                            </button>
                        </div>
                    </div>
                )}

                {/* Add Tenant Modal */}
                {showAddModal && (
                    <div className="tenant-modal-backdrop" onClick={() => setShowAddModal(false)}>
                        <div className="tenant-modal" onClick={e => e.stopPropagation()}>
                            <button className="modal-close" onClick={() => setShowAddModal(false)}>
                                &times;
                            </button>
                            <h3>Add Tenant</h3>
                            <form
                                onSubmit={handleAddTenant}
                                className="add-tenant-form"
                            >
                                <label>
                                    First Name
                                    <input
                                        required
                                        value={addForm.first_name}
                                        onChange={e => setAddForm(f => ({ ...f, first_name: e.target.value }))}
                                    />
                                </label>
                                <label>
                                    Last Name
                                    <input
                                        required
                                        value={addForm.last_name}
                                        onChange={e => setAddForm(f => ({ ...f, last_name: e.target.value }))}
                                    />
                                </label>
                                <label>
                                    Email
                                    <input
                                        type="email"
                                        required
                                        value={addForm.email}
                                        onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                                    />
                                </label>
                                <label>
                                    Property Address
                                    <select
                                        required
                                        value={addForm.property_id}
                                        onChange={e => setAddForm(f => ({ ...f, property_id: e.target.value }))}
                                    >
                                        <option value="">Select property</option>
                                        {properties.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.address}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Rent Amount (£)
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={addForm.rent_amount || ""}
                                        onChange={e => setAddForm(f => ({ ...f, rent_amount: e.target.value }))}
                                    />
                                </label>
                                <label>
                                    Rent Schedule
                                    <select
                                        value={addForm.rent_schedule_type || "monthly"}
                                        onChange={e => {
                                            const type = e.target.value;
                                            setAddForm(f => ({
                                                ...f,
                                                rent_schedule_type: type,
                                                rent_schedule_value: (type === "last_friday") ? null : ""
                                            }));
                                        }}
                                        required
                                    >
                                        <option value="monthly">Specific day of month</option>
                                        <option value="weekly">Weekly (choose weekday)</option>
                                        <option value="biweekly">Every two weeks (choose weekday)</option>
                                        <option value="last_friday">Last Friday of the month</option>
                                    </select>
                                </label>
                                {addForm.rent_schedule_type === "monthly" && (
                                    <label>
                                        Rent Due Date
                                        <input
                                            type="date"
                                            value={addForm.rent_due_date || ""}
                                            onChange={e => setAddForm(f => ({ ...f, rent_due_date: e.target.value }))}
                                            required
                                        />
                                    </label>
                                )}
                                {["weekly", "biweekly"].includes(addForm.rent_schedule_type) && (
                                    <label>
                                        Weekday
                                        <select
                                            value={addForm.rent_schedule_value || ""}
                                            onChange={e => setAddForm(f => ({ ...f, rent_schedule_value: e.target.value }))}
                                            required
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
                                    const lastFriday = getLastFriday(today.getFullYear(), today.getMonth());
                                    return (
                                        <div style={{ margin: "8px 0", fontWeight: 500 }}>
                                            Next rent due date: {lastFriday.toLocaleDateString()}
                                        </div>
                                    );
                                })()}
                                {addError && <div style={{ color: "red" }}>{addError}</div>}
                                <button type="submit" className="add-tenant-btn" style={{ marginTop: 12 }}>
                                    Add Tenant
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Tenant Modal */}
                {editTenant && (
                    <div className="tenant-modal-backdrop" onClick={() => setEditTenant(null)}>
                        <div className="tenant-modal" onClick={e => e.stopPropagation()}>
                            <button className="modal-close" onClick={() => setEditTenant(null)}>
                                &times;
                            </button>
                            <h3>Edit Tenant</h3>
                            <form onSubmit={handleEditSubmit} className="add-tenant-form">
                                <label>
                                    First Name
                                    <input
                                        required
                                        value={editForm.first_name}
                                        onChange={e => setEditForm(f => ({ ...f, first_name: e.target.value }))}
                                    />
                                </label>
                                <label>
                                    Last Name
                                    <input
                                        required
                                        value={editForm.last_name}
                                        onChange={e => setEditForm(f => ({ ...f, last_name: e.target.value }))}
                                    />
                                </label>
                                <label>
                                    Email
                                    <input
                                        type="email"
                                        required
                                        value={editForm.email}
                                        onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                                    />
                                </label>
                                <label>
                                    Property Address
                                    <select
                                        required
                                        value={editForm.property_id}
                                        onChange={e => setEditForm(f => ({ ...f, property_id: e.target.value }))}
                                    >
                                        <option value="">Select property</option>
                                        {properties.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.address}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Rent Amount (£)
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={editForm.rent_amount || ""}
                                        onChange={e => setEditForm(f => ({ ...f, rent_amount: e.target.value }))}
                                    />
                                </label>
                                <label>
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
                                    >
                                        <option value="monthly">Specific day of month</option>
                                        <option value="weekly">Weekly (choose weekday)</option>
                                        <option value="biweekly">Every two weeks (choose weekday)</option>
                                        <option value="last_friday">Last Friday of the month</option>
                                    </select>
                                </label>
                                {editForm.rent_schedule_type === "monthly" && (
                                    <label>
                                        Rent Due Date
                                        <input
                                            type="date"
                                            value={editForm.rent_due_date || ""}
                                            onChange={e => setEditForm(f => ({ ...f, rent_due_date: e.target.value }))}
                                            required
                                        />
                                    </label>
                                )}
                                {["weekly", "biweekly"].includes(editForm.rent_schedule_type) && (
                                    <label>
                                        Weekday
                                        <select
                                            value={editForm.rent_schedule_value || ""}
                                            onChange={e => setEditForm(f => ({ ...f, rent_schedule_value: e.target.value }))}
                                            required
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
                                {editForm.rent_schedule_type === "last_friday" && (() => {
                                    const today = new Date();
                                    const lastFriday = getLastFriday(today.getFullYear(), today.getMonth());
                                    return (
                                        <div style={{ margin: "8px 0", fontWeight: 500 }}>
                                            Next rent due date: {lastFriday.toLocaleDateString()}
                                        </div>
                                    );
                                })()}
                                <button type="submit" className="add-tenant-btn" style={{ marginTop: 12 }}>
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {inviteMessage && (
                    <div style={{ color: "#22c55e", marginBottom: 16, fontWeight: 500 }}>
                        {inviteMessage}
                    </div>
                )}
            </main>
        </div>
    );
}