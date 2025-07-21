import React, { useState, useEffect } from "react";
import Sidebar from "../../sidebar/sidebar.jsx";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

const PERIODS = [
  { label: "Monthly", value: "month" },
  { label: "Quarterly", value: "quarter" },
  { label: "Yearly", value: "year" },
];

const API_BASE = "https://mypropertypal-3.onrender.com/api/finances";

function getPeriodDates(period) {
  const now = new Date();
  if (period === "month") return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date(now.getFullYear(), now.getMonth() + 1, 0) };
  if (period === "quarter") {
    const q = Math.floor(now.getMonth() / 3);
    return { start: new Date(now.getFullYear(), q * 3, 1), end: new Date(now.getFullYear(), q * 3 + 3, 0) };
  }
  return { start: new Date(now.getFullYear(), 0, 1), end: new Date(now.getFullYear(), 11, 31) };
}

function filterByPeriod(items, period) {
  const { start, end } = getPeriodDates(period);
  return items.filter(item => {
    const d = new Date(item.date || item.paid_on || item.due_date || item.incurred_on);
    return d >= start && d <= end;
  });
}

export default function Finances() {
  // State
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
  const [rentForm, setRentForm] = useState({
    property_id: "",
    tenant_id: "",
    amount: "",
    paid_on: "",
    method: "",
    reference: "",
  });
  const [editRentModal, setEditRentModal] = useState(null);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [expectedRent, setExpectedRent] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [openRentDropdown, setOpenRentDropdown] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [rentToDelete, setRentToDelete] = useState(null);

  const [openExpenseDropdown, setOpenExpenseDropdown] = useState(null);
  const [editExpenseModal, setEditExpenseModal] = useState(null);
  const [expenseForm, setExpenseForm] = useState({
    property_id: "",
    amount: "",
    category: "",
    description: "",
    incurred_on: "",
  });
  const [showDeleteExpenseConfirm, setShowDeleteExpenseConfirm] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // Fetch data
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const [finRes, propRes, tenantRes, expRentRes] = await Promise.all([
          fetch(API_BASE, { headers: { Authorization: token ? `Bearer ${token}` : "" } }),
          fetch("https://mypropertypal-3.onrender.com/api/properties", { headers: { Authorization: token ? `Bearer ${token}` : "" } }),
          fetch("https://mypropertypal-3.onrender.com/api/tenants", { headers: { Authorization: token ? `Bearer ${token}` : "" } }),
          fetch("https://mypropertypal-3.onrender.com/api/finances/expected-rent", { headers: { Authorization: token ? `Bearer ${token}` : "" } }),
        ]);
        if (!finRes.ok) throw new Error("Failed to fetch finances");
        const finData = await finRes.json();
        setRentPayments(finData.rentPayments || []);
        setExpenses(finData.expenses || []);
        setTotalIncome(finData.totalIncome || 0);
        setTotalExpenses(finData.totalExpenses || 0);
        setTaxableProfit(finData.taxableProfit || 0);

        if (propRes.ok) {
          const data = await propRes.json();
          setProperties(data.properties || []);
        }
        if (tenantRes.ok) {
          const data = await tenantRes.json();
          setTenants(data.tenants || []);
        }
        if (expRentRes.ok) {
          const data = await expRentRes.json();
          setExpectedRent(data.expected || []);
        }
      } catch (err) {
        setError(err.message || "Error loading finances");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Filtering
  const filteredRent = filterByPeriod(rentPayments, period);
  const filteredExpenses = filterByPeriod(expenses, period);

  // Only show tenants for the selected property (fix: use property_id only)
  const filteredTenants = tenants.filter(
    t => !rentForm.property_id || t.property_id === rentForm.property_id
  );

  // Helpers
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  }

  function getMonthlySummary(rentPayments, expenses) {
    const year = new Date().getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthsArr = Array.from({ length: 12 }, (_, i) => ({
      key: `${year}-${i}`,
      month: `${monthNames[i]} ${year}`,
      income: 0,
      expenses: 0,
    }));

    rentPayments.forEach(rp => {
      const d = new Date(rp.paid_on || rp.date);
      if (d.getFullYear() === year) monthsArr[d.getMonth()].income += Number(rp.amount || 0);
    });

    expenses.forEach(e => {
      const d = new Date(e.incurred_on || e.date);
      if (d.getFullYear() === year) monthsArr[d.getMonth()].expenses += Number(e.amount || 0);
    });

    return monthsArr;
  }

  const monthlySummaryData = getMonthlySummary(rentPayments, expenses);

  // Dropdown close on outside click
  useEffect(() => {
    function handleClick() {
      setOpenRentDropdown(null);
      setOpenExpenseDropdown(null);
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // --- Rent Modal Logic ---
  function openAddRentModal(payment) {
    setEditRentModal(null);
    setRentForm({
      property_id: payment.property_id,
      tenant_id: "",
      amount: payment.amount,
      paid_on: payment.due_date,
      method: "",
      reference: "",
    });
    setShowRentModal(true);
  }

  function openEditRentModal(payment) {
    setEditRentModal(payment);
    setRentForm({
      property_id: payment.property_id,
      tenant_id: payment.tenant_id,
      amount: payment.amount,
      paid_on: payment.paid_on,
      method: payment.method || "",
      reference: payment.reference || "",
    });
    setShowRentModal(true);
  }

  async function handleAddOrEditRent(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      let res;
      if (editRentModal) {
        // Rent payment update
        res = await fetch(`https://mypropertypal-3.onrender.com/api/finances/rent/${editRentModal.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
          body: JSON.stringify(rentForm),
        });
        if (!res.ok) throw new Error("Failed to update rent payment");
      } else {
        // Rent add
        res = await fetch("https://mypropertypal-3.onrender.com/api/finances/rent", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
          body: JSON.stringify(rentForm),
        });
        if (!res.ok) throw new Error("Failed to add rent payment");
      }
      setShowRentModal(false);
      setEditRentModal(null);
      setRentForm({ property_id: "", tenant_id: "", amount: "", paid_on: "", method: "", reference: "" });
      const refreshed = await fetch(API_BASE, { headers: { Authorization: token ? `Bearer ${token}` : "" } });
      const data = await refreshed.json();
      setRentPayments(data.rentPayments || []);
      setTotalIncome(data.totalIncome || 0);
      setTaxableProfit(data.taxableProfit || 0);
    } catch (err) {
      alert(err.message || "Failed to save rent payment");
    }
  }

  async function confirmDeleteRentPayment() {
    if (!rentToDelete) return;
    const token = localStorage.getItem("token");
    await fetch(`https://mypropertypal-3.onrender.com/api/finances/rent/${rentToDelete}`, {
      method: "DELETE",
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    setRentPayments(rentPayments => rentPayments.filter(r => r.id !== rentToDelete));
    setShowDeleteConfirm(false);
    setRentToDelete(null);
  }

  // --- Expense Modal Logic ---
  function openEditExpenseModal(expense) {
    setEditExpenseModal(expense);
    setExpenseForm({
      property_id: expense.property_id || "",
      amount: expense.amount || "",
      category: expense.category || "",
      description: expense.description || "",
      incurred_on: expense.incurred_on ? expense.incurred_on.slice(0, 10) : expense.date ? expense.date.slice(0, 10) : "",
    });
    setShowExpenseModal(true);
  }

  async function handleAddOrEditExpense(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      let res;
      if (editExpenseModal) {
        // Expense update
        res = await fetch(`https://mypropertypal-3.onrender.com/api/finances/expense/${editExpenseModal.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
          body: JSON.stringify(expenseForm),
        });
        if (!res.ok) throw new Error("Failed to update expense");
      } else {
        // Expense add
        res = await fetch("https://mypropertypal-3.onrender.com/api/finances/expense", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
          body: JSON.stringify(expenseForm),
        });
        if (!res.ok) throw new Error("Failed to add expense");
      }
      setShowExpenseModal(false);
      setEditExpenseModal(null);
      setExpenseForm({ property_id: "", amount: "", category: "", description: "", incurred_on: "" });
      const refreshed = await fetch(API_BASE, { headers: { Authorization: token ? `Bearer ${token}` : "" } });
      const data = await refreshed.json();
      setExpenses(data.expenses || []);
      setTotalExpenses(data.totalExpenses || 0);
      setTaxableProfit(data.taxableProfit || 0);
    } catch (err) {
      alert(err.message || "Failed to save expense");
    }
  }

  async function confirmDeleteExpense() {
    if (!expenseToDelete) return;
    const token = localStorage.getItem("token");
    await fetch(`https://mypropertypal-3.onrender.com/api/finances/expense/${expenseToDelete}`, {
      method: "DELETE",
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    setExpenses(expenses => expenses.filter(e => e.id !== expenseToDelete));
    setShowDeleteExpenseConfirm(false);
    setExpenseToDelete(null);
  }

  // --- Modal UI ---
  function RentModal() {
    if (!showRentModal) return null;

    // Find property and tenant objects for display
    const selectedProperty = properties.find(p => p.id === rentForm.property_id);
    const selectedTenant = tenants.find(t => t.id === rentForm.tenant_id);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <form
          className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
          onSubmit={handleAddOrEditRent}
          onClick={e => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-4 text-blue-700">
            {editRentModal ? "Edit Rent Payment" : "Mark Rent Received"}
          </h2>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Property</label>
            {editRentModal && selectedProperty && (
              <div className="mb-2 text-blue-700 font-semibold">
                {selectedProperty.name}
              </div>
            )}
            <select
              className="w-full border rounded px-3 py-2"
              value={rentForm.property_id}
              onChange={e => setRentForm(f => ({
                ...f,
                property_id: e.target.value,
                tenant_id: ""
              }))}
              required
              disabled={!!editRentModal}
            >
              <option value="">Select property</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Tenant</label>
            {editRentModal && selectedTenant && (
              <div className="mb-2 text-blue-700 font-semibold">
                {selectedTenant.name || `${selectedTenant.first_name || ""} ${selectedTenant.last_name || ""}`.trim()}
              </div>
            )}
            <select
              className="w-full border rounded px-3 py-2"
              value={String(rentForm.tenant_id)}
              onChange={e => setRentForm(f => ({ ...f, tenant_id: e.target.value }))}
              required
              disabled={!!editRentModal}
            >
              <option value="">Select tenant</option>
              {filteredTenants.map(t => (
                <option key={t.id} value={String(t.id)}>
                  {t.name || `${t.first_name || ""} ${t.last_name || ""}`.trim()}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Amount</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={rentForm.amount}
              onChange={e => setRentForm(f => ({ ...f, amount: e.target.value }))}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Date Paid</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={rentForm.paid_on ? rentForm.paid_on.slice(0, 10) : ""}
              onChange={e => setRentForm(f => ({ ...f, paid_on: e.target.value }))}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Method</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={rentForm.method || ""}
              onChange={e => setRentForm(f => ({ ...f, method: e.target.value }))}
              autoComplete="off"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Reference</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={rentForm.reference || ""}
              onChange={e => setRentForm(f => ({ ...f, reference: e.target.value }))}
              autoComplete="off"
            />
          </div>
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 transition"
            >
              {editRentModal ? "Save Changes" : "Mark Received"}
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition"
              onClick={() => {
                setShowRentModal(false);
                setEditRentModal(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  function ExpenseModal() {
    if (!showExpenseModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <form
          className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
          onSubmit={handleAddOrEditExpense}
          onClick={e => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-4 text-blue-700">
            {editExpenseModal ? "Edit Expense" : "Add Expense"}
          </h2>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Property</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={expenseForm.property_id}
              onChange={e => setExpenseForm(f => ({ ...f, property_id: e.target.value }))}
            >
              <option value="">Select property</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Amount</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={expenseForm.amount}
              onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value }))}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Category</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={expenseForm.category || ""}
              onChange={e => setExpenseForm(f => ({ ...f, category: e.target.value }))}
              autoComplete="off"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Description</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={expenseForm.description || ""}
              onChange={e => setExpenseForm(f => ({ ...f, description: e.target.value }))}
              autoComplete="off"
              maxLength={200}
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Date</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={expenseForm.incurred_on ?? ""}
              onChange={e => setExpenseForm(f => ({ ...f, incurred_on: e.target.value }))}
              required
            />
          </div>
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 transition"
            >
              {editExpenseModal ? "Save Changes" : "Add Expense"}
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition"
              onClick={() => {
                setShowExpenseModal(false);
                setEditExpenseModal(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  function DeleteConfirmModal() {
    if (!showDeleteConfirm) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" onClick={() => setShowDeleteConfirm(false)}>
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm" onClick={e => e.stopPropagation()}>
          <h2 className="text-xl font-bold mb-4 text-red-700">Are you sure?</h2>
          <p className="mb-6">This will permanently delete this rent payment.</p>
          <div className="flex gap-4">
            <button
              className="bg-red-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-red-700 transition"
              onClick={confirmDeleteRentPayment}
            >
              Delete
            </button>
            <button
              className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  function DeleteExpenseConfirmModal() {
    if (!showDeleteExpenseConfirm) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" onClick={() => setShowDeleteExpenseConfirm(false)}>
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm" onClick={e => e.stopPropagation()}>
          <h2 className="text-xl font-bold mb-4 text-red-700">Are you sure?</h2>
          <p className="mb-6">This will permanently delete this expense.</p>
          <div className="flex gap-4">
            <button
              className="bg-red-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-red-700 transition"
              onClick={confirmDeleteExpense}
            >
              Delete
            </button>
            <button
              className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition"
              onClick={() => setShowDeleteExpenseConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  function HouseBarShape(props) {
    const { x, y, width, height, fill } = props;
    const roofHeight = Math.min(14, height * 0.22);
    const roofOverhang = Math.max(3, width * 0.12);
    return (
      <g>
        <polygon
          points={`
            ${x - roofOverhang},${y + roofHeight}
            ${x + width / 2},${y}
            ${x + width + roofOverhang},${y + roofHeight}
          `}
          fill={fill}
        />
        <rect
          x={x}
          y={y + roofHeight}
          width={width}
          height={height - roofHeight}
          fill={fill}
        />
        {height > 30 && (
          <rect
            x={x + width / 2 - width * 0.10}
            y={y + roofHeight + (height - roofHeight) - Math.max(10, (height - roofHeight) * 0.22)}
            width={width * 0.20}
            height={Math.max(10, (height - roofHeight) * 0.22)}
            fill="#fff"
            opacity={0.18}
          />
        )}
      </g>
    );
  }

  function getStatusBubble(status) {
    let color = "bg-blue-100 text-blue-700";
    let label = status;
    if (status === "Late" || status === "Overdue") {
      color = "bg-red-100 text-red-700";
      label = "Overdue";
    } else if (status === "Not Paid") {
      color = "bg-yellow-100 text-yellow-800";
      label = "Not Paid";
    } else if (status === "On Time" || status === "Paid") {
      color = "bg-blue-100 text-blue-700";
      label = "On Time";
    }
    return (
      <span className={`px-4 py-1 rounded-xl font-semibold text-sm ${color}`}>
        {label}
      </span>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <RentModal />
      <ExpenseModal />
      <DeleteConfirmModal />
      <DeleteExpenseConfirmModal />
      <div className="w-64 flex-shrink-0 h-screen">
        <Sidebar />
      </div>
      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-10 overflow-auto">
        <div className="flex items-center justify-between mb-6 border-b border-blue-100 pb-3">
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Financial Manager</h1>
          <div className="flex gap-4">
            <button
              className="bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 transition"
              onClick={() => {
                setEditExpenseModal(null);
                setExpenseForm({ property_id: "", amount: "", category: "", description: "", incurred_on: "" });
                setShowExpenseModal(true);
              }}
            >
              + Add Expense
            </button>
            <button
              className="bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 transition"
              onClick={() => {
                setEditRentModal(null);
                setRentForm({ property_id: "", tenant_id: "", amount: "", paid_on: "", method: "", reference: "" });
                setShowRentModal(true);
              }}
            >
              + Mark Rent Received
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          {PERIODS.map(opt => (
            <button
              key={opt.value}
              className={`font-semibold rounded-lg px-4 py-2 border border-blue-100 transition ${
                period === opt.value
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-700 hover:bg-blue-50"
              }`}
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
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-blue-100 flex flex-col items-center">
                <div className="font-semibold text-blue-700 mb-2">Total Rent Received</div>
                <div className="text-2xl font-bold text-black">£{totalIncome.toLocaleString()}</div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-blue-100 flex flex-col items-center">
                <div className="font-semibold text-blue-700 mb-2">Total Expenses</div>
                <div className="text-2xl font-bold text-black">£{totalExpenses.toLocaleString()}</div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-blue-100 flex flex-col items-center">
                <div className="font-semibold text-blue-700 mb-2">Taxable Profit</div>
                <div className="text-2xl font-bold text-black">£{taxableProfit.toLocaleString()}</div>
              </div>
            </div>

            {/* Expected/Overdue Rent Table */}
            <section className="mb-10">
              <div className="bg-white rounded-2xl p-6 border border-blue-100">
                <h2 className="text-xl font-bold text-blue-700 mb-4">Expected & Overdue Rent Payments</h2>
                <table className="min-w-[900px] w-full text-base divide-y divide-blue-100">
                  <thead>
                    <tr>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Property</th>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Tenant</th>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Amount</th>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Date Due</th>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Status</th>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expectedRent.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-gray-400 py-8">
                          No payments added yet
                        </td>
                      </tr>
                    ) : (
                      expectedRent.map(payment => (
                        <tr key={payment.property_id + "-" + payment.tenant_id + "-" + payment.due_date}>
                          <td className="py-4 px-3">{payment.property}</td>
                          <td className="py-4 px-3">{payment.tenant}</td>
                          <td className="py-4 px-3">£{payment.amount}</td>
                          <td className="py-4 px-3">{payment.due_date ? formatDate(payment.due_date) : ""}</td>
                          <td className="py-4 px-3">{getStatusBubble(payment.status)}</td>
                          <td className="py-4 px-3">
                            <button
                              className="bg-blue-600 text-white font-semibold rounded-lg px-3 py-1 hover:bg-blue-700 transition"
                              onClick={() => openAddRentModal(payment)}
                            >
                              Mark as Received
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Paid Rent Table */}
            <section className="mb-10">
              <div className="bg-white rounded-2xl p-6 border border-blue-100">
                <h2 className="text-xl font-bold text-blue-700 mb-4">Rent Paid</h2>
                <table className="min-w-[900px] w-full text-base divide-y divide-blue-100">
                  <thead>
                    <tr>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Property</th>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Tenant</th>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Amount</th>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Date Due</th>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Date Paid</th>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Method</th>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Reference</th>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Status</th>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentPayments.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center text-gray-400 py-8">
                          No payments added yet
                        </td>
                      </tr>
                    ) : (
                      rentPayments.map(payment => (
                        <tr key={payment.id}>
                          <td className="py-4 px-3">{payment.property}</td>
                          <td className="py-4 px-3">{payment.tenant}</td>
                          <td className="py-4 px-3">£{payment.amount}</td>
                          <td className="py-4 px-3">{payment.due_date ? formatDate(payment.due_date) : ""}</td>
                          <td className="py-4 px-3">{payment.paid_on ? formatDate(payment.paid_on) : ""}</td>
                          <td className="py-4 px-3">{payment.method || ""}</td>
                          <td className="py-4 px-3">{payment.reference || ""}</td>
                          <td className="py-4 px-3">{getStatusBubble(payment.payment_status)}</td>
                          <td className="py-4 px-3">
                            <div className="relative">
                              <button
                                className="bg-white text-blue-700 font-semibold rounded-lg px-3 py-1 border border-blue-200 hover:bg-blue-50 transition"
                                onClick={e => {
                                  e.stopPropagation();
                                  setOpenRentDropdown(payment.id === openRentDropdown ? null : payment.id);
                                }}
                              >
                                Actions ▼
                              </button>
                              {openRentDropdown === payment.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10">
                                  <button
                                    className="w-full text-left px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition"
                                    onClick={() => openEditRentModal(payment)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                                    onClick={() => {
                                      setRentToDelete(payment.id);
                                      setShowDeleteConfirm(true);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Outgoing Expenses Table */}
            <section className="mb-10">
              <div className="bg-white rounded-2xl p-6 border border-blue-100">
                <h2 className="text-xl font-bold text-blue-700 mb-4">Outgoing Expenses</h2>
                <table className="min-w-[900px] w-full text-base divide-y divide-blue-100">
                  <thead>
                    <tr>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Date</th>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Category</th>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Description</th>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Amount</th>
                      <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-gray-400 py-8">
                          No payments added yet
                        </td>
                      </tr>
                    ) : (
                      filteredExpenses.map(expense => (
                        <tr key={expense.id}>
                          <td className="py-4 px-3">{formatDate(expense.date || expense.incurred_on)}</td>
                          <td className="py-4 px-3">{expense.category}</td>
                          <td className="py-4 px-3">{expense.description}</td>
                          <td className="py-4 px-3">£{expense.amount}</td>
                          <td className="py-4 px-3">
                            <div className="relative">
                              <button
                                className="bg-white text-blue-700 font-semibold rounded-lg px-3 py-1 border border-blue-200 hover:bg-blue-50 transition"
                                onClick={e => {
                                  e.stopPropagation();
                                  setOpenExpenseDropdown(expense.id === openExpenseDropdown ? null : expense.id);
                                }}
                              >
                                Actions ▼
                              </button>
                              {openExpenseDropdown === expense.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10">
                                  <button
                                    className="w-full text-left px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition"
                                    onClick={() => openEditExpenseModal(expense)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                                    onClick={() => {
                                      setExpenseToDelete(expense.id);
                                      setShowDeleteExpenseConfirm(true);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Interactive Summary Section */}
            <section className="mb-10">
              <div className="bg-white rounded-2xl p-8 border border-blue-100 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-extrabold text-blue-700 tracking-tight">Monthly Income & Expenses</h2>
                  <div className="flex items-center">
                    <span className="mr-2 text-blue-700 font-semibold text-sm">Bar</span>
                    <span
                      className="relative inline-block w-12 h-6 bg-blue-200 rounded-full transition"
                      onClick={() => setChartType(chartType === "bar" ? "line" : "bar")}
                      role="button"
                      aria-pressed={chartType === "line"}
                      onKeyDown={e => {
                        if (e.key === "Enter" || e.key === " ") setChartType(chartType === "bar" ? "line" : "bar");
                      }}
                    >
                      <span
                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                          chartType === "line" ? "translate-x-6" : ""
                        }`}
                      ></span>
                    </span>
                    <span className="ml-2 text-blue-700 font-semibold text-sm">Line</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-blue-700 mb-1">Total Income</div>
                    <div className="text-3xl font-bold text-black">£{totalIncome.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-blue-700 mb-1">Total Expenses</div>
                    <div className="text-3xl font-bold text-black">£{totalExpenses.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-blue-700 mb-1">Taxable Profit</div>
                    <div className="text-3xl font-bold text-black">£{taxableProfit.toLocaleString()}</div>
                  </div>
                </div>
                <hr className="my-6 border-blue-100" />
                <div className="w-full h-72 bg-white rounded-xl shadow-md p-4 flex items-center justify-center">
                  <ResponsiveContainer>
                    {chartType === "bar" ? (
                      <BarChart data={monthlySummaryData} barCategoryGap="30%">
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" stroke="#2563eb" tick={{ fontWeight: 600, fontSize: 14 }} />
                        <YAxis stroke="#2563eb" tick={{ fontWeight: 600, fontSize: 14 }} />
                        <Tooltip
                          formatter={value => `£${value.toLocaleString()}`}
                          contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #2563eb" }}
                          labelStyle={{ color: "#2563eb", fontWeight: "bold" }}
                        />
                        <Legend
                          wrapperStyle={{ paddingTop: 10 }}
                          iconType="circle"
                          formatter={(value, entry) => (
                            <span style={{ color: entry.color, fontWeight: 700 }}>{value}</span>
                          )}
                        />
                        <Bar
                          dataKey="income"
                          name="Rental Income"
                          fill="#22c55e"
                          shape={<HouseBarShape />}
                        />
                        <Bar
                          dataKey="expenses"
                          name="Expenses"
                          fill="#ef4444"
                          shape={<HouseBarShape />}
                        />
                      </BarChart>
                    ) : (
                      <LineChart data={monthlySummaryData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" stroke="#2563eb" tick={{ fontWeight: 600, fontSize: 14 }} />
                        <YAxis stroke="#2563eb" tick={{ fontWeight: 600, fontSize: 14 }} />
                        <Tooltip
                          formatter={value => `£${value.toLocaleString()}`}
                          contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #2563eb" }}
                          labelStyle={{ color: "#2563eb", fontWeight: "bold" }}
                        />
                        <Legend
                          wrapperStyle={{ paddingTop: 10 }}
                          iconType="circle"
                          formatter={(value, entry) => (
                            <span style={{ color: entry.color, fontWeight: 700 }}>{value}</span>
                          )}
                        />
                        <Line
                          type="monotone"
                          dataKey="income"
                          name="Rental Income"
                          stroke="#22c55e"
                          strokeWidth={3}
                          dot={{ r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="expenses"
                          name="Expenses"
                          stroke="#ef4444"
                          strokeWidth={3}
                          dot={{ r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
