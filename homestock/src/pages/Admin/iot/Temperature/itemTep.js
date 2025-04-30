import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiAlertTriangle, FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import { WiHumidity, WiThermometer } from "react-icons/wi";
import { motion, AnimatePresence } from "framer-motion";

const ProductDashboard = () => {
  // Your existing state and logic remains unchanged
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [pulse, setPulse] = useState(false);

  const products = [
    {
      id: 1,
      name: "Molding Fish",
      category: "Seafood",
      tempThreshold: 5,
      humidityThreshold: 80,
    },
    {
      id: 2,
      name: "Fresh Milk",
      category: "Dairy",
      tempThreshold: 4,
      humidityThreshold: 70,
    },
    {
      id: 3,
      name: "Organic Eggs",
      category: "Poultry",
      tempThreshold: 7,
      humidityThreshold: 75,
    },
  ];

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://192.168.14.103/temperature");
      setData(response.data);
      setLastUpdated(new Date());
      setError(null);
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    } catch (err) {
      setError("Failed to connect to monitoring system");
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderGauge = (value, max, colors, threshold) => {
    const percentage = Math.min((value / max) * 100, 100);
    const isCritical = value > threshold;

    return (
      <div className="relative w-full">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>0</span>
          <span className={isCritical ? "text-red-400 font-medium" : ""}>
            Threshold: {threshold}
          </span>
          <span>{max}</span>
        </div>
        <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8 }}
            className={`absolute h-full ${isCritical ? "animate-pulse" : ""}`}
            style={{
              background: `linear-gradient(90deg, ${colors.join(", ")})`,
            }}
          />
          <div
            className="absolute h-full border-r-2 border-red-400/80"
            style={{ left: `${(threshold / max) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  const getStatusIcon = (value, threshold) => {
    if (isLoading)
      return <FiRefreshCw className="animate-spin text-blue-400" />;
    if (value > threshold) return <FiAlertTriangle className="text-red-400" />;
    return <FiCheckCircle className="text-green-400" />;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header with connection status */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Product Monitoring Dashboard
            </h1>
            <p className="text-gray-400">Real-time environmental conditions</p>
          </div>

          <div className="flex items-center space-x-4">
            {lastUpdated && (
              <div className="text-sm text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
            <div
              className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                error
                  ? "bg-red-900/30 text-red-400"
                  : "bg-blue-900/30 text-blue-400"
              }`}
            >
              <span
                className={`relative flex h-2 w-2 mr-2 ${
                  pulse ? "animate-ping" : ""
                }`}
              >
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    error ? "bg-red-400" : "bg-blue-400"
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    error ? "bg-red-400" : "bg-blue-400"
                  }`}
                ></span>
              </span>
              {error ? "Disconnected" : "Connected"}
            </div>
          </div>
        </div>

        {/* Error Notification */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-900/50 border-l-4 border-red-500 rounded-lg flex items-start"
            >
              <FiAlertTriangle className="text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-200">Connection Error</h3>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Table */}
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Temperature
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Humidity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center space-x-2 text-gray-500">
                        <FiRefreshCw className="animate-spin" />
                        <span>Loading product data...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-750/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {product.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/30 text-blue-400">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <WiThermometer
                            className={`text-3xl ${
                              data.temperature > product.tempThreshold
                                ? "text-red-400"
                                : "text-blue-400"
                            }`}
                          />
                          <div className="flex-1 min-w-[120px]">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-white">
                                {data.temperature || 0}°C
                              </span>
                              {getStatusIcon(
                                data.temperature,
                                product.tempThreshold
                              )}
                            </div>
                            {renderGauge(
                              data.temperature || 0,
                              100,
                              ["#3b82f6", "#10b981"],
                              product.tempThreshold
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <WiHumidity
                            className={`text-3xl ${
                              data.humidity > product.humidityThreshold
                                ? "text-amber-400"
                                : "text-green-400"
                            }`}
                          />
                          <div className="flex-1 min-w-[120px]">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-white">
                                {data.humidity || 0}%
                              </span>
                              {getStatusIcon(
                                data.humidity,
                                product.humidityThreshold
                              )}
                            </div>
                            {renderGauge(
                              data.humidity || 0,
                              100,
                              ["#fbbf24", "#f97316"],
                              product.humidityThreshold
                            )}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-gray-900/50 px-6 py-3 flex items-center justify-between border-t border-gray-700">
            <div className="text-sm text-gray-400">
              {isLoading ? "Updating..." : "Monitoring active"}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchData}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-1.5 border border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <FiRefreshCw
                className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </motion.button>
          </div>
        </div>
      </div>

      {/* Floating IoT Elements */}
      <div className="fixed top-1/4 left-1/4 w-8 h-8 rounded-full bg-blue-500/10 animate-float pointer-events-none"></div>
      <div className="fixed top-1/3 right-1/3 w-6 h-6 rounded-full bg-green-500/10 animate-float-delay pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-10 h-10 rounded-full bg-indigo-500/10 animate-float pointer-events-none"></div>
    </div>
  );
};

export default ProductDashboard;
