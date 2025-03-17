import React, { useState } from "react";
import Switches from "../Switches/Switches";
import {
  FaFire,
  FaFan,
  FaTemperatureHigh,
  FaMapMarkerAlt,
} from "react-icons/fa";
import backgroundImage from "../../../../assets/g2.png";
import AAA from "../../../../assets/map2.png";
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
    <section className=" px-6 py-8 rounded-2xl shadow-sm space-y-6 relative bottom-11">
      <div className=" p-6 rounded-2xl ">
        <div className="flex items-center justify-between">
          <div className="relative w-36 h-1  bottom-20 ">
            <img
              src={backgroundImage}
              alt="EV Car"
              className="w-full   rounded-lg "
            />
            <div className=" relative left-32  bottom-11">
              <p className="  text-white  font-bold bg-slate-900/60 px-4 rounded-md">
                Available Range: <span className="text-yellow-300">30%</span>
              </p>
            </div>
          </div>

          <div
            className="bg-slate-200 bg-opacity-80 p-4 rounded-xl bg-cover bg-center"
            style={{ backgroundImage: `url(${AAA})` }}
          >
            <Switches />
          </div>
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
