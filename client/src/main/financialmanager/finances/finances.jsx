import React, { useState, useEffect } from "react";
import Sidebar from "../../sidebar/sidebar.jsx";
import "./finances.css";

const PERIODS = [
  { label: "Monthly", value: "month" },
  { label: "Quarterly", value: "quarter" },
  { label: "Yearly", value: "year" },
];

function getPeriodDates(period) {
  const now = new Date();
  if (period === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start, end };
  }
  if (period === "quarter") {
    const quarter = Math.floor(now.getMonth() / 3);
    const start = new Date(now.getFullYear(), quarter * 3, 1);
    const end = new Date(now.getFullYear(), quarter * 3 + 3, 0);
    return { start, end };
  }
  // year
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), 11, 31);
  return { start, end };
}

function filterByPeriod(items, period) {
  const { start, end } = getPeriodDates(period);
  return items.filter(item => {
    const d = new Date(item.date);
    return d >= start && d <= end;
  });
}

const API_BASE = "https://mypropertypal-3.onrender.com/api/finances";

export default function Finances() {
  const [period, setPeriod] = useState("month");
  const [rentPayments, setRentPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [taxableProfit, setTaxableProfit] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showRentModal, setShowRentModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    property_id: "",
    amount: "",
    category: "",
    description: "",
    incurred_on: "",
  });
  const [rentForm, setRentForm] = useState({
    property_id: "",
    tenant_id: "",
    amount: "",
    paid_on: "",
    method: "",
    reference: "",
  });
  const [editExpenseModal, setEditExpenseModal] = useState(null);
  const [editRentModal, setEditRentModal] = useState(null);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [user, setUser] = useState(null);
  const [expectedRent, setExpectedRent] = useState([]);

  useEffect(() => {
    async function fetchFinances() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(API_BASE, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (!res.ok) throw new Error("Failed to fetch finances");
        const data = await res.json();
        setRentPayments(data.rentPayments || []);
        setExpenses(data.expenses || []);
        setTotalIncome(data.totalIncome || 0);
        setTotalExpenses(data.totalExpenses || 0);
        setTaxableProfit(data.taxableProfit || 0);
        setUser(data.user || null);
      } catch (err) {
        setError(err.message || "Error loading finances");
      } finally {
        setLoading(false);
      }
    }
    fetchFinances();
  }, []);

  useEffect(() => {
    async function fetchDropdowns() {
      const token = localStorage.getItem("token");
      try {
        const propRes = await fetch("https://mypropertypal-3.onrender.com/api/properties", {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (propRes.ok) {
          const data = await propRes.json();
          setProperties(data.properties || []);
        }
        const tenantRes = await fetch("https://mypropertypal-3.onrender.com/api/tenants", {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (tenantRes.ok) {
          const data = await tenantRes.json();
          setTenants(data.tenants || []);
        }
      } catch {}
    }
    fetchDropdowns();
  }, []);

  useEffect(() => {
    async function fetchExpectedRent() {
      const token = localStorage.getItem("token");
      const res = await fetch("https://mypropertypal-3.onrender.com/api/finances/expected-rent", {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });
      const data = await res.json();
      setExpectedRent(data.expected || []);
    }
    fetchExpectedRent();
  }, []);

  const filteredRent = filterByPeriod(rentPayments, period);
  const filteredExpenses = filterByPeriod(expenses, period);

  async function handleAddExpense(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(expenseForm),
      });
      if (!res.ok) throw new Error("Failed to add expense");
      setShowExpenseModal(false);
      setExpenseForm({
        property_id: "",
        amount: "",
        category: "",
        description: "",
        incurred_on: "",
      });
      const refreshed = await fetch(API_BASE, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await refreshed.json();
      setExpenses(data.expenses || []);
      setTotalExpenses(data.totalExpenses || 0);
      setTaxableProfit(data.taxableProfit || 0);
    } catch (err) {
      alert(err.message || "Failed to add expense");
    }
  }

  async function handleAddRent(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/rent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(rentForm),
      });
      if (!res.ok) throw new Error("Failed to add rent payment");
      setShowRentModal(false);
      setRentForm({
        property_id: "",
        tenant_id: "",
        amount: "",
        paid_on: "",
        method: "",
        reference: "",
      });
      const refreshed = await fetch(API_BASE, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await refreshed.json();
      setRentPayments(data.rentPayments || []);
      setTotalIncome(data.totalIncome || 0);
      setTaxableProfit(data.taxableProfit || 0);
    } catch (err) {
      alert(err.message || "Failed to add rent payment");
    }
  }

  async function handleEditExpense(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { id, property_id, amount, category, description, incurred_on } = editExpenseModal;
      const res = await fetch(`${API_BASE}/expense/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ property_id, amount, category, description, incurred_on }),
      });
      if (!res.ok) throw new Error("Failed to update expense");
      setEditExpenseModal(null);
      const refreshed = await fetch(API_BASE, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await refreshed.json();
      setExpenses(data.expenses || []);
      setTotalExpenses(data.totalExpenses || 0);
      setTaxableProfit(data.taxableProfit || 0);
    } catch (err) {
      alert(err.message || "Failed to update expense");
    }
  }

  async function handleEditRent(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { id, property_id, tenant_id, amount, paid_on, method, reference } = editRentModal;
      const res = await fetch(`${API_BASE}/rent/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ property_id, tenant_id, amount, paid_on, method, reference }),
      });
      if (!res.ok) throw new Error("Failed to update rent payment");
      setEditRentModal(null);
      const refreshed = await fetch(API_BASE, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await refreshed.json();
      setRentPayments(data.rentPayments || []);
      setTotalIncome(data.totalIncome || 0);
      setTaxableProfit(data.taxableProfit || 0);
    } catch (err) {
      alert(err.message || "Failed to update rent payment");
    }
  }

  async function handleExportTaxReport() {
    try {
      const year = new Date().getFullYear();
      const token = localStorage.getItem("token");
      const res = await fetch(`https://mypropertypal-3.onrender.com/api/finances/tax-report?year=${year}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });
      if (!res.ok) throw new Error("Failed to generate tax report.");
      const blob = await res.blob();
      // Create a download link for the PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tax-report-${year}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to generate tax report.");
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const deleteRentPayment = async (rentId) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_BASE}/rent/${rentId}`, {
      method: "DELETE",
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    setRentPayments(rentPayments => rentPayments.filter(r => r.id !== rentId));
  };

  const deleteExpense = async (expenseId) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_BASE}/expense/${expenseId}`, {
      method: "DELETE",
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    setExpenses(expenses => expenses.filter(e => e.id !== expenseId));
  };

  // Split expectedRent into paid and expected/overdue
  const paidRent = rentPayments;
  const expectedOrOverdueRent = expectedRent.filter(r => r.status !== "Paid");

  return (
    <div className="properties-page">
      <Sidebar />
      <main className="properties-main">
        <div className="properties-header">
          <h1 className="properties-title">Financial Manager</h1>
          <div>
            <button className="add-property-btn" onClick={() => setShowExpenseModal(true)}>
              + Add Expense
            </button>
            <button
              className="add-property-btn"
              style={{ marginLeft: 12 }}
              onClick={() => setShowRentModal(true)}
            >
              + Mark Rent Received
            </button>
          </div>
        </div>
        <div className="finances-period-toggle">
          {PERIODS.map(opt => (
            <button
              key={opt.value}
              className={`finances-period-btn${period === opt.value ? " active" : ""}`}
              onClick={() => setPeriod(opt.value)}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : (
          <>
            <div className="finances-summary-cards">
              <div className="finances-summary-card">
                <div className="finances-summary-label">Total Rent Received</div>
                <div className="finances-summary-value">£{totalIncome.toLocaleString()}</div>
              </div>
              <div className="finances-summary-card">
                <div className="finances-summary-label">Total Expenses</div>
                <div className="finances-summary-value">£{totalExpenses.toLocaleString()}</div>
              </div>
              <div className="finances-summary-card">
                <div className="finances-summary-label">Taxable Profit</div>
                <div className="finances-summary-value">£{taxableProfit.toLocaleString()}</div>
              </div>
            </div>

            {/* Expected/Overdue Rent Table */}
            <section className="finances-section">
              <h2>Expected & Overdue Rent Payments</h2>
              <table className="finances-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Tenant</th>
                    <th>Amount</th>
                    <th>Date Due</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {expectedOrOverdueRent.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", color: "#888" }}>
                        No payments added yet
                      </td>
                    </tr>
                  ) : (
                    expectedOrOverdueRent.map(payment => (
                      <tr key={payment.property_id + "-" + payment.tenant_id + "-" + payment.due_date}>
                        <td>{payment.property}</td>
                        <td>{payment.tenant}</td>
                        <td>£{payment.amount}</td>
                        <td>{payment.due_date ? formatDate(payment.due_date) : ""}</td>
                        <td className={
                          payment.status === "Overdue"
                            ? "finances-status-overdue"
                            : "finances-status-pending"
                        }>
                          {payment.status}
                        </td>
                        <td>
                          <button
                            className="finances-add-btn"
                            onClick={() => {
                              setRentForm({
                                property_id: payment.property_id,
                                tenant_id: payment.tenant_id,
                                amount: payment.amount,
                                paid_on: payment.due_date,
                                method: "",
                                reference: "",
                              });
                              setShowRentModal(true);
                            }}
                          >
                            Mark as Received
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>

            {/* Paid Rent Table */}
            <section className="finances-section">
              <h2>Rent Paid</h2>
              <table className="finances-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Tenant</th>
                    <th>Amount</th>
                    <th>Date Due</th>
                    <th>Date Paid</th>
                    <th>Method</th>
                    <th>Reference</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paidRent.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center", color: "#888" }}>
                        No payments added yet
                      </td>
                    </tr>
                  ) : (
                    paidRent.map(payment => (
                      <tr key={payment.id}>
                        <td>{payment.property}</td>
                        <td>{payment.tenant}</td>
                        <td>£{payment.amount}</td>
                        <td>{payment.due_date ? formatDate(payment.due_date) : ""}</td>
                        <td>{payment.paid_on ? formatDate(payment.paid_on) : ""}</td>
                        <td>{payment.method || ""}</td>
                        <td>{payment.reference || ""}</td>
                        <td>
                          {payment.payment_status === "Late" ? (
                            <span style={{ color: "#d9534f" }}>Late</span>
                          ) : (
                            <span style={{ color: "#22c55e" }}>On Time</span>
                          )}
                        </td>
                        <td>
                          <div className="rent-paid-actions-dropdown">
                            <button className="rent-paid-actions-btn">Actions ▼</button>
                            <div className="rent-paid-actions-menu">
                              <button
                                className="rent-paid-actions-menu-item"
                                onClick={() => setEditRentModal(payment)}
                              >
                                Edit
                              </button>
                              <button
                                className="rent-paid-actions-menu-item delete"
                                onClick={() => deleteRentPayment(payment.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>

            {/* Outgoing Expenses Table */}
            <section className="finances-section">
              <h2>Outgoing Expenses</h2>
              <table className="finances-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", color: "#888" }}>
                        No payments added yet
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map(expense => (
                      <tr key={expense.id}>
                        <td>{formatDate(expense.date)}</td>
                        <td>{expense.category}</td>
                        <td>{expense.description}</td>
                        <td>£{expense.amount}</td>
                        <td>
                          <div className="finances-actions-dropdown">
                            <button className="finances-actions-btn">Actions ▼</button>
                            <div className="finances-actions-menu">
                              <button
                                className="finances-actions-menu-item"
                                onClick={() => setEditExpenseModal(expense)}
                              >
                                Edit
                              </button>
                              <button
                                className="finances-actions-menu-item"
                                onClick={() => deleteExpense(expense.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>

            <section className="finances-section">
              <h2>Summary</h2>
              <div className="finances-tax-summary">
                <div><strong>Total Income:</strong> £{totalIncome.toLocaleString()}</div>
                <div><strong>Total Expenses:</strong> £{totalExpenses.toLocaleString()}</div>
                <div><strong>Taxable Profit:</strong> £{taxableProfit.toLocaleString()}</div>
              </div>
            </section>
          </>
        )}

        {/* Add Expense Modal */}
        {showExpenseModal && (
          <div className="finances-modal-backdrop" onClick={() => setShowExpenseModal(false)}>
            <div className="finances-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowExpenseModal(false)}>&times;</button>
              <h3>Add Expense</h3>
              <form onSubmit={handleAddExpense}>
                <label>
                  Property
                  <select
                    required
                    value={expenseForm.property_id}
                    onChange={e => setExpenseForm(f => ({ ...f, property_id: e.target.value }))}
                  >
                    <option value="">Select property</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Amount (£)
                  <input
                    type="number"
                    required
                    min="0"
                    value={expenseForm.amount}
                    onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value }))}
                  />
                </label>
                <label>
                  Category
                  <input
                    required
                    value={expenseForm.category}
                    onChange={e => setExpenseForm(f => ({ ...f, category: e.target.value }))}
                  />
                </label>
                <label>
                  Description
                  <input
                    required
                    value={expenseForm.description}
                    onChange={e => setExpenseForm(f => ({ ...f, description: e.target.value }))}
                  />
                </label>
                <label>
                  Date
                  <input
                    type="date"
                    required
                    value={expenseForm.incurred_on}
                    onChange={e => setExpenseForm(f => ({ ...f, incurred_on: e.target.value }))}
                  />
                </label>
                <button type="submit" className="finances-add-btn" style={{ marginTop: 12 }}>
                  Add Expense
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Add Rent Payment Modal */}
        {showRentModal && (
          <div className="finances-modal-backdrop" onClick={() => setShowRentModal(false)}>
            <div className="finances-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowRentModal(false)}>&times;</button>
              <h3>Mark Rent as Received</h3>
              <form onSubmit={handleAddRent}>
                <label>
                  Tenant
                  <select
                    required
                    value={rentForm.tenant_id}
                    onChange={e => {
                      const tenantId = e.target.value;
                      const selectedTenant = tenants.find(t => String(t.id) === tenantId);
                      setRentForm(f => ({
                        ...f,
                        tenant_id: tenantId,
                        property_id: selectedTenant ? selectedTenant.property_id : "",
                        amount: selectedTenant && selectedTenant.rent_amount ? selectedTenant.rent_amount : ""
                      }));
                    }}
                  >
                    <option value="">Select tenant</option>
                    {tenants.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.first_name} {t.last_name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Amount (£)
                  <input
                    type="number"
                    required
                    min="0"
                    value={rentForm.amount}
                    onChange={e => setRentForm(f => ({ ...f, amount: e.target.value }))}
                    readOnly={!!rentForm.tenant_id}
                  />
                </label>
                <label>
                  Date
                  <input
                    type="date"
                    required
                    value={rentForm.paid_on}
                    onChange={e => setRentForm(f => ({ ...f, paid_on: e.target.value }))}
                  />
                </label>
                <label>
                  Method
                  <input
                    value={rentForm.method}
                    onChange={e => setRentForm(f => ({ ...f, method: e.target.value }))}
                    placeholder="e.g. Bank Transfer"
                  />
                </label>
                <label>
                  Reference
                  <input
                    value={rentForm.reference}
                    onChange={e => setRentForm(f => ({ ...f, reference: e.target.value }))}
                    placeholder="Reference (optional)"
                  />
                </label>
                <button type="submit" className="finances-add-btn" style={{ marginTop: 12 }}>
                  Add Rent Payment
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Expense Modal */}
        {editExpenseModal && (
          <div className="finances-modal-backdrop" onClick={() => setEditExpenseModal(null)}>
            <div className="finances-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setEditExpenseModal(null)}>&times;</button>
              <h3>Edit Expense</h3>
              <form onSubmit={handleEditExpense}>
                <label>
                  Property
                  <select
                    required
                    value={editExpenseModal.property_id}
                    onChange={e => setEditExpenseModal(f => ({ ...f, property_id: e.target.value }))}
                  >
                    <option value="">Select property</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Amount (£)
                  <input
                    type="number"
                    required
                    min="0"
                    value={editExpenseModal.amount}
                    onChange={e => setEditExpenseModal(f => ({ ...f, amount: e.target.value }))}
                  />
                </label>
                <label>
                  Category
                  <input
                    required
                    value={editExpenseModal.category}
                    onChange={e => setEditExpenseModal(f => ({ ...f, category: e.target.value }))}
                  />
                </label>
                <label>
                  Description
                  <input
                    required
                    value={editExpenseModal.description}
                    onChange={e => setEditExpenseModal(f => ({ ...f, description: e.target.value }))}
                  />
                </label>
                <label>
                  Date
                  <input
                    type="date"
                    required
                    value={editExpenseModal.incurred_on}
                    onChange={e => setEditExpenseModal(f => ({ ...f, incurred_on: e.target.value }))}
                  />
                </label>
                <button type="submit" className="finances-add-btn" style={{ marginTop: 12 }}>
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Rent Payment Modal */}
        {editRentModal && (
          <div className="finances-modal-backdrop" onClick={() => setEditRentModal(null)}>
            <div className="finances-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setEditRentModal(null)}>&times;</button>
              <h3>Edit Rent Payment</h3>
              <form onSubmit={handleEditRent}>
                <label>
                  Tenant
                  <select
                    required
                    value={editRentModal.tenant_id}
                    onChange={e => {
                      const tenantId = e.target.value;
                      const selectedTenant = tenants.find(t => String(t.id) === tenantId);
                      setEditRentModal(f => ({
                        ...f,
                        tenant_id: tenantId,
                        property_id: selectedTenant ? selectedTenant.property_id : "",
                        amount: selectedTenant && selectedTenant.rent_amount ? selectedTenant.rent_amount : ""
                      }));
                    }}
                  >
                    <option value="">Select tenant</option>
                    {tenants.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.first_name} {t.last_name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Amount (£)
                  <input
                    type="number"
                    required
                    min="0"
                    value={editRentModal.amount}
                    onChange={e => setEditRentModal(f => ({ ...f, amount: e.target.value }))}
                  />
                </label>
                <label>
                  Date
                  <input
                    type="date"
                    required
                    value={editRentModal.paid_on}
                    onChange={e => setEditRentModal(f => ({ ...f, paid_on: e.target.value }))}
                  />
                </label>
                <label>
                  Method
                  <input
                    value={editRentModal.method}
                    onChange={e => setEditRentModal(f => ({ ...f, method: e.target.value }))}
                    placeholder="e.g. Bank Transfer"
                  />
                </label>
                <label>
                  Reference
                  <input
                    value={editRentModal.reference}
                    onChange={e => setEditRentModal(f => ({ ...f, reference: e.target.value }))}
                    placeholder="Reference (optional)"
                  />
                </label>
                <button type="submit" className="finances-add-btn" style={{ marginTop: 12 }}>
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}