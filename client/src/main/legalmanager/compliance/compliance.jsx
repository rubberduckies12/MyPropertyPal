import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../sidebar/sidebar.jsx";

const BACKEND_URL = "https://api.mypropertypal.com";

export default function Compliance() {
  const [documents, setDocuments] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [properties, setProperties] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    property_id: "",
    name: "",
    description: "",
    due_date: "",
    reminder_days: [90],
  });
  const [eventSuccess, setEventSuccess] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const fileInputRef = useRef();

  // Fetch compliance events, documents, and properties from backend using cookies
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/compliance/events`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setDeadlines(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load deadlines"));

    fetch(`${BACKEND_URL}/api/compliance/documents`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setDocuments(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load documents"));

    fetch(`${BACKEND_URL}/api/properties`, {
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch properties");
        return res.json();
      })
      .then(data => setProperties(data.properties || []))
      .catch(() => setError("Failed to load properties"));
  }, []);

  // Upload & scan compliance document
  const handleUpload = async (e) => {
    setError("");
    setUploading(true);
    const file = e.target.files[0];
    if (!file) {
      setUploading(false);
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BACKEND_URL}/api/compliance/documents/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        // Re-fetch documents after upload
        fetch(`${BACKEND_URL}/api/compliance/documents`, {
          credentials: "include"
        })
          .then(res => res.json())
          .then(data => setDocuments(Array.isArray(data) ? data : []));
      } else {
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Upload failed");
    }
    setUploading(false);
  };

  // Add compliance event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    setEventSuccess("");
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/compliance/events`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newEvent),
      });
      if (res.ok) {
        setEventSuccess("Compliance event added!");
        setNewEvent({ property_id: "", name: "", description: "", due_date: "", reminder_days: [90] });
        setShowEventForm(false);
        // Re-fetch events
        fetch(`${BACKEND_URL}/api/compliance/events`, {
          credentials: "include"
        })
          .then(res => res.json())
          .then(data => setDeadlines(Array.isArray(data) ? data : []));
      } else {
        setError("Failed to add event");
      }
    } catch {
      setError("Failed to add event");
    }
  };

  // Edit event handler (used for both Edit and Renew)
  const handleEditEvent = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/compliance/events/${editEvent.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editEvent),
      });
      if (res.ok) {
        setEventSuccess("Event updated!");
        setEditEvent(null);
        setSelectedEvent(null);
        // Refresh events
        fetch(`${BACKEND_URL}/api/compliance/events`, {
          credentials: "include"
        })
          .then(res => res.json())
          .then(data => setDeadlines(Array.isArray(data) ? data : []));
      } else {
        setError("Failed to update event");
      }
    } catch {
      setError("Failed to update event");
    }
  };

  // Delete event handler
  const handleDeleteEvent = async (id) => {
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/compliance/events/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        setEventSuccess("Event deleted!");
        setSelectedEvent(null);
        // Refresh events
        fetch(`${BACKEND_URL}/api/compliance/events`, {
          credentials: "include"
        })
          .then(res => res.json())
          .then(data => setDeadlines(Array.isArray(data) ? data : []));
      } else {
        setError("Failed to delete event");
      }
    } catch {
      setError("Failed to delete event");
    }
  };

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function getDueStatus(dueDateStr, reminderDaysArr) {
    if (!dueDateStr) return "status-upcoming";
    const dueDate = new Date(dueDateStr);
    const now = new Date();
    const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    const reminders = (reminderDaysArr && reminderDaysArr.length > 0) ? reminderDaysArr : [90];
    const soonest = Math.min(...reminders);

    if (diffDays < 0) return "status-overdue";
    if (diffDays <= soonest) return "status-expiringsoon";
    return "status-valid";
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Sidebar />
      <main className="flex-1 ml-64 px-4 py-8 pl-8">
        <div className="flex items-center justify-between mb-8 border-b border-blue-100 pb-4">
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Compliance Manager</h1>
          <button
            className="bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 transition"
            type="button"
            onClick={() => setShowEventForm(true)}
          >
            Add Compliance Event
          </button>
        </div>

        {/* Modal for Add Compliance Event */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md border border-blue-100 shadow-lg">
              <h2 className="text-2xl font-extrabold text-blue-700 text-center mb-6">Add Compliance Event</h2>
              <form className="flex flex-col gap-4" onSubmit={handleAddEvent}>
                <label className="font-semibold text-blue-700">
                  Property
                  <select
                    className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    value={newEvent.property_id}
                    onChange={e => setNewEvent(ev => ({ ...ev, property_id: e.target.value }))}
                    required
                  >
                    <option value="">Select Property</option>
                    {properties.map((prop) => (
                      <option key={prop.id} value={prop.id}>
                        {prop.name} {prop.address ? `- ${prop.address}` : ""}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="font-semibold text-blue-700">
                  Name
                  <input
                    className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    type="text"
                    placeholder="Name (e.g. Gas Safety)"
                    value={newEvent.name}
                    onChange={e => setNewEvent(ev => ({ ...ev, name: e.target.value }))}
                    required
                  />
                </label>
                <label className="font-semibold text-blue-700">
                  Description
                  <input
                    className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    type="text"
                    placeholder="Description"
                    value={newEvent.description}
                    onChange={e => setNewEvent(ev => ({ ...ev, description: e.target.value }))}
                  />
                </label>
                <label className="font-semibold text-blue-700">
                  Due Date
                  <input
                    className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    type="date"
                    value={newEvent.due_date}
                    onChange={e => setNewEvent(ev => ({ ...ev, due_date: e.target.value }))}
                    required
                  />
                </label>
                <label className="font-semibold text-blue-700">
                  Reminder days
                  <input
                    className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    type="text"
                    placeholder="Reminder days (e.g. 90,30,7)"
                    value={newEvent.reminder_days ? newEvent.reminder_days.join(",") : ""}
                    onChange={e =>
                      setNewEvent(ev => ({
                        ...ev,
                        reminder_days: e.target.value
                          .split(",")
                          .map(s => parseInt(s.trim()))
                          .filter(n => !isNaN(n))
                      }))
                    }
                  />
                </label>
                <div className="flex gap-4 mt-4">
                  <button
                    className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-700 transition flex-1"
                    type="submit"
                  >
                    Add Event
                  </button>
                  <button
                    className="bg-gray-100 text-gray-700 font-bold rounded-lg px-4 py-2 border border-blue-100 hover:bg-gray-200 transition flex-1"
                    type="button"
                    onClick={() => setShowEventForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md border border-blue-100 shadow-lg">
              <h2 className="text-2xl font-extrabold text-blue-700 text-center mb-6">
                {editEvent && editEvent.onlyRenew ? "Renew Compliance" : "Compliance Event Details"}
              </h2>
              {!editEvent ? (
                <>
                  <div className="bg-blue-50 rounded-lg p-4 mb-4 text-base text-gray-700 flex flex-col gap-2">
                    <div><strong className="text-blue-700">Name:</strong> {selectedEvent.name}</div>
                    <div><strong className="text-blue-700">Property:</strong> {selectedEvent.property_name}</div>
                    <div><strong className="text-blue-700">Description:</strong> {selectedEvent.description}</div>
                    <div><strong className="text-blue-700">Due Date:</strong> {formatDate(selectedEvent.due_date)}</div>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <button
                      className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-700 transition flex-1"
                      onClick={() => setEditEvent(selectedEvent)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-700 transition flex-1"
                      onClick={() => setEditEvent({ ...selectedEvent, onlyRenew: true })}
                    >
                      Renew
                    </button>
                    <button
                      className="bg-red-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-red-700 transition flex-1"
                      onClick={() => handleDeleteEvent(selectedEvent.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-gray-100 text-gray-700 font-bold rounded-lg px-4 py-2 border border-blue-100 hover:bg-gray-200 transition flex-1"
                      onClick={() => { setSelectedEvent(null); setEditEvent(null); }}
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <form className="flex flex-col gap-4" onSubmit={handleEditEvent}>
                  <label className="font-semibold text-blue-700">
                    Property
                    <select
                      className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                      value={editEvent.property_id}
                      onChange={e => setEditEvent(ev => ({ ...ev, property_id: e.target.value }))}
                      required
                      disabled={editEvent.onlyRenew}
                    >
                      <option value="">Select Property</option>
                      {properties.map((prop) => (
                        <option key={prop.id} value={prop.id}>
                          {prop.name} {prop.address ? `- ${prop.address}` : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="font-semibold text-blue-700">
                    Name
                    <input
                      className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                      type="text"
                      placeholder="Name"
                      value={editEvent.name}
                      onChange={e => setEditEvent(ev => ({ ...ev, name: e.target.value }))}
                      required
                      disabled={editEvent.onlyRenew}
                    />
                  </label>
                  <label className="font-semibold text-blue-700">
                    Description
                    <input
                      className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                      type="text"
                      placeholder="Description"
                      value={editEvent.description}
                      onChange={e => setEditEvent(ev => ({ ...ev, description: e.target.value }))}
                      disabled={editEvent.onlyRenew}
                    />
                  </label>
                  <label className="font-semibold text-blue-700">
                    {editEvent.onlyRenew ? "New Due Date" : "Due Date"}
                    <input
                      className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                      type="date"
                      value={editEvent.due_date ? editEvent.due_date.slice(0,10) : ""}
                      onChange={e => setEditEvent(ev => ({ ...ev, due_date: e.target.value }))}
                      required
                    />
                  </label>
                  <label className="font-semibold text-blue-700">
                    Reminder days
                    <input
                      className="mt-1 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                      type="text"
                      placeholder="Reminder days (e.g. 90,30,7)"
                      value={editEvent.reminder_days ? editEvent.reminder_days.join(",") : ""}
                      onChange={e =>
                        setEditEvent(ev => ({
                          ...ev,
                          reminder_days: e.target.value
                            .split(",")
                            .map(s => parseInt(s.trim()))
                            .filter(n => !isNaN(n))
                        }))
                      }
                      disabled={editEvent.onlyRenew}
                    />
                  </label>
                  <div className="flex gap-4 mt-4">
                    <button
                      className="bg-blue-600 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-700 transition flex-1"
                      type="submit"
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-100 text-gray-700 font-bold rounded-lg px-4 py-2 border border-blue-100 hover:bg-gray-200 transition flex-1"
                      type="button"
                      onClick={() => setEditEvent(null)}
                    >
                      Cancel
                    </button>
                  </div>
                  {error && <div className="text-red-500 text-center mt-2">{error}</div>}
                </form>
              )}
            </div>
          </div>
        )}

        {/* Compliance Tracker */}
        <section className="bg-white rounded-2xl p-6 border border-blue-100 shadow mb-10">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Compliance Tracker</h2>
          <div className="w-full overflow-x-auto">
            <table className="min-w-[900px] w-full text-base divide-y divide-blue-100">
              <thead>
                <tr>
                  <th className="py-4 px-3 text-left bg-blue-50 text-blue-700 font-bold border-b border-blue-100">Name</th>
                  <th className="py-4 px-3 text-left bg-blue-50 text-blue-700 font-bold border-b border-blue-100">Property</th>
                  <th className="py-4 px-3 text-left bg-blue-50 text-blue-700 font-bold border-b border-blue-100">Description</th>
                  <th className="py-4 px-3 text-left bg-blue-50 text-blue-700 font-bold border-b border-blue-100">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(deadlines) && deadlines.length === 0) ? (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-400 py-8">
                      No compliance deadlines added yet
                    </td>
                  </tr>
                ) : (
                  (Array.isArray(deadlines) ? deadlines : []).map(item => (
                    <tr key={item.id} className="hover:bg-blue-50 transition cursor-pointer"
                      onClick={() => { setSelectedEvent(item); setEventSuccess(""); setError(""); }}>
                      <td className="py-4 px-3">{item.name}</td>
                      <td className="py-4 px-3">
                        {item.property_name}
                        {item.property_address ? `, ${item.property_address}` : ""}
                        {item.property_postcode ? `, ${item.property_postcode}` : ""}
                      </td>
                      <td className="py-4 px-3">{item.description}</td>
                      <td className="py-4 px-3">
                        <span className={
                          `px-4 py-1 rounded-xl font-semibold text-sm
                          ${getDueStatus(item.due_date, item.reminder_days) === "status-overdue"
                            ? "bg-red-100 text-red-700"
                            : getDueStatus(item.due_date, item.reminder_days) === "status-expiringsoon"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-700"}`
                        }>
                          {formatDate(item.due_date)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Resource Hub */}
        <section className="bg-white rounded-2xl p-6 border border-blue-100 shadow mb-10">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Regulation Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <a
              className="bg-blue-50 rounded-lg p-4 flex flex-col gap-2 hover:bg-blue-100 transition"
              href="https://www.gov.uk/private-renting/your-landlords-safety-responsibilities"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-bold text-blue-700">Landlord Safety Responsibilities</span>
              <span className="text-gray-700">gov.uk guidance on landlord safety duties</span>
            </a>
            <a
              className="bg-blue-50 rounded-lg p-4 flex flex-col gap-2 hover:bg-blue-100 transition"
              href="https://www.gov.uk/energy-performance-certificate-commercial-property"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-bold text-blue-700">EPC Rules</span>
              <span className="text-gray-700">Energy Performance Certificate requirements</span>
            </a>
            <a
              className="bg-blue-50 rounded-lg p-4 flex flex-col gap-2 hover:bg-blue-100 transition"
              href="https://www.gov.uk/guidance/making-tax-digital-for-vat"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-bold text-blue-700">Making Tax Digital</span>
              <span className="text-gray-700">Digital tax submission for landlords</span>
            </a>
            <a
              className="bg-blue-50 rounded-lg p-4 flex flex-col gap-2 hover:bg-blue-100 transition"
              href="https://www.gov.uk/government/collections/housing-forms"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-bold text-blue-700">Templates & Forms</span>
              <span className="text-gray-700">Official landlord forms and templates</span>
            </a>
            <a
              className="bg-blue-50 rounded-lg p-4 flex flex-col gap-2 hover:bg-blue-100 transition"
              href="https://www.gov.uk/guidance/assured-tenancy-forms"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-bold text-blue-700">Deposit Protection</span>
              <span className="text-gray-700">Deposit protection scheme rules</span>
            </a>
            <a
              className="bg-blue-50 rounded-lg p-4 flex flex-col gap-2 hover:bg-blue-100 transition"
              href="https://www.gov.uk/private-renting-tenancy-agreements"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-bold text-blue-700">Tenancy Agreements</span>
              <span className="text-gray-700">Tenancy agreement legal requirements</span>
            </a>
            <a
              className="bg-blue-50 rounded-lg p-4 flex flex-col gap-2 hover:bg-blue-100 transition"
              href="https://www.gov.uk/buy-sell-your-home/energy-performance-certificates"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-bold text-blue-700">EPC for Private Renting</span>
              <span className="text-gray-700">EPC rules for private landlords</span>
            </a>
            <a
              className="bg-blue-50 rounded-lg p-4 flex flex-col gap-2 hover:bg-blue-100 transition"
              href="https://www.gov.uk/government/publications/electrical-safety-standards-in-the-private-rented-sector-guidance-for-landlords-tenants-and-local-authorities/guide-for-landlords-electrical-safety-standards-in-the-private-rented-sector"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-bold text-blue-700">Electrical Safety Standards</span>
              <span className="text-gray-700">Guidance for landlords on electrical safety</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}