import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import axios from "axios";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [barcodeOptions, setBarcodeOptions] = useState([]);
  const [expiryDateOptions, setExpiryDateOptions] = useState([]);
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
  const [sortOrder, setSortOrder] = useState("asc");
  const [showLowStockModal, setShowLowStockModal] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/inventory");
        setItems(response.data);
        setLowStockItems(
          response.data.filter((item) => Number(item.quantity) < 5)
        );
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    const fetchBarcodes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/barcodes");
        setBarcodeOptions(
          response.data.barcodes.map((barcode) => ({
            value: barcode.code,
            label: barcode.code,
          }))
        );

        const uniqueExpiryDates = new Set();
        response.data.barcodes.forEach((barcode) => {
          const cleanedBarcode = barcode.code.replace(/[^0-9]/g, "");
          if (cleanedBarcode.length >= 10) {
            const day = cleanedBarcode.slice(4, 6);
            const month = cleanedBarcode.slice(2, 4);
            const year = cleanedBarcode.slice(6, 10);
            uniqueExpiryDates.add(`${year}-${month}-${day}`);
          }
        });
        setExpiryDateOptions(
          Array.from(uniqueExpiryDates).map((date) => ({
            value: date,
            label: date,
          }))
        );
      } catch (error) {
        console.error("Error fetching barcodes:", error);
      }
    };

    fetchItems();
    fetchBarcodes();
  }, []);

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
      setEditItem(null);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleAddItem = async () => {
    try {
      // Check if itemNumber is empty
      if (!newItem.itemNumber.trim()) {
        setWarning("Item Number is required.");
        setTimeout(() => setWarning(""), 3000);
        return;
      }

      // Check if all required fields are filled
      if (!newItem.name || !newItem.category || !newItem.quantity) {
        setWarning("Please fill all required fields.");
        setTimeout(() => setWarning(""), 3000);
        return;
      }

      if (editItem && editItem._id) {
        await axios.put(
          `http://localhost:5000/api/inventory/${editItem._id}`,
          newItem
        );
        setWarning("Item updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/inventory", newItem);
        setWarning("Item added successfully!");
      }

      setTimeout(() => setWarning(""), 3000);
      setShowForm(false);
      resetForm();

      // Refresh the items list
      const response = await axios.get("http://localhost:5000/api/inventory");
      setItems(response.data);
      setLowStockItems(
        response.data.filter((item) => Number(item.quantity) < 5)
      );
    } catch (error) {
      console.error("Error:", error);
      setWarning(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      setTimeout(() => setWarning(""), 3000);
    }
  };

  const handleEditItem = (item) => {
    setEditItem(item);
    setNewItem({
      ...item,
      // Ensure dates are in the correct format for the date inputs
      manufactureDate: item.manufactureDate.split("T")[0],
      expiryDate: item.expiryDate.split("T")[0],
    });
    setShowForm(true);
  };

  const handleDeleteItem = async (id) => {
    try {
      if (!id) {
        console.error("Item ID is missing");
        return;
      }
      await axios.delete(`http://localhost:5000/api/inventory/${id}`);
      const response = await axios.get("http://localhost:5000/api/inventory");
      setItems(response.data);
      setLowStockItems(
        response.data.filter((item) => Number(item.quantity) < 5)
      );
    } catch (error) {
      console.error("Error deleting item:", error);
      setWarning("Error deleting item. Please try again.");
      setTimeout(() => setWarning(""), 3000);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    const dateA = new Date(a.expiryDate);
    const dateB = new Date(b.expiryDate);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

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

  const toggleLowStockModal = () => {
    setShowLowStockModal(!showLowStockModal);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <main className="bg-white p-6 rounded-lg shadow-lg w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>

      <div className="flex justify-between mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search items..."
            className="w-[260px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4 text-sm font-semibold">
          <button
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={toggleForm}
          >
            {showForm ? <FaTimes /> : <FaPlus />}
            {showForm ? "Close Form" : "Add Item"}
          </button>
          <button
            className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
            onClick={toggleSortOrder}
          >
            Sort by Expiry Date (
            {sortOrder === "asc" ? "Ascending" : "Descending"})
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            onClick={toggleLowStockModal}
          >
            Low Stock Items
          </button>
          <button
            className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
            onClick={toggleSortOrder}
          >
            Export PDF
          </button>
        </div>
      </div>

      {warning && (
        <div
          className={`text-center p-2 mb-4 ${
            warning.includes("success") ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {warning}
        </div>
      )}

      {showForm && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h2 className="text-lg font-semibold mb-2">
            {editItem ? "Edit Item" : "Add New Item"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Item Number*
              </label>
              <select
                name="itemNumber"
                className="w-full p-2 border rounded"
                value={newItem.itemNumber}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Item Number</option>
                {barcodeOptions.slice(0, 1).map(
                  (
                    option // Only shows first 5 options
                  ) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Name*</label>
              <select
                name="name"
                className="w-full p-2 border rounded"
                value={newItem.name}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Item</option>
                <option value="Milk">Milk</option>
                <option value="Eggs">Eggs</option>
                <option value="Bread">Bread</option>
                <option value="Cheese">Cheese</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Category*
              </label>
              <select
                name="category"
                className="w-full p-2 border rounded"
                value={newItem.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Dairy">Dairy</option>
                <option value="Bakery">Bakery</option>
                <option value="Frozen">Frozen</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Quantity*
              </label>
              <select
                name="quantity"
                className="w-full p-2 border rounded"
                value={newItem.quantity}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Quantity</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Manufacture Date
              </label>
              <input
                type="date"
                name="manufactureDate"
                className="w-full p-2 border rounded"
                value={newItem.manufactureDate}
                onChange={handleInputChange}
                max={getCurrentDate()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Expiry Date*
              </label>
              <div className="flex gap-2">
                <select
                  name="expiryDate"
                  className="flex-1 p-2 border rounded"
                  value={newItem.expiryDate}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select from scanned dates</option>
                  {expiryDateOptions.slice(0, 1).map(
                    (
                      option // Only show first 3 options
                    ) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    )
                  )}
                </select>
                <span className="self-center">or</span>
                <input
                  type="date"
                  name="expiryDateManual"
                  className="flex-1 p-2 border rounded"
                  value={newItem.expiryDate}
                  onChange={handleInputChange}
                  min={getCurrentDate()}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Temperature
              </label>
              <select
                name="temperature"
                className="w-full p-2 border rounded"
                value={newItem.temperature}
                onChange={handleInputChange}
              >
                <option value="">Select Storage Temperature</option>
                <option value="Frozen (-18°C)">Frozen (-18°C)</option>
                <option value="Refrigerated (0-4°C)">
                  Refrigerated (0-4°C)
                </option>
                <option value="Ambient">Ambient</option>
              </select>
            </div>

            <div className="col-span-2">
              <button
                type="button"
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleAddItem}
              >
                {editItem ? "Update Item" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLowStockModal && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Low Stock Items</h3>
              <button
                onClick={toggleLowStockModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            {lowStockItems.length > 0 ? (
              <ul className="divide-y">
                {lowStockItems.map((item) => (
                  <li key={item._id} className="py-2">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} | Category: {item.category}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No low stock items</p>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-auto mt-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Item Number</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Manufacture Date</th>
              <th className="px-4 py-2 text-left">Expiry Date</th>
              <th className="px-4 py-2 text-left">Temperature</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{item.itemNumber}</td>
                  <td className="px-4 py-2 border">{item.name}</td>
                  <td className="px-4 py-2 border">{item.category}</td>
                  <td
                    className={`px-4 py-2 border ${
                      item.quantity < 5 ? "text-red-600 font-bold" : ""
                    }`}
                  >
                    {item.quantity}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.manufactureDate.split("T")[0]}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.expiryDate.split("T")[0]}
                  </td>
                  <td className="px-4 py-2 border">{item.temperature}</td>
                  <td className="px-4 py-2 border">{item.status}</td>
                  <td className="px-4 py-2 border flex gap-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center p-4 border">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Inventory;
