import React, { useState } from "react";
import "./tenants.css";
import Sidebar from "../sidebar/sidebar.jsx";

const sampleTenants = [
	{
		id: 1,
		first_name: "Alice",
		last_name: "Smith",
		property: { address: "123 Main St, London, E1 2AB" },
		rent_amount: 1200,
		rent_due: "2024-07-01",
		rent_status: "Paid",
		contract_end: "2024-12-31",
		total_earned: 6000,
	},
	{
		id: 2,
		first_name: "Bob",
		last_name: "Jones",
		property: { address: "456 Oak Rd, London, E2 3CD" },
		rent_amount: 950,
		rent_due: "2024-07-05",
		rent_status: "Overdue",
		contract_end: "2024-11-30",
		total_earned: 3800,
	},
	{
		id: 3,
		first_name: "Charlie",
		last_name: "Brown",
		property: { address: "789 Willow Ave, London, E3 4GH" },
		rent_amount: 1100,
		rent_due: "2024-07-10",
		rent_status: "Paid",
		contract_end: "2025-03-15",
		total_earned: 4400,
	},
];

function daysLeft(dateString) {
	const today = new Date();
	const date = new Date(dateString);
	const diffTime = date - today;
	const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
	return diffDays;
}

export default function Tenants() {
	const [tenants, setTenants] = useState(sampleTenants);
	const [showYearly, setShowYearly] = useState(false);
	const [selectedTenant, setSelectedTenant] = useState(null);

	const handleRowClick = (tenant) => {
		setSelectedTenant(tenant);
	};

	const handleCloseModal = () => {
		setSelectedTenant(null);
	};

	const handleRemoveTenant = (id) => {
		setTenants((prev) => prev.filter((t) => t.id !== id));
		setSelectedTenant(null);
	};

	return (
		<div className="properties-page">
			<Sidebar />
			<main className="properties-main">
				<div className="properties-header">
					<h2 className="properties-title">Tenants</h2>
					<div>
						<label style={{ fontWeight: 600, marginRight: 8 }}>
							Show yearly rent
						</label>
						<input
							type="checkbox"
							checked={showYearly}
							onChange={() => setShowYearly((v) => !v)}
						/>
					</div>
				</div>
				<div className="tenants-table-container">
					<table className="tenants-table">
						<thead>
							<tr>
								<th>Name</th>
								<th>Property Address</th>
								<th>Rental Income</th>
								<th>Rent Due</th>
								<th>Status</th>
								<th>Contract End</th>
								<th>Days Left</th>
								<th>Total Earned</th>
							</tr>
						</thead>
						<tbody>
							{tenants.map((tenant) => (
								<tr
									key={tenant.id}
									className="tenant-row"
									onClick={() => handleRowClick(tenant)}
									style={{ cursor: "pointer" }}
								>
									<td>
										{tenant.first_name} {tenant.last_name}
									</td>
									<td>{tenant.property.address}</td>
									<td>
										£
										{showYearly
											? (tenant.rent_amount * 12).toLocaleString()
											: tenant.rent_amount.toLocaleString()}
										/{showYearly ? "yr" : "mo"}
									</td>
									<td>
										{new Date(tenant.rent_due).toLocaleDateString("en-GB")}
									</td>
									<td>
										<span
											className={
												"tenant-status " +
												(tenant.rent_status === "Paid"
													? "status-paid"
													: tenant.rent_status === "Overdue"
													? "status-overdue"
													: "status-other")
											}
										>
											{tenant.rent_status}
										</span>
									</td>
									<td>
										{new Date(tenant.contract_end).toLocaleDateString("en-GB")}
									</td>
									<td>
										<span className="countdown">
											{daysLeft(tenant.contract_end)} days
										</span>
									</td>
									<td>
										£{tenant.total_earned.toLocaleString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Modal */}
				{selectedTenant && (
					<div className="tenant-modal-backdrop" onClick={handleCloseModal}>
						<div
							className="tenant-modal"
							onClick={(e) => e.stopPropagation()}
						>
							<button className="modal-close" onClick={handleCloseModal}>
								&times;
							</button>
							<h3>
								{selectedTenant.first_name} {selectedTenant.last_name}
							</h3>
							<p>
								<b>Property:</b> {selectedTenant.property.address}
							</p>
							<p>
								<b>Rental Income:</b> £
								{showYearly
									? (selectedTenant.rent_amount * 12).toLocaleString()
									: selectedTenant.rent_amount.toLocaleString()}
								/{showYearly ? "yr" : "mo"}
							</p>
							<p>
								<b>Rent Due:</b>{" "}
								{new Date(selectedTenant.rent_due).toLocaleDateString("en-GB")}
							</p>
							<p>
								<b>Status:</b>{" "}
								<span
									className={
										"tenant-status " +
										(selectedTenant.rent_status === "Paid"
											? "status-paid"
											: selectedTenant.rent_status === "Overdue"
											? "status-overdue"
											: "status-other")
									}
								>
									{selectedTenant.rent_status}
								</span>
							</p>
							<p>
								<b>Contract End:</b>{" "}
								{new Date(selectedTenant.contract_end).toLocaleDateString(
									"en-GB"
								)}
							</p>
							<p>
								<b>Days Left:</b> {daysLeft(selectedTenant.contract_end)}
							</p>
							<p>
								<b>Total Earned:</b> £
								{selectedTenant.total_earned.toLocaleString()}
							</p>
							<button
								className="remove-tenant-btn"
								onClick={() => handleRemoveTenant(selectedTenant.id)}
							>
								Remove Tenant
							</button>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}