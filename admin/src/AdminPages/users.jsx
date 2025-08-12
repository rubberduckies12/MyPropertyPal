import React, { useState, useEffect } from "react";

const BASE_URL = "https://api.mypropertypal.com"; // Backend URL

const Users = () => {
  const [users, setUsers] = useState([]); // List of users matching the search
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [selectedUser, setSelectedUser] = useState(null); // Selected user details
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch users based on the search term
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/manage-users/search-users?search=${searchTerm}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  // Handle user edit
  const handleEdit = async () => {
    try {
      const { landlord_id, first_name, last_name, email } = selectedUser;
      const response = await fetch(`${BASE_URL}/api/admin/manage-users/edit/${landlord_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ firstName: first_name, lastName: last_name, email }),
      });
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      alert("User updated successfully!");
      fetchUsers(); // Refresh the user list
      setSelectedUser(null); // Close the details card
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user.");
    }
  };

  // Handle user delete
  const handleDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/manage-users/delete/${selectedUser.landlord_id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      alert("User deleted successfully!");
      fetchUsers(); // Refresh the user list
      setSelectedUser(null); // Close the details card
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={fetchUsers}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* User Table */}
      {!selectedUser && !loading && users.length > 0 && (
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
            {users.map((user) => (
              <tr key={user.landlord_id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{user.first_name}</td>
                <td className="border border-gray-300 p-2">{user.last_name}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.payment_plan_name || "N/A"}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="text-red-500 hover:underline ml-4"
                  >
                    Delete
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