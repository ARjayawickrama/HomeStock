import React, { useState } from 'react';
import { FaFire, FaFan, FaTemperatureHigh } from 'react-icons/fa'; // Import the necessary icons

function Temperature({ currentTemperature, maxTemperature, temperaturePercentage }) {
  // Define the status color based on the temperature percentage
  const getStatusColor = (percentage) => {
    if (percentage > 80) {
      return 'bg-red-500'; // Red for high temperatures
    } else if (percentage > 50) {
      return 'bg-yellow-500'; // Yellow for moderate temperatures
    }
    return 'bg-green-500'; // Green for low temperatures
  };

  // State to manage the switches
  const [fireAlarm, setFireAlarm] = useState(false);
  const [temperatureControl, setTemperatureControl] = useState(false);
  const [fan, setFan] = useState(false);

  // Toggle switch state function
  const handleToggle = (setter) => {
    setter((prevState) => !prevState);
  };

  return (
    <section className="mt-8 px-6 py-8 bg-white rounded-xl shadow-lg space-y-6">
      {/* Header Tile */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl shadow-lg flex items-center justify-between">
  <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
    <FaTemperatureHigh className="text-4xl text-yellow-300" /> {/* Icon */}
    <span>Temperature Control Overview</span>
  </h2>
  <div className="text-lg text-gray-200 italic">
    Monitor and adjust the temperature settings below.
  </div>
</div>


      {/* Temperature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* Card: Current Temperature */}
  <div className="bg-gradient-to-r from-blue-400 to-black p-6 rounded-xl shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300 ease-in-out">
    <h3 className="text-2xl font-semibold text-white flex items-center space-x-2">
      <FaTemperatureHigh className="text-4xl text-yellow-300" /> {/* Temperature icon */}
      <span>Current Temperature</span>
    </h3>
    <div className="flex items-center justify-center w-32 h-32 bg-white rounded-full shadow-lg mt-4">
      <p className="text-4xl font-bold text-blue-600">{currentTemperature}°C</p>
    </div>
    <div className={`mt-6 p-3 rounded-full ${getStatusColor(temperaturePercentage)} text-center w-full`}>
      <p className="text-sm font-medium text-white">Status: Normal</p>
    </div>
  </div>

  {/* Card: Max Temperature */}
  <div className="bg-gradient-to-r from-green-400 to-black p-6 rounded-xl shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300 ease-in-out">
    <h3 className="text-2xl font-semibold text-white flex items-center space-x-2">
      <FaTemperatureHigh className="text-4xl text-yellow-300" /> {/* Temperature icon */}
      <span>Max Temperature</span>
    </h3>
    <div className="flex items-center justify-center w-32 h-32 bg-white rounded-full shadow-lg mt-4">
      <p className="text-4xl font-bold text-green-600">{maxTemperature}°C</p>
    </div>
    <div className={`mt-6 p-3 rounded-full ${getStatusColor(temperaturePercentage)} text-center w-full`}>
      <p className="text-sm font-medium text-white">Status: Normal</p>
    </div>
  </div>
</div>

    </section>
  );
}

export default Temperature;
