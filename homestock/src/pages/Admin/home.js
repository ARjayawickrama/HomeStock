import React from "react";
import { MessageCircle, ArrowRight, ChevronRight } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const userData = [
  { name: "Jan", users: 400 },
  { name: "Feb", users: 600 },
  { name: "Mar", users: 800 },
  { name: "Apr", users: 1200 },
  { name: "May", users: 1500 },
  { name: "Jun", users: 1800 },
];

const sectionData = [
  {
    title: "IOT",
    description: "Manage your connected devices and sensors",
    color: "from-purple-500 to-indigo-600",
    icon: "📶",
  },
  {
    title: "Inventory",
    description: "Track and optimize your stock levels",
    color: "from-blue-500 to-cyan-600",
    icon: "📦",
  },
  {
    title: "Budgeting",
    description: "Plan and monitor your finances",
    color: "from-green-500 to-emerald-600",
    icon: "💰",
  },
  {
    title: "Grocery",
    description: "Organize your shopping lists",
    color: "from-amber-500 to-orange-600",
    icon: "🛒",
  },
];

function HomeScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center"></header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {sectionData.map((section, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${section.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-3xl mb-2">{section.icon}</span>
                  <h3 className="text-2xl font-semibold">{section.title}</h3>
                  <p className="text-white/90 mt-2">{section.description}</p>
                </div>
                <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors duration-200">
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-medium">View details</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                User Growth
              </h2>
              <select className="bg-gray-100 border-0 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500">
                <option>Last 6 months</option>
                <option>Last year</option>
                <option>Last 3 years</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34D399" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eee"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      border: "none",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#34D399"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                    activeDot={{ r: 6, stroke: "#059669", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                System Performance
              </h2>
              <select className="bg-gray-100 border-0 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500">
                <option>Last 7 days</option>
                <option>Last month</option>
                <option>Last quarter</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-1">
                  Performance Metrics
                </h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  Detailed performance metrics will be displayed here when
                  available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <button className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 group">
          <MessageCircle size={28} />
          <span className="absolute right-full mr-2 px-2 py-1 bg-blue-600 text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
            Need help?
          </span>
        </button>
      </div>
    </div>
  );
}

export default HomeScreen;
