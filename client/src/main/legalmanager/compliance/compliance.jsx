import React, { useState, useRef } from "react";
import Sidebar from "../../sidebar/sidebar.jsx";
import "./compliance.css";

// Mock data for demo
const mockDeadlines = [
  { id: 1, type: "Gas Safety", property: "Flat 1A", due: "2025-07-10", status: "Upcoming" },
  { id: 2, type: "EPC Renewal", property: "Flat 2B", due: "2025-06-25", status: "Urgent" },
  { id: 3, type: "Insurance Expiry", property: "Flat 1A", due: "2025-06-22", status: "Overdue" },
];

const mockDocuments = [
  { id: 1, name: "Gas Safety Certificate.pdf", type: "Gas Safety", property: "Flat 1A", expiry: "2025-07-10", status: "Valid" },
  { id: 2, name: "EPC.pdf", type: "EPC", property: "Flat 2B", expiry: "2025-06-25", status: "Expiring Soon" },
  { id: 3, name: "Insurance.pdf", type: "Insurance", property: "Flat 1A", expiry: "2025-06-22", status: "Expired" },
];

const mockTasks = [
  { id: 1, task: "Upload new Gas Safety Certificate", property: "Flat 1A", assigned: "You", status: "Pending" },
  { id: 2, task: "Schedule EPC inspection", property: "Flat 2B", assigned: "You", status: "Complete" },
];

const statusOptions = ["Valid", "Expiring Soon", "Expired"];
const taskStatusOptions = ["Pending", "Complete"];
const deadlineStatusOptions = ["Upcoming", "Urgent", "Overdue"];

export default function Compliance() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [deadlines, setDeadlines] = useState(mockDeadlines);
  const [tasks, setTasks] = useState(mockTasks);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState({
    task: "",
    property: "",
    assigned: "",
    status: "Pending",
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const fileInputRef = useRef();

  // Simulate scan/upload with OCR
  const handleUpload = (e) => {
    setError("");
    setUploading(true);
    const file = e.target.files[0];
    if (!file) {
      setUploading(false);
      return;
    }
    // Simulate scan/ocr delay
    setTimeout(() => {
      // Mock: extract type from filename for demo
      let docType = "Other";
      if (/gas/i.test(file.name)) docType = "Gas Safety";
      else if (/epc/i.test(file.name)) docType = "EPC";
      else if (/insurance/i.test(file.name)) docType = "Insurance";
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + 12);
      setDocuments((docs) => [
        ...docs,
        {
          id: docs.length + 1,
          name: file.name,
          type: docType,
          property: "Unassigned",
          expiry: expiry.toISOString().slice(0, 10),
          status: "Valid",
        },
      ]);
      setUploading(false);
    }, 1500);
  };

  // Update document status
  const handleDocStatusChange = (id, newStatus) => {
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === id ? { ...doc, status: newStatus } : doc
      )
    );
  };

  // Update task status
  const handleTaskStatusChange = (id, newStatus) => {
    setTasks(tsks =>
      tsks.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  // Update deadline status
  const handleDeadlineStatusChange = (id, newStatus) => {
    setDeadlines(dls =>
      dls.map(dl =>
        dl.id === id ? { ...dl, status: newStatus } : dl
      )
    );
  };

  // Add new task handler
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.task.trim() || !newTask.property.trim() || !newTask.assigned.trim()) {
      setError("Please fill in all fields to add a new task.");
      return;
    }
    setTasks(tsks => [
      ...tsks,
      {
        id: tsks.length + 1,
        ...newTask,
      },
    ]);
    setNewTask({ task: "", property: "", assigned: "", status: "Pending" });
    setError("");
  };

  // Show task modal
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  // Delete task handler
  const handleDeleteTask = (id) => {
    setTasks(tsks => tsks.filter(task => task.id !== id));
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main compliance-main">
        <h1 className="compliance-title">Compliance Manager</h1>

        {/* Upload & Scan Compliance Document */}
        <section className="compliance-section">
          <h2>Scan & Upload Compliance Document</h2>
          <label className="compliance-upload-label">
            <input
              type="file"
              accept="application/pdf,image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleUpload}
              disabled={uploading}
            />
            <button
              className="compliance-upload-btn"
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
              type="button"
            >
              {uploading ? "Uploading..." : "Upload or Scan Document"}
            </button>
          </label>
          <div className="compliance-upload-desc">
            Upload or scan your Gas Safety, EPC, Insurance, or other compliance documents. We'll scan and track expiry dates for you.
          </div>
          {error && <div className="compliance-error">{error}</div>}
        </section>

        {/* Deadlines & Urgent Reminders */}
        <section className="compliance-section">
          <h2>Upcoming Deadlines & Urgent Reminders</h2>
          <table className="compliance-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Property</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {deadlines.map(item => (
                <tr key={item.id} className={`compliance-status-${item.status.toLowerCase()}`}>
                  <td>{item.type}</td>
                  <td>{item.property}</td>
                  <td>{item.due}</td>
                  <td>
                    <span className={`status-bubble status-${item.status.replace(/\s/g, '').toLowerCase()}`}>
                      <select
                        value={item.status}
                        onChange={e => handleDeadlineStatusChange(item.id, e.target.value)}
                        className="compliance-status-select"
                      >
                        {deadlineStatusOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Document Expiry Tracker */}
        <section className="compliance-section">
          <h2>Document Expiry Tracker</h2>
          <table className="compliance-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Property</th>
                <th>Expiry</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id} className={`compliance-doc-status-${doc.status.replace(/\s/g, '').toLowerCase()}`}>
                  <td>{doc.name}</td>
                  <td>{doc.type}</td>
                  <td>{doc.property}</td>
                  <td>{doc.expiry}</td>
                  <td>
                    <span className={`status-bubble status-${doc.status.replace(/\s/g, '').toLowerCase()}`}>
                      <select
                        value={doc.status}
                        onChange={e => handleDocStatusChange(doc.id, e.target.value)}
                        className="compliance-status-select"
                      >
                        {statusOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Compliance Workflow Tracker */}
        <section className="compliance-section">
          <h2>Compliance Workflow Tracker</h2>
          <form className="compliance-add-task-form" onSubmit={handleAddTask}>
            <input
              type="text"
              placeholder="Task"
              value={newTask.task}
              onChange={e => setNewTask({ ...newTask, task: e.target.value })}
              className="compliance-add-task-input"
              required
            />
            <input
              type="text"
              placeholder="Property"
              value={newTask.property}
              onChange={e => setNewTask({ ...newTask, property: e.target.value })}
              className="compliance-add-task-input"
              required
            />
            <input
              type="text"
              placeholder="Assigned To"
              value={newTask.assigned}
              onChange={e => setNewTask({ ...newTask, assigned: e.target.value })}
              className="compliance-add-task-input"
              required
            />
            <button type="submit" className="compliance-add-task-btn">Add Task</button>
          </form>
          {error && <div className="compliance-error">{error}</div>}
          <table className="compliance-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Property</th>
                <th>Assigned</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr
                  key={task.id}
                  className={`compliance-task-status-${task.status.toLowerCase()}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleTaskClick(task)}
                >
                  <td>{task.task}</td>
                  <td>{task.property}</td>
                  <td>{task.assigned}</td>
                  <td>
                    <span className={`status-bubble status-${task.status.replace(/\s/g, '').toLowerCase()}`}>
                      <select
                        value={task.status}
                        onClick={e => e.stopPropagation()}
                        onChange={e => handleTaskStatusChange(task.id, e.target.value)}
                        className="compliance-status-select"
                      >
                        {taskStatusOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Task Modal Popup */}
        {showTaskModal && selectedTask && (
          <div className="compliance-modal-overlay" onClick={() => setShowTaskModal(false)}>
            <div className="compliance-modal-card" onClick={e => e.stopPropagation()}>
              <h3 className="compliance-modal-title">{selectedTask.task}</h3>
              <div className="compliance-modal-info">
                <div><strong>Property:</strong> {selectedTask.property}</div>
                <div><strong>Assigned To:</strong> {selectedTask.assigned}</div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span className={`status-bubble status-${selectedTask.status.replace(/\s/g, '').toLowerCase()}`}>
                    {selectedTask.status}
                  </span>
                </div>
              </div>
              <div className="compliance-modal-actions">
                <button
                  className="compliance-modal-delete-btn"
                  onClick={() => handleDeleteTask(selectedTask.id)}
                >
                  Delete Task
                </button>
                <button
                  className="compliance-modal-close-btn"
                  onClick={() => setShowTaskModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resource Hub */}
        <section className="compliance-section">
          <h2>Regulation Resource Hub</h2>
          <div className="compliance-resource-grid">
            <a
              className="compliance-resource-card"
              href="https://www.gov.uk/private-renting/your-landlords-safety-responsibilities"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="compliance-resource-title">Landlord Safety Responsibilities</span>
              <span className="compliance-resource-desc">gov.uk guidance on landlord safety duties</span>
            </a>
            <a
              className="compliance-resource-card"
              href="https://www.gov.uk/energy-performance-certificate-commercial-property"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="compliance-resource-title">EPC Rules</span>
              <span className="compliance-resource-desc">Energy Performance Certificate requirements</span>
            </a>
            <a
              className="compliance-resource-card"
              href="https://www.gov.uk/guidance/making-tax-digital-for-vat"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="compliance-resource-title">Making Tax Digital</span>
              <span className="compliance-resource-desc">Digital tax submission for landlords</span>
            </a>
            <a
              className="compliance-resource-card"
              href="https://www.gov.uk/government/collections/landlord-and-letting-agents-forms"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="compliance-resource-title">Templates & Forms</span>
              <span className="compliance-resource-desc">Official landlord forms and templates</span>
            </a>
            <a
              className="compliance-resource-card"
              href="https://www.gov.uk/deposit-protection-schemes-and-landlords"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="compliance-resource-title">Deposit Protection</span>
              <span className="compliance-resource-desc">Deposit protection scheme rules</span>
            </a>
            <a
              className="compliance-resource-card"
              href="https://www.gov.uk/private-renting-tenancy-agreements"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="compliance-resource-title">Tenancy Agreements</span>
              <span className="compliance-resource-desc">Tenancy agreement legal requirements</span>
            </a>
            <a
              className="compliance-resource-card"
              href="https://www.gov.uk/private-renting-energy-performance-certificates"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="compliance-resource-title">EPC for Private Renting</span>
              <span className="compliance-resource-desc">EPC rules for private landlords</span>
            </a>
            <a
              className="compliance-resource-card"
              href="https://www.gov.uk/government/publications/how-to-rent"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="compliance-resource-title">How to Rent Guide</span>
              <span className="compliance-resource-desc">Official government guide for tenants and landlords</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}