import React, { useRef, useState, useEffect } from "react";
import Sidebar from "../../sidebar/sidebar.jsx";
import "./documents.css";

const BACKEND_URL = "http://localhost:5001";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchDocs = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${BACKEND_URL}/api/documents`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const data = await res.json();
        if (res.ok) {
          setDocuments(
            data.map((doc, idx) => ({
              id: doc.id,
              name: doc.description || `Document ${idx + 1}`,
              type: doc.category || "Other",
              date: doc.incurred_on,
              amount: doc.amount || "N/A",
              status: doc.amount ? "Processed" : "No amount found",
            }))
          );
        }
      } catch (err) {}
    };
    fetchDocs();
  }, []);

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

  return (
    <div className="properties-page">
      <Sidebar />
      <main className="properties-main">
        <div className="properties-header">
          <h1 className="properties-title">Documents & Uploads</h1>
          <div>
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
              className="add-property-btn"
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
              type="button"
            >
              {uploading ? "Uploading..." : "Upload Invoice or Receipt"}
            </button>
          </div>
        </div>
        {error && <div className="documents-error">{error}</div>}
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