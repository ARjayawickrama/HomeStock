import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaSort, FaFileExport } from "react-icons/fa";
import { RiCalendarTodoFill } from "react-icons/ri";
import axios from "axios";

const Inventory = () => {
  // All your existing state declarations remain exactly the same
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

  // All your existing useEffect hooks remain exactly the same
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

  // All your existing handler functions remain exactly the same
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
      if (!newItem.itemNumber.trim()) {
        setWarning("Item Number is required.");
        setTimeout(() => setWarning(""), 3000);
        return;
      }

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
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
              <p className="text-gray-600 mt-1">Manage your inventory items efficiently</p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="relative flex items-center bg-blue-50 rounded-lg px-3 py-2">
                <RiCalendarTodoFill className="text-blue-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search items..."
                className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
              <button
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                onClick={toggleForm}
              >
                {showForm ? <FaTimes /> : <FaPlus />}
                {showForm ? "Close Form" : "Add Item"}
              </button>
              
              <button
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors duration-200"
                onClick={toggleSortOrder}
              >
                <FaSort />
                {sortOrder === "asc" ? "Oldest First" : "Newest First"}
              </button>
              
              <button
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                onClick={toggleLowStockModal}
              >
                Low Stock
              </button>
              
              <button
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <FaFileExport />
                Export
              </button>
            </div>
          </div>

          {warning && (
            <div className={`mb-6 p-3 rounded-lg text-center ${
              warning.includes("success") 
                ? "bg-green-100 text-green-800 border border-green-200" 
                : "bg-red-100 text-red-800 border border-red-200"
            }`}>
              {warning}
            </div>
          )}

          {showForm && (
            <div className="bg-blue-50 p-6 rounded-xl mb-6 border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editItem ? "Edit Item" : "Add New Item"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Number*
                    </label>
                    <select
                      name="itemNumber"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      value={newItem.itemNumber}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Item Number</option>
                      {barcodeOptions.slice(0, 1).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name*
                    </label>
                    <select
                      name="name"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category*
                    </label>
                    <select
                      name="category"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity*
                    </label>
                    <select
                      name="quantity"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manufacture Date
                    </label>
                    <input
                      type="date"
                      name="manufactureDate"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      value={newItem.manufactureDate}
                      onChange={handleInputChange}
                      max={getCurrentDate()}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date*
                    </label>
                    <div className="flex gap-3">
                      <select
                        name="expiryDate"
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={newItem.expiryDate}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select from scanned dates</option>
                        {expiryDateOptions.slice(0, 1).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <span className="self-center text-gray-500">or</span>
                      <input
                        type="date"
                        name="expiryDateManual"
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={newItem.expiryDate}
                        onChange={handleInputChange}
                        min={getCurrentDate()}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temperature
                    </label>
                    <select
                      name="temperature"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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

                  <div className="pt-2">
                    <button
                      type="button"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                      onClick={handleAddItem}
                    >
                      {editItem ? "Update Item" : "Add Item"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showLowStockModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center border-b border-gray-200 p-4">
                  <h3 className="text-xl font-semibold text-gray-800">Low Stock Items</h3>
                  <button
                    onClick={toggleLowStockModal}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
                  {lowStockItems.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {lowStockItems.map((item) => (
                        <li key={item._id} className="py-3">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium text-gray-800">{item.name}</p>
                              <p className="text-sm text-gray-600">{item.category}</p>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                                {item.quantity} left
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                Expires: {item.expiryDate.split("T")[0]}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No low stock items found</p>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-200 p-4 flex justify-end">
                  <button
                    onClick={toggleLowStockModal}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mfg Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedItems.length > 0 ? (
                  sortedItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.itemNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.category}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        item.quantity < 5 ? "text-red-600" : "text-gray-900"
                      }`}>
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.manufactureDate.split("T")[0]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.expiryDate.split("T")[0]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.temperature}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                      No items found. Try adjusting your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Inventory;