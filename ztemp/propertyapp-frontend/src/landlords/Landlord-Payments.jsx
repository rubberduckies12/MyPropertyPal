import React, { useState } from "react";
import jsPDF from "jspdf";

/**
 * Utility: Get payment status based on due and paid dates
 */
const getStatus = (dueDate, paidDate) => {
  if (!paidDate) return "Unpaid";
  const due = new Date(dueDate);
  const paid = new Date(paidDate);
  return paid <= due ? "On Time" : "Late";
};

/**
 * LandlordPayments
 * Payments are automatically set up when a tenant is assigned to a property.
 * Allows landlord to view payments, mark as paid, download receipts, and delete payments.
 */
const LandlordPayments = ({
  properties = [],
  tenants = [],
  payments = [],
  onMarkPaid,
  onDeletePayment,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  /**
   * Generate a PDF rent receipt for a payment
   */
  const generateReceiptPDF = (payment, property, tenant) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 76, 150);
    doc.text("MyPropertyPal", 20, 20);

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Rent Payment Receipt", 20, 32);

    // Draw a line
    doc.setLineWidth(0.5);
    doc.line(20, 36, 190, 36);

    // Receipt Details
    doc.setFontSize(12);
    let y = 46;
    doc.text(`Receipt ID: ${payment.paymentId}`, 20, y);
    y += 8;
    doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 20, y);
    y += 8;
    doc.text(`Status: Paid`, 20, y);

    // Property & Tenant Details
    y += 14;
    doc.setFontSize(13);
    doc.setTextColor(40, 76, 150);
    doc.text("Property Details", 20, y);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    y += 8;
    doc.text(`Name: ${property ? property.name : payment.propertyId}`, 20, y);
    y += 8;
    doc.text(`Address: ${property ? property.address : "-"}`, 20, y);

    y += 12;
    doc.setFontSize(13);
    doc.setTextColor(40, 76, 150);
    doc.text("Tenant Details", 20, y);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    y += 8;
    doc.text(`Name: ${tenant ? (tenant.name || tenant.email) : payment.tenantId}`, 20, y);

    // Payment Details
    y += 12;
    doc.setFontSize(13);
    doc.setTextColor(40, 76, 150);
    doc.text("Payment Details", 20, y);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    y += 8;
    doc.text(`Amount: £${payment.amount}`, 20, y);
    y += 8;
    doc.text(`Due Date: ${payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : "-"}`, 20, y);
    y += 8;
    doc.text(`Paid Date: ${payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : "-"}`, 20, y);

    // Footer
    y += 20;
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Thank you for using MyPropertyPal!", 20, y);

    doc.save(`receipt-${payment.paymentId}.pdf`);
  };

  /**
   * Handle dropdown open/close for payment actions
   */
  const handleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  // -------------------- Render --------------------
  return (
    <main className="flex-1 p-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Payments & Rent Tracking</h1>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Rent Payments</h2>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 text-left">Property</th>
              <th className="py-3 px-4 text-left">Tenant</th>
              <th className="py-3 px-4 text-left">Amount (£)</th>
              <th className="py-3 px-4 text-left">Due Date</th>
              <th className="py-3 px-4 text-left">Paid Date</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-400">
                  No payments yet.
                </td>
              </tr>
            )}
            {payments.map(payment => {
              const property = properties.find(p => p.propertyId === payment.propertyId);
              const tenant = tenants.find(t => t.userId === payment.tenantId);
              return (
                <tr key={payment.paymentId} className="border-b last:border-none">
                  <td className="py-3 px-4">{property ? property.name : payment.propertyId}</td>
                  <td className="py-3 px-4">{tenant ? (tenant.name || tenant.email) : payment.tenantId || "Unknown"}</td>
                  <td className="py-3 px-4">£{payment.amount}</td>
                  <td className="py-3 px-4">{payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : "-"}</td>
                  <td className="py-3 px-4">{payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : "-"}</td>
                  <td className="py-3 px-4">
                    <span className={
                      getStatus(payment.dueDate, payment.paidDate) === "On Time"
                        ? "text-green-600 font-semibold"
                        : getStatus(payment.dueDate, payment.paidDate) === "Late"
                        ? "text-yellow-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }>
                      {getStatus(payment.dueDate, payment.paidDate)}
                    </span>
                  </td>
                  <td className="py-3 px-4 relative">
                    {/* Actions Dropdown */}
                    <button
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      onClick={() => handleDropdown(payment.paymentId)}
                      type="button"
                    >
                      Actions ▼
                    </button>
                    {openDropdown === payment.paymentId && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                        <ul>
                          {/* Mark as Paid */}
                          {!payment.paidDate && (
                            <li>
                              <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={() => {
                                  onMarkPaid(payment.paymentId);
                                  setOpenDropdown(null);
                                }}
                              >
                                Mark as Paid
                              </button>
                            </li>
                          )}
                          {/* Download Receipt */}
                          {payment.paidDate && (
                            <li>
                              <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={() => {
                                  generateReceiptPDF(payment, property, tenant);
                                  setOpenDropdown(null);
                                }}
                              >
                                Download Receipt
                              </button>
                            </li>
                          )}
                          {/* Delete Payment */}
                          <li>
                            <button
                              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this payment?")) {
                                  onDeletePayment(payment.paymentId);
                                }
                                setOpenDropdown(null);
                              }}
                            >
                              Delete Payment
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default LandlordPayments;