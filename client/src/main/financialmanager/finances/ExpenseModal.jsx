import React, { useEffect, useState } from "react";

export default function ExpenseModal({
  show,
  onClose,
  onSubmit,
  properties,
  initialExpense
}) {
  const [form, setForm] = useState({
    property_id: "",
    amount: "",
    category: "",
    description: "",
    incurred_on: "",
  });

  useEffect(() => {
    if (show) {
      setForm(
        initialExpense
          ? {
              property_id: initialExpense.property_id || "",
              amount: initialExpense.amount ? String(initialExpense.amount) : "",
              category: initialExpense.category || "",
              description: initialExpense.description || "",
              incurred_on:
                initialExpense.incurred_on
                  ? initialExpense.incurred_on.slice(0, 10)
                  : initialExpense.date
                  ? initialExpense.date.slice(0, 10)
                  : "",
            }
          : {
              property_id: "",
              amount: "",
              category: "",
              description: "",
              incurred_on: "",
            }
      );
    }
  }, [show, initialExpense]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <form
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
        onSubmit={e => {
          e.preventDefault();
          onSubmit(form);
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-blue-700">
          {initialExpense ? "Edit Expense" : "Add Expense"}
        </h2>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Property</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={form.property_id}
            onChange={e => setForm(f => ({ ...f, property_id: e.target.value }))}
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
            value={form.amount}
            onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Category</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            autoComplete="off"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Description</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            autoComplete="off"
            maxLength={200}
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Date</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={form.incurred_on}
            onChange={e => setForm(f => ({ ...f, incurred_on: e.target.value }))}
            required
          />
        </div>
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 transition"
          >
            {initialExpense ? "Save Changes" : "Add Expense"}
          </button>
          <button
            type="button"
            className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}