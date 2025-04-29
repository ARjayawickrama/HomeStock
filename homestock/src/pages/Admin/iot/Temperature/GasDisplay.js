import React, { useState, useEffect } from "react";
import axios from "axios";
import { WiFire } from "react-icons/wi";

const GasDisplay = () => {
  const [gasData, setGasData] = useState({
    ppm: 0,
    raw: 0,
    loading: true,
    error: null,
  });

  const fetchGasData = async () => {
    try {
      const response = await axios.get("http://192.168.228.103/gas");
      setGasData({
        ppm: response.data.gas,
        raw: response.data.raw,
        loading: false,
        error: null,
      });
    } catch (error) {
      setGasData((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to fetch gas data",
      }));
      console.error("Error fetching gas data:", error);
    }
  };

  useEffect(() => {
    fetchGasData();
    const interval = setInterval(fetchGasData, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const getGasLevel = (ppm) => {
    if (ppm > 1000) return "DANGER";
    if (ppm > 500) return "WARNING";
    return "NORMAL";
  };

  const gasLevel = getGasLevel(gasData.ppm);
  const levelColors = {
    DANGER: "bg-red-500",
    WARNING: "bg-yellow-500",
    NORMAL: "bg-green-500",
  };

  const levelTextColors = {
    DANGER: "text-red-500",
    WARNING: "text-yellow-500",
    NORMAL: "text-green-500",
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-xl shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
        <WiFire className="mr-2" /> Gas Concentration Monitor
      </h2>

      {gasData.error && (
        <div className="bg-red-900/80 text-red-100 p-3 rounded-lg mb-4">
          {gasData.error}
        </div>
      )}

      <div className="bg-gray-700 p-6 rounded-lg">
        {gasData.loading ? (
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-32 bg-gray-600 rounded mb-2"></div>
            <div className="h-6 w-24 bg-gray-600 rounded"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-300">Current Reading</p>
                <p className="text-3xl font-bold">
                  {gasData.ppm.toFixed(2)} <span className="text-lg">ppm</span>
                </p>
              </div>
              <div
                className={`px-4 py-2 rounded-full ${levelColors[gasLevel]}`}
              >
                <span className="font-medium">{gasLevel}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>0 ppm</span>
                <span>1000 ppm</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${levelColors[gasLevel]}`}
                  style={{
                    width: `${Math.min(100, (gasData.ppm / 1000) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-600/50 p-3 rounded-lg">
                <p className="text-gray-300">Raw Value</p>
                <p className="text-xl font-mono">{gasData.raw}</p>
              </div>
              <div className="bg-gray-600/50 p-3 rounded-lg">
                <p className="text-gray-300">Status</p>
                <p className={`text-xl ${levelTextColors[gasLevel]}`}>
                  {gasLevel === "DANGER"
                    ? "⚠️ Danger"
                    : gasLevel === "WARNING"
                    ? "⚠️ Warning"
                    : "✅ Normal"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 text-center text-sm text-gray-400">
        <p>Last updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default GasDisplay;
