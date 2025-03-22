import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import axios from "axios";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    itemNumber: "",
    name: "",
    category: "",
    quantity: "",
    manufactureDate: "",
    expiryDate: "",
    temperature: "",
    status: "Available",
  });
  const [editItem, setEditItem] = useState(null);
  const [warning, setWarning] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // For sorting
  const [showLowStockModal, setShowLowStockModal] = useState(false); // For low stock modal
  const [lowStockItems, setLowStockItems] = useState([]); // For low stock items

  // Fetch inventory data on mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/inventory");
        setItems(response.data);
        setLowStockItems(response.data.filter(item => item.quantity < 5)); // Filter low stock items
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  // Toggle the form visibility and reset the form if necessary
  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setNewItem({
        itemNumber: "",
        name: "",
        category: "",
        quantity: "",
        manufactureDate: "",
        expiryDate: "",
        temperature: "",
        status: "Available",
      });
    }
  };

  // Toggle the sort order between ascending and descending
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  // Handle adding or updating an item
  const handleAddItem = async () => {
    try {
      if (editItem && editItem._id) {
        // Update existing item
        await axios.put(
          `http://localhost:5000/api/inventory/${editItem._id}`,
          newItem
        );
        setWarning("Item updated successfully!");
      } else {
        // Add new item
        await axios.post("http://localhost:5000/api/inventory", newItem);
        setWarning("Item added successfully!");
      }

      setShowForm(false);
      resetForm();
      // Refetch inventory data
      const response = await axios.get("http://localhost:5000/api/inventory");
      setItems(response.data);
    } catch (error) {
      console.error(error);
      setWarning("An error occurred while adding or updating the item.");
    }
  };

  // Handle editing an item
  const handleEditItem = (item) => {
    setEditItem(item);
    setNewItem(item); // Pre-fill form with selected item
    setShowForm(true); // Show form for editing
  };

  // Handle deleting an item
  const handleDeleteItem = async (id) => {
    try {
      if (!id) {
        console.error("Item ID is missing");
        return;
      }
      await axios.delete(`http://localhost:5000/api/inventory/${id}`);
      // Refetch inventory data after delete
      const response = await axios.get("http://localhost:5000/api/inventory");
      setItems(response.data);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Filter items based on the search input
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sort items by expiry date
  const sortedItems = [...filteredItems].sort((a, b) => {
    const dateA = new Date(a.expiryDate);
    const dateB = new Date(b.expiryDate);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Reset the form to its initial state
  const resetForm = () => {
    setNewItem({
      itemNumber: "",
      name: "",
      category: "",
      quantity: "",
      manufactureDate: "",
      expiryDate: "",
      temperature: "",
      status: "Available",
    });
    setEditItem(null);
  };

  // Toggle low stock modal visibility
  const toggleLowStockModal = () => {
    setShowLowStockModal(!showLowStockModal);
  };

  return (
    <main className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>

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
        <div className="flex gap-4">
          <button
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={toggleForm}
          >
            {showForm ? <FaTimes /> : <FaPlus />}{" "}
            {showForm ? "Close Form" : "Add Item"}
          </button>
          <button
            className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
            onClick={toggleSortOrder}
          >
            Sort by Expiry Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            onClick={toggleLowStockModal}
          >
            Low Stock Items
          </button>
        </div>
      </div>

      {warning && (
        <div className="bg-red-500 text-white text-center p-2 mb-4 animate-pulse">
          {warning}
        </div>
      )}

      {showForm && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h2 className="text-lg font-semibold mb-2">
            {editItem ? "Edit Item" : "Add New Item"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="itemNumber"
              className="p-2 border rounded"
              value={newItem.itemNumber}
              onChange={handleInputChange}
              placeholder="Item Number"
            />
            <select
              name="name"
              className="p-2 border rounded"
              value={newItem.name}
              onChange={handleInputChange}
            >
              <option value="">Select Item</option>
              <option value="Milk">Milk</option>
              <option value="Eggs">Eggs</option>
              <option value="Bread">Bread</option>
              <option value="Cheese">Cheese</option>
            </select>
            <select
              name="category"
              className="p-2 border rounded"
              value={newItem.category}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              <option value="Dairy">Dairy</option>
              <option value="Bakery">Bakery</option>
              <option value="Frozen">Frozen</option>
              <option value="Beverages">Beverages</option>
            </select>
            <select
              name="quantity"
              className="p-2 border rounded"
              value={newItem.quantity}
              onChange={handleInputChange}
            >
              <option value="">Select Quantity</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
            <input
              type="date"
              name="manufactureDate"
              className="p-2 border rounded"
              value={newItem.manufactureDate}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="expiryDate"
              className="p-2 border rounded"
              value={newItem.expiryDate}
              onChange={handleInputChange}
            />
            <select
              name="temperature"
              className="p-2 border rounded"
              value={newItem.temperature}
              onChange={handleInputChange}
            >
              <option value="">Select Storage Temperature</option>
              <option value="Frozen (-18°C)">Frozen (-18°C)</option>
              <option value="Refrigerated (0-4°C)">Refrigerated (0-4°C)</option>
              <option value="Ambient">Ambient</option>
            </select>
            <button
              type="button"
              className="w-full py-2 bg-blue-600 text-white rounded-lg"
              onClick={handleAddItem}
            >
              {editItem ? "Update Item" : "Add Item"}
            </button>
          </div>
        </div>
      )}

      {/* Low Stock Modal */}
      {showLowStockModal && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Low Stock Items</h3>
            <ul>
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item) => (
                  <li key={item._id}>
                    <p>{item.name} - {item.quantity} left</p>
                  </li>
                ))
              ) : (
                <li>No low stock items</li>
              )}
            </ul>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              onClick={toggleLowStockModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Display sorted items in table */}
      <table className="w-full table-auto mt-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Item Number</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Quantity</th>
            <th className="px-4 py-2 text-left">Expiry Date</th>
            <th className="px-4 py-2 text-left">Temperature</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.length > 0 ? (
            sortedItems.map((item) => (
              <tr key={item._id}>
                <td className="px-4 py-2">{item.itemNumber}</td>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.category}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">{item.expiryDate}</td>
                <td className="px-4 py-2">{item.temperature}</td>
                <td className="px-4 py-2">{item.status}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="text-yellow-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center p-4">
                No items found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
};

export default Inventory;
