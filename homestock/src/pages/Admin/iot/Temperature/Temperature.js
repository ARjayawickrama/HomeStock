import React, { useState, useEffect } from "react";
import { FaTemperatureHigh, FaFan, FaFireExtinguisher } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import axios from "axios";
import TmpChart from "../Charts/TmpChart";
import backgroundImage from "../../../../assets/g2.png";
import { motion, AnimatePresence } from "framer-motion";
import GasDisplay from "./GasDisplay";

function Temperature({ temperaturePercentage }) {
  // State management
  const [controls, setControls] = useState({
    temperature: false,
    fan: false,
    fireAlarm: false,
  });
  const [sensorData, setSensorData] = useState({
    temperature: "--",
    humidity: "--",
    gas: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pulse, setPulse] = useState(false);

  // Pulse animation for data updates
  useEffect(() => {
    const timer = setTimeout(() => setPulse(false), 1000);
    return () => clearTimeout(timer);
  }, [pulse]);

  // Color thresholds
  const getStatusColor = (percentage) => {
    if (percentage > 80) return "bg-red-500";
    if (percentage > 50) return "bg-amber-400";
    return "bg-emerald-500";
  };

  const getGasStatus = (value) => {
    if (!value) return { text: "Loading...", color: "text-gray-400" };
    if (value >= 2000) return { text: "Danger", color: "text-red-500" };
    if (value >= 1000) return { text: "Moderate", color: "text-amber-400" };
    if (value >= 300) return { text: "Low", color: "text-blue-400" };
    return { text: "Clean", color: "text-green-500" };
  };

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tempRes, gasRes] = await Promise.all([
          axios.get("http://192.168.228.103/temperature"),
          axios.get("http://192.168.228.103/gas"),
        ]);

        setSensorData({
          temperature: tempRes.data.temperature || "--",
          humidity: tempRes.data.humidity || "--",
          gas: gasRes.data.gas_value,
        });
        setError(null);
        setPulse(true);
      } catch (err) {
        setError("Failed to fetch sensor data");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Toggle handler with animation
  const toggleControl = (control) => {
    setControls((prev) => ({
      ...prev,
      [control]: !prev[control],
    }));
    setPulse(true);
  };

  const gasStatus = getGasStatus(sensorData.gas);

  return (
    <div className="space-y-8 p-4 bg-gray-900">
      {/* Connection Status Indicator */}
      <div
        className={`p-3 rounded-lg mb-6 ${
          error
            ? "bg-red-900/30 border-red-500"
            : "bg-blue-900/30 border-blue-500"
        } border border-opacity-50 transition-all duration-500`}
      >
        <div className="flex items-center">
          <span
            className={`relative flex h-3 w-3 ${pulse ? "animate-ping" : ""}`}
          >
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                error ? "bg-red-500" : "bg-blue-500"
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                error ? "bg-red-500" : "bg-blue-500"
              }`}
            ></span>
          </span>
          <span className="ml-2 text-sm font-medium text-gray-200">
            {error ? "Connection Error" : "Connected to IoT Network"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <GasDisplay/>
        {/* Temperature Chart */}
        <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 hover:border-indigo-500/50 transition-all duration-300">
          <TmpChart darkMode={true} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Temperature Card */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-red-600/90 to-red-800/90 rounded-2xl p-6 text-white shadow-xl border border-red-500/30 hover:border-red-400/50 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center">
              <FaTemperatureHigh className="mr-3 text-red-200" /> Temperature
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20">
              {sensorData.temperature > 30
                ? "High"
                : sensorData.temperature > 20
                ? "Normal"
                : "Low"}
            </span>
          </div>
          <div className="text-center">
            <motion.p
              key={`temp-${sensorData.temperature}`}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-5xl font-bold mb-2"
            >
              {sensorData.temperature}
              <span className="text-2xl">°C</span>
            </motion.p>
            <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${temperaturePercentage}%` }}
                transition={{ duration: 0.8 }}
                className={`h-full ${getStatusColor(temperaturePercentage)}`}
              />
            </div>
            <p className="text-sm mt-2 opacity-80">Max: 40°C</p>
          </div>
        </motion.div>

        {/* Humidity Card */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-blue-600/90 to-blue-800/90 rounded-2xl p-6 text-white shadow-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center">
              <WiHumidity className="text-2xl mr-3 text-blue-200" /> Humidity
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20">
              {sensorData.humidity > 70
                ? "High"
                : sensorData.humidity > 40
                ? "Normal"
                : "Low"}
            </span>
          </div>
          <div className="text-center">
            <motion.p
              key={`hum-${sensorData.humidity}`}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-5xl font-bold mb-2"
            >
              {sensorData.humidity}
              <span className="text-2xl">%</span>
            </motion.p>
            <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width:
                    sensorData.humidity !== "--"
                      ? `${((sensorData.humidity - 30) / 50) * 100}%`
                      : "0%",
                }}
                transition={{ duration: 0.8 }}
                className="h-full bg-blue-300"
              />
            </div>
            <p className="text-sm mt-2 opacity-80">Range: 30-80%</p>
          </div>
        </motion.div>

        {/* Device Controls */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-gray-700/90 to-gray-800/90 rounded-2xl p-6 text-white shadow-xl border border-gray-600 hover:border-gray-500 transition-all duration-300"
        >
          <h3 className="text-xl font-semibold mb-6">Device Controls</h3>

          <div className="space-y-4">
            {[
              {
                control: "temperature",
                icon: <FaTemperatureHigh className="mr-3 text-red-300" />,
                label: "Cooling System",
                color: "blue",
              },
              {
                control: "fan",
                icon: <FaFan className="mr-3 text-blue-300" />,
                label: "Ventilation Fan",
                color: "blue",
              },
              {
                control: "fireAlarm",
                icon: <FaFireExtinguisher className="mr-3 text-red-400" />,
                label: "Fire Alarm",
                color: "red",
              },
            ].map((item) => (
              <div
                key={item.control}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  controls[item.control]
                    ? item.color === "red"
                      ? "bg-red-900/30"
                      : "bg-blue-900/30"
                    : "bg-gray-700/50"
                } transition-colors duration-300`}
              >
                <div className="flex items-center">
                  {item.icon}
                  <span
                    className={
                      controls[item.control] ? "text-white" : "text-gray-300"
                    }
                  >
                    {item.label}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={controls[item.control]}
                    onChange={() => toggleControl(item.control)}
                  />
                  <div
                    className={`w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                      controls[item.control]
                        ? item.color === "red"
                          ? "peer-checked:bg-red-500"
                          : "peer-checked:bg-blue-500"
                        : ""
                    }`}
                  ></div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Error Notification */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-red-900/80 border-l-4 border-red-500 text-white p-4 rounded-lg"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">IoT Connection Error</h3>
                <p className="text-sm opacity-90 mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Temperature;
