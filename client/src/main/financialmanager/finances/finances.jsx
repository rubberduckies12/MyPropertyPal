import React, { useState, useEffect } from "react";
import Sidebar from "../../sidebar/sidebar.jsx";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

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
  const [chartType, setChartType] = useState("bar"); // "bar" or "line"

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

  function getMonthlySummary(rentPayments, expenses) {
    const year = new Date().getFullYear();
    // Array of month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // Build all months for current year
    const monthsArr = Array.from({ length: 12 }, (_, i) => ({
      key: `${year}-${i}`,
      month: `${monthNames[i]} ${year}`,
      income: 0,
      expenses: 0,
    }));

    rentPayments.forEach(rp => {
      const d = new Date(rp.paid_on || rp.date);
      if (d.getFullYear() === year) {
        const idx = d.getMonth();
        monthsArr[idx].income += Number(rp.amount || 0);
      }
    });

    expenses.forEach(e => {
      const d = new Date(e.incurred_on || e.date);
      if (d.getFullYear() === year) {
        const idx = d.getMonth();
        monthsArr[idx].expenses += Number(e.amount || 0);
      }
    });

    return monthsArr;
  }

  const monthlySummaryData = getMonthlySummary(rentPayments, expenses);

  // Track which dropdown is open for actions
  const [openRentDropdown, setOpenRentDropdown] = useState(null);
  const [openExpenseDropdown, setOpenExpenseDropdown] = useState(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClick() {
      setOpenRentDropdown(null);
      setOpenExpenseDropdown(null);
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const summaryData = [
    { name: "Rent Received", value: totalIncome },
    { name: "Expenses", value: totalExpenses },
  ];

  function HouseBarShape(props) {
    const { x, y, width, height, fill } = props;
    const roofHeight = Math.min(14, height * 0.22);
    const roofOverhang = Math.max(3, width * 0.12);

    // Roof base is at y + roofHeight, roof top is at y
    return (
      <g>
        {/* Roof */}
        <polygon
          points={`
            ${x - roofOverhang},${y + roofHeight}
            ${x + width / 2},${y}
            ${x + width + roofOverhang},${y + roofHeight}
          `}
          fill={fill}
        />
        {/* Body */}
        <rect
          x={x}
          y={y + roofHeight}
          width={width}
          height={height - roofHeight}
          fill={fill}
        />
        {/* Door (optional, subtle) */}
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

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="w-64 flex-shrink-0 h-screen">
        <Sidebar />
      </div>
      {/* Make main content scrollable, not each table */}
      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-10 overflow-auto">
        <div className="flex items-center justify-between mb-6 border-b border-blue-100 pb-3">
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Financial Manager</h1>
          <div className="flex gap-4">
            <button
              className="bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 transition"
              onClick={() => setShowExpenseModal(true)}
            >
              + Add Expense
            </button>
            <button
              className="bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 transition"
              onClick={() => setShowRentModal(true)}
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
                          <td className="py-4 px-3">
                            <span className="px-4 py-1 rounded-xl font-semibold text-sm bg-blue-100 text-blue-700">
                              {payment.status}
                            </span>
                          </td>
                          <td className="py-4 px-3">
                            <button
                              className="bg-blue-600 text-white font-semibold rounded-lg px-3 py-1 hover:bg-blue-700 transition"
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
                          <td className="py-4 px-3">
                            {payment.payment_status === "Late" ? (
                              <span className="text-red-600 font-semibold">Late</span>
                            ) : (
                              <span className="text-green-600 font-semibold">On Time</span>
                            )}
                          </td>
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
                                    onClick={() => setEditRentModal(payment)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                                    onClick={() => deleteRentPayment(payment.id)}
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
                          <td className="py-4 px-3">{formatDate(expense.date)}</td>
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
                                    onClick={() => setEditExpenseModal(expense)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                                    onClick={() => deleteExpense(expense.id)}
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
                      style={{ cursor: "pointer" }}
                      tabIndex={0}
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
