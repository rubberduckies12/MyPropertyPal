import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/sidebar.jsx";

const API_BASE = "https://api.mypropertypal.com";

export default function FileExplorer() {
  // State
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedTenant, setSelectedTenant] = useState("");
  const [category, setCategory] = useState("");
  const [shareWithTenant, setShareWithTenant] = useState(false);
  const [customFileName, setCustomFileName] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch properties and documents on load
  useEffect(() => {
    async function fetchData() {
      try {
        const [propRes, docRes] = await Promise.all([
          fetch(`${API_BASE}/api/properties`, { credentials: "include" }),
          fetch(`${API_BASE}/api/file-explorer`, { credentials: "include" }),
        ]);
        if (propRes.ok) {
          const propData = await propRes.json();
          setProperties(propData.properties || []);
        }
        if (docRes.ok) {
          const docData = await docRes.json();
          setDocuments(docData.documents || []);
        }
      } catch (err) {
        setError("Failed to load data.");
      }
    }
    fetchData();
  }, []);

  // Fetch properties and include the full address
  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch(`${API_BASE}/api/properties`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setProperties(
            data.properties.map((property) => ({
              id: property.id,
              name: `${property.name} (${property.address})`, // Combine name and full address
            }))
          );
        } else {
          setError("Failed to load properties.");
        }
      } catch (err) {
        setError("Failed to load properties.");
      }
    }
    fetchProperties();
  }, []);

  // Fetch tenants for the selected property
  useEffect(() => {
    async function fetchTenants() {
      if (!selectedProperty) {
        setTenants([]); // Clear tenants if no property is selected
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/tenants?property_id=${selectedProperty}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setTenants(
            data.tenants.map((tenant) => ({
              id: tenant.id,
              name: `${tenant.first_name} ${tenant.last_name}`, // Combine first and last name
            }))
          );
        } else {
          setError("Failed to load tenants.");
        }
      } catch (err) {
        setError("Failed to load tenants.");
      }
    }
    fetchTenants();
  }, [selectedProperty]);

  // Handle file upload
  const handleUpload = async () => {
    if (!files.length || !selectedProperty) {
      setError("Please select a property and upload at least one file.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));
    formData.append("property_id", selectedProperty);
    formData.append("tenant_id", selectedTenant);
    formData.append("category", category);
    formData.append("shared_with_tenant", shareWithTenant);
    formData.append("custom_name", customFileName);

    try {
      const res = await fetch(`${API_BASE}/api/file-explorer/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed.");
      await fetchDocuments(); // Fetch the updated list of documents
      setFiles([]);
      setCategory("");
      setCustomFileName("");
      setShareWithTenant(false);
      setSuccess("File uploaded successfully!");
      window.location.reload(); // Refresh the page after a successful upload
    } catch (err) {
      setError(err.message || "Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/file-explorer`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      } else {
        setError("Failed to load documents.");
      }
    } catch (err) {
      setError("Failed to load documents.");
    }
  };

  // Call fetchDocuments on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  // Handle file deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/file-explorer/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete file.");
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete file.");
    }
  };

  // Filtered documents based on search query
  const filteredDocuments = documents.filter((doc) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      doc.property_address?.toLowerCase().includes(searchLower) ||
      doc.tenant_name?.toLowerCase().includes(searchLower) ||
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
        <h1 className="text-2xl font-bold text-blue-700 mb-6">File Explorer</h1>

        {/* Upload Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">Upload Files</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Property</label>
              <select
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
              >
                <option value="">Select a property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tenant</label>
              <select
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                disabled={!selectedProperty}
              >
                <option value="">Select a tenant</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Custom File Name</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={customFileName}
                onChange={(e) => setCustomFileName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Share with Tenant</label>
              <input
                type="checkbox"
                className="mt-1"
                checked={shareWithTenant}
                onChange={(e) => setShareWithTenant(e.target.checked)}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Files</label>
              <input
                type="file"
                multiple
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <button
            className="mt-4 bg-blue-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-blue-700 transition"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {/* Uploaded Documents */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">Uploaded Documents</h2>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by property, tenant, category, or file name"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

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
                    <strong>Tenant:</strong> {doc.tenant_name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Category:</strong> {doc.category || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Shared with Tenant:</strong> {doc.shared_with_tenant ? "Yes" : "No"}
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
                    <button
                      className="text-red-600 hover:underline text-sm"
                      onClick={() => handleDelete(doc.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}