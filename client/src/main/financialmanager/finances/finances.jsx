import React, { useState } from "react";
import Sidebar from "../../sidebar/sidebar.jsx";
import "./finances.css";

const mockRentPayments = [
  { id: 1, date: "2025-06-01", property: "Flat 1A, Main St", tenant: "John Doe", amount: 1200, status: "Received" },
  { id: 2, date: "2025-06-01", property: "Flat 2B, Main St", tenant: "Jane Smith", amount: 950, status: "Pending" },
  { id: 3, date: "2025-05-01", property: "Flat 1A, Main St", tenant: "John Doe", amount: 1200, status: "Received" },
  { id: 4, date: "2025-04-01", property: "Flat 2B, Main St", tenant: "Jane Smith", amount: 950, status: "Received" },
];

const mockExpenses = [
  { id: 1, date: "2025-05-28", category: "Repairs", description: "Boiler fix", amount: 180 },
  { id: 2, date: "2025-05-20", category: "Insurance", description: "Annual premium", amount: 320 },
  { id: 3, date: "2025-04-15", category: "Maintenance", description: "Garden", amount: 60 },
  { id: 4, date: "2025-03-10", category: "Utilities", description: "Water bill", amount: 90 },
];

const mockPortfolio = [
  { id: 1, property: "Flat 1A, Main St", value: 250000 },
  { id: 2, property: "Flat 2B, Main St", value: 210000 },
];

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

export default function Finances() {
  const [period, setPeriod] = useState("month");
  const [rentPayments] = useState(mockRentPayments);
  const [expenses] = useState(mockExpenses);
  const [portfolio] = useState(mockPortfolio);

  const filteredRent = filterByPeriod(rentPayments, period);
  const filteredExpenses = filterByPeriod(expenses, period);

  const totalIncome = filteredRent.reduce((sum, p) => sum + (p.status === "Received" ? p.amount : 0), 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const taxableProfit = totalIncome - totalExpenses;
  const portfolioValue = portfolio.reduce((sum, p) => sum + p.value, 0);

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
        <div className="finances-summary-cards">
          <div className="finances-summary-card">
            <div className="finances-summary-label">Total Portfolio Value</div>
            <div className="finances-summary-value">£{portfolioValue.toLocaleString()}</div>
          </div>
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
      </main>
    </div>
  );
}