import React, { useState } from 'react';
import { Plus, FileText, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import AddBudgetModal from './component/AddBudgetModal'; // Import the modal component

const BudgetDetails = ({ setActiveTab }) => {
  const [budgets, setBudgets] = useState([
    { id: 1, category: 'Groceries', amount: 400, spent: 350, period: 'Monthly' },
    { id: 2, category: 'Household', amount: 300, spent: 275, period: 'Monthly' },
    { id: 3, category: 'Utilities', amount: 200, spent: 180, period: 'Monthly' },
    { id: 4, category: 'Entertainment', amount: 100, spent: 95, period: 'Monthly' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const handleAddBudget = (newBudget) => {
    setBudgets([...budgets, { ...newBudget, id: Date.now() }]);
    setIsModalOpen(false);
  };

  const handleEditBudget = (updatedBudget) => {
    setBudgets(budgets.map((b) => (b.id === updatedBudget.id ? updatedBudget : b)));
    setEditingBudget(null);
    setIsModalOpen(false);
  };

  const handleDeleteBudget = (id) => {
    setBudgets(budgets.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setActiveTab('BudgetDash')}
          className="p-2 transition-colors rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-900">Budget List</h2>
          <p className="text-sm text-gray-500">Manage your budget allocations across categories</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <FileText className="w-5 h-5 mr-2" />
            Generate Report
          </button>
          <button
            onClick={() => {
              setEditingBudget(null); // Clear editing state for adding a new budget
              setIsModalOpen(true); // Open the modal for adding a new budget
            }}
            className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Budget
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow-sm rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Spent
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Remaining
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Period
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Progress
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {budgets.map((budget) => (
              <tr key={budget.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{budget.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${budget.amount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${budget.spent}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${budget.amount - budget.spent}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{budget.period}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-indigo-600 rounded-full"
                      style={{ width: `${(budget.spent / budget.amount) * 100}%` }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setEditingBudget(budget); // Set the budget to edit
                        setIsModalOpen(true); // Open the modal for editing
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AddBudgetModal
          onSubmit={editingBudget ? handleEditBudget : handleAddBudget}
          onClose={() => setIsModalOpen(false)}
          initialData={editingBudget}
        />
      )}
    </div>
  );
};

export default BudgetDetails;
