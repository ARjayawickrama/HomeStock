import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaFilePdf } from 'react-icons/fa'; // Import icons
import jsPDF from 'jspdf';

function GroceryList() {
  const [inventory, setInventory] = useState([]);
  const [groceryList, setGroceryList] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });

  // Simulate fetching low-stock inventory items
  useEffect(() => {
    const fetchedInventory = [
      { id: 1, name: 'Milk', stock: 1 },
      { id: 2, name: 'Eggs', stock: 0 },
      { id: 3, name: 'Bread', stock: 5 },
    ];
    setInventory(fetchedInventory.filter(item => item.stock <= 1)); // Filter low-stock items
  }, []);

  // Add an item to the grocery list
  const addItem = () => {
    if (!newItem.name || !newItem.quantity) return;
    setGroceryList([...groceryList, { ...newItem, id: Date.now() }]);
    setNewItem({ name: '', quantity: '' });
  };

  // Edit an item in the grocery list
  const editItem = (id) => {
    const itemToEdit = groceryList.find(item => item.id === id);
    setNewItem(itemToEdit);
    setGroceryList(groceryList.filter(item => item.id !== id));
  };

  // Delete an item from the grocery list
  const deleteItem = (id) => {
    setGroceryList(groceryList.filter(item => item.id !== id));
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

  // Send grocery list to budgeting system (Simulated API Call)
  const sendToBudgeting = async (list) => {
    const budgetingData = list.map(item => ({
      name: item.name,
      quantity: item.quantity,
      costEstimate: Math.floor(Math.random() * 10 + 1) * item.quantity, // Example cost calculation
    }));

    try {
      console.log("Sending to Budgeting System:", budgetingData);

      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));

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
      doc.text(`${index + 1}. ${item.name} - Qty: ${item.quantity}`, 20, 20 + (index * 10));
    });

    doc.save("Grocery_List.pdf");
  };

  return (
    <main className="bg-white p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Grocery List Management</h2>

      {/* Display Low-Stock Items from Inventory */}
      <div className="bg-red-100 text-red-700 p-2 rounded-lg mb-4">
        <strong>Low Stock Alert:</strong> The following items are running low:
        <ul className="list-disc pl-5">
          {inventory.map(item => (
            <li key={item.id}>{item.name} (Stock: {item.stock})</li>
          ))}
        </ul>
      </div>

      {/* Add New Item Form */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={addItem} className="bg-green-500 text-white p-2">Add</button>
      </div>

      {/* Grocery List Display */}
      <ul className="space-y-2">
        {groceryList.map(item => (
          <li key={item.id} className="p-2 border rounded-lg flex justify-between items-center">
            <span>{item.name} - Qty: {item.quantity}</span>
            <div>
              <button onClick={() => editItem(item.id)} className="bg-yellow-500 text-white p-2 mr-2">
                <FaEdit />
              </button>
              <button onClick={() => deleteItem(item.id)} className="bg-red-500 text-white p-2">
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="mt-4 flex space-x-2">
        <button onClick={buyItems} className="bg-blue-500 text-white p-2">Buy for Two Weeks</button>
        <button onClick={generatePDF} className="bg-gray-500 text-white p-2 flex items-center">
          <FaFilePdf className="mr-2" /> Generate PDF
        </button>
      </div>
    </main>
  );
}

export default GroceryList;
