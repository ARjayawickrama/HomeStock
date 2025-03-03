import React from 'react';

function Humidity({ currentHumidity, maxHumidity, humidityPercentage }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-medium text-gray-800">Humidity</h2>
      <div className="flex justify-between items-center mt-4">
        <div className="text-gray-600">
          <p className="text-lg">Current Humidity:</p>
          <p className="text-2xl font-bold text-green-500">{currentHumidity}%</p>
        </div>
        <div className="bg-green-100 p-2 rounded-lg">
          <p className="text-sm text-gray-600">Status: Optimal</p>
        </div>
      </div>

      {/* Simple Humidity Meter (Progress Bar) */}
      <div className="mt-6">
        <p className="text-lg text-gray-600">Humidity Meter:</p>
        <div className="relative w-full bg-gray-200 h-4 rounded-lg">
          <div
            className="bg-green-500 h-4 rounded-lg"
            style={{ width: `${humidityPercentage}%` }}
          ></div>
          <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-2">
            <span className="text-xs text-gray-600">{0}%</span>
            <span className="text-xs text-gray-600">{maxHumidity}%</span>
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

export default Humidity;
