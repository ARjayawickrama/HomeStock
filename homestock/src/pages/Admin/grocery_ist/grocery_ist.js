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
import Notification from "../grocery_ist/Notification";
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

  // Professional color palette
  const colors = {
    primary: {
      main: "#4F46E5", // Indigo
      light: "#6366F1",
      dark: "#4338CA",
    },
    secondary: {
      main: "#10B981", // Emerald
      light: "#34D399",
      dark: "#059669",
    },
    accent: {
      main: "#F59E0B", // Amber
      light: "#FBBF24",
      dark: "#D97706",
    },
    danger: {
      main: "#EF4444", // Red
      light: "#F87171",
      dark: "#DC2626",
    },
    background: {
      light: "#F9FAFB", // Gray 50
      dark: "#1F2937", // Gray 800
    },
    text: {
      primary: "#111827", // Gray 900
      secondary: "#6B7280", // Gray 500
      light: "#F3F4F6", // Gray 100
    },
    status: {
      pending: "#F59E0B", // Amber 500
      purchased: "#10B981", // Emerald 500
      completed: "#6B7280", // Gray 500
    },
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
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

  const handleLowStockItemClick = (itemName) => {
    setNewItem((prev) => ({
      ...prev,
      name: itemName,
      quantity: "1", // Default quantity
    }));

    // Scroll to the form
    document
      .getElementById("grocery-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.quantity) return;
    try {
      const today = new Date().toISOString().split("T")[0];
      const itemWithDate = {
        ...newItem,
        completed: false,
        dateAdded: today,
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

  const toggleComplete = async (id, currentStatus, itemName) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/groceries/${id}`, {
        completed: !currentStatus,
      });
      setGroceries(
        groceries.map((item) => (item._id === id ? res.data : item))
      );
      showNotification(
        `${itemName} marked as ${!currentStatus ? "purchased" : "pending"}`
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id, itemName) => {
    if (window.confirm(`Are you sure you want to delete ${itemName}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/groceries/${id}`);
        setGroceries(groceries.filter((item) => item._id !== id));
        showNotification(`${itemName} deleted from grocery list`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openEditModal = (item) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  const saveEditedItem = async () => {
    if (!itemToEdit.name || !itemToEdit.quantity) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/groceries/${itemToEdit._id}`,
        itemToEdit
      );
      setGroceries(
        groceries.map((item) => (item._id === itemToEdit._id ? res.data : item))
      );
      setIsModalOpen(false);
      showNotification(`${itemToEdit.name} updated successfully`);
    } catch (err) {
      console.error(err);
    }
  };

  const buyItems = async () => {
    const pendingItems = groceries.filter((item) => !item.completed);
    if (pendingItems.length === 0) {
      showNotification("No pending items to mark as purchased");
      return;
    }

    try {
      await Promise.all(
        pendingItems.map((item) =>
          axios.put(`http://localhost:5000/api/groceries/${item._id}`, {
            completed: true,
          })
        )
      );
      const updatedGroceries = await axios.get(
        "http://localhost:5000/api/groceries"
      );
      setGroceries(updatedGroceries.data);
      showNotification(
        `Marked ${pendingItems.length} items as purchased successfully`
      );
    } catch (err) {
      console.error(err);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // Title
    doc.setFontSize(20);
    doc.text("Grocery List", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Generated on: ${date}`, 105, 22, { align: "center" });

    // Table data
    const tableData = filteredItems.map((item) => [
      item.completed ? "✓" : "",
      item.name,
      item.quantity,
      item.category || "Uncategorized",
      formatDate(item.createdAt),
    ]);

    // Table
    autoTable(doc, {
      head: [["Status", "Item", "Quantity", "Category", "Date Added"]],
      body: tableData,
      startY: 30,
      styles: {
        halign: "center",
      },
      headStyles: {
        fillColor: [79, 70, 229], // Indigo 600
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251], // Gray 50
      },
    });

    // Summary
    const pendingCount = groceries.filter((item) => !item.completed).length;
    const purchasedCount = groceries.filter((item) => item.completed).length;
    const summaryY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.setTextColor(79, 70, 229); // Indigo 600
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 14, summaryY);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Pending items: ${pendingCount}`, 14, summaryY + 7);
    doc.text(`Purchased items: ${purchasedCount}`, 14, summaryY + 14);
    doc.text(`Total items: ${groceries.length}`, 14, summaryY + 21);

    doc.save(`grocery-list-${date}.pdf`);
  };

  // Chart data with new color scheme
  const chartData = {
    itemsByCategory: {
      labels: categories,
      datasets: [
        {
          label: "Items",
          data: categories.map(
            (cat) =>
              groceries.filter(
                (item) => (item.category || "Uncategorized") === cat
              ).length
          ),
          backgroundColor: `${colors.primary.main}80`, // 50% opacity
          borderColor: colors.primary.main,
          borderWidth: 1,
        },
      ],
    },
    quantitiesByCategory: {
      labels: categories,
      datasets: [
        {
          label: "Quantities",
          data: categories.map((cat) =>
            groceries
              .filter((item) => (item.category || "Uncategorized") === cat)
              .reduce((sum, item) => sum + parseInt(item.quantity || 0), 0)
          ),
          backgroundColor: `${colors.secondary.main}80`, // 50% opacity
          borderColor: colors.secondary.main,
          borderWidth: 1,
        },
      ],
    },
  };

  return (
    <div className="min-h-screen p-6 mt-11 bg-gray-50">
      <Notification onLowStockItemClick={handleLowStockItemClick} />

      {notification.show && (
        <div
          className="fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 text-white font-medium"
          style={{ backgroundColor: colors.secondary.main }}
        >
          {notification.message}
        </div>
      )}

      <div
        id="grocery-form"
        className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8"
        style={{
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        <h2
          className="text-2xl font-semibold mb-5 text-center"
          style={{ color: colors.primary.dark }}
        >
          Add New Item
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: colors.text.primary }}
            >
              Item Name
            </label>
            <input
              type="text"
              placeholder="Enter item name"
              value={newItem.name}
              onChange={(e) => {
                // Remove any numbers or special characters using regex
                const filteredValue = e.target.value.replace(
                  /[^a-zA-Z\s]/g,
                  ""
                );
                setNewItem({ ...newItem, name: filteredValue });
              }}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all"
              style={{
                borderColor: colors.text.secondary,
                focusBorderColor: colors.primary.main,
                focusRingColor: colors.primary.light,
              }}
              onKeyPress={(e) => {
                // Prevent typing invalid characters in the first place
                if (!/[a-zA-Z\s]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              pattern="[a-zA-Z\s]*" // HTML5 pattern validation as fallback
            />
            {newItem.name && /[^a-zA-Z\s]/.test(newItem.name) && (
              <p className="mt-1 text-sm text-red-500">
                Only letters and spaces are allowed
              </p>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: colors.text.primary }}
            >
              Quantity
            </label>
            <input
              type="number"
              placeholder="Qty"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all"
              style={{
                borderColor: colors.text.secondary,
                focusBorderColor: colors.primary.main,
                focusRingColor: colors.primary.light,
              }}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: colors.text.primary }}
            >
              Category
            </label>
            <select
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
              value={newItem.category}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all"
              style={{
                borderColor: colors.text.secondary,
                focusBorderColor: colors.primary.main,
                focusRingColor: colors.primary.light,
              }}
            >
              <option value="">Select Category</option>
              {[
                "Vegetables",
                "Fruits",
                "Dairy",
                "Meat & Fish",
                "Beverages",
                "Snacks",
                "Household",
                "Personal Care",
                "Other",
              ].map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={addItem}
            className="px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-medium"
            style={{
              backgroundColor: colors.primary.main,
              color: "white",
              hoverBackgroundColor: colors.primary.dark,
            }}
          >
            <FaPlus className="text-sm" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === "all"
                ? "text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            style={{
              backgroundColor: activeTab === "all" ? colors.primary.main : "",
              border:
                activeTab !== "all"
                  ? `1px solid ${colors.text.secondary}`
                  : "none",
            }}
          >
            All Items
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === "pending"
                ? "text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            style={{
              backgroundColor:
                activeTab === "pending" ? colors.accent.main : "",
              border:
                activeTab !== "pending"
                  ? `1px solid ${colors.text.secondary}`
                  : "none",
            }}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab("purchased")}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === "purchased"
                ? "text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            style={{
              backgroundColor:
                activeTab === "purchased" ? colors.secondary.main : "",
              border:
                activeTab !== "purchased"
                  ? `1px solid ${colors.text.secondary}`
                  : "none",
            }}
          >
            Purchased
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === cat
                  ? "text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              style={{
                backgroundColor: activeTab === cat ? colors.primary.light : "",
                border:
                  activeTab !== cat
                    ? `1px solid ${colors.text.secondary}`
                    : "none",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <FaSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            style={{ color: colors.text.secondary }}
          />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-1 focus:outline-none transition"
            style={{
              borderColor: colors.text.secondary,
              focusBorderColor: colors.primary.main,
              focusRingColor: colors.primary.light,
            }}
          />
        </div>
        <button
          onClick={generatePDF}
          className="w-full md:w-auto px-4 py-3 rounded-lg shadow-sm transition flex items-center justify-center space-x-2 font-medium"
          style={{
            backgroundColor: colors.danger.main,
            color: "white",
            hoverBackgroundColor: colors.danger.dark,
          }}
        >
          <FaFilePdf />
          <span>Export PDF</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table
            className="min-w-full divide-y"
            style={{ divideColor: colors.text.secondary }}
          >
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.text.primary }}
                >
                  Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.text.primary }}
                >
                  Item
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.text.primary }}
                >
                  Quantity
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.text.primary }}
                >
                  Category
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.text.primary }}
                >
                  Date Added
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.text.primary }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className="bg-white divide-y"
              style={{ divideColor: colors.text.secondary }}
            >
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
                        className="h-5 w-5 rounded cursor-pointer transition"
                        style={{
                          accentColor: colors.secondary.main,
                          hoverBorderColor: colors.primary.main,
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`font-medium ${
                            item.completed ? "line-through" : ""
                          }`}
                          style={{
                            color: item.completed
                              ? colors.text.secondary
                              : colors.text.primary,
                          }}
                        >
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: item.completed
                            ? `${colors.secondary.light}30`
                            : `${colors.primary.light}30`,
                          color: item.completed
                            ? colors.secondary.dark
                            : colors.primary.dark,
                        }}
                      >
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded"
                        style={{
                          backgroundColor: `${colors.primary.light}20`,
                          color: colors.primary.dark,
                        }}
                      >
                        {item.category || "Uncategorized"}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1 rounded-full hover:bg-gray-100 transition"
                          title="Edit"
                          style={{ color: colors.primary.main }}
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => deleteItem(item._id, item.name)}
                          className="p-1 rounded-full hover:bg-gray-100 transition"
                          title="Delete"
                          style={{ color: colors.danger.main }}
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
                    className="px-6 py-4 text-center"
                    style={{ color: colors.text.secondary }}
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
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-lg font-semibold"
              style={{ color: colors.text.primary }}
            >
              Category Analytics
            </h3>
            <div
              className="flex items-center space-x-2 text-sm"
              style={{ color: colors.text.secondary }}
            >
              <FaChartLine />
              <span>Analytics</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64">
              <h4
                className="text-sm font-medium mb-2"
                style={{ color: colors.text.secondary }}
              >
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
                        grid: {
                          color: colors.text.secondary,
                        },
                      },
                      x: {
                        grid: {
                          display: false,
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
                <div
                  className="h-full flex items-center justify-center"
                  style={{ color: colors.text.secondary }}
                >
                  No category data available
                </div>
              )}
            </div>
            <div className="h-64">
              <h4
                className="text-sm font-medium mb-2"
                style={{ color: colors.text.secondary }}
              >
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
                        grid: {
                          color: colors.text.secondary,
                        },
                      },
                      x: {
                        grid: {
                          display: false,
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
                <div
                  className="h-full flex items-center justify-center"
                  style={{ color: colors.text.secondary }}
                >
                  No quantity data available
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text.primary }}
          >
            Quick Actions
          </h3>
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <button
                onClick={buyItems}
                className="w-full px-4 py-3 rounded-lg shadow-sm transition flex items-center justify-center space-x-2 font-medium"
                style={{
                  backgroundColor: colors.secondary.main,
                  color: "white",
                  hoverBackgroundColor: colors.secondary.dark,
                }}
              >
                <FaShoppingCart />
                <span>Mark as Purchased</span>
              </button>
              <button
                onClick={generatePDF}
                className="w-full px-4 py-3 rounded-lg shadow-sm transition flex items-center justify-center space-x-2 font-medium"
                style={{
                  backgroundColor: colors.danger.main,
                  color: "white",
                  hoverBackgroundColor: colors.danger.dark,
                }}
              >
                <FaFilePdf />
                <span>Export as PDF</span>
              </button>
            </div>
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: `${colors.primary.light}10`,
                borderColor: colors.primary.light,
              }}
            >
              <h4
                className="text-sm font-medium mb-2"
                style={{ color: colors.primary.dark }}
              >
                Summary
              </h4>
              <p className="text-xs" style={{ color: colors.text.secondary }}>
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
                <h3
                  className="text-xl font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  Edit Item
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{ color: colors.text.secondary }}
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
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.text.primary }}
                  >
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={itemToEdit.name}
                    onChange={(e) =>
                      setItemToEdit({ ...itemToEdit, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-offset-1 focus:outline-none transition"
                    style={{
                      borderColor: colors.text.secondary,
                      focusBorderColor: colors.primary.main,
                      focusRingColor: colors.primary.light,
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.text.primary }}
                  >
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-offset-1 focus:outline-none transition"
                    style={{
                      borderColor: colors.text.secondary,
                      focusBorderColor: colors.primary.main,
                      focusRingColor: colors.primary.light,
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.text.primary }}
                  >
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-offset-1 focus:outline-none transition"
                    style={{
                      borderColor: colors.text.secondary,
                      focusBorderColor: colors.primary.main,
                      focusRingColor: colors.primary.light,
                    }}
                  >
                    <option value="">Select Category</option>
                    {[
                      "Vegetables",
                      "Fruits",
                      "Dairy Products",
                      "Meat & Fish",
                      "Beverages",
                      "Snacks",
                      "Household Items",
                      "Personal Care",
                      "Spices",
                      "Other",
                    ].map((cat, index) => (
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
                  className="px-4 py-2 border rounded-lg font-medium transition"
                  style={{
                    borderColor: colors.text.secondary,
                    color: colors.text.primary,
                    hoverBackgroundColor: colors.background.light,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedItem}
                  className="px-4 py-2 rounded-lg text-white font-medium transition"
                  style={{
                    backgroundColor: colors.primary.main,
                    hoverBackgroundColor: colors.primary.dark,
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroceryList;
