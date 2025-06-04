import React, { useState } from 'react';

/**
 * LandlordPortfolio
 * Allows landlords to manage their property portfolio, assign tenants, update rent/lease, and remove properties.
 */
const LandlordPortfolio = ({
  properties = [],
  tenants = [],
  newProperty,
  onNewPropertyChange,
  onAddProperty,
  onRemoveProperty,
  assignTenant,
  onAssignTenantChange,
  onAssignTenant,
  onUpdateRent,
  onUpdateLeaseEnd,
}) => {
  // -------------------- State --------------------
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const [confirmUnassign, setConfirmUnassign] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [assignPopup, setAssignPopup] = useState(null);
  const [updateRentPopup, setUpdateRentPopup] = useState(null);
  const [newRent, setNewRent] = useState('');
  const [confirmUpdateRent, setConfirmUpdateRent] = useState(false);
  const [updateLeaseEndPopup, setUpdateLeaseEndPopup] = useState(null);
  const [newLeaseEnd, setNewLeaseEnd] = useState('');

  // -------------------- Handlers --------------------
  // Unassign tenant from property
  const handleUnassignTenant = (propertyId) => {
    onAssignTenant(propertyId, null);
    setOpenActionMenu(null);
    setConfirmUnassign(null);
  };

  // Remove property from portfolio
  const handleRemoveProperty = (propertyId) => {
    onRemoveProperty(propertyId);
    setOpenActionMenu(null);
    setConfirmDelete(null);
  };

  // Update rent for a property
  const handleUpdateRent = () => {
    if (updateRentPopup && newRent) {
      onUpdateRent(updateRentPopup, newRent);
      setUpdateRentPopup(null);
      setNewRent('');
      setConfirmUpdateRent(false);
    }
  };

  // Update lease end date for a property
  const handleUpdateLeaseEnd = () => {
    if (onUpdateLeaseEnd && updateLeaseEndPopup && newLeaseEnd) {
      onUpdateLeaseEnd(updateLeaseEndPopup, newLeaseEnd);
      setUpdateLeaseEndPopup(null);
      setNewLeaseEnd('');
    }
  };

  // Helper: Check if lease has ended
  const leaseHasEnded = (property) => {
    if (!property.leaseEnd) return true;
    return new Date(property.leaseEnd) <= new Date();
  };

  // -------------------- Render --------------------
  return (
    <main className="flex-1 p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Property Portfolio</h1>
          <p className="text-gray-500">Manage your properties and assign tenants.</p>
        </div>
      </div>

      {/* Add Property Form */}
      <form
        onSubmit={onAddProperty}
        className="bg-gray-100 rounded-2xl p-6 mb-8 shadow-lg flex flex-col md:flex-row gap-4 items-center"
      >
        <div className="flex flex-col w-full md:w-48">
          <label className="mb-1 text-sm font-bold text-gray-700">Property Name</label>
          <input
            type="text"
            placeholder="Property Name"
            className="border rounded-lg px-3 py-2"
            value={newProperty.name}
            onChange={e => onNewPropertyChange({ ...newProperty, name: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col w-full md:w-64">
          <label className="mb-1 text-sm font-bold text-gray-700">Address</label>
          <input
            type="text"
            placeholder="Address"
            className="border rounded-lg px-3 py-2"
            value={newProperty.address}
            onChange={e => onNewPropertyChange({ ...newProperty, address: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col w-full md:w-32">
          <label className="mb-1 text-sm font-bold text-gray-700">Rent (£)</label>
          <input
            type="number"
            placeholder="Rent (£)"
            className="border rounded-lg px-3 py-2"
            value={newProperty.rent}
            onChange={e => onNewPropertyChange({ ...newProperty, rent: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition mt-6 md:mt-0"
        >
          Add Property
        </button>
      </form>

      {/* Assign Tenant Popup */}
      {assignPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Assign Tenant</h2>
            <div className="mb-6">
              <select
                className="border rounded-lg px-2 py-2 w-full"
                value={assignTenant[assignPopup] || ''}
                onChange={e =>
                  onAssignTenantChange({
                    ...assignTenant,
                    [assignPopup]: e.target.value,
                  })
                }
              >
                <option value="">Select Tenant</option>
                {tenants
                  .filter(tenant => {
                    // Only show tenants not already assigned, or the current tenant
                    const isAssigned = properties.some(
                      p => p.tenantId && String(p.tenantId) === String(tenant.userId)
                    );
                    const currentProperty = properties.find(p => p.propertyId === assignPopup);
                    const isCurrentTenant =
                      currentProperty && String(currentProperty.tenantId) === String(tenant.userId);
                    return !isAssigned || isCurrentTenant;
                  })
                  .map(tenant => (
                    <option key={tenant.userId} value={tenant.userId}>
                      {tenant.name || tenant.email}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setAssignPopup(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  // Extra validation: ensure selected tenant is not already assigned elsewhere
                  const selectedTenantId = assignTenant[assignPopup];
                  const isAssigned = properties.some(
                    p =>
                      p.tenantId &&
                      String(p.tenantId) === String(selectedTenantId) &&
                      String(p.propertyId) !== String(assignPopup)
                  );
                  if (!selectedTenantId || isAssigned) {
                    // Optionally show an error message here
                    return;
                  }
                  onAssignTenant(assignPopup, selectedTenantId);
                  setAssignPopup(null);
                  setOpenActionMenu(null);
                }}
                disabled={
                  !assignTenant[assignPopup] ||
                  properties.some(
                    p =>
                      p.tenantId &&
                      String(p.tenantId) === String(assignTenant[assignPopup]) &&
                      String(p.propertyId) !== String(assignPopup)
                  )
                }
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Unassign Tenant Popup */}
      {confirmUnassign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
            <p className="mb-6">
              {(() => {
                const property = properties.find(p => p.propertyId === confirmUnassign);
                if (property && !leaseHasEnded(property)) {
                  return "The lease has not ended. Are you sure you want to unassign this tenant?";
                }
                return "Are you sure you want to unassign this tenant?";
              })()}
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setConfirmUnassign(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => handleUnassignTenant(confirmUnassign)}
              >
                Unassign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Property Popup */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
            <p className="mb-6">
              Are you sure you want to delete this property?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleRemoveProperty(confirmDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Rent Popup */}
      {updateRentPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Update Rent</h2>
            {!confirmUpdateRent ? (
              <>
                <div className="mb-6">
                  <input
                    type="number"
                    className="border rounded-lg px-3 py-2 w-full"
                    placeholder="New Rent (£)"
                    value={newRent}
                    onChange={e => setNewRent(e.target.value)}
                    min={0}
                  />
                </div>
                <div className="flex flex-col gap-2 mb-4 text-sm text-gray-600">
                  <span>
                    Before updating the rent amount, please ensure you have provided your tenant with appropriate notice in accordance with legal requirements.
                  </span>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => {
                      setUpdateRentPopup(null);
                      setNewRent('');
                      setConfirmUpdateRent(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setConfirmUpdateRent(true)}
                    disabled={!newRent}
                  >
                    Continue
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-6">
                  Are you sure you want to update the rent to <span className="font-semibold">£{newRent}</span>?<br />
                  Please confirm you have notified your tenant about this change.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => {
                      setConfirmUpdateRent(false);
                      setUpdateRentPopup(null);
                      setNewRent('');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => {
                      handleUpdateRent();
                    }}
                  >
                    Confirm Update
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Update Lease End Popup */}
      {updateLeaseEndPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Update Lease End</h2>
            <div className="mb-6">
              <input
                type="date"
                className="border rounded-lg px-3 py-2 w-full"
                value={newLeaseEnd}
                onChange={e => setNewLeaseEnd(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  setUpdateLeaseEndPopup(null);
                  setNewLeaseEnd('');
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleUpdateLeaseEnd}
                disabled={!newLeaseEnd}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Properties Table */}
      <table className="min-w-full bg-white rounded-2xl shadow-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Address</th>
            <th className="py-3 px-4 text-left">Rent (£)</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Lease End</th>
            <th className="py-3 px-4 text-left">Tenant</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* No properties row */}
          {properties.length === 0 && (
            <tr>
              <td colSpan={7} className="py-6 text-center text-gray-400">
                No properties yet.
              </td>
            </tr>
          )}
          {/* Property rows */}
          {properties.map(property => {
            const isOccupied = !!property.tenantId;
            const tenantName = property.tenantId
              ? tenants.find(t => String(t.userId) === String(property.tenantId))?.name || 'Unknown'
              : 'None';
            return (
              // 1. Table Row Key
              <tr key={property.propertyId} className="border-b last:border-none">
                <td className="py-3 px-4">{property.name}</td>
                <td className="py-3 px-4">{property.address}</td>
                <td className="py-3 px-4">£{property.rent}</td>
                <td className="py-3 px-4">
                  <span className={isOccupied ? "text-green-600 font-semibold" : "text-gray-500"}>
                    {isOccupied ? "Occupied" : "Vacant"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {(property.tenantId && property.leaseEnd)
                    ? new Date(property.leaseEnd).toLocaleDateString()
                    : "-"}
                </td>
                <td className="py-3 px-4">{tenantName}</td>
                <td className="py-3 px-4 relative" style={{ overflow: 'visible' }}>
                  <div className="inline-block text-left w-full">
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded transition"
                      onClick={() =>
                        setOpenActionMenu(openActionMenu === property.propertyId ? null : property.propertyId)
                      }
                      type="button"
                    >
                      Actions ▼
                    </button>
                    {openActionMenu === property.propertyId && (
                      <div
                        className="absolute right-0 z-20 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg"
                        style={{ minWidth: '12rem' }}
                      >
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => setAssignPopup(property.propertyId)}
                        >
                          Assign Tenant
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setUpdateRentPopup(property.propertyId);
                            setNewRent(property.rent || '');
                            setOpenActionMenu(null);
                          }}
                        >
                          Update Rent
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setUpdateLeaseEndPopup(property.propertyId);
                            setNewLeaseEnd(property.leaseEnd ? property.leaseEnd.slice(0, 10) : '');
                            setOpenActionMenu(null);
                          }}
                        >
                          Update Lease End
                        </button>
                        {property.tenantId && (
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={() => setConfirmUnassign(property.propertyId)}
                          >
                            Unassign Tenant
                          </button>
                        )}
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 border-t border-gray-100"
                          onClick={() => setConfirmDelete(property.propertyId)}
                        >
                          Remove Property
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
};

export default LandlordPortfolio;