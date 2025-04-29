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
import { motion } from "framer-motion";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

function HomeScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center"></header>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {sectionData.map((section, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`bg-gradient-to-br ${section.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
            >
              {/* Animated background element */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-3xl mb-2">{section.icon}</span>
                  <h3 className="text-2xl font-semibold">{section.title}</h3>
                  <p className="text-white/90 mt-2">{section.description}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
              <div className="mt-6 flex items-center justify-between relative z-10">
                <span className="text-sm font-medium">View details</span>
                <motion.div
                  animate={{
                    x: [0, 4, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <ArrowRight size={16} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* User Growth Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  User Growth
                </h2>
                <p className="text-sm text-gray-500">
                  Last 6 months performance
                </p>
              </div>
              <motion.select
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option>Last 6 months</option>
                <option>Last year</option>
                <option>Last 3 years</option>
              </motion.select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#3B82F6"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      border: "1px solid #e5e7eb",
                      padding: "0.5rem 1rem",
                    }}
                    itemStyle={{ color: "#1F2937", fontSize: 12 }}
                    labelStyle={{ fontWeight: 600, color: "#111827" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                    activeDot={{
                      r: 6,
                      stroke: "#2563EB",
                      strokeWidth: 2,
                      fill: "#ffffff",
                      filter: "drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* System Performance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  System Performance
                </h2>
                <p className="text-sm text-gray-500">Key metrics overview</p>
              </div>
              <motion.select
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option>Last 7 days</option>
                <option>Last month</option>
                <option>Last quarter</option>
              </motion.select>
            </div>
            <div className="h-64 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <svg
                    className="w-10 h-10 text-blue-600"
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
                </motion.div>
                <h3 className="text-lg font-medium text-gray-700 mb-1">
                  Performance Metrics
                </h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto mb-4">
                  Detailed performance metrics will be displayed here when
                  available.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md"
                >
                  Generate Report
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Help Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 group relative"
        >
          <MessageCircle size={28} />
          <span className="absolute right-full mr-3 px-3 py-1.5 bg-blue-600 text-sm font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
            Need help? Chat with us
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}

export default HomeScreen;
