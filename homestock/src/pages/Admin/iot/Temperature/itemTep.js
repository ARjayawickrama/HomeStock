import React, { useState } from "react";
import { FaThermometerFull, FaTint } from "react-icons/fa"; // Import icons

function AllProductsTemperature() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Tea Leaves",
      category: "Raw Material",
      temperature: 15,
      maxTemperature: 50,
      humidity: 40,
      maxHumidity: 100,
    },
    {
      id: 2,
      name: "Green Tea",
      category: "Processed",
      temperature: 25,
      maxTemperature: 50,
      humidity: 60,
      maxHumidity: 100,
    },
    {
      id: 3,
      name: "Black Tea",
      category: "Processed",
      temperature: 40,
      maxTemperature: 50,
      humidity: 50,
      maxHumidity: 100,
    },
    {
      id: 4,
      name: "Herbal Tea",
      category: "Herbal",
      temperature: 10,
      maxTemperature: 50,
      humidity: 30,
      maxHumidity: 100,
    },
    {
      id: 5,
      name: "Oolong Tea",
      category: "Processed",
      temperature: 35,
      maxTemperature: 50,
      humidity: 55,
      maxHumidity: 100,
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("All Items");

  // Helper function to calculate percentage
  const calculatePercentage = (value, maxValue) => (value / maxValue) * 100;

  // Temperature color based on percentage
  const getTemperatureColor = (percentage) => {
    if (percentage < 30) return "bg-blue-500";
    if (percentage < 70) return "bg-green-500";
    return "bg-red-500";
  };

  const getHumidityColor = (percentage) => {
    if (percentage < 30) return "bg-blue-300";
    if (percentage < 70) return "bg-yellow-300";
    return "bg-red-300";
  };

  const filteredProducts =
    selectedCategory === "All Items"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="p-6">
      <div className="mb-6">
        <select
          className="px-6 py-3 border-2 border-gray-300 rounded-lg bg-black text-gray-800 shadow-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 hover:border-green-500 hover:shadow-md"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option className="bg-black text-gray-800" value="All Items">
            All Items
          </option>
          <option className="bg-black text-gray-800" value="Raw Material">
            Raw Material
          </option>
          <option className="bg-black text-gray-800" value="Processed">
            Processed
          </option>
          <option className="bg-black text-gray-800" value="Herbal">
            Herbal
          </option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.slice(0, 3).map((product) => {
          const temperaturePercentage = calculatePercentage(
            product.temperature,
            product.maxTemperature
          );
          const humidityPercentage = calculatePercentage(
            product.humidity,
            product.maxHumidity
          );

          return (
            <div
              key={product.id}
              className="p-6 bg-gradient-to-r from-white to-blue-50  rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-black mb-2">
                {product.name}
              </h2>
              <p className="text-black mb-2">{product.category}</p>
              <p className="text-black mb-4">
                <FaThermometerFull className="inline-block mr-2 text-blue-600" />
                Temperature: {product.temperature}°C
              </p>
              <p className="text-black mb-4">
                <FaTint className="inline-block mr-2 text-blue-600" />
                Humidity: {product.humidity}%
              </p>

              {/* Temperature Bar */}
              <div className="mt-4">
                <div className="relative w-full bg-gray-200 h-4 rounded-lg">
                  <div
                    className={`${getTemperatureColor(
                      temperaturePercentage
                    )} h-4 rounded-lg transition-all duration-500`}
                    style={{ width: `${temperaturePercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-black">
                  <span>Cold</span>
                  <span>Normal</span>
                  <span>Hot</span>
                </div>
              </div>

              {/* Humidity Bar */}
              <div className="mt-4">
                <div className="relative w-full bg-gray-200 h-4 rounded-lg">
                  <div
                    className={`${getHumidityColor(
                      humidityPercentage
                    )} h-4 rounded-lg transition-all duration-500`}
                    style={{ width: `${humidityPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-black">
                  <span>Low</span>
                  <span>Normal</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AllProductsTemperature;
