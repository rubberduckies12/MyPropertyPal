import React, { useRef, useState } from "react";
import Sidebar from "../../sidebar/sidebar.jsx";
import "./documents.css";

// Mock for uploaded documents
const initialDocs = [
  // Example: { id: 1, name: "invoice-may.pdf", type: "Invoice", date: "2025-06-01", amount: 120, status: "Processed" }
];

const BACKEND_URL = "http://localhost:5001"; // <-- Hardcoded backend URL

export default function Documents() {
  const [documents, setDocuments] = useState(initialDocs);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  // Example upload handler
  const handleUpload = async (file) => {
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BACKEND_URL}/api/documents/upload`, {
        method: "POST",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setDocuments((docs) => [
        ...docs,
        {
          id: docs.length + 1,
          name: file.name,
          type: file.name.toLowerCase().includes("invoice")
            ? "Invoice"
            : file.name.toLowerCase().includes("receipt")
            ? "Receipt"
            : "Other",
          date: new Date().toISOString().slice(0, 10),
          amount: data.amount || "N/A",
          status: data.amount ? "Processed" : "No amount found",
        },
      ]);
    } catch (err) {
      setError(err.message || "Upload failed");
    }
    setUploading(false);
  };

  // Simulate Google Vision OCR and outgoing extraction
  const handleFileChange = async (e) => {
    setError("");
    setUploading(true);
    const file = e.target.files[0];
    if (!file) {
      setUploading(false);
      return;
    }
    handleUpload(file);
    // Simulate OCR and extraction delay
    setTimeout(() => {
      // Mock: extract amount and type from filename for demo
      const isInvoice = file.name.toLowerCase().includes("invoice");
      const isReceipt = file.name.toLowerCase().includes("receipt");
      const amount = Math.floor(Math.random() * 200) + 20;
      setDocuments((docs) => [
        ...docs,
        {
          id: docs.length + 1,
          name: file.name,
          type: isInvoice ? "Invoice" : isReceipt ? "Receipt" : "Other",
          date: new Date().toISOString().slice(0, 10),
          amount,
          status: "Processed",
        },
      ]);
      setUploading(false);
    }, 1800);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main documents-main">
        <h1 className="documents-title">Documents & Uploads</h1>
        <div className="documents-upload-section">
          <label className="documents-upload-label">
            <input
              type="file"
              accept="application/pdf,image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={e => {
                const file = e.target.files[0];
                if (file) handleUpload(file);
              }}
              disabled={uploading}
            />
            <button
              className="documents-upload-btn"
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
              type="button"
            >
              {uploading ? "Uploading..." : "Upload Invoice or Receipt"}
            </button>
          </label>
          <div className="documents-upload-desc">
            Upload your invoices, receipts, and bills. We’ll scan them with Google Vision and automatically extract outgoings for your records.
          </div>
          {error && <div className="documents-error">{error}</div>}
        </div>
        <section className="documents-list-section">
          <h2>Uploaded Documents</h2>
          <table className="documents-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>File Name</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#64748b" }}>
                    No documents uploaded yet.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.date}</td>
                    <td>{doc.name}</td>
                    <td>{doc.type}</td>
                    <td>£{doc.amount}</td>
                    <td className="documents-status">{doc.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}