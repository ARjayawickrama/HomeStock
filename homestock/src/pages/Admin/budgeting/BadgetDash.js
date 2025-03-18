import React ,{ useState } from 'react';
import { Wallet, TrendingUp, Receipt, PieChart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import BudgetDetails from './BudgetDetails'
import ExpensesList from './ExpensesList'

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
      <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
        <Wallet className="w-8 h-8 text-indigo-600" />
        Budget & Expenses Overview
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div 
          className="p-6 transition-shadow bg-white shadow-sm cursor-pointer rounded-xl hover:shadow-md"
          
          onClick={() => setActiveTab('BudgetDetails')}
        >
          <div className="flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Total Budget</p>
              <p className="text-2xl font-bold">${totalBudget}</p>
            </div>
          </div>
        </div>

        <div 
          className="p-6 transition-shadow bg-white shadow-sm cursor-pointer rounded-xl hover:shadow-md"
          onClick={() => setActiveTab('ExpensesList')}
        >
          <div className="flex items-center gap-4">
            <Receipt className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold">${totalSpent}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white shadow-sm rounded-xl">
          <div className="flex items-center gap-4">
            <PieChart className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Remaining</p>
              <p className="text-2xl font-bold">${remaining}</p>
            </div>
          </div>
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

        <div className="p-6 bg-white shadow-sm rounded-xl">
          <h2 className="mb-6 text-lg font-semibold">Category Breakdown</h2>
          <div className="space-y-4">
            {categories.map((category) => {
              const categoryTotal = expenses
                .filter((e) => e.category === category)
                .reduce((sum, e) => sum + e.amount, 0);
              const percentage = (categoryTotal / totalSpent) * 100;

              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">{category}</span>
                    <span className="text-sm font-medium text-gray-900">${categoryTotal}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-indigo-600 rounded-full"
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