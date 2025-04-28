import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaFilePdf,
  FaShoppingCart,
  FaPlus,
  FaSearch,
  FaChartLine,
} from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

Chart.register(...registerables);

const GroceryList = () => {
  const [groceries, setGroceries] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    category: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const categories = [
    ...new Set(groceries.map((item) => item.category || "Uncategorized")),
  ];

  // Fetch groceries from backend
  useEffect(() => {
    const fetchGroceries = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/groceries");
        const itemsWithDates = res.data.map((item) => ({
          ...item,
          createdAt: item.createdAt || new Date().toISOString(),
        }));
        setGroceries(itemsWithDates);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGroceries();
  }, []);

  // Update filtered items when filters change
  useEffect(() => {
    const filtered = groceries.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "pending" && !item.completed) ||
        (activeTab === "purchased" && item.completed) ||
        activeTab === item.category;
      return matchesSearch && matchesTab;
    });
    setFilteredItems(filtered);
  }, [groceries, searchTerm, activeTab]);

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: "" }), 3000);
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.quantity) return;
    try {
      const today = new Date().toISOString().split("T")[0]; // Get only YYYY-MM-DD
      const itemWithDate = {
        ...newItem,
        completed: false,
        dateAdded: today, // Store only the date
      };
      const res = await axios.post(
        "http://localhost:5000/api/groceries",
        itemWithDate
      );
      setGroceries([res.data, ...groceries]);
      setNewItem({ name: "", quantity: "", category: "" });
      showNotification(`${newItem.name} added to grocery list`);
    } catch (err) {
      console.error(err);
    }
  };
  const updateItem = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/groceries/${itemToEdit._id}`,
        itemToEdit
      );
      setGroceries(
        groceries.map((item) => (item._id === itemToEdit._id ? res.data : item))
      );
      setIsModalOpen(false);
      setItemToEdit(null);
      showNotification(`${itemToEdit.name} updated successfully`);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name}?`
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/groceries/${id}`);
        setGroceries(groceries.filter((item) => item._id !== id));
        showNotification(`${name} removed from grocery list`);
      } catch (err) {
        console.error("Error deleting item:", err);
        showNotification("Failed to delete item. Please try again.");
      }
    }
  };

  const toggleComplete = async (id, currentStatus, name) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/groceries/${id}`, {
        completed: !currentStatus,
      });
      setGroceries(
        groceries.map((item) => (item._id === id ? res.data : item))
      );
      showNotification(
        `${name} marked as ${!currentStatus ? "purchased" : "pending"}`
      );
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (item) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  const saveEditedItem = () => {
    updateItem();
  };

  const buyItems = () => {
    showNotification("Items marked as purchased");
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();

    doc.setFillColor(40, 53, 147);
    doc.rect(0, 0, pageWidth, 20, "F");

    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("GROCERY LIST REPORT", pageWidth / 2, 13, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "italic");
    doc.text(`Report generated on: ${date} at ${time}`, margin, 30);

    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    doc.text(
      "This report provides a detailed list of all grocery items, their status, quantities, and categories.",
      margin,
      40
    );

    const headers = [
      ["#", "Status", "Item Name", "Quantity", "Category", "Date Added"],
    ];
    const data = filteredItems.map((item, index) => [
      index + 1,
      item.completed ? "✓ Purchased" : "○ Pending",
      item.name,
      item.quantity,
      item.category || "Uncategorized",
      formatDate(item.createdAt),
    ]);

    autoTable(doc, {
      startY: 50,
      head: headers,
      body: data,
      theme: "grid",
      headStyles: {
        fillColor: [40, 53, 147],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        fontSize: 10,
        textColor: [60, 60, 60],
      },
      styles: {
        cellPadding: 3,
        overflow: "linebreak",
        valign: "middle",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        1: { halign: "center", cellWidth: 20 },
        2: { cellWidth: 50 },
        3: { halign: "center", cellWidth: 20 },
        4: { cellWidth: 40 },
        5: { cellWidth: 30 },
      },
      margin: { left: margin, right: margin },
    });

    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "Generated by Grocery Management System",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );

    doc.save(`Grocery-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
    showNotification("✅ Professional PDF report generated successfully!");
  };

  const chartData = {
    itemsByCategory: {
      labels: categories,
      datasets: [
        {
          label: "Items by Category",
          data: categories.map(
            (cat) => groceries.filter((item) => item.category === cat).length
          ),
          backgroundColor: categories.map(
            (_, i) => `hsl(${(i * 360) / categories.length}, 70%, 50%)`
          ),
          borderColor: categories.map(
            (_, i) => `hsl(${(i * 360) / categories.length}, 70%, 30%)`
          ),
          borderWidth: 1,
        },
      ],
    },
    quantitiesByCategory: {
      labels: categories,
      datasets: [
        {
          label: "Total Quantity by Category",
          data: categories.map((cat) =>
            groceries
              .filter((item) => item.category === cat)
              .reduce((sum, item) => sum + parseInt(item.quantity || 0), 0)
          ),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
  };

  const inventory = groceries.filter((item) => item.quantity < 3).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {notification.show && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
          {notification.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {inventory.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-800 p-5 rounded-lg shadow-sm mb-8">
            <div className="flex items-start">
              <div className="bg-red-100 p-2 rounded-full mr-4">
                <IoMdNotificationsOutline className="text-red-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Low Stock Alert</h3>
                <p className="text-sm mb-3">
                  The following items need replenishment:
                </p>
                <div className="flex flex-wrap gap-2">
                  {inventory.map((item) => (
                    <span
                      key={item._id}
                      className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow-xs border border-red-100"
                    >
                      {item.name} (Qty: {item.quantity})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-2">Total Items</h3>
            <p className="text-3xl font-bold text-blue-600">
              {groceries.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-2">Pending</h3>
            <p className="text-3xl font-bold text-amber-500">
              {groceries.filter((item) => !item.completed).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-2">Categories</h3>
            <p className="text-3xl font-bold text-green-600">
              {categories.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Add New Item
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Item Name
              </label>
              <input
                type="text"
                placeholder="Enter item name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                placeholder="Enter quantity"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
                value={newItem.category}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 transition"
              >
                <option value="">Select Category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={addItem}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
            >
              <FaPlus className="text-lg" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                activeTab === "pending"
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab("purchased")}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                activeTab === "purchased"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Purchased
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  activeTab === cat
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <button
            onClick={generatePDF}
            className="w-full md:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium px-4 py-3 rounded-lg shadow-sm transition flex items-center justify-center space-x-2"
          >
            <FaFilePdf />
            <span>Export PDF</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-800 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-900">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Date Added
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr
                      key={item._id}
                      className={
                        item.completed ? "bg-green-50" : "hover:bg-gray-50"
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() =>
                            toggleComplete(item._id, item.completed, item.name)
                          }
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span
                            className={`font-medium ${
                              item.completed
                                ? "text-gray-500 line-through"
                                : "text-gray-900"
                            }`}
                          >
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.completed
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800">
                          {item.category || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition"
                            title="Edit"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteItem(item._id, item.name)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition"
                            title="Delete"
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No items found. Add some items to your grocery list.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Category Analytics
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FaChartLine />
                <span>Analytics</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Items by Category
                </h4>
                {categories.length > 0 ? (
                  <Bar
                    data={chartData.itemsByCategory}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0,
                            stepSize: 1,
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    No category data available
                  </div>
                )}
              </div>
              <div className="h-64">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Quantity by Category
                </h4>
                {categories.length > 0 ? (
                  <Bar
                    data={chartData.quantitiesByCategory}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0,
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    No quantity data available
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <button
                  onClick={buyItems}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium px-4 py-3 rounded-lg shadow-sm transition flex items-center justify-center space-x-2"
                >
                  <FaShoppingCart />
                  <span>Mark as Purchased</span>
                </button>
                <button
                  onClick={generatePDF}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium px-4 py-3 rounded-lg shadow-sm transition flex items-center justify-center space-x-2"
                >
                  <FaFilePdf />
                  <span>Export as PDF</span>
                </button>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Summary
                </h4>
                <p className="text-xs text-blue-600">
                  {groceries.filter((item) => !item.completed).length} pending
                  items
                  <br />
                  {groceries.filter((item) => item.completed).length} purchased
                  items
                  <br />
                  Total: {groceries.length} items
                </p>
              </div>
            </div>
          </div>
        </div>

        {isModalOpen && itemToEdit && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Edit Item
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={itemToEdit.name}
                      onChange={(e) =>
                        setItemToEdit({ ...itemToEdit, name: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={itemToEdit.quantity}
                      onChange={(e) =>
                        setItemToEdit({
                          ...itemToEdit,
                          quantity: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={itemToEdit.category}
                      onChange={(e) =>
                        setItemToEdit({
                          ...itemToEdit,
                          category: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEditedItem}
                    className="px-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroceryList;
