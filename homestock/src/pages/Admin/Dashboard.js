import React, { useState } from "react";
import { Bell, Mail, Globe, Home as HomeIcon, LogOut, Box, ShoppingCart, DollarSign, Cpu ,User } from "lucide-react"; // Importing necessary icons
import { useNavigate } from "react-router-dom";
import Inventory from "./inventory/Inventory";
import Grocery_ist from "./grocery_ist/grocery_ist";
import Budgeting from "./budgeting/budgeting";
import Iot from "./iot/iot";
import Home from "./home";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <nav className="bg-black text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <HomeIcon className="w-6 h-6" />
          <span className="text-lg font-semibold">Home Stock</span>
        </div>
        <div className="flex items-center gap-4">
          <Globe className="w-6 h-6 cursor-pointer" />
          <Mail className="w-6 h-6 cursor-pointer" />
          <div className="relative">
            <Bell className="w-6 h-6 cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1 rounded-full">3</span>
          </div>
          <button onClick={handleLogout} className="flex items-center bg-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700">
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-6 flex flex-col md:flex-row gap-6">
        <aside className="md:w-1/4 bg-white shadow-lg rounded-lg p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full mb-4" />
            <h2 className="text-lg font-semibold mt-3">Home Stock</h2>
            <p className="text-sm text-gray-600">system unit </p>
          </div>
          <ul className="mt-6 space-y-2">
            {[
              { name: "Home", icon: <HomeIcon className="w-5 h-5" /> },
              { name: "Inventory", icon: <Box className="w-5 h-5" /> },
              { name: "Grocery", icon: <ShoppingCart className="w-5 h-5" /> },
              { name: "Budgeting", icon: <DollarSign className="w-5 h-5" /> },
              { name: "Iot", icon: <Cpu className="w-5 h-5" /> },
              { name: "User", icon: <User className="w-5 h-5" /> },
            ].map((tab) => (
              <li
                key={tab.name}
                className={`p-3 rounded-lg cursor-pointer text-center font-medium transition duration-200 hover:bg-black flex items-center gap-3 ${
                  activeTab === tab.name.toLowerCase()
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black"
                }`}
                onClick={() => setActiveTab(tab.name.toLowerCase())}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <main className="md:w-3/4 bg-white shadow-lg rounded-lg p-6">
          {activeTab === "home" && <Home />}
          {activeTab === "inventory" && <Inventory />}
          {activeTab === "grocery" && <Grocery_ist />}
          {activeTab === "budgeting" && <Budgeting />}
          {activeTab === "iot" && <Iot />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
