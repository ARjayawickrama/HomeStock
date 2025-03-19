import React, { useState } from 'react';
import { Plus, FileText, Filter, ArrowLeft, Search } from 'lucide-react';

const ExpensesList = ({ setActiveTab }) => {

  const [expenses, setExpenses] = useState([
    { 
      id: 1, 
      description: 'Weekly Groceries',
      category: 'Groceries',
      amount: 150,
      date: '2024-03-20',
      paymentMethod: 'Credit Card',
      status: 'Completed'
    },
    { 
      id: 2, 
      description: 'Cleaning Supplies',
      category: 'Household',
      amount: 75,
      date: '2024-03-19',
      paymentMethod: 'Cash',
      status: 'Completed'
    },
    { 
      id: 3, 
      description: 'Personal Care Items',
      category: 'Essentials',
      amount: 45,
      date: '2024-03-18',
      paymentMethod: 'Debit Card',
      status: 'Pending'
    },
  ]);
  


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setActiveTab('BudgetDash')}
          className="p-2 transition-colors rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Expenses Management</h1>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-900">Expenses List</h2>
          <p className="text-sm text-gray-500">Track and manage your expenses</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <FileText className="w-5 h-5 mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            <Plus className="w-5 h-5 mr-2" />
            Add Expense
          </button>
        </div>
      </div>

      <div className="flex mb-6 space-x-4">
        <div className="relative flex-1">
          <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search expenses..."
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="w-5 h-5 mr-2" />
          Filter
        </button>
      </div>

      <div className="overflow-hidden bg-white shadow-sm rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Payment Method
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{expense.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{expense.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${expense.amount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{expense.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{expense.paymentMethod}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${expense.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {expense.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpensesList;