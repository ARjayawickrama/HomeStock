import React, { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";

const Inventory = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Milk", category: "Dairy", quantity: 2, status: "Low Stock" },
    { id: 2, name: "Rice", category: "Grains", quantity: 5, status: "Available" },
  ]);
  const [search, setSearch] = useState("");

  return (
    <main className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Home Stock</h1>
      
      {/* Search & Add Button */}
      <div className="flex justify-between mb-4">
        <div className="relative w-2/3">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
        <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          <FaPlus /> Add Item
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
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items
              .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
              .map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className={`p-2 ${item.status === "Low Stock" ? "text-red-500" : "text-green-500"}`}>
                    {item.status}
                  </td>
                  <td className="p-2 flex gap-2">
                    <button className="text-yellow-500 hover:text-yellow-700">
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Inventory;
