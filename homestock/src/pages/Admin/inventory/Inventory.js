import React, { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    manufactureDate: "",
    expiryDate: "",
    temperature: "",
    status: "Available",
  });

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = `${name} is required.`;
    } else if (name === "quantity" && value <= 0) {
      error = "Quantity must be greater than 0.";
    } else if (name === "expiryDate" && newItem.manufactureDate && newItem.manufactureDate > value) {
      error = "Expiry Date must be later than Manufacture Date.";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
    validateField(name, value);
  };

  const handleAddItem = () => {
    if (Object.values(errors).some((error) => error) || Object.values(newItem).some((value) => !value)) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    const newItemData = {
      ...newItem,
      id: items.length + 1,
      quantity: parseInt(newItem.quantity),
      status: newItem.quantity < 10 ? "Low Stock" : "Available",
    };

    setItems([...items, newItemData]);
    setNewItem({ name: "", category: "", quantity: "", manufactureDate: "", expiryDate: "", temperature: "", status: "Available" });
    setShowForm(false);
  };

  return (
    <main className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>

      {/* Search & Add Button */}
      <div className="flex justify-between mb-4">
        <div className="relative w-2/3">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={toggleForm}
        >
          {showForm ? <FaTimes /> : <FaPlus />} {showForm ? "Close Form" : "Add Item"}
        </button>
      </div>

      {/* Add Item Form */}
      {showForm && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h2 className="text-lg font-semibold mb-2">Add New Item</h2>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Item Name" className="p-2 border rounded" value={newItem.name} onChange={handleInputChange} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            <input type="text" name="category" placeholder="Category" className="p-2 border rounded" value={newItem.category} onChange={handleInputChange} />
            {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            <input type="number" name="quantity" placeholder="Quantity" className="p-2 border rounded" value={newItem.quantity} onChange={handleInputChange} />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
            <input type="date" name="manufactureDate" className="p-2 border rounded" value={newItem.manufactureDate} onChange={handleInputChange} />
            <input type="date" name="expiryDate" className="p-2 border rounded" value={newItem.expiryDate} onChange={handleInputChange} />
            {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
            <input type="text" name="temperature" placeholder="Temperature" className="p-2 border rounded" value={newItem.temperature} onChange={handleInputChange} />
          </div>
          <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={handleAddItem}>
            Add Item
          </button>
        </div>
      )}

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Item Name</th>
              <th className="p-2">Category</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Manufacture Date</th>
              <th className="p-2">Expiry Date</th>
              <th className="p-2">Temperature</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())).map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.category}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">{item.manufactureDate || "N/A"}</td>
                <td className="p-2 text-red-500">{item.expiryDate || "N/A"}</td>
                <td className="p-2">{item.temperature || "N/A"}</td>
                <td className={`p-2 ${item.status === "Low Stock" ? "text-red-500" : "text-green-500"}`}>{item.status}</td>
                <td className="p-2 flex gap-2">
                  <button className="text-yellow-500 hover:text-yellow-700"><FaEdit /></button>
                  <button className="text-red-500 hover:text-red-700"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Inventory;
