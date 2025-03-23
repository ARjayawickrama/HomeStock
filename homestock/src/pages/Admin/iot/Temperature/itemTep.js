import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductDashboard = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://192.168.14.103/temperature");
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderGauge = (value, max, colors) => {
    const percentage = Math.min((value / max) * 100, 100);
    return (
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute h-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${colors.join(", ")})`,
          }}
        />
      </div>
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 relative top-11 to-blue-50 rounded-2xl shadow-2xl shadow-blue-100/50">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl flex items-center">
          <span className="animate-pulse">⚠️</span>
          <span className="ml-2 text-sm">{error}</span>
        </div>
      )}

      {/* Table for Product and Environment Information */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Product Details</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Temperature</th>
              <th className="py-3 px-4 text-left">Humidity</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="py-3 px-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : (
              <>
                {/* First Product Row */}
                <tr>
                  <td className="py-3 px-4">
                    {data.product || "Molding fish"}
                  </td>
                  <td className="py-3 px-4">{data.category || "Seafood"}</td>
                  <td className="py-3 px-4">
                    {data.temperature || 0}°C
                    {renderGauge(data.temperature || 0, 100, [
                      "#3b82f6",
                      "#10b981",
                    ])}
                  </td>
                  <td className="py-3 px-4">
                    {data.humidity || 0}%
                    {renderGauge(data.humidity || 0, 100, [
                      "#fbbf24",
                      "#f97316",
                    ])}
                  </td>
                </tr>

                {/* Second Product Row */}
                <tr>
                  <td className="py-3 px-4">{data.product || "Milk"}</td>
                  <td className="py-3 px-4">{data.category || "Dairy"}</td>
                  <td className="py-3 px-4">
                    {data.temperature || 0}°C
                    {renderGauge(data.temperature || 0, 100, [
                      "#3b82f6",
                      "#10b981",
                    ])}
                  </td>
                  <td className="py-3 px-4">
                    {data.humidity || 0}%
                    {renderGauge(data.humidity || 0, 100, [
                      "#fbbf24",
                      "#f97316",
                    ])}
                  </td>
                </tr>

                {/* Second Product Row */}
                <tr>
                  <td className="py-3 px-4">{data.product || "Eggs"}</td>
                  <td className="py-3 px-4">{data.category || "Poultry"}</td>
                  <td className="py-3 px-4">
                    {data.temperature || 0}°C
                    {renderGauge(data.temperature || 0, 100, [
                      "#3b82f6",
                      "#10b981",
                    ])}
                  </td>
                  <td className="py-3 px-4">
                    {data.humidity || 0}%
                    {renderGauge(data.humidity || 0, 100, [
                      "#fbbf24",
                      "#f97316",
                    ])}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDashboard;
