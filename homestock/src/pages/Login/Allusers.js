import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Allusers = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null); // Track which user is being edited
  const [editedUser, setEditedUser] = useState(null); // To store the changes made to the user
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
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  // Handle Edit user - Set the user being edited
  const handleEdit = (userId) => {
    setEditingUserId(userId);
    const userToEdit = users.find((user) => user._id === userId);
    setEditedUser({ ...userToEdit }); // Create a copy of the user to be edited
  };

  // Handle input change in edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  // Handle submit form to update user
  const handleEditSubmit = (e, userId) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/user/${userId}`, editedUser)
      .then((response) => {
        console.log("User updated:", response);
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, ...editedUser } : user
          )
        );
        setEditingUserId(null); // Stop editing
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
                  <td className="py-3 px-6">
                    {editingUserId === user._id ? (
                      <input
                        type="text"
                        name="name"
                        value={editedUser.name}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="py-3 px-6">
                    {editingUserId === user._id ? (
                      <input
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="py-3 px-6">
                    {editingUserId === user._id ? (
                      <input
                        type="text"
                        name="phone"
                        value={editedUser.phone}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                    ) : (
                      user.phone
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {editingUserId === user._id ? (
                      <div className="flex gap-2">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                          onClick={(e) => handleEditSubmit(e, user._id)}
                        >
                          Update
                        </button>
                        <button
                          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                          onClick={() => setEditingUserId(null)} // Cancel editing
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
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
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
};

export default Allusers;
