import React, { useState } from "react";
import Sidebar from "../../sidebar/sidebar";
import "./contracts.css";

// Dummy data for sidebar and documents
const sidebarData = [
  {
    name: "Property 1",
    tenants: [
      {
        name: "Tenant A",
        folders: ["Contracts", "Documents"],
      },
      {
        name: "Tenant B",
        folders: ["Contracts", "Documents"],
      },
    ],
  },
  {
    name: "Property 2",
    tenants: [],
  },
];

const documentsSample = {
  "Property 1/Tenant A/Contracts": [
    { name: "Tenancy Agreement.pdf", type: "Contract", date: "2024-05-01" },
    { name: "Guarantor Agreement.pdf", type: "Contract", date: "2024-05-10" },
  ],
  "Property 1/Tenant A/Documents": [
    { name: "Inspection Report.pdf", type: "Report", date: "2024-06-01" },
  ],
  "Property 1/Tenant B/Contracts": [
    { name: "Short Let Agreement.pdf", type: "Contract", date: "2024-04-15" },
  ],
  "Property 1/Tenant B/Documents": [
    { name: "Inventory.pdf", type: "Inventory", date: "2024-06-10" },
  ],
};

const templates = [
  "Section 21 Notice",
  "Tenancy Agreement",
  "Rent Increase Notice",
  "Deposit Protection Certificate",
];

function Contracts() {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [generateModalOpen, setGenerateModalOpen] = useState(false);

  // Handle contracts sidebar click
  const handleSidebarClick = (property, tenant, folder) => {
    if (tenant && folder) {
      setSelectedFolder(`${property}/${tenant}/${folder}`);
    } else {
      setSelectedFolder(null);
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Replace with actual upload logic
      console.log("Uploading file:", selectedFile.name);
      setUploadOpen(false);
      setSelectedFile(null);
    }
  };

  // Filtering and sorting
  let docs = documentsSample[selectedFolder] || [];
  if (filter) {
    docs = docs.filter(
      (doc) =>
        doc.name.toLowerCase().includes(filter.toLowerCase()) ||
        doc.type.toLowerCase().includes(filter.toLowerCase())
    );
  }
  if (sortBy === "date-desc") {
    docs = docs.slice().sort((a, b) => b.date.localeCompare(a.date));
  } else if (sortBy === "date-asc") {
    docs = docs.slice().sort((a, b) => a.date.localeCompare(b.date));
  } else if (sortBy === "name") {
    docs = docs.slice().sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="contracts-root">
      {/* App-wide sidebar */}
      <Sidebar />

      {/* Contracts page sidebar */}
      <aside className="contracts-sidebar">
        <h2 className="contracts-sidebar-title">Properties</h2>
        <ul className="contracts-sidebar-list">
          {sidebarData.map((property) => (
            <li key={property.name}>
              <span className="contracts-sidebar-property">{property.name}</span>
              {property.tenants.length > 0 && (
                <ul>
                  {property.tenants.map((tenant) => (
                    <li key={tenant.name}>
                      <span className="contracts-sidebar-tenant">{tenant.name}</span>
                      <ul>
                        {tenant.folders.map((folder) => (
                          <li
                            key={folder}
                            className={
                              selectedFolder ===
                              `${property.name}/${tenant.name}/${folder}`
                                ? "contracts-sidebar-folder selected"
                                : "contracts-sidebar-folder"
                            }
                            onClick={() =>
                              handleSidebarClick(property.name, tenant.name, folder)
                            }
                          >
                            {folder}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <div className="contracts-main contracts-main-with-sidebar">
        {/* Top Action Bar */}
        <div className="contracts-action-bar">
          <button
            className="contracts-action-btn"
            onClick={() => setUploadOpen(true)}
          >
            Upload Document
          </button>
          <button
            className="contracts-action-btn"
            onClick={() => setGenerateModalOpen(true)}
          >
            Generate Document
          </button>
          <button className="contracts-action-btn">Templates</button>
        </div>

        {/* Filter and Sort */}
        <div className="contracts-filter-row">
          <input
            className="contracts-filter-input"
            type="text"
            placeholder="Filter by name or type..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <select
            className="contracts-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Newest</option>
            <option value="date-asc">Oldest</option>
            <option value="name">A-Z</option>
          </select>
        </div>

        {/* Document List */}
        <main className="contracts-content">
          {selectedFolder ? (
            <>
              <h1 className="contracts-folder-title">
                Documents in <span>{selectedFolder}</span>
              </h1>
              {docs.length > 0 ? (
                <table className="contracts-doc-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((doc, i) => (
                      <tr key={i}>
                        <td>{doc.name}</td>
                        <td>{doc.type}</td>
                        <td>{doc.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="contracts-empty-state">
                  No documents found for this folder.
                </div>
              )}
            </>
          ) : (
            <div className="contracts-empty-state">
              <h1>Document Viewer</h1>
              <p>Select a folder from the sidebar to view documents</p>
            </div>
          )}
        </main>
      </div>

      {/* Generate Document Modal */}
      {generateModalOpen && (
        <div
          className="contracts-modal-overlay"
          onClick={() => setGenerateModalOpen(false)}
        >
          <div
            className="contracts-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Select a Template</h2>
            <ul className="contracts-template-list">
              {templates.map((t, i) => (
                <li key={i}>
                  <button
                    className="contracts-template-btn"
                    onClick={() => {
                      console.log("Generate document:", t);
                      setGenerateModalOpen(false);
                    }}
                  >
                    {t}
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="contracts-modal-cancel-btn"
              onClick={() => setGenerateModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {uploadOpen && (
        <div
          className="contracts-modal-overlay"
          onClick={() => setUploadOpen(false)}
        >
          <div
            className="contracts-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Upload Document</h2>
            <input type="file" onChange={handleFileChange} />
            {selectedFile && (
              <p className="contracts-selected-file">
                Selected file: <strong>{selectedFile.name}</strong>
              </p>
            )}
            <button
              className="contracts-template-btn"
              onClick={handleUpload}
              disabled={!selectedFile}
            >
              Upload
            </button>
            <button
              className="contracts-modal-cancel-btn"
              onClick={() => setUploadOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contracts;