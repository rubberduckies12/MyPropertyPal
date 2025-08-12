import React, { useState, useEffect } from "react";

const BASE_URL = "https://api.mypropertypal.com"; // Hardcoded backend URL

const Users = () => {
  const [users, setUsers] = useState([]); // All users
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users for search
  const [selectedUser, setSelectedUser] = useState(null); // Selected user details
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [editMode, setEditMode] = useState(false); // Toggle edit mode
  const [confirmDeleteCount, setConfirmDeleteCount] = useState(0); // Delete confirmation counter

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/admin/manage-users/all`, {
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
    try {
      const response = await fetch(`${BASE_URL}/api/admin/manage-users/details/${userId}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const data = await response.json();
      setSelectedUser(data);
      setEditMode(false); // Exit edit mode if active
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  // Handle user edit
  const handleEdit = async () => {
    try {
      const { account_id, first_name, last_name, email, role_id } = selectedUser;
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
          roleId: role_id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      alert("User updated successfully!");
      setEditMode(false);
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
      const refreshResponse = await fetch(`${BASE_URL}/api/admin/manage-users/all`, {
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

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      {/* User Table */}
      {!selectedUser && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Role</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.account_id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  {user.first_name} {user.last_name}
                </td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.role}</td>
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

      {/* User Details */}
      {selectedUser && (
        <div className="mt-6">
          <button
            onClick={() => setSelectedUser(null)}
            className="text-blue-500 hover:underline mb-4"
          >
            Back to User List
          </button>

          {!editMode ? (
            <div>
              <h2 className="text-xl font-bold mb-4">
                {selectedUser.first_name} {selectedUser.last_name}
              </h2>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Payment Plan:</strong> {selectedUser.payment_plan_name}</p>
              <p><strong>Rent Due Date:</strong> {selectedUser.rent_due_date || "N/A"}</p>

              <div className="mt-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-4">Edit User</h2>
              <input
                type="text"
                value={selectedUser.first_name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, first_name: e.target.value })
                }
                placeholder="First Name"
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
              <input
                type="text"
                value={selectedUser.last_name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, last_name: e.target.value })
                }
                placeholder="Last Name"
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
              <input
                type="email"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
              <button
                onClick={handleEdit}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Users;