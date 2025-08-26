import React, { useState, useEffect } from "react";
import Sidebar from "../../sidebar/sidebar.jsx";

const API_BASE = "https://api.mypropertypal.com";

export default function TenantDocuments() {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  // Fetch documents shared with the tenant
  useEffect(() => {
    async function fetchDocuments() {
      try {
        const res = await fetch(`${API_BASE}/api/file-explorer/tenant`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setDocuments(data.documents || []);
        } else {
          setError("Failed to load documents.");
        }
      } catch (err) {
        setError("Failed to load documents.");
      }
    }
    fetchDocuments();
  }, []);

  // Filter documents based on search query
  const filteredDocuments = documents.filter((doc) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      doc.property_address?.toLowerCase().includes(searchLower) ||
      doc.category?.toLowerCase().includes(searchLower) ||
      doc.file_name?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0 h-screen">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-10 pt-4 overflow-auto">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Shared Documents</h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by property, category, or file name"
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Documents List */}
        {filteredDocuments.length === 0 ? (
          <p className="text-gray-500">No documents match your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="bg-gray-50 p-4 rounded-lg shadow">
                <h3 className="text-blue-700 font-semibold">{doc.file_name}</h3>
                <p className="text-sm text-gray-500">
                  <strong>Property:</strong> {doc.property_address || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Category:</strong> {doc.category || "N/A"}
                </p>
                <div className="flex justify-between mt-4">
                  <a
                    href={doc.file_url} // Ensure this is a valid URL
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </a>
                  <a
                    href={doc.file_url}
                    download={doc.file_name}
                    className="text-green-600 hover:underline text-sm"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}