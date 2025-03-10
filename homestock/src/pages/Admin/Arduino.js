import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null); // To hold the user being edited
  const [loading, setLoading] = useState(true); // To handle loading state
  const navigate = useNavigate(); // Initialize navigate

  // Fetch all users when the component is mounted
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user")
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data && data.users) {
          setUsers(data.users);
        } else {
          console.error("Unexpected data format:", data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  // Delete user
  const handleDelete = (userId) => {
    axios
      .delete(`http://localhost:5000/api/user/${userId}`)
      .then((response) => {
        console.log("User deleted:", response);
        setUsers(users.filter((user) => user._id !== userId));
        navigate("/user-list"); // Navigate back to UserList after deletion
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  // Handle Edit user - Show the Edit Form
  const handleEdit = (userId) => {
    const userToEdit = users.find((user) => user._id === userId);
    if (userToEdit) {
      setEditUser(userToEdit); // Set the user to be edited
      navigate(`/edit-user/${userId}`); // Navigate to the edit page
    }
  };

  // Handle input change in edit form
  const handleEditChange = (e) => {
    setEditUser({
      ...editUser,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit form to update user
  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/user/${editUser._id}`, editUser)
      .then((response) => {
        console.log("User updated:", response);
        setUsers(
          users.map((user) =>
            user._id === editUser._id ? { ...user, ...editUser } : user
          )
        );
        setEditUser(null); // Close the edit form
        navigate("/user-list"); // Navigate back to UserList after update
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <main className="bg-white p-4 rounded-lg">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8">User List</h1>
        {users.length === 0 ? (
          <p className="text-center text-gray-500">No users found.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-100">
                  <td className="py-3 px-6">{user.name}</td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6">{user.phone}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600"
                      onClick={() => handleEdit(user._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Edit User Form */}
        {editUser && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
              <h2 className="text-2xl font-bold mb-4">Edit User</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editUser.name}
                    onChange={handleEditChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editUser.email}
                    onChange={handleEditChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editUser.phone}
                    onChange={handleEditChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                    onClick={() => setEditUser(null)} // Close the edit form
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default UserList;
