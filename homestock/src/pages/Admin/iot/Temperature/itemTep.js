import React, { useState } from "react";

function AllProductsTemperature() {
  
  const [products, setProducts] = useState([
    { id: 1, name: "Tea Leaves", category: "Raw Material", temperature: 15, maxTemperature: 50, humidity: 40, maxHumidity: 100 },
    { id: 2, name: "Green Tea", category: "Processed", temperature: 25, maxTemperature: 50, humidity: 60, maxHumidity: 100 },
    { id: 3, name: "Black Tea", category: "Processed", temperature: 40, maxTemperature: 50, humidity: 50, maxHumidity: 100 },
    { id: 4, name: "Herbal Tea", category: "Herbal", temperature: 10, maxTemperature: 50, humidity: 30, maxHumidity: 100 },
    { id: 5, name: "Oolong Tea", category: "Processed", temperature: 35, maxTemperature: 50, humidity: 55, maxHumidity: 100 },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("All Items");

  
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

  const filteredProducts = selectedCategory === "All Items" 
    ? products 
    : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="p-6">
     
      <div className="mb-4">
        <select
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All Items">All Items</option>
          <option value="Raw Material">Raw Material</option>
          <option value="Processed">Processed</option>
          <option value="Herbal">Herbal</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.slice(0, 3).map((product) => {
          const temperaturePercentage = (product.temperature / product.maxTemperature) * 100;
          const humidityPercentage = (product.humidity / product.maxHumidity) * 100;
          return (
            <div key={product.id} className="p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700">{product.name}</h2>
              <p className="text-gray-500">{product.category}</p>
              <p className="text-gray-600">Temperature: {product.temperature}°C</p>
              <p className="text-gray-600">Humidity: {product.humidity}%</p>

           
              <div className="mt-2">
                <div className="relative w-full bg-gray-200 h-4 rounded-lg">
                  <div
                    className={`${getTemperatureColor(temperaturePercentage)} h-4 rounded-lg transition-all duration-300`}
                    style={{ width: `${temperaturePercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-600">
                  <span>Cold</span>
                  <span>Normal</span>
                  <span>Hot</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="relative w-full bg-gray-200 h-4 rounded-lg">
                  <div
                    className={`${getHumidityColor(humidityPercentage)} h-4 rounded-lg transition-all duration-300`}
                    style={{ width: `${humidityPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-600">
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
