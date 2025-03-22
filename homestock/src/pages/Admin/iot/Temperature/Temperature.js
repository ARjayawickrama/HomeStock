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
        const response = await axios.get("http://192.168.181.103/data");
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
        <div className="bg-gradient-to-br from-white  to  p-6 rounded-xl shadow-lg border">
          <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2 mb-4">
            <FaTemperatureHigh className="text-2xl text-orange-500" /> Current
            Temp
          </h3>
          <div className="text-center py-6">
            <span className="text-5xl font-bold text-slate-800">
              {data.temperature}
            </span>
            <span className="text-xl text-slate-500">°C</span>
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
        <div className="bg-gradient-to-br from-white to-blue-200 p-6 rounded-xl shadow-lg border">
          <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2 mb-4">
            <FaTemperatureHigh className="text-2xl text-blue-500" /> Humidity
          </h3>
          <div className="text-center py-6">
            <span className="text-5xl font-bold text-slate-800">
              {data.humidity}
            </span>
            <span className="text-xl text-slate-500">°C</span>
            <p className="text-sm text-slate-600 mt-4">System Safety Limit</p>
          </div>
        </div>

        {/* Control Switches */}
        <div className="bg-white p-6 rounded-xl shadow-lg border space-y-6">
          {/* Fire Alarm */}
          <SwitchControl
            icon={<FaFire className="text-xl text-red-600" />}
            label="power 1"
            subLabel="Emergency shutdown"
            isOn={fireAlarm}
            toggle={() => handleToggle(setFireAlarm)}
          />

          {/* Temperature Control */}
          <SwitchControl
            icon={<FaTemperatureHigh className="text-xl text-blue-600" />}
            label="Power 2"
            subLabel="Auto regulation"
            isOn={temperatureControl}
            toggle={() => handleToggle(setTemperatureControl)}
          />
          <SwitchControl
            icon={<FaTemperatureHigh className="text-xl text-blue-600" />}
            label="Power 2"
            subLabel="Auto regulation"
            isOn={temperatureControl}
            toggle={() => handleToggle(setTemperatureControl)}
          />
        </div>
      </div>
    </section>
  );
}

// Switch Control Component
function SwitchControl({ icon, label, subLabel, isOn, toggle }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-slate-100">{icon}</div>
        <div>
          <h4 className="font-semibold text-slate-700">{label}</h4>
          <p className="text-sm text-slate-500">{subLabel}</p>
        </div>
      </div>
      <button
        onClick={toggle}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          isOn ? "bg-blue-500" : "bg-slate-300"
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
            isOn ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export default Temperature;
