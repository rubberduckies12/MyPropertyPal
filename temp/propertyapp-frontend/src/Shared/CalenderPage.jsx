import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import { parseISO, format } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = momentLocalizer(moment);

const CalendarPage = ({
  user,
  events,
  error,
  fetchEvents,
  saveEvent,
  deleteEvent,
  fetchTenants,
}) => {
  // -------------------- State --------------------
  const [showModal, setShowModal] = useState(false);
  const [modalEvent, setModalEvent] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  // -------------------- Effects --------------------
  // Fetch calendar events on mount
  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, []);

  // Fetch tenants for landlord on user change
  useEffect(() => {
    if (user.role === "landlord") {
      fetchTenants().then(setTenants);
    }
    // eslint-disable-next-line
  }, [user]);

  // -------------------- Handlers --------------------
  // When a slot is selected, open modal for new event
  const handleSelectSlot = (slotInfo) => {
    setModalEvent({
      date: format(slotInfo.start, "yyyy-MM-dd"),
      time: format(slotInfo.start, "HH:mm"),
      description: "",
      tenantId: "",
      landlordId: "",
      isNew: true,
    });
    setShowModal(true);
  };

  // When an event is selected, open modal for editing
  const handleSelectEvent = (event) => {
    setModalEvent({
      ...event,
      date: format(event.start, "yyyy-MM-dd"),
      time: format(event.start, "HH:mm"),
      isNew: false,
    });
    setShowModal(true);
  };

  // Handle changes in modal form fields
  const handleModalChange = (e) => {
    setModalEvent({ ...modalEvent, [e.target.name]: e.target.value });
  };

  // Handle modal form submit (add or update event)
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const success = await saveEvent(modalEvent, user);
    if (success) {
      setShowModal(false);
      setModalEvent(null);
    }
  };

  // Handle event deletion
  const handleDelete = async () => {
    if (!modalEvent?.id) return;
    const success = await deleteEvent(modalEvent.id);
    if (success) {
      setShowModal(false);
      setModalEvent(null);
    }
  };

  // Calendar navigation and view change
  const handleNavigate = (newDate) => setDate(newDate);
  const handleView = (newView) => setView(newView);

  // -------------------- Render --------------------
  return (
    <div className="flex-1 p-2 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-10 mb-8">
          <h2 className="text-4xl font-bold text-blue-800 mb-6">
            Shared Calendar
          </h2>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            style={{
              height: "75vh",
              minHeight: 400,
              background: "#f9fafb",
              borderRadius: "1rem",
              padding: "1rem",
            }}
            popup
            view={view}
            date={date}
            onView={handleView}
            onNavigate={handleNavigate}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            className="rounded-xl shadow"
          />
        </div>
        {/* Modal for adding/editing events */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <form
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
              onSubmit={handleModalSubmit}
            >
              <h3 className="text-2xl font-bold text-blue-700 mb-6">
                {modalEvent.isNew ? "Add Event" : "Edit Event"}
              </h3>
              {/* Description */}
              <label className="block mb-2 font-semibold text-gray-700">
                Description
              </label>
              <input
                className="border border-gray-300 rounded-lg w-full mb-4 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                name="description"
                value={modalEvent.description}
                onChange={handleModalChange}
                required
              />
              {/* Date */}
              <label className="block mb-2 font-semibold text-gray-700">Date</label>
              <input
                className="border border-gray-300 rounded-lg w-full mb-4 px-3 py-2"
                name="date"
                type="date"
                value={modalEvent.date}
                onChange={handleModalChange}
                required
              />
              {/* Time */}
              <label className="block mb-2 font-semibold text-gray-700">Time</label>
              <input
                className="border border-gray-300 rounded-lg w-full mb-4 px-3 py-2"
                name="time"
                type="time"
                value={modalEvent.time}
                onChange={handleModalChange}
                required
              />
              {/* Tenant selection for landlord */}
              {user.role === "landlord" && tenants && (
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Tenant
                  </label>
                  <select
                    className="border border-gray-300 rounded-lg w-full mb-4 px-3 py-2"
                    name="tenantId"
                    value={modalEvent.tenantId}
                    onChange={handleModalChange}
                    required
                  >
                    <option value="">Select tenant</option>
                    {tenants.map((t) => (
                      <option key={t.userId} value={t.userId}>
                        {t.name ||
                          `${t.firstName || ""} ${t.lastName || ""}`.trim() ||
                          t.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* Landlord ID for tenant */}
              {user.role === "tenant" && (
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Landlord ID
                  </label>
                  <input
                    className="border border-gray-300 rounded-lg w-full mb-4 px-3 py-2"
                    name="landlordId"
                    value={modalEvent.landlordId}
                    onChange={handleModalChange}
                    required
                  />
                </div>
              )}
              {/* Modal action buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition"
                >
                  Save
                </button>
                {!modalEvent.isNew && (
                  <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold transition"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg font-semibold transition"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
