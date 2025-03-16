import React, { useState } from "react";
import {
  FaThermometerHalf,
  FaTint,
  FaLeaf,
  FaMugHot,
  FaFilter,
} from "react-icons/fa";

function ProductTable() {
  const [products] = useState([
    {
      id: 1,
      name: "Tea Leaves",
      category: "Raw Material",
      icon: <FaLeaf className="text-green-600 text-xl" />,
      temperature: 15,
      maxTemperature: 50,
      humidity: 40,
      maxHumidity: 100,
    },
    {
      id: 2,
      name: "Green Tea",
      category: "Processed",
      icon: <FaMugHot className="text-yellow-500 text-xl" />,
      temperature: 25,
      maxTemperature: 50,
      humidity: 60,
      maxHumidity: 100,
    },
    {
      id: 3,
      name: "Black Tea",
      category: "Processed",
      icon: <FaMugHot className="text-red-600 text-xl" />,
      temperature: 40,
      maxTemperature: 50,
      humidity: 50,
      maxHumidity: 100,
    },
    {
      id: 4,
      name: "Herbal Tea",
      category: "Herbal",
      icon: <FaLeaf className="text-green-400 text-xl" />,
      temperature: 10,
      maxTemperature: 50,
      humidity: 30,
      maxHumidity: 100,
    },
    {
      id: 5,
      name: "Oolong Tea",
      category: "Processed",
      icon: <FaMugHot className="text-purple-600 text-xl" />,
      temperature: 35,
      maxTemperature: 50,
      humidity: 55,
      maxHumidity: 100,
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("All Items");

  const calculatePercentage = (value, maxValue) => (value / maxValue) * 100;
  const getTemperatureColor = (percentage) =>
    percentage < 30
      ? "bg-blue-500"
      : percentage < 70
      ? "bg-green-500"
      : "bg-red-500";
  const getHumidityColor = (percentage) =>
    percentage < 30
      ? "bg-blue-300"
      : percentage < 70
      ? "bg-yellow-300"
      : "bg-red-300";

  const filteredProducts =
    selectedCategory === "All Items"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="p-6">
      {/* Filter Dropdown */}
      <div className="mb-4 flex items-center space-x-3">
        <FaFilter className="text-green-600 text-xl" />
        <select
          className="px-4 py-2 border border-gray-400 rounded-lg bg-white text-gray-800 shadow-md focus:ring-2 focus:ring-green-600"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All Items">All Items</option>
          <option value="Raw Material">Raw Material</option>
          <option value="Processed">Processed</option>
          <option value="Herbal">Herbal</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
          <thead className="bg-gradient-to-r from-black to-indigo-900 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Temperature</th>
              <th className="py-3 px-4 text-left">Humidity</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const temperaturePercentage = calculatePercentage(
                product.temperature,
                product.maxTemperature
              );
              const humidityPercentage = calculatePercentage(
                product.humidity,
                product.maxHumidity
              );

              return (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="py-3 px-4 flex items-center space-x-2">
                    {product.icon}
                    <span className="font-medium">{product.name}</span>
                  </td>
                  <td className="py-3 px-4">{product.category}</td>

                  {/* Temperature Progress Bar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <FaThermometerHalf className="text-blue-600" />
                      <span>{product.temperature}°C</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-md mt-1">
                      <div
                        className={`${getTemperatureColor(
                          temperaturePercentage
                        )} h-2 rounded-md`}
                        style={{ width: `${temperaturePercentage}%` }}
                      ></div>
                    </div>
                  </td>

                  {/* Humidity Progress Bar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <FaTint className="text-blue-600" />
                      <span>{product.humidity}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-md mt-1">
                      <div
                        className={`${getHumidityColor(
                          humidityPercentage
                        )} h-2 rounded-md`}
                        style={{ width: `${humidityPercentage}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTable;
