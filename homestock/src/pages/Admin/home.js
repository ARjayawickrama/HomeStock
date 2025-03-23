import React from "react";
import { MessageCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const userData = [
  { name: "Jan", users: 400 },
  { name: "Feb", users: 600 },
  { name: "Mar", users: 800 },
  { name: "Apr", users: 1200 },
  { name: "May", users: 1500 },
  { name: "Jun", users: 1800 },
];

function HomeScreen() {
  const sections = ["IOT", "Inventory", "Budgeting", "Grocery"];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r p-6">
      <h1 className="text-4xl font-extrabold text-green-800 mb-8 drop-shadow-md">
        Welcome to Home Screen
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white shadow-2xl rounded-xl p-8 text-center hover:scale-105 transition-transform duration-300 border border-green-400"
          >
            <h2 className="text-2xl font-semibold text-green-700 drop-shadow-sm">
              {section}
            </h2>
            <p className="text-gray-600 mt-3">
              Manage your {section} efficiently.
            </p>
          </div>
        ))}
      </div>

      {/* User Chart Section */}
      <div className="bg-white shadow-2xl rounded-xl p-6 mt-10 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-green-700 text-center mb-4">
          User Growth Chart
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#34D399"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chat Button */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center">
          <MessageCircle size={28} />
        </button>
      </div>
    </div>
  );
}

export default HomeScreen;
