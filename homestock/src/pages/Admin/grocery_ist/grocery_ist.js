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
    <main className="bg-white p-4 rounded-lg ">
    grocery_ist Home
   </main>
  )
}

export default GroceryList;
