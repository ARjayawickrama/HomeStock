import React, { useState } from "react";
import { Bell, Mail, Globe, Home as HomeIcon, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Inventory from "./inventory/Inventory";
import Grocery_ist from "./grocery_ist/grocery_ist";
import Budgeting from "./budgeting/budgeting";
import Iot from "./iot/iot";
import Home from "./home";
import Allusers from "../Login/Allusers";
import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaDollarSign,
  FaUser,
  FaMicrochip,
} from "react-icons/fa";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar (Fixed) */}
      <aside className="w-64 h-screen fixed left-0 top-0 bg-slate-900 shadow-md p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
            <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white">Home Stock</h2>
          <p className="text-sm text-white">System Unit</p>
        </div>
        <ul className="space-y-2">
          {[
            { name: "Home", icon: <FaHome className="w-5 h-5" /> },
            { name: "Inventory", icon: <FaBox className="w-5 h-5" /> },
            { name: "Grocery", icon: <FaShoppingCart className="w-5 h-5" /> },
            { name: "Budgeting", icon: <FaDollarSign className="w-5 h-5" /> },
            { name: "IoT", icon: <FaMicrochip className="w-5 h-5" /> },
            { name: "Allusers", icon: <FaUser className="w-5 h-5" /> },
          ].map((tab) => (
            <li
              key={tab.name}
              className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors duration-300 ${
                activeTab === tab.name.toLowerCase()
                  ? "bg-gradient-to-r from-blue-500 to-indigo-900 text-white font-medium"
                  : "hover:bg-blue-400 text-white"
              }`}
              onClick={() => setActiveTab(tab.name.toLowerCase())}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content (Scrollable) */}
      <div className="flex-1 ml-64 flex flex-col h-screen">
        {/* Top Navigation Bar */}
        <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-4">
            <HomeIcon className="w-6 h-6" />
            <span className="text-lg font-semibold">Home Stock Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Globe className="w-5 h-5 cursor-pointer hover:text-indigo-300 transition-colors" />
            <Mail className="w-5 h-5 cursor-pointer hover:text-indigo-300 transition-colors" />
            <div className="relative">
              <Bell className="w-5 h-5 cursor-pointer hover:text-indigo-300 transition-colors" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-xs px-1.5 py-0.5 rounded-full">
                3
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </button>
          </div>
        </nav>

        {/* Scrollable Content Section */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {activeTab === "home" && <Home />}
          {activeTab === "inventory" && <Inventory />}
          {activeTab === "grocery" && <Grocery_ist />}
          {activeTab === "budgeting" && <Budgeting />}
          {activeTab === "iot" && <Iot />}
          {activeTab === "allusers" && <Allusers />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
