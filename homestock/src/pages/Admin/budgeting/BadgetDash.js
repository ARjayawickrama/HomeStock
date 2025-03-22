import React from 'react';
import PropTypes from 'prop-types';
import { Wallet, TrendingUp,ArrowUpRight,ArrowDownRight, Receipt, PieChart,Calendar, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function BudgetDash({ setActiveTab }) {
  
  const expenses = [
    { id: 1, category: 'Groceries', amount: 150, date: '2024-03-20', description: 'Weekly groceries' },
    { id: 2, category: 'Household', amount: 75, date: '2024-03-19', description: 'Cleaning supplies' },
    { id: 3, category: 'Essentials', amount: 45, date: '2024-03-18', description: 'Personal care items' },
  ];

  const categories = ['Groceries', 'Household', 'Essentials'];
  const totalBudget = 1000;
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = totalBudget - totalSpent;

  BudgetDash.propTypes = {
    setActiveTab: PropTypes.func.isRequired,
  };

  const monthlyData = [
    { name: 'Jan', budget: 1000, expenses: 850 },
    { name: 'Feb', budget: 1000, expenses: 920 },
    { name: 'Mar', budget: 1000, expenses: 780 },
    { name: 'Apr', budget: 1000, expenses: 850 },
    { name: 'May', budget: 1000, expenses: 950 },
    { name: 'Jun', budget: 1000, expenses: 880 },
  ];

  

  return (
    <main className="p-4 bg-white rounded-lg ">
    <div className="space-y-6">
    <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Financial Overview</h1>
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* budget card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white cursor-pointer transform transition-transform hover:scale-[1.02]" onClick={() => setActiveTab('BudgetDetails')}>
          <div className="flex items-center justify-between mb-4">
            <Wallet className="w-8 h-8 opacity-80" />
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <p className="text-lg font-medium opacity-90">Total Budget</p>
          <p className="mt-2 text-3xl font-bold">Rs.{totalBudget.toLocaleString()}</p>
          <p className="mt-2 text-sm opacity-75">Monthly allocation</p>
        </div>

         {/* expenses card */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white cursor-pointer transform transition-transform hover:scale-[1.02]" onClick={() => setActiveTab('ExpensesList')}>
        <div className="flex items-center justify-between mb-4">
            <Receipt className="w-8 h-8 opacity-80" />
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <p className="text-lg font-medium opacity-90">Total Spent</p>
          <p className="mt-2 text-3xl font-bold">Rs.{totalSpent.toLocaleString()}</p>
          <p className="mt-2 text-sm opacity-75">This month</p>
        </div>
        {/* remain card */}
        <div className="p-6 text-white bg-gradient-to-br from-green-500 to-green-600 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <PieChart className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-lg font-medium opacity-90">Remaining</p>
          <p className="mt-2 text-3xl font-bold">Rs.{remaining.toLocaleString()}</p>
          <p className="mt-2 text-sm opacity-75">Available balance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white shadow-sm rounded-xl">
          <h2 className="mb-6 text-lg font-semibold">Budget vs Expenses</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="budget" stroke="#10B981" name="Budget" />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-white shadow-sm rounded-2xl">
          <h2 className="mb-6 text-xl font-semibold">Category Breakdown</h2>
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryTotal = expenses
                .filter((e) => e.category === category)
                .reduce((sum, e) => sum + e.amount, 0);
              const percentage = (categoryTotal / totalSpent) * 100;

              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{category}</p>
                      <p className="text-sm text-gray-500">Rs.{categoryTotal.toLocaleString()}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden bg-gray-100 rounded-full">
                    <div
                      className="h-full transition-all duration-500 ease-in-out rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </main>
    
  )
};

export default BudgetDash;