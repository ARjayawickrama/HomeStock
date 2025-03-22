import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";

function GroceryList() {
  const [inventory, setInventory] = useState([]);
  const [groceryList, setGroceryList] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [items, setItems] = useState(["Tea", "Coffee", "Sugar", "Milk"]);

  useEffect(() => {
    const fetchedInventory = [
      { id: 1, name: "Milk", stock: 1 },
      { id: 2, name: "Eggs", stock: 0 },
      { id: 3, name: "Bread", stock: 5 },
    ];
    setInventory(fetchedInventory.filter((item) => item.stock <= 1));
  }, []);

  const addItem = () => {
    if (!newItem.name || !newItem.quantity) return;
    setGroceryList([
      ...groceryList,
      { ...newItem, quantity: Number(newItem.quantity), id: Date.now() },
    ]);
    setNewItem({ name: "", quantity: "" });
  };

  const openEditModal = (id) => {
    const item = groceryList.find((item) => item.id === id);
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  const saveEditedItem = () => {
    setGroceryList(
      groceryList.map((item) =>
        item.id === itemToEdit.id
          ? { ...itemToEdit, quantity: Number(itemToEdit.quantity) }
          : item
      )
    );
    setIsModalOpen(false);
    setItemToEdit(null);
  };

  const deleteItem = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      setGroceryList(groceryList.filter((item) => item.id !== id));
    }
  };

  const buyItems = () => {
    if (groceryList.length === 0) {
      alert("No items to purchase.");
      return;
    }

    alert("Purchased items for two weeks! ✅");
    sendToBudgeting(groceryList);
    setGroceryList([]);
  };

  const sendToBudgeting = async (list) => {
    const budgetingData = list.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      costEstimate: Math.floor(Math.random() * 10 + 1) * item.quantity,
    }));

    try {
      console.log("Sending to Budgeting System:", budgetingData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Grocery list sent to budgeting system! 📊");
    } catch (error) {
      console.error("Error sending to budgeting:", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Grocery List", 20, 10);

    groceryList.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.name} - Qty: ${item.quantity}`,
        20,
        20 + index * 10
      );
    });

    doc.save("Grocery_List.pdf");
  };

  return (
    <main className="bg-white p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Grocery List Management</h2>

      <div className="bg-red-50 border-l-4 border-red-600 text-red-800 p-4 rounded-lg shadow-md mb-6 transition-all duration-300">
        <div className="flex items-start">
          <svg
            className="w-6 h-6 text-red-600 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M4.93 19.07a10 10 0 1114.14 0M12 2a10 10 0 00-10 10h0a10 10 0 0020 0h0A10 10 0 0012 2z"
            />
          </svg>

          <div>
            <strong className="text-lg font-semibold">Low Stock Alert:</strong>
            <p className="text-sm text-red-700 mt-1">
              The following items are running low:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              {inventory.map((item) => (
                <li key={item.id} className="font-medium text-red-800">
                  {item.name}
                  <span className="text-xs text-red-600 font-semibold ml-2">
                    (Stock: {item.stock})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
        <select
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          value={newItem.name}
          className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 rounded-lg p-3 w-1/3 outline-none transition duration-200"
        >
          <option value="" disabled>
            Select an Item
          </option>
          {items.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 rounded-lg p-3 w-1/4 outline-none transition duration-200"
        />

        <button
          onClick={addItem}
          className="bg-green-600 hover:bg-green-500 text-white font-bold px-5 py-3 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
        >
          Add Item
        </button>
      </div>

      {/* Grocery List Table */}
      <table className="min-w-full border border-gray-300 shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-900 to-blue-950 text-white">
          <tr>
            <th className="px-6 py-4 text-left font-extrabold uppercase tracking-wider">
              Item
            </th>
            <th className="px-6 py-4 text-left font-extrabold uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-4 text-left font-extrabold uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {groceryList.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 transition duration-300 ease-in-out"
            >
              <td className="px-6 py-4 text-gray-800 text-lg">{item.name}</td>
              <td className="px-6 py-4 text-green-700 font-bold text-lg">
                {item.quantity}
              </td>
              <td className="px-6 py-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => openEditModal(item.id)}
                    className="bg-yellow-500 text-white px-3 py-2 rounded-full shadow-md hover:bg-yellow-400 transition transform hover:scale-105 duration-300"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="bg-red-600 text-white px-3 py-2 rounded-full shadow-md hover:bg-red-500 transition transform hover:scale-105 duration-300"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {isModalOpen && itemToEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Item</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                value={itemToEdit.name}
                onChange={(e) =>
                  setItemToEdit({ ...itemToEdit, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={itemToEdit.quantity}
                onChange={(e) =>
                  setItemToEdit({ ...itemToEdit, quantity: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedItem}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex space-x-4">
        <button
          onClick={generatePDF}
          className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-5 py-3 rounded-lg shadow-md transition duration-300 transform hover:scale-105 flex items-center space-x-2"
        >
          <FaFilePdf />
          <span>Export PDF</span>
        </button>
        <button
          onClick={buyItems}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
        >
          Buy for Two Weeks
        </button>
      </div>
    </main>
  );
}

export default GroceryList;
