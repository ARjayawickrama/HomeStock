import React, { useState, useEffect } from "react";
import TmpChart from "../Charts/TmpChart";
import { FaFire, FaFan, FaTemperatureHigh } from "react-icons/fa";
import axios from "axios";
import backgroundImage from "../../../../assets/g2.png";

function Temperature({ temperaturePercentage }) {
  const getStatusColor = (percentage) => {
    if (percentage > 80) return "bg-red-600";
    if (percentage > 50) return "bg-amber-500";
    return "bg-emerald-600";
  };

  const [fireAlarm, setFireAlarm] = useState(false);
  const [temperatureControl, setTemperatureControl] = useState(false);
  const [fan, setFan] = useState(false);
  const [data, setData] = useState({ temperature: null, humidity: null });
  const [gasValue, setGasValue] = useState(null);
  const [error, setError] = useState(null);

  const handleToggle = (setter) => setter((prev) => !prev);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://192.168.181.103/temperature");
        setData(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data from the ESP32 server.");
      }
    };

    const fetchGasValue = async () => {
      try {
        const response = await axios.get("http://192.168.181.103/gas");
        setGasValue(response.data.gas_value);
      } catch (error) {
        console.error("Error fetching gas value:", error);
      }
    };

    fetchData();
    fetchGasValue();
    const dataInterval = setInterval(fetchData, 5000);
    const gasInterval = setInterval(fetchGasValue, 2000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(gasInterval);
    };
  }, []);

  return (
    <section className="px-6 py-8 rounded-2xl shadow-sm space-y-6 relative bottom-20">
      <div className="p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="relative w-36 h-1 bottom-20">
            <img
              src={backgroundImage}
              alt="Background"
              className=" rounded-lg h-40 mt-16"
            />

            <div className="relative left-32 bottom-32">
              <p className="text-white font-bold bg-slate-900/60 px-4 rounded-md">
                {gasValue !== null ? (
                  <div>
                    <p className="text-xl">
                      Gas Value: <span className="font-bold">{gasValue}</span>
                    </p>
                    <p className="mt-2">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          gasValue >= 2000 ? "text-red-600" : ""
                        }`}
                      >
                        {gasValue < 300 && "Clean Air"}
                        {gasValue >= 300 &&
                          gasValue < 1000 &&
                          "Low Concentration"}
                        {gasValue >= 1000 &&
                          gasValue < 2000 &&
                          "Moderate Concentration"}
                        {gasValue >= 2000 &&
                          "High Concentration - Possible Hazard!"}
                      </span>
                    </p>
                  </div>
                ) : (
                  "Loading..."
                )}
              </p>
            </div>
          </div>

          <div class="h-80 border-l border-black mx-4 absolute left-80"></div>

          <TmpChart />
        </div>
      </div>
      <hr className="h-px my-8 bg-black border-0 dark:bg-gray-700" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Current Temperature */}
        <div className="bg-gradient-to-br from-red-900 to-black  p-6 rounded-xl shadow-lg border">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <FaTemperatureHigh className="text-2xl text-white" /> Current Temp
          </h3>
          <div className="text-center py-6">
            <span className="text-5xl font-bold text-white">
              {data.temperature}
            </span>
            <span className="text-2xl text-white">°C</span>
            <div className="mt-4 w-3/4 mx-auto h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStatusColor(
                  temperaturePercentage
                )} transition-all duration-500`}
                style={{ width: `${temperaturePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Max Temperature */}
        <div className="bg-gradient-to-br from-blue-900 to-black  p-6 rounded-xl shadow-lg border border-blue-400">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
            <FaTemperatureHigh className="text-3xl text-white drop-shadow-md" />{" "}
            Humidity
          </h3>
          <div className="text-center py-6">
            <span className="text-6xl font-extrabold text-white drop-shadow-lg">
              {data.humidity}
            </span>
            <span className="text-2xl text-white font-medium">%</span>
          </div>
        </div>

        {/* Control Switches */}
        <div className="bg-gradient-to-br from-slate-800 to-black p-6 rounded-xl shadow-lg border border-blue-300 space-y-6">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={temperatureControl}
              onChange={() => handleToggle(setTemperatureControl)}
            />
            <div className="relative w-12 h-7 bg-gray-300 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-400 dark:peer-focus:ring-blue-700 dark:bg-gray-700 peer-checked:bg-blue-500 transition-all duration-300">
              <div
                className={`absolute top-0.5 ${
                  temperatureControl && "left-[21px]"
                } start-[3px] w-6 h-6 bg-white border border-gray-300 rounded-full transition-all duration-300 peer-checked:translate-x-5 peer-checked:border-blue-500 shadow-md`}
              ></div>
            </div>
            <span className="ms-3 text-base font-semibold text-gray-800 dark:text-gray-300">
              Power ON & OFF
            </span>
          </label>
        </div>
      </div>
    </section>
  );
}

export default Temperature;
