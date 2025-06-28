import React, { useState, useEffect } from "react";
import "./tenants.css";
import Sidebar from "../../sidebar/sidebar.jsx";

// Utility: Calculate days until next rent due day (integer 1-31)
function daysLeft(rentDueDay) {
    if (!rentDueDay) return "";
    const today = new Date();
    const currentDay = today.getDate();
    let nextDue = new Date(today);
    nextDue.setDate(rentDueDay);

    if (currentDay > rentDueDay) nextDue.setMonth(nextDue.getMonth() + 1);
    if (nextDue.getDate() !== rentDueDay) nextDue.setMonth(nextDue.getMonth() + 1, rentDueDay);

    const diffTime = nextDue - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

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
        rent_due: "",
        rent_amount: "",
    });
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [addError, setAddError] = useState("");

    // Fetch tenants
    useEffect(() => {
        const token = localStorage.getItem("token");
        setLoading(true);
        fetch("http://localhost:5001/api/tenants", {
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
        fetch("http://localhost:5001/api/properties", {
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
            await fetch(`http://localhost:5001/api/tenants/${id}`, {
                method: "DELETE",
                headers: { Authorization: token ? `Bearer ${token}` : "" },
            });
            setTenants((prev) => prev.filter((t) => t.id !== id));
            setSelectedTenant(null);
        } catch {
            alert("Failed to remove tenant.");
        }
    };

    const getSelectedPropertyRent = () => {
        const prop = properties.find((p) => p.id === Number(addForm.property_id));
        return prop ? prop.rent_amount : "";
    };

    const calculateTotalEarned = () => {
        const rent = Number(getSelectedPropertyRent());
        return rent ? rent : 0;
    };

    const handleAddTenant = async (e) => {
        e.preventDefault();
        setAddError("");
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:5001/api/tenants", {
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
                    rent_due_date: Number(addForm.rent_due),
                    rent_amount: addForm.rent_amount,
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to add tenant");
            }
            // Refresh tenants list
            const tenantsRes = await fetch("http://localhost:5001/api/tenants", {
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
                rent_due: "",
                rent_amount: "",
            });
        } catch (err) {
            setAddError(err.message);
        }
    };

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
                                    <th>Total Earned</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenants.map((tenant) => (
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
                                        <td>
                                            {tenant.rent_due_date
                                                ? `Day ${tenant.rent_due_date} of each month`
                                                : ""}
                                        </td>
                                        <td>
                                            <span
                                                className={
                                                    "tenant-status " +
                                                    (tenant.pays_rent
                                                        ? "status-paid"
                                                        : "status-overdue")
                                                }
                                            >
                                                {tenant.pays_rent ? "Paid" : "Overdue"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="countdown">
                                                {daysLeft(tenant.rent_due_date)} days
                                            </span>
                                        </td>
                                        <td>
                                            £
                                            {tenant.rent_amount && tenant.rent_due_date
                                                ? (() => {
                                                    const rent = Number(tenant.rent_amount);
                                                    const start = new Date(tenant.rent_due_date);
                                                    const end = new Date(tenant.contract_end);
                                                    if (!rent || isNaN(start) || isNaN(end) || end < start)
                                                        return 0;
                                                    const months =
                                                        (end.getFullYear() - start.getFullYear()) * 12 +
                                                        (end.getMonth() - start.getMonth()) +
                                                        1;
                                                    return (rent * months).toLocaleString();
                                                })()
                                                : "0"}
                                        </td>
                                    </tr>
                                ))}
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
                                {selectedTenant.rent_due_date
                                    ? `Day ${selectedTenant.rent_due_date} of each month`
                                    : ""}
                            </p>
                            <p>
                                <b>Status:</b>{" "}
                                <span
                                    className={
                                        "tenant-status " +
                                        (selectedTenant.pays_rent
                                            ? "status-paid"
                                            : "status-overdue")
                                    }
                                >
                                    {selectedTenant.pays_rent ? "Paid" : "Overdue"}
                                </span>
                            </p>
                            <p>
                                <b>Days Left:</b> {daysLeft(selectedTenant.rent_due_date)} days
                            </p>
                            <p>
                                <b>Total Earned:</b> £
                                {selectedTenant.rent_amount
                                    ? Number(selectedTenant.rent_amount).toLocaleString()
                                    : "0"}
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
                                    Rent Due Day (1-31)
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        max="31"
                                        value={addForm.rent_due}
                                        onChange={e => setAddForm(f => ({ ...f, rent_due: e.target.value }))}
                                        placeholder="Day of month"
                                    />
                                </label>
                                <div>
                                    <strong>Total Earned: </strong>
                                    £{calculateTotalEarned()}
                                </div>
                                {addError && <div style={{ color: "red" }}>{addError}</div>}
                                <button type="submit" className="add-tenant-btn" style={{ marginTop: 12 }}>
                                    Add Tenant
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <button className="add-tenant-btn" onClick={() => setShowAddModal(true)}>
                    + Add Tenant
                </button>
            </main>
        </div>
    );
}