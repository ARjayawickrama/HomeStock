import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const Allusers = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null); 
  const [editedUser, setEditedUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();


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


  const handleEdit = (userId) => {
    setEditingUserId(userId);
    const userToEdit = users.find((user) => user._id === userId);
    setEditedUser({ ...userToEdit }); 
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };


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
        setEditingUserId(null); 
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
    <div className="max-w-7xl mx-auto p-6 overflow-x-auto">
      {users.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <div className="max-h-[500px] overflow-y-auto"> {/* Vertical Scroll */}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </main>
  
  );
};

export default Allusers;
