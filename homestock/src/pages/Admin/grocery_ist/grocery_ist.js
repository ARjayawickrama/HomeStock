import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaFilePdf } from "react-icons/fa"; // Import icons
import jsPDF from "jspdf";

function GroceryList() {
  const [inventory, setInventory] = useState([]);
  const [groceryList, setGroceryList] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [itemToEdit, setItemToEdit] = useState(null); // Item to be edited

  // Simulate fetching low-stock inventory items
  useEffect(() => {
    const fetchedInventory = [
      { id: 1, name: "Milk", stock: 1 },
      { id: 2, name: "Eggs", stock: 0 },
      { id: 3, name: "Bread", stock: 5 },
    ];
    setInventory(fetchedInventory.filter((item) => item.stock <= 1)); // Filter low-stock items
  }, []);

  // Add an item to the grocery list
  const addItem = () => {
    if (!newItem.name || !newItem.quantity) return;
    setGroceryList([...groceryList, { ...newItem, id: Date.now() }]);
    setNewItem({ name: "", quantity: "" });
  };

  // Open the modal for editing
  const openEditModal = (id) => {
    const item = groceryList.find((item) => item.id === id);
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  // Save the edited item
  const saveEditedItem = () => {
    setGroceryList(
      groceryList.map((item) =>
        item.id === itemToEdit.id ? { ...itemToEdit } : item
      )
    );
    setIsModalOpen(false); // Close modal after saving
    setItemToEdit(null); // Reset item to edit
  };

  // Delete an item from the grocery list
  const deleteItem = (id) => {
    setGroceryList(groceryList.filter((item) => item.id !== id));
  };

  // Purchase items for two weeks (Simulation)
  const buyItems = () => {
    if (groceryList.length === 0) {
      alert("No items to purchase.");
      return;
    }

    alert("Purchased items for two weeks! ✅");
    sendToBudgeting(groceryList); // Send purchased list to budgeting
    setGroceryList([]); // Clear list after purchase
  };

  const sendToBudgeting = async (list) => {
    const budgetingData = list.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      costEstimate: Math.floor(Math.random() * 10 + 1) * item.quantity,
    }));

    try {
      console.log("Sending to Budgeting System:", budgetingData);

      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Grocery list sent to budgeting system! 📊");
    } catch (error) {
      console.error("Error sending to budgeting:", error);
    }
  };

  // Generate PDF Function
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

      <div className="bg-red-100 text-red-700 p-2 rounded-lg mb-4">
        <strong>Low Stock Alert:</strong> The following items are running low:
        <ul className="list-disc pl-5">
          {inventory.map((item) => (
            <li key={item.id}>
              {item.name} (Stock: {item.stock})
            </li>
          ))}
        </ul>
      </div>

      {/* Add New Item Form */}
      <div className="mb-6 flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 rounded-lg p-3 w-1/3 outline-none transition duration-200"
        />
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Edit Item</h3>
            <input
              type="text"
              placeholder="Item Name"
              value={itemToEdit.name}
              onChange={(e) =>
                setItemToEdit({ ...itemToEdit, name: e.target.value })
              }
              className="border p-2 mb-4 w-full"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={itemToEdit.quantity}
              onChange={(e) =>
                setItemToEdit({ ...itemToEdit, quantity: e.target.value })
              }
              className="border p-2 mb-4 w-full"
            />
            <div className="flex space-x-2">
              <button
                onClick={saveEditedItem}
                className="bg-green-500 text-white p-2 rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white p-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex space-x-2">
        <button onClick={buyItems} className="bg-blue-500 text-white p-2">
          Buy for Two Weeks
        </button>
        <button
          onClick={generatePDF}
          className="bg-gray-500 text-white p-2 flex items-center"
        >
          <FaFilePdf className="mr-2" /> Generate PDF
        </button>
      </div>
    </main>
  );
}

export default GroceryList;
