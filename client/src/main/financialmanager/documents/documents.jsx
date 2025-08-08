import React, { useRef, useState, useEffect } from "react";
import Sidebar from "../../sidebar/sidebar.jsx";

const BACKEND_URL = "https://api.mypropertypal.com";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/documents`, {
          credentials: "include",
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
    try {
      const res = await fetch(`${BACKEND_URL}/api/documents/upload`, {
        method: "POST",
        credentials: "include",
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

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/finances/expense/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete document/expense");
      setDocuments((docs) => docs.filter((doc) => doc.id !== id));
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-64 px-4 py-8 pl-8">
        <div className="flex items-center justify-between mb-8 border-b border-blue-100 pb-4">
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Documents & Uploads</h1>
          <div>
            <input
              type="file"
              accept="application/pdf,image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleUpload(file);
              }}
              disabled={uploading}
            />
            <button
              className="bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 transition"
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
              type="button"
            >
              {uploading ? "Uploading..." : "Upload Invoice or Receipt"}
            </button>
          </div>
        </div>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <section className="bg-white rounded-2xl p-6 border border-blue-100 shadow mb-10">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Uploaded Documents</h2>
          <div className="w-full overflow-x-auto">
            <table className="min-w-[900px] w-full text-base divide-y divide-blue-100">
              <thead>
                <tr>
                  <th className="py-4 px-3 text-left bg-blue-50 text-blue-700 font-bold border-b border-blue-100">Date</th>
                  <th className="py-4 px-3 text-left bg-blue-50 text-blue-700 font-bold border-b border-blue-100">File Name</th>
                  <th className="py-4 px-3 text-left bg-blue-50 text-blue-700 font-bold border-b border-blue-100">Type</th>
                  <th className="py-4 px-3 text-left bg-blue-50 text-blue-700 font-bold border-b border-blue-100">Amount</th>
                  <th className="py-4 px-3 text-left bg-blue-50 text-blue-700 font-bold border-b border-blue-100">Status</th>
                  <th className="py-4 px-3 text-left bg-blue-50 text-blue-700 font-bold border-b border-blue-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-8">
                      No documents uploaded yet.
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-blue-50 transition">
                      <td className="py-4 px-3">
                        {new Date(doc.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="py-4 px-3">{doc.name}</td>
                      <td className="py-4 px-3">{doc.type}</td>
                      <td className="py-4 px-3">£{doc.amount}</td>
                      <td className="py-4 px-3">
                        <span
                          className={
                            doc.status === "Processed"
                              ? "bg-green-100 text-green-700 px-3 py-1 rounded-xl font-semibold text-sm"
                              : "bg-red-100 text-red-700 px-3 py-1 rounded-xl font-semibold text-sm"
                          }
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <button
                          className="bg-red-600 text-white font-semibold rounded-lg px-3 py-1 hover:bg-red-700 transition"
                          onClick={() => handleDelete(doc.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}