import React, { useState, useEffect } from "react";

const BASE_URL = "https://api.mypropertypal.com"; // Hardcoded backend URL

const Users = () => {
  const [users, setUsers] = useState([]); // All users for the table
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users for search
  const [selectedUser, setSelectedUser] = useState(null); // Selected user details
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [loading, setLoading] = useState(false); // Loading state for fetch requests
  const [error, setError] = useState(null); // Error state
  const [confirmDeleteCount, setConfirmDeleteCount] = useState(0); // Delete confirmation counter

  // Fetch the list of users for the table on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL}/api/admin/manage-users/all-users`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.email.toLowerCase().includes(term) ||
          user.first_name.toLowerCase().includes(term) ||
          user.last_name.toLowerCase().includes(term)
      )
    );
  };

  // Handle user selection
  const handleUserClick = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/manage-users/details/${userId}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const data = await response.json();
      setSelectedUser(data);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to load user details.");
    } finally {
      setLoading(false);
    }
  };

  // Handle user edit
  const handleEdit = async () => {
    try {
      const { account_id, first_name, last_name, email, payment_plan_id } = selectedUser;
      const response = await fetch(`${BASE_URL}/api/admin/manage-users/edit/${account_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName: first_name,
          lastName: last_name,
          email,
          paymentPlanId: payment_plan_id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      alert("User updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user.");
    }
  };

  // Handle user delete
  const handleDelete = async () => {
    if (confirmDeleteCount < 2) {
      setConfirmDeleteCount(confirmDeleteCount + 1);
      alert(`Are you sure? (${3 - confirmDeleteCount} confirmations left)`);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/admin/manage-users/delete/${selectedUser.account_id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      alert("User deleted successfully!");
      setSelectedUser(null);
      setConfirmDeleteCount(0);
      // Refresh the user list
      const refreshResponse = await fetch(`${BASE_URL}/api/admin/manage-users/all-users`, {
        credentials: "include",
      });
      if (!refreshResponse.ok) {
        throw new Error("Failed to refresh user list");
      }
      const data = await refreshResponse.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Loading and Error States */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Search Bar */}
      {!selectedUser && (
        <input
          type="text"
          placeholder="Search by name, email, or plan..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
      )}

      {/* User Table */}
      {!selectedUser && !loading && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">First Name</th>
              <th className="border border-gray-300 p-2">Last Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Plan</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.account_id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{user.first_name}</td>
                <td className="border border-gray-300 p-2">{user.last_name}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.payment_plan_name || "N/A"}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleUserClick(user.account_id)}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* User Details Card */}
      {selectedUser && (
        <div className="mt-6 p-4 border border-gray-300 rounded shadow-md">
          <button
            onClick={() => setSelectedUser(null)}
            className="text-blue-500 hover:underline mb-4"
          >
            Back to User List
          </button>
          <h2 className="text-xl font-bold mb-4">
            {selectedUser.first_name} {selectedUser.last_name}
          </h2>
          <div className="mb-4">
            <label className="block font-medium">First Name</label>
            <input
              type="text"
              value={selectedUser.first_name}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, first_name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Last Name</label>
            <input
              type="text"
              value={selectedUser.last_name}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, last_name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Email</label>
            <input
              type="email"
              value={selectedUser.email}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Plan</label>
            <input
              type="text"
              value={selectedUser.payment_plan_name || "N/A"}
              disabled
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleEdit}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete User
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;