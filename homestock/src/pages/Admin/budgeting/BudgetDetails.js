import React, { useState, useEffect } from 'react';
import { Plus, FileText, ArrowLeft, Calendar, Filter, MoreVertical } from 'lucide-react';
import AddBudgetModal from './component/AddBudgetModal'; // Import the modal component
import BudgetOptionsPopup from './component/BudgetOptionsPopup'; // Import the popup component
import axios from 'axios';

const BudgetDetails = ({ setActiveTab }) => {
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/budgets");
        setBudgets(response.data);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };
    fetchBudgets();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const handleAddBudget = async (newBudget) => {
    try {
      const response = await axios.post("http://localhost:5000/api/budgets", newBudget);
      setBudgets([...budgets, response.data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const handleEditBudget = async (updatedBudget) => {
    try {
      const response = await axios.put("http://localhost:5000/api/budgets${updatedBudget.id}", updatedBudget);
      setBudgets(budgets.map((b) => (b.id === updatedBudget.id ? response.data : b)));
      setEditingBudget(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error editing budget:', error);
    }
  };

  const [showPopup, setShowPopup] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const handleDeleteBudget = async (id) => {
    try {
      await axios.delete(`/api/budgets/${id}`);
      setBudgets(budgets.filter((b) => b.id !== id));
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const handleMoreOptionsClick = (event, budget) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect(); // Get button position
    setPopupPosition({
      top: rect.bottom + window.scrollY + 5, // Position below the button with a small offset
      left: rect.left + window.scrollX, // Align with the button
    });
    setSelectedBudget(budget);
    setShowPopup(true);
  };

  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('BudgetDash')}
            className="p-2 transition-colors rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Calendar className="w-4 h-4 mr-2" />
            March 2024
          </button>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
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

      <div className="grid grid-cols-1 gap-4">
        {budgets.map((budget) => (
          <div 
            key={budget.id} 
            className="p-6 transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-${budget.color}-100 flex items-center justify-center`}>
                  <span className={`text-${budget.color}-600 text-lg font-semibold`}>
                    {budget.category[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{budget.category}</h3>
                  <p className="text-sm text-gray-500">{budget.period} Budget</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">Rs.{budget.amount}.00</p>
                  <p className="text-sm text-gray-500">Budget</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">Rs.{budget.spent}.00</p>
                  <p className="text-sm text-gray-500">Spent</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">Rs.{budget.amount - budget.spent}.00</p>
                  <p className="text-sm text-gray-500">Remaining</p>
                </div>
                <div className="relative">
                  <button 
                    onClick={(e) => handleMoreOptionsClick(e, budget)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full h-2 overflow-hidden bg-gray-100 rounded-full">
                <div
                  className={`bg-${budget.color}-600 h-2 rounded-full transition-all duration-500 ease-in-out`}
                  style={{ width: `${(budget.spent / budget.amount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <BudgetOptionsPopup
          onEdit={() => {
            setEditingBudget(selectedBudget);
            setIsModalOpen(true);
            setShowPopup(false);
          }}
          onDelete={() => {
            handleDeleteBudget(selectedBudget.id);
            setShowPopup(false);
          }}
          onClose={() => setShowPopup(false)}
          position={popupPosition}
        />
      )}
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