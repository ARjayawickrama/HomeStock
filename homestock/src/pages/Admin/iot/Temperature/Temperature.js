import React from 'react';

function Temperature({ currentTemperature, maxTemperature, temperaturePercentage }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-medium text-gray-800">Temperature</h2>
      <div className="flex justify-between items-center mt-4">
        <div className="text-gray-600">
          <p className="text-lg">Current Temperature:</p>
          <p className="text-2xl font-bold text-blue-500">{currentTemperature}°C</p>
        </div>
        <div className="bg-blue-100 p-2 rounded-lg">
          <p className="text-sm text-gray-600">Status: Normal</p>
        </div>
      </div>

      {/* Simple Temperature Meter (Progress Bar) */}
      <div className="mt-6">
        <p className="text-lg text-gray-600">Temperature Meter:</p>
        <div className="relative w-full bg-gray-200 h-4 rounded-lg">
          <div
            className="bg-blue-500 h-4 rounded-lg"
            style={{ width: `${temperaturePercentage}%` }}
          ></div>
          <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-2">
            <span className="text-xs text-gray-600">{0}°C</span>
            <span className="text-xs text-gray-600">{maxTemperature}°C</span>
          </div>
        </div>
      </div>
      <section className="mt-8 flex justify-between">
        <button className="px-6 py-3 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition duration-300">
          Refresh Data
        </button>
        <button className="px-6 py-3 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition duration-300">
          Turn Off System
        </button>
      </section>
    </section>
  );
}

export default Temperature;
