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

const API_BASE = "http://localhost:5001/api/finances";

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

  // Optionally, fetch properties/tenants for dropdowns
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);

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
      } catch (err) {
        setError(err.message || "Error loading finances");
      } finally {
        setLoading(false);
      }
    }
    fetchFinances();
  }, []);

  // Fetch properties and tenants for dropdowns (optional, for better UX)
  useEffect(() => {
    async function fetchDropdowns() {
      const token = localStorage.getItem("token");
      try {
        const propRes = await fetch("http://localhost:5001/api/properties", {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (propRes.ok) {
          const data = await propRes.json();
          setProperties(data.properties || []);
        }
        const tenantRes = await fetch("http://localhost:5001/api/tenants", {
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

  const filteredRent = filterByPeriod(rentPayments, period);
  const filteredExpenses = filterByPeriod(expenses, period);

  // Add Expense Handler
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
      // Refresh data
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

  // Add Rent Payment Handler
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
      // Refresh data
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

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main finances-main">
        <h1 className="finances-title">Financial Manager</h1>
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
        <div style={{ marginBottom: 24 }}>
          <button className="finances-add-btn" onClick={() => setShowExpenseModal(true)}>
            + Add Expense
          </button>
          <button className="finances-add-btn" onClick={() => setShowRentModal(true)} style={{ marginLeft: 12 }}>
            + Mark Rent Received
          </button>
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

            <section className="finances-section">
              <h2>Incoming Rent Payments</h2>
              <table className="finances-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Property</th>
                    <th>Tenant</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRent.map(payment => (
                    <tr key={payment.id}>
                      <td>{payment.date}</td>
                      <td>{payment.property}</td>
                      <td>{payment.tenant}</td>
                      <td>£{payment.amount}</td>
                      <td className={payment.status === "Received" ? "finances-status-received" : "finances-status-pending"}>
                        {payment.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="finances-section">
              <h2>Outgoing Expenses</h2>
              <table className="finances-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map(expense => (
                    <tr key={expense.id}>
                      <td>{expense.date}</td>
                      <td>{expense.category}</td>
                      <td>{expense.description}</td>
                      <td>£{expense.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="finances-section">
              <h2>HMRC Tax Summary</h2>
              <div className="finances-tax-summary">
                <div><strong>Total Income:</strong> £{totalIncome.toLocaleString()}</div>
                <div><strong>Total Expenses:</strong> £{totalExpenses.toLocaleString()}</div>
                <div><strong>Taxable Profit:</strong> £{taxableProfit.toLocaleString()}</div>
                <button className="finances-export-btn">Export HMRC Tax Report</button>
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
                  Property
                  <select
                    required
                    value={rentForm.property_id}
                    onChange={e => setRentForm(f => ({ ...f, property_id: e.target.value }))}
                  >
                    <option value="">Select property</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Tenant
                  <select
                    required
                    value={rentForm.tenant_id}
                    onChange={e => setRentForm(f => ({ ...f, tenant_id: e.target.value }))}
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
                  Mark as Received
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}