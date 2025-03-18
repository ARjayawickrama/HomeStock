import React, { useState } from 'react';

const AddBudgetModal = ({ isOpen, onClose, onAddBudget }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('Monthly');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddBudget({ category, amount: parseFloat(amount), period });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Add New Budget</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
            >
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-300 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded-md">Add Budget</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudgetModal;