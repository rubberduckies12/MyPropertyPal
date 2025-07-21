import React, { useEffect, useState } from "react";

export default function RentModal({
  show,
  onClose,
  onSubmit,
  properties,
  tenants,
  rentForm,
  setRentForm,
  editRentModal
}) {
  const [localForm, setLocalForm] = useState({
    property_id: "",
    tenant_id: "",
    amount: "",
    paid_on: "",
    method: "",
    reference: "",
  });

  useEffect(() => {
    if (show) {
      setLocalForm(rentForm);
    }
  }, [show, rentForm]);

  // Only show tenants for the selected property
  const filteredTenants = tenants.filter(
    t => !localForm.property_id || t.property_id === localForm.property_id
  );

  if (!show) return null;

  const selectedProperty = properties.find(p => p.id === localForm.property_id);
  const selectedTenant = tenants.find(t => t.id === localForm.tenant_id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <form
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
        onSubmit={e => {
          e.preventDefault();
          onSubmit(localForm); // Pass the latest form directly
        }}
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
            value={localForm.property_id}
            onChange={e => setLocalForm(f => ({
              ...f,
              property_id: e.target.value,
              tenant_id: "" // reset tenant when property changes
            }))}
            required
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
            value={localForm.tenant_id}
            onChange={e => setLocalForm(f => ({ ...f, tenant_id: e.target.value }))}
            required
          >
            <option value="">Select tenant</option>
            {tenants
              .filter(t => !localForm.property_id || t.property_id === Number(localForm.property_id))
              .map(t => (
                <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
              ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Amount</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={localForm.amount || ""}
            onChange={e => setLocalForm(f => ({ ...f, amount: e.target.value }))}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Date Paid</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={localForm.paid_on || ""}
            onChange={e => setLocalForm(f => ({ ...f, paid_on: e.target.value }))}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Method</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={localForm.method || ""}
            onChange={e => setLocalForm(f => ({ ...f, method: e.target.value }))}
            autoComplete="off"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Reference</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={localForm.reference || ""}
            onChange={e => setLocalForm(f => ({ ...f, reference: e.target.value }))}
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
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}