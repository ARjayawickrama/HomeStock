import React, { useState } from "react";
import { FaFire, FaFan, FaTemperatureHigh } from "react-icons/fa";

function Temperature({
  currentTemperature,
  maxTemperature,
  temperaturePercentage,
}) {
  // Status color with refined shades
  const getStatusColor = (percentage) => {
    if (percentage > 80) return "bg-red-600"; // Deeper red
    if (percentage > 50) return "bg-amber-500"; // Warm amber
    return "bg-emerald-600"; // Rich green
  };

  const [fireAlarm, setFireAlarm] = useState(false);
  const [temperatureControl, setTemperatureControl] = useState(false);
  const [fan, setFan] = useState(false);

  const handleToggle = (setter) => setter((prev) => !prev);

  return (
    <section className="mt-8 px-6 py-8 rounded-2xl shadow-sm space-y-6">
      <div className=" p-6 rounded-2xl ">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-black flex items-center space-x-3">
            <FaTemperatureHigh className="text-4xl text-amber-300" />
            <span>Temperature Control Overview</span>
          </h2>

          <p className="text-lg text-black italic hidden lg:block">
            Monitor and adjust temperature settings in real-time
          </p>
        </div>
      </div>
      <hr className="h-px my-8 bg-black border-0 dark:bg-gray-700" />

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Current Temperature Card */}
        <div className="bg-gradient-to-br from-white to-slate-100 p-6 rounded-xl shadow-lg border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <FaTemperatureHigh className="text-2xl text-orange-500" />
              Current Temp
            </h3>
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600">
              Live
            </span>
          </div>
          <div className="text-center py-6">
            <div className="inline-flex items-end gap-1">
              <span className="text-5xl font-bold text-slate-800">
                {currentTemperature}
              </span>
              <span className="text-xl text-slate-500 mb-1">°C</span>
            </div>
            <div
              className={`mt-4 mx-auto w-3/4 h-2 rounded-full overflow-hidden bg-slate-200`}
            >
              <div
                className={`h-full ${getStatusColor(
                  temperaturePercentage
                )} transition-all duration-500`}
                style={{ width: `${temperaturePercentage}%` }}
                aria-label={`Temperature: ${temperaturePercentage}%`}
              />
            </div>
          </div>
        </div>

        {/* Max Temperature Card */}
        <div className="bg-gradient-to-br from-white to-slate-100 p-6 rounded-xl shadow-lg border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <FaTemperatureHigh className="text-2xl text-blue-500" />
              Max Temp
            </h3>
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600">
              Threshold
            </span>
          </div>
          <div className="text-center py-6">
            <div className="inline-flex items-end gap-1">
              <span className="text-5xl font-bold text-slate-800">
                {maxTemperature}
              </span>
              <span className="text-xl text-slate-500 mb-1">°C</span>
            </div>
            <div className="mt-4 text-sm font-medium text-slate-600">
              System Safety Limit
            </div>
          </div>
        </div>

        {/* Control Switches */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 space-y-6">
          {/* Fire Alarm Switch */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-100 text-red-600">
                <FaFire className="text-xl" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-700">Fire Alarm</h4>
                <p className="text-sm text-slate-500">Emergency shutdown</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle(setFireAlarm)}
              aria-label={`Fire alarm ${fireAlarm ? "on" : "off"}`}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                fireAlarm ? "bg-red-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                  fireAlarm ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Temperature Control Switch */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <FaTemperatureHigh className="text-xl" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-700">
                  Climate Control
                </h4>
                <p className="text-sm text-slate-500">Auto regulation</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle(setTemperatureControl)}
              aria-label={`Climate control ${
                temperatureControl ? "on" : "off"
              }`}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                temperatureControl ? "bg-blue-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                  temperatureControl ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Fan Control Switch */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                <FaFan className="text-xl" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-700">Cooling Fan</h4>
                <p className="text-sm text-slate-500">Ventilation system</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle(setFan)}
              aria-label={`Cooling fan ${fan ? "on" : "off"}`}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                fan ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                  fan ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Temperature;
