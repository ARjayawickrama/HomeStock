import React, { useState } from "react";

const AddExpenseModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    amount: "",
    date: "",
    paymentMethod: "",
    
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="p-6 bg-white rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold">Add Expense</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input type="text" name="description" placeholder="Description" className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="text" name="category" placeholder="Category" className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="number" name="amount" placeholder="Amount" className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="date" name="date" className="w-full p-2 border rounded" onChange={handleChange} />
          <input type="text" name="paymentMethod" placeholder="Payment Method" className="w-full p-2 border rounded" onChange={handleChange} />
          <div className="flex justify-end space-x-2">
            <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
