import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiAlertTriangle, FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import { WiHumidity, WiThermometer } from "react-icons/wi";

const ProductDashboard = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

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
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>0</span>
          <span className={isCritical ? "text-red-500 font-medium" : ""}>
            Threshold: {threshold}
          </span>
          <span>{max}</span>
        </div>
        <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`absolute h-full transition-all duration-700 ease-out ${
              isCritical ? "animate-pulse" : ""
            }`}
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, ${colors.join(", ")})`,
            }}
          />
          <div
            className="absolute h-full border-r-2 border-red-400"
            style={{ left: `${(threshold / max) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  const getStatusIcon = (value, threshold) => {
    if (isLoading)
      return <FiRefreshCw className="animate-spin text-gray-400" />;
    if (value > threshold) return <FiAlertTriangle className="text-red-500" />;
    return <FiCheckCircle className="text-green-500" />;
  };

  return (
    <div className="p-6 bg-gradient-to-br  ">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Product Monitoring Dashboard
            </h1>
            <p className="text-gray-600">Real-time environmental conditions</p>
          </div>
          {lastUpdated && (
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start">
            <FiAlertTriangle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">Connection Error</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Temperature
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Humidity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
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
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <WiThermometer
                            className={`text-2xl ${
                              data.temperature > product.tempThreshold
                                ? "text-red-500"
                                : "text-blue-500"
                            }`}
                          />
                          <div className="flex-1 min-w-[120px]">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">
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
                            className={`text-2xl ${
                              data.humidity > product.humidityThreshold
                                ? "text-amber-500"
                                : "text-green-500"
                            }`}
                          />
                          <div className="flex-1 min-w-[120px]">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {isLoading ? "Updating..." : "Data refreshed"}
            </div>
            <button
              onClick={fetchData}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiRefreshCw
                className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDashboard;
