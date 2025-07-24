import React, { useState, useEffect } from "react";
import Sidebar from "../../sidebar/sidebar.jsx";

const API_BASE = "https://mypropertypal-3.onrender.com";

export default function Properties() {
  // State
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyNotes, setPropertyNotes] = useState({});
  const [noteInput, setNoteInput] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addForm, setAddForm] = useState({
    name: "",
    address: "",
    city: "",
    county: "",
    postcode: "",
    rent_amount: "",
    status: "Available",
  });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // Fetch properties
  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line
  }, []);

  const fetchProperties = () => {
    setLoading(true);
    fetch(`${API_BASE}/api/properties`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        setProperties(data.properties || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error loading properties");
        setLoading(false);
      });
  };

  // Handlers
  const handleRowClick = (property) => {
    setSelectedProperty(property);
    setNoteInput("");
  };

  const handleCloseNotesModal = () => setSelectedProperty(null);

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    setPropertyNotes((prev) => ({
      ...prev,
      [selectedProperty.name]: [
        ...(prev[selectedProperty.name] || []),
        { text: noteInput, date: new Date().toLocaleString() },
      ],
    }));
    setNoteInput("");
  };

  const handleAddFormChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/properties`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addForm),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add property");
      }
      setShowAddModal(false);
      setAddForm({
        name: "",
        address: "",
        city: "",
        county: "",
        postcode: "",
        rent_amount: "",
        status: "Available",
      });
      // Refresh the page to fetch the updated list of properties
      window.location.reload();
    } catch (err) {
      setAddError(err.message);
      setAddLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/properties/${propertyId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete property");
      }
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      setSelectedProperty(null);
    } catch (err) {
      alert(err.message || "Failed to delete property");
    }
  };

  const handleAddPropertyClick = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/properties/canAddProperty`, { // Use the correct endpoint
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to check property limit");
      }

      if (data.canAdd) {
        setShowAddModal(true); // Open the Add Property modal
      } else {
        alert("You have reached the maximum number of properties allowed by your subscription plan. Upgrade your plan to add more properties.");
      }
    } catch (err) {
      alert(err.message || "Error checking property limit");
    }
  };

  // Render
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="w-64 flex-shrink-0 h-screen">
        <Sidebar />
      </div>
      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-10 overflow-y-auto">
        <div className="flex items-center justify-between mb-6 border-b border-blue-100 pb-3">
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Your Properties</h1>
          <button
            className="bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 transition"
            onClick={handleAddPropertyClick}
          >
            + Add Property
          </button>
        </div>

        {loading && <div>Loading properties...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {!loading && !error && (
          <div className="w-full overflow-x-auto mt-8">
            <table className="min-w-[900px] w-full bg-white rounded-2xl text-base divide-y divide-blue-100">
              <thead>
                <tr>
                  <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">Name</th>
                  <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">Address</th>
                  <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-center">Status</th>
                  <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">Tenant</th>
                  <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">Next Rent Due</th>
                  <th className="bg-blue-50 text-blue-700 font-bold py-4 px-3 border-b border-blue-100 sticky top-0 z-10 text-left">Rental Income</th>
                </tr>
              </thead>
              <tbody>
                {properties.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-8">
                      No properties added yet
                    </td>
                  </tr>
                ) : (
                  properties.map((prop, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-blue-50 transition cursor-pointer"
                      onClick={() => handleRowClick(prop)}
                    >
                      <td className="py-4 px-3">{prop.name || "-"}</td>
                      <td className="py-4 px-3">{prop.address || "-"}</td>
                      <td className="py-4 px-3 text-center">
                        <span className={
                          `px-4 py-1 rounded-xl font-semibold text-sm
                          ${prop.status === "Available" ? "bg-green-100 text-green-700"
                            : prop.status === "Occupied" ? "bg-blue-100 text-blue-700"
                            : prop.status === "Under Maintenance" ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-700"}`
                        }>
                          {prop.status}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        {prop.tenants && prop.tenants.length > 0
                          ? prop.tenants.map(t => `${t.first_name} ${t.last_name}`).join(", ")
                          : "No tenant"}
                      </td>
                      <td className="py-4 px-3">
                        {(() => {
                          if (!prop.nextRentDue) return "N/A";
                          // Try to extract a valid date substring
                          const match = prop.nextRentDue.match(/[A-Z][a-z]{2} [A-Z][a-z]{2} \d{1,2} \d{4} \d{2}:\d{2}:\d{2}/);
                          const dateStr = match ? match[0] : prop.nextRentDue;
                          const dateObj = new Date(dateStr);
                          return !isNaN(dateObj)
                            ? dateObj.toLocaleDateString("en-GB")
                            : "N/A";
                        })()}
                      </td>
                      <td className="py-4 px-3">{prop.rental_income}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Property Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-start justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg my-8 flex flex-col gap-6 border border-blue-100">
              <h2 className="text-2xl font-extrabold text-blue-700 text-center mb-2">Add Property</h2>
              <form onSubmit={handleAddProperty} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="font-semibold text-blue-700">
                    Number (or Name)
                    <input
                      name="name"
                      value={addForm.name}
                      onChange={handleAddFormChange}
                      required
                      className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    />
                  </label>
                  <label className="font-semibold text-blue-700">
                    Address
                    <input
                      name="address"
                      value={addForm.address}
                      onChange={handleAddFormChange}
                      required
                      className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    />
                  </label>
                  <label className="font-semibold text-blue-700">
                    City
                    <input
                      name="city"
                      value={addForm.city}
                      onChange={handleAddFormChange}
                      required
                      className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    />
                  </label>
                  <label className="font-semibold text-blue-700">
                    County
                    <input
                      name="county"
                      value={addForm.county}
                      onChange={handleAddFormChange}
                      className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    />
                  </label>
                  <label className="font-semibold text-blue-700">
                    Postcode
                    <input
                      name="postcode"
                      value={addForm.postcode}
                      onChange={handleAddFormChange}
                      required
                      className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    />
                  </label>
                  <label className="font-semibold text-blue-700">
                    Rent Amount
                    <input
                      name="rent_amount"
                      value={addForm.rent_amount}
                      onChange={handleAddFormChange}
                      required
                      type="number"
                      className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    />
                  </label>
                </div>
                {addError && <div className="text-red-500 text-center">{addError}</div>}
                <div className="flex gap-4 mt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-700 transition flex-1"
                    disabled={addLoading}
                  >
                    {addLoading ? "Adding..." : "Add Property"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-100 text-gray-700 font-bold rounded-lg px-4 py-2 border border-blue-100 hover:bg-gray-200 transition flex-1"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Property Notes Modal */}
        {selectedProperty && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-start justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg my-8 flex flex-col gap-6 border border-blue-100">
              <h2 className="text-2xl font-extrabold text-blue-700 mb-2">
                Details for {selectedProperty.name}
              </h2>
              <div className="bg-blue-50 rounded-lg p-4 mb-2 text-base text-gray-700 flex flex-col gap-2">
                <div>
                  <strong className="text-blue-700">Address:</strong> {selectedProperty.address}
                </div>
                <div>
                  <strong className="text-blue-700">Status:</strong> {selectedProperty.status}
                </div>
                <div>
                  <strong className="text-blue-700">Tenants:</strong>{" "}
                  {selectedProperty.tenants && selectedProperty.tenants.length > 0
                    ? selectedProperty.tenants.map(t => `${t.first_name} ${t.last_name}`).join(", ")
                    : "No tenants"}
                </div>
                <div>
                  <strong className="text-blue-700">Rental Income:</strong>{" "}
                  {selectedProperty.rental_income
                    ? `£${selectedProperty.rental_income.toLocaleString()}`
                    : "N/A"}
                </div>
                <div>
                  <strong className="text-blue-700">Next Rent Due:</strong>{" "}
                  {(() => {
                    if (!selectedProperty.nextRentDue) return "N/A";
                    const match = selectedProperty.nextRentDue.match(/[A-Z][a-z]{2} [A-Z][a-z]{2} \d{1,2} \d{4} \d{2}:\d{2}:\d{2}/);
                    const dateStr = match ? match[0] : selectedProperty.nextRentDue;
                    const dateObj = new Date(dateStr);
                    return !isNaN(dateObj)
                      ? dateObj.toLocaleDateString("en-GB")
                      : "N/A";
                  })()}
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={handleCloseNotesModal}
                  className="bg-gray-100 text-gray-700 font-bold rounded-lg px-4 py-2 border border-blue-100 hover:bg-gray-200 transition flex-1"
                >
                  Close
                </button>
                <button
                  className="bg-red-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-red-700 transition flex-1"
                  onClick={() => handleDeleteProperty(selectedProperty.id)}
                >
                  Delete Property
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}