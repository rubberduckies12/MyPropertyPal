import React, { useRef, useState, useEffect } from "react";
import Sidebar from "../../sidebar/sidebar.jsx";
import ExpenseModal from "./ExpenseModal.jsx";
import RentModal from "./RentModal.jsx";
import DeleteConfirmModal from "./DeleteConfirmModal.jsx";
import DeleteExpenseConfirmModal from "./DeleteExpenseConfirmModal.jsx";
import { BarChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line, ResponsiveContainer } from "recharts";

const API_BASE = "https://api.mypropertypal.com"; // <-- Add this line

const PERIODS = [
  { label: "Monthly", value: "month" },
  { label: "Quarterly", value: "quarter" },
  { label: "Yearly", value: "year" },
];

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
  const [period, setPeriod] = useState("year");
  const [rentPayments, setRentPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [taxableProfit, setTaxableProfit] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editExpenseModal, setEditExpenseModal] = useState(null);
  const [rentForm, setRentForm] = useState({
    property_id: "",
    tenant_id: "",
    amount: "",
    paid_on: "",
    method: "",
    reference: "",
  });
  const [editRentModal, setEditRentModal] = useState(null);
  const [showRentModal, setShowRentModal] = useState(false);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [expectedRent, setExpectedRent] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [openRentDropdown, setOpenRentDropdown] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [rentToDelete, setRentToDelete] = useState(null);

  const [openExpenseDropdown, setOpenExpenseDropdown] = useState(null);
  const [expenseForm, setExpenseForm] = useState({
    property_id: "",
    amount: "",
    category: "",
    description: "",
    incurred_on: "",
  });
  const [showDeleteExpenseConfirm, setShowDeleteExpenseConfirm] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const originalDueDateRef = useRef("");

  // Fetch data from backend
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError("");
      try {
        const [finRes, propRes, tenantRes, expRentRes] = await Promise.all([
          fetch("https://api.mypropertypal.com/api/finances", { credentials: "include" }),
          fetch("https://api.mypropertypal.com/api/properties", { credentials: "include" }),
          fetch("https://api.mypropertypal.com/api/tenants", { credentials: "include" }),
          fetch("https://api.mypropertypal.com/api/finances/expected-rent", { credentials: "include" }),
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

  // Only show tenants for the selected property
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
      property_id: payment.property_id || "",
      tenant_id: payment.tenant_id || "",
      amount: payment.amount ? String(payment.amount) : "",
      paid_on: payment.due_date ? payment.due_date.slice(0, 10) : "",
      method: "",
      reference: "",
    });
    setShowRentModal(true);
  }

  function openEditRentModal(payment) {
    setEditRentModal(payment);
    originalDueDateRef.current = payment.due_date || ""; // Save original due date
    setRentForm({
      property_id: payment.property_id || properties.find(p => p.name === payment.property)?.id || "",
      tenant_id: payment.tenant_id || tenants.find(t => t.name === payment.tenant)?.id || "",
      amount: payment.amount ? String(payment.amount) : "",
      paid_on: payment.paid_on ? payment.paid_on.slice(0, 10) : "",
      method: payment.method || "",
      reference: payment.reference || "",
    });
    setShowRentModal(true);
  }

  async function handleAddOrEditRent(form) {
    try {
      const payload = {
        property_id: Number(form.property_id),
        tenant_id: Number(form.tenant_id),
        amount: Number(form.amount),
        paid_on: form.paid_on,
        method: form.method || "",
        reference: form.reference || "",
        due_date: originalDueDateRef.current
      };
      let res;
      if (editRentModal) {
        res = await fetch(`${API_BASE}/api/finances/rent/${editRentModal.id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errMsg = await res.text();
          console.error("Rent update error:", errMsg);
          throw new Error("Failed to update rent payment");
        }
        const updated = await res.json();
        setRentPayments(prev => prev.map(r => r.id === editRentModal.id ? updated : r));
      } else {
        res = await fetch(`${API_BASE}/api/finances/rent`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errMsg = await res.text();
          console.error("Rent add error:", errMsg);
          throw new Error("Failed to add rent payment");
        }
        const added = await res.json();
        setRentPayments(prev => [...prev, added]);
      }
      // Refetch expectedRent after saving rent
      const expRentRes = await fetch(`${API_BASE}/api/finances/expected-rent`, {
        credentials: "include"
      });
      if (expRentRes.ok) {
        const data = await expRentRes.json();
        setExpectedRent(data.expected || []);
      }
      setShowRentModal(false);
      setEditRentModal(null);
      setRentForm({ property_id: "", tenant_id: "", amount: "", paid_on: "", method: "", reference: "" });
      window.location.reload();
    } catch (err) {
      alert(err.message || "Failed to save rent payment");
    }
  }

  async function confirmDeleteRentPayment() {
    if (!rentToDelete) return;
    await fetch(`${API_BASE}/api/finances/rent/${rentToDelete}`, {
      method: "DELETE",
      credentials: "include"
    });
    setRentPayments(rentPayments => rentPayments.filter(r => r.id !== rentToDelete));
    setShowDeleteConfirm(false);
    setRentToDelete(null);
  }

  // --- Expense Modal Logic ---
  function openEditExpenseModal(expense) {
    setEditExpenseModal(expense);
    setShowExpenseModal(true);
  }

  async function handleExpenseModalSubmit(form) {
    const payload = {
      property_id: Number(form.property_id),
      amount: Number(form.amount),
      category: form.category,
      description: form.description || "",
      incurred_on: form.incurred_on
    };
    try {
      let res;
      if (editExpenseModal) {
        res = await fetch(`${API_BASE}/api/finances/expense/${editExpenseModal.id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errMsg = await res.text();
          console.error("Expense update error:", errMsg);
          throw new Error("Failed to update expense");
        }
        const updated = await res.json();
        setExpenses(prev => prev.map(e => e.id === editExpenseModal.id ? updated : e));
      } else {
        res = await fetch(`${API_BASE}/api/finances/expense`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errMsg = await res.text();
          console.error("Expense add error:", errMsg);
          throw new Error("Failed to add expense");
        }
        const added = await res.json();
        setExpenses(prev => [...prev, added]);
      }
      setShowExpenseModal(false);
      setEditExpenseModal(null);
      window.location.reload();
    } catch (err) {
      alert(err.message || "Failed to save expense");
    }
  }

  async function confirmDeleteExpense() {
    if (!expenseToDelete) return;
    await fetch(`${API_BASE}/api/finances/expense/${expenseToDelete}`, {
      method: "DELETE",
      credentials: "include"
    });
    setExpenses(expenses => expenses.filter(e => e.id !== expenseToDelete));
    setShowDeleteExpenseConfirm(false);
    setExpenseToDelete(null);
  }

  // --- Graph helpers ---
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

  // Add state for toggling table rows
  const [showAllExpectedRent, setShowAllExpectedRent] = useState(false);
  const [showAllRentPayments, setShowAllRentPayments] = useState(false);
  const [showAllExpenses, setShowAllExpenses] = useState(false);

  // Limit rows to 5 by default
  const visibleExpectedRent = showAllExpectedRent ? expectedRent : expectedRent.slice(0, 5);
  const visibleRentPayments = showAllRentPayments ? rentPayments : rentPayments.slice(0, 5);
  const visibleExpenses = showAllExpenses ? filteredExpenses : filteredExpenses.slice(0, 5);

  // State for managing the selected transaction for the popup
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Function to handle card click (open popup)
  const handleCardClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  // Function to close the popup
  const handleClosePopup = () => {
    setSelectedTransaction(null);
  };

  // --- Main UI ---
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ExpenseModal
        show={showExpenseModal}
        onClose={() => { setShowExpenseModal(false); setEditExpenseModal(null); }}
        onSubmit={handleExpenseModalSubmit}
        properties={properties}
        initialExpense={editExpenseModal}
      />
      <RentModal
        show={showRentModal}
        onClose={() => { setShowRentModal(false); setEditRentModal(null); setRentForm({ property_id: "", tenant_id: "", amount: "", paid_on: "", method: "", reference: "" }); }}
        onSubmit={handleAddOrEditRent}
        properties={properties}
        tenants={tenants}
        rentForm={rentForm}
        setRentForm={setRentForm}
        editRentModal={editRentModal}
      />
      <DeleteConfirmModal
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onDelete={confirmDeleteRentPayment}
      />
      <DeleteExpenseConfirmModal
        show={showDeleteExpenseConfirm}
        onClose={() => setShowDeleteExpenseConfirm(false)}
        onDelete={confirmDeleteExpense}
      />
      <div className="hidden lg:block w-64 flex-shrink-0 h-screen">
        <Sidebar />
      </div>
      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-10 pt-4 overflow-auto">
        <div className="flex items-center justify-between mb-6 border-b border-blue-100 pb-3 pt-12">
       

          {/* Page Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-blue-700 tracking-tight">
            Financial Manager
          </h1>

          {/* Add Expense and Mark Rent Received Buttons */}
          <div className="flex flex-col gap-2 mt-4">
            <button
              className="bg-blue-600 text-white font-medium rounded-lg px-3 py-2 text-sm hover:bg-blue-700 transition"
              onClick={() => {
                setEditExpenseModal(null);
                setExpenseForm({
                  property_id: "",
                  amount: "",
                  category: "",
                  description: "",
                  incurred_on: "",
                });
                setShowExpenseModal(true);
              }}
            >
              + Add Expense
            </button>
            <button
              className="bg-blue-600 text-white font-medium rounded-lg px-3 py-2 text-sm hover:bg-blue-700 transition"
              onClick={() => {
                setEditRentModal(null);
                setRentForm({
                  property_id: "",
                  tenant_id: "",
                  amount: "",
                  paid_on: "",
                  method: "",
                  reference: "",
                });
                setShowRentModal(true);
              }}
            >
              + Mark Rent Received
            </button>
          </div>
        </div>

        {/* Mobile View: Incoming Rent */}
        <div className="grid grid-cols-1 gap-4 lg:hidden">
          <h2 className="text-lg font-bold text-blue-700">Incoming Rent</h2>
          {visibleExpectedRent.map((payment) => (
            <div
              key={payment.id}
              className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2 cursor-pointer"
              onClick={() => handleCardClick(payment)} // Opens the popup when the card is clicked
            >
              <h3 className="text-lg font-bold text-blue-700">{payment.property}</h3>
              <p className="text-sm text-gray-500">Tenant: {payment.tenant}</p>
              <p className="text-sm text-gray-500">Amount: £{payment.amount}</p>
              <p className="text-sm text-gray-500">
                Due Date: {formatDate(payment.due_date)}
              </p>
              <div className="mt-4">
                <button
                  className="bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 transition w-full"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the card's onClick from being triggered
                    openAddRentModal(payment); // Opens the "Mark Rent Received" form
                  }}
                >
                  Mark as Received
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View: Rent Received */}
        <div className="grid grid-cols-1 gap-4 lg:hidden mt-8">
          <h2 className="text-lg font-bold text-blue-700">Rent Received</h2>
          {visibleRentPayments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2 cursor-pointer"
              onClick={() => handleCardClick(payment)}
            >
              <h3 className="text-lg font-bold text-blue-700">{payment.property}</h3>
              <p className="text-sm text-gray-500">Tenant: {payment.tenant}</p>
              <p className="text-sm text-gray-500">Amount: £{payment.amount}</p>
              <p className="text-sm text-gray-500">
                Paid On: {formatDate(payment.paid_on)}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile View: Expenses */}
        <div className="grid grid-cols-1 gap-4 lg:hidden mt-8">
          <h2 className="text-lg font-bold text-blue-700">Expenses</h2>
          {visibleExpenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2 cursor-pointer"
              onClick={() => handleCardClick(expense)}
            >
              <h3 className="text-lg font-bold text-blue-700">
                {expense.category || "Expense"}
              </h3>
              <p className="text-sm text-gray-500">Amount: £{expense.amount}</p>
              <p className="text-sm text-gray-500">
                Incurred On: {formatDate(expense.incurred_on)}
              </p>
              <p className="text-sm text-gray-500">
                Description: {expense.description || "N/A"}
              </p>
            </div>
          ))}
        </div>

        {/* Popup Card for Mobile */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={handleClosePopup}
              >
                &times;
              </button>
              <h3 className="text-xl font-bold text-blue-700 mb-4">
                {selectedTransaction.property || selectedTransaction.category}
              </h3>
              <p className="text-sm text-gray-500">
                Tenant: {selectedTransaction.tenant || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                Amount: £{selectedTransaction.amount}
              </p>
              <p className="text-sm text-gray-500">
                {selectedTransaction.due_date
                  ? `Due Date: ${formatDate(selectedTransaction.due_date)}`
                  : selectedTransaction.paid_on
                  ? `Paid On: ${formatDate(selectedTransaction.paid_on)}`
                  : `Incurred On: ${formatDate(selectedTransaction.incurred_on)}`}
              </p>
              <p className="text-sm text-gray-500">
                Description: {selectedTransaction.description || "N/A"}
              </p>
            </div>
          </div>
        )}

        {/* Desktop View: Tables */}
        <div className="hidden lg:block">
          {/* Expected Rent Table */}
          <section className="mb-10">
            <div className="bg-white rounded-2xl p-6 border border-blue-100">
              <h2 className="text-xl font-bold text-blue-700 mb-4">
                Expected & Overdue Rent Payments
              </h2>
              <table className="min-w-[900px] w-full text-base divide-y divide-blue-100">
                <thead>
                  <tr>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">
                      Property
                    </th>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">
                      Tenant
                    </th>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">
                      Amount
                    </th>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">
                      Date Due
                    </th>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">
                      Status
                    </th>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleExpectedRent.map((payment) => (
                    <tr key={payment.id}>
                      <td className="py-4 px-3">{payment.property}</td>
                      <td className="py-4 px-3">{payment.tenant}</td>
                      <td className="py-4 px-3">£{payment.amount}</td>
                      <td className="py-4 px-3">
                        {formatDate(payment.due_date)}
                      </td>
                      <td className="py-4 px-3">
                        {getStatusBubble(payment.status)}
                      </td>
                      <td className="py-4 px-3">
                        <button
                          className="bg-blue-600 text-white font-semibold rounded-lg px-3 py-1 hover:bg-blue-700 transition"
                          onClick={() => openAddRentModal(payment)}
                        >
                          Mark as Received
                        </button>
                      </td>
                    </tr>
                  ))}
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
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">
                      Property
                    </th>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">
                      Tenant
                    </th>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">
                      Amount
                    </th>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">
                      Date Due
                    </th>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">
                      Date Paid
                    </th>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">
                      Method
                    </th>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">
                      Reference
                    </th>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">
                      Status
                    </th>
                    <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 text-left">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRentPayments.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center text-gray-400 py-8">
                        No payments added yet
                      </td>
                    </tr>
                  ) : (
                    visibleRentPayments.map(payment => (
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
                  {visibleExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-400 py-8">
                        No payments added yet
                      </td>
                    </tr>
                  ) : (
                    visibleExpenses.map(expense => (
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

          {/* Hide Graph on Mobile */}
          <section className="hidden lg:block mb-10">
            <div className="bg-white rounded-2xl p-8 border border-blue-100 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-extrabold text-blue-700 tracking-tight">
                  Monthly Income & Expenses
                </h2>
                <div className="flex items-center">
                  <span className="mr-2 text-blue-700 font-semibold text-sm">
                    Bar
                  </span>
                  <span
                    className="relative inline-block w-12 h-6 bg-blue-200 rounded-full transition"
                    onClick={() =>
                      setChartType(chartType === "bar" ? "line" : "bar")
                    }
                    role="button"
                    aria-pressed={chartType === "line"}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setChartType(chartType === "bar" ? "line" : "bar");
                    }}
                  >
                    <span
                      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        chartType === "line" ? "translate-x-6" : ""
                      }`}
                    ></span>
                  </span>
                  <span className="ml-2 text-blue-700 font-semibold text-sm">
                    Line
                  </span>
                </div>
              </div>
              <div className="w-full h-72 bg-white rounded-xl shadow-md p-4 flex items-center justify-center">
                <ResponsiveContainer>
                  {chartType === "bar" ? (
                    <BarChart data={monthlySummaryData} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="month"
                        stroke="#2563eb"
                        tick={{ fontWeight: 600, fontSize: 14 }}
                      />
                      <YAxis
                        stroke="#2563eb"
                        tick={{ fontWeight: 600, fontSize: 14 }}
                      />
                      <Tooltip
                        formatter={(value) => `£${value.toLocaleString()}`}
                        contentStyle={{
                          backgroundColor: "#f9fafb",
                          borderRadius: "8px",
                          border: "1px solid #2563eb",
                        }}
                        labelStyle={{ color: "#2563eb", fontWeight: "bold" }}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: 10 }}
                        iconType="circle"
                        formatter={(value, entry) => (
                          <span
                            style={{ color: entry.color, fontWeight: 700 }}
                          >
                            {value}
                          </span>
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
                      <XAxis
                        dataKey="month"
                        stroke="#2563eb"
                        tick={{ fontWeight: 600, fontSize: 14 }}
                      />
                      <YAxis
                        stroke="#2563eb"
                        tick={{ fontWeight: 600, fontSize: 14 }}
                      />
                      <Tooltip
                        formatter={(value) => `£${value.toLocaleString()}`}
                        contentStyle={{
                          backgroundColor: "#f9fafb",
                          borderRadius: "8px",
                          border: "1px solid #2563eb",
                        }}
                        labelStyle={{ color: "#2563eb", fontWeight: "bold" }}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: 10 }}
                        iconType="circle"
                        formatter={(value, entry) => (
                          <span
                            style={{ color: entry.color, fontWeight: 700 }}
                          >
                            {value}
                          </span>
                        )}
                      />
                      <Line
                        type="monotone"
                        dataKey="income"
                        name="Rental Income"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        name="Expenses"
                        stroke="#ef4444"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
