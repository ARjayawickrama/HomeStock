import React, { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [warning, setWarning] = useState(""); // For storing warning message
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    manufactureDate: "",
    expiryDate: "",
    temperature: "",
    status: "Available",
  });
  const [sortOrder, setSortOrder] = useState("asc"); // Added state to manage sorting order
  const [showLowStockModal, setShowLowStockModal] = useState(false); // State to control modal visibility

  const temperatureRanges = {
    Milk: "Refrigerated (0-4°C)",
    Eggs: "Cool (10-15°C)",
    Bread: "Room Temperature (15-25°C)",
    Cheese: "Refrigerated (0-4°C)",
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const toggleLowStockModal = () => {
    setShowLowStockModal(!showLowStockModal);
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
    let validationErrors = {};
    let temperatureAlert = "";

    // Validate Item Name
    if (!newItem.name) {
      validationErrors.name = "Item name is required";
    }

    // Validate Category
    if (!newItem.category) {
      validationErrors.category = "Category is required";
    }

    // Validate Quantity
    if (!newItem.quantity) {
      validationErrors.quantity = "Quantity is required";
    } else if (isNaN(newItem.quantity) || newItem.quantity <= 0) {
      validationErrors.quantity = "Quantity must be a positive number";
    }

    // Validate Manufacture Date
    if (!newItem.manufactureDate) {
      validationErrors.manufactureDate = "Manufacture date is required";
    }

    // Validate Expiry Date
    if (!newItem.expiryDate) {
      validationErrors.expiryDate = "Expiry date is required";
    } else if (new Date(newItem.expiryDate) <= new Date(newItem.manufactureDate)) {
      validationErrors.expiryDate = "Expiry date must be after manufacture date";
    }

    // Validate Temperature
    if (!newItem.temperature) {
      validationErrors.temperature = "Temperature selection is required";
    } else {
      // Check if the temperature is correct for the item
      const expectedTemperature = temperatureRanges[newItem.name];
      if (newItem.temperature !== expectedTemperature) {
        temperatureAlert = `Warning: ${newItem.name} should be stored at ${expectedTemperature}.`;
      }
    }

    // If validation fails, set errors and return
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // If temperature is not correct, set the warning
    if (temperatureAlert) {
      setWarning(temperatureAlert); // Set warning to be displayed
    } else {
      setWarning(""); // Clear warning if temperature is correct
    }

    // If all validations pass, proceed with adding the item
    const newItemData = {
      ...newItem,
      id: items.length + 1,
      quantity: parseInt(newItem.quantity),
      status: newItem.quantity < 10 ? "Low Stock" : "Available",
    };

    setItems([...items, newItemData]);
    setNewItem({ name: "", category: "", quantity: "", manufactureDate: "", expiryDate: "", temperature: "", status: "Available" });
    setShowForm(false);
    setErrors({});
  };

  // Sort items based on expiry date
  const sortItems = () => {
    const sortedItems = [...items].sort((a, b) => {
      const expiryA = new Date(a.expiryDate);
      const expiryB = new Date(b.expiryDate);

      if (sortOrder === "asc") {
        return expiryA - expiryB; // Ascending order
      } else {
        return expiryB - expiryA; // Descending order
      }
    });

    return sortedItems;
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle between ascending and descending
  };

  // Filter for low stock items
  const lowStockItems = items.filter((item) => item.status === "Low Stock");

  return (
    <main className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">HomeStock</h1>

      {/* Search, Add Button */}
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
            {showForm ? <FaTimes /> : <FaPlus />} {showForm ? "Close Form" : "Add Item"}
          </button>
          {/* Low Stock Button */}
          <button
            className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            onClick={toggleLowStockModal}
          >
            Low Stock Items
          </button>
        </div>
      </div>

      {/* Display Warning Message */}
      {warning && (
        <div className="bg-red-500 text-white text-center p-2 mb-4 animate-pulse">
          {warning}
        </div>
      )}

      {/* Add Item Form */}
      {showForm && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h2 className="text-lg font-semibold mb-2">Add New Item</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Select Item Name */}
            <select name="name" className="p-2 border rounded" value={newItem.name} onChange={handleInputChange}>
              <option value="">Select Item</option>
              <option value="Milk">Milk</option>
              <option value="Eggs">Eggs</option>
              <option value="Bread">Bread</option>
              <option value="Cheese">Cheese</option>
            </select>
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

            {/* Select Category */}
            <select name="category" className="p-2 border rounded" value={newItem.category} onChange={handleInputChange}>
              <option value="">Select Category</option>
              <option value="Dairy">Dairy</option>
              <option value="Bakery">Bakery</option>
              <option value="Frozen">Frozen</option>
              <option value="Beverages">Beverages</option>
            </select>
            {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}

            {/* Select Quantity */}
            <select name="quantity" className="p-2 border rounded" value={newItem.quantity} onChange={handleInputChange}>
              <option value="">Select Quantity</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}

            {/* Manufacture & Expiry Dates */}
            <input type="date" name="manufactureDate" className="p-2 border rounded" value={newItem.manufactureDate} onChange={handleInputChange} />
            <input type="date" name="expiryDate" className="p-2 border rounded" value={newItem.expiryDate} onChange={handleInputChange} />
            {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}

            {/* Temperature Selection */}
            <select name="temperature" className="p-2 border rounded" value={newItem.temperature} onChange={handleInputChange}>
              <option value="">Select Storage Temperature</option>
              <option value="Frozen (-18°C)">Frozen (-18°C)</option>
              <option value="Refrigerated (0-4°C)">Refrigerated (0-4°C)</option>
              <option value="Cool (10-15°C)">Cool (10-15°C)</option>
              <option value="Room Temperature (15-25°C)">Room Temperature (15-25°C)</option>
              <option value="Warm (25-40°C)">Warm (25-40°C)</option>
            </select>
          </div>

          <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={handleAddItem}>
            Add Item
          </button>
        </div>
      )}

      {/* Sort Button */}
      <div className="mb-4 flex justify-end">
        <button
          className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
          onClick={toggleSortOrder}
        >
          Sort by Expiry Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </button>
      </div>

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
            {sortItems()
              .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
              .map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">{item.manufactureDate}</td>
                  <td className="p-2">{item.expiryDate}</td>
                  <td className="p-2">{item.temperature}</td>
                  <td className="p-2">{item.status}</td>
                  <td className="p-2">
                    <button className="text-blue-500">
                      <FaEdit />
                    </button>
                    <button className="text-red-500 ml-2">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Low Stock Modal */}
      {showLowStockModal && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Low Stock Items</h3>
            <ul>
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item) => (
                  <li key={item.id}>
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
    </main>
  );
};

export default Inventory;
