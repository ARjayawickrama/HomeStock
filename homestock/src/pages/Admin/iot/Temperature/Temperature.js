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
      {/* Temperature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card: Current Temperature */}
        <div className="bg-blue-50 p-6 rounded-xl shadow-lg flex flex-col items-center">
          <h3 className="text-xl font-semibold text-blue-600 flex items-center">
            <FaTemperatureHigh className="mr-2 text-blue-600" /> {/* Temperature icon */}
            Current Temperature
          </h3>
          <div className="flex items-center justify-center w-32 h-32 bg-blue-100 rounded-full shadow-md mt-4">
            <p className="text-3xl font-bold text-blue-500">{currentTemperature}°C</p>
          </div>
          <div className={`mt-6 p-3 rounded-full ${getStatusColor(temperaturePercentage)} text-center w-full`}>
            <p className="text-sm font-medium text-white">Status: Normal</p>
          </div>
        </div>

        {/* Card: Max Temperature */}
        <div className="bg-green-50 p-6 rounded-xl shadow-lg flex flex-col items-center">
          <h3 className="text-xl font-semibold text-green-600 flex items-center">
            <FaTemperatureHigh className="mr-2 text-green-600" /> {/* Temperature icon */}
            Max Temperature
          </h3>
          <div className="flex items-center justify-center w-32 h-32 bg-green-100 rounded-full shadow-md mt-4">
            <p className="text-3xl font-bold text-green-500">{maxTemperature}°C</p>
          </div>
          <div className={`mt-6 p-3 rounded-full ${getStatusColor(temperaturePercentage)} text-center w-full`}>
            <p className="text-sm font-medium text-white">Status: Normal</p>
          </div>
        </div>
      </div>

      {/* Switches Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Fire Alarm */}
        <div className="flex items-center space-x-4">
          <FaFire className={`text-2xl ${fireAlarm ? 'text-red-600' : 'text-gray-500'}`} />
          <button
            className={`text-sm font-semibold ${fireAlarm ? 'text-red-600' : 'text-gray-500'}`}
            onClick={() => handleToggle(setFireAlarm)}
          >
            Fire Alarm
          </button>
        </div>

        {/* Temperature Control */}
        <div className="flex items-center space-x-4">
          <FaTemperatureHigh className={`text-2xl ${temperatureControl ? 'text-yellow-600' : 'text-gray-500'}`} />
          <button
            className={`text-sm font-semibold ${temperatureControl ? 'text-yellow-600' : 'text-gray-500'}`}
            onClick={() => handleToggle(setTemperatureControl)}
          >
            Temperature Control
          </button>
        </div>

        {/* Fan */}
        <div className="flex items-center space-x-4">
          <FaFan className={`text-2xl ${fan ? 'text-blue-600' : 'text-gray-500'}`} />
          <button
            className={`text-sm font-semibold ${fan ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => handleToggle(setFan)}
          >
            Fan
          </button>
        </div>
      </div>
    </section>
  );
}

export default Temperature;
