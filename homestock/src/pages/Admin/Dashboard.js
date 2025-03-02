import React, { useState } from "react";
import { Bell, Mail, Globe, Home as HomeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Inventory from "./Inventory";
import Order from "./Order";
import A from "./a";
import B from "./b";
import Home from "./home";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userRole, setUserRole] = useState("user");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const navigate = useNavigate();

  const logout = () => {
    console.log("Logging out...");
  };

  const notify = () => {
    console.log("Logged out successfully!");
  };

  const decodeToken = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return {};
    }
  };

  const handleLogout = () => {
    if (token) {
      const decodedToken = decodeToken(token);
      console.log("Decoded Token:", decodedToken);
    }

    logout();
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserRole("");
    setToken("");

    navigate("/", { replace: true });

    notify();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <HomeIcon className="w-6 h-6" />
          <span className="text-lg font-semibold">Logo</span>
          <button onClick={handleLogout} className="ml-4 bg-red-500 px-3 py-1 rounded">Logout</button>
        </div>
        <div className="flex gap-4">
          <Globe className="w-6 h-6" />
          <Mail className="w-6 h-6" />
          <div className="relative">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-green-500 text-xs px-1 rounded-full">3</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4">
        {/* Left Sidebar */}
        <div className="md:w-1/4 space-y-4">
          <div className="p-4 text-center border border-gray-300 rounded-lg">
            <div className="w-24 h-24 mx-auto bg-gray-300 rounded-full" />
            <h2 className="text-lg font-semibold mt-2">My Profile</h2>
            <p>Designer, UI</p>
            <p>London, UK</p>
            <p>April 1, 1988</p>
          </div>
          <div className="p-4 bg-gray-200 border border-gray-300 rounded-lg">
            <ul className="space-y-2">
              {["home", "inventory", "order", "A", "B"].map((tab) => (
                <li
                  key={tab}
                  className={`p-2 rounded cursor-pointer ${
                    activeTab === tab ? "bg-gray-400" : "bg-gray-300"
                  }`}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 border border-gray-300 rounded-lg">
            <h3 className="font-semibold">Interests</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {["News", "W3Schools", "Games", "Friends", "Food", "Design", "Art"].map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-300 rounded text-sm">{tag}</span>
              ))}
            </div>
          </div>
        </div>

   
        <div className="md:w-11/12 space-y-4">
          {activeTab === "home" && <Home />}
          {activeTab === "inventory" && <Inventory />}
          {activeTab === "order" && <Order />}
          {activeTab === "A" && <A />}
          {activeTab === "B" && <B />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
