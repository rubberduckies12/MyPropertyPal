import React from "react";
import TenantSidebar from "../tsidebar/tenantSidebar.jsx";

export default function TenantHome() {
  return (
    <div style={{ display: "flex" }}>
      <TenantSidebar />
      <div className="tenant-home-container" style={{ marginLeft: 240, padding: "32px", width: "100%" }}>
        <h1>Welcome to Your Tenant Portal</h1>
        <p>
          Here you can view your tenancy details, report issues, download documents, and contact your landlord.
        </p>
        {/* Add more tenant-specific features here */}
      </div>
    </div>
  );
}