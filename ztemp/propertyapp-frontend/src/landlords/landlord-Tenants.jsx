import React from 'react';

/**
 * LandlordTenants
 * Displays a list of tenants linked to the landlord, their properties, rent status, and allows deletion.
 */
const LandlordTenants = ({
  tenants = [],
  properties = [],
  onDeleteTenant,
  landlordId,
}) => {
  // Helper: Get property info for a tenant (compare IDs as strings)
  const getPropertyForTenant = (tenant) => {
    return properties.find(
      (p) =>
        String(p.tenantId) === String(tenant.userId) &&
        String(p.landlordId) === String(landlordId)
    );
  };

  // Helper: Check if rent is overdue (based on nextRentDue date)
  const isRentOverdue = (property) => {
    if (!property || !property.nextRentDue) return false;
    const today = new Date();
    const dueDate = new Date(property.nextRentDue);
    return dueDate < today;
  };

  // Only show tenants linked to this landlord
  const filteredTenants = tenants.filter(
    (t) => String(t.linkedLandlordId) === String(landlordId)
  );

  // -------------------- Render --------------------
  return (
    <main className="flex-1 p-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Tenants</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Property</th>
              <th className="py-3 px-4 text-left">Rent (£)</th>
              <th className="py-3 px-4 text-left">Rent Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* No tenants row */}
            {filteredTenants.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400">
                  No tenants found.
                </td>
              </tr>
            )}
            {/* Tenant rows */}
            {filteredTenants.map((tenant) => {
              const property = getPropertyForTenant(tenant);
              return (
                <tr key={tenant._id || tenant.userId} className="border-b last:border-none">
                  <td className="py-3 px-4">{tenant.name || tenant.fullName}</td>
                  <td className="py-3 px-4">{tenant.email}</td>
                  <td className="py-3 px-4">
                    {property
                      ? `${property.name || ''} (${property.address || ''})`
                      : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {property && property.rent ? `£${property.rent}` : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {property ? (
                      isRentOverdue(property) ? (
                        <span className="text-red-600 font-semibold">Overdue</span>
                      ) : (
                        <span className="text-green-600 font-semibold">Caught Up</span>
                      )
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                      onClick={() => onDeleteTenant && onDeleteTenant(tenant._id || tenant.userId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default LandlordTenants;