import React, { useState } from 'react';
import Temperature from './Temperature/Temperature';
import Humidity from './Humidity/Humidity';
import ScannerItem from './ScannerItems/ScannerItems'; 

function Iot() {
  const currentTemperature = 22; // Current temperature in °C
  const maxTemperature = 40; // Max temperature (you can adjust this as needed)
  const currentHumidity = 60; // Current humidity in percentage
  const maxHumidity = 100; // Max humidity (you can adjust this as needed)


  const temperaturePercentage = (currentTemperature / maxTemperature) * 100;

  
  const humidityPercentage = (currentHumidity / maxHumidity) * 100;


  const [activeTab, setActiveTab] = useState('temperature'); 

  return (
    <main className="bg-white p-4 rounded-lg">
     

      {/* Tab navigation */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={() => setActiveTab('temperature')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'temperature' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Temperature
        </button>
        <button
          onClick={() => setActiveTab('humidity')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'humidity' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          Humidity
        </button>
        <button
          onClick={() => setActiveTab('scannerItem')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'scannerItem' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
        >
          Scanner Item
        </button>
      </div>

      {/* Temperature Section with Meter */}
      {activeTab === 'temperature' && (
        <Temperature
          currentTemperature={currentTemperature}
          maxTemperature={maxTemperature}
          temperaturePercentage={temperaturePercentage}
        />
      )}

      {/* Humidity Section with Meter */}
      {activeTab === 'humidity' && (
        <Humidity
          currentHumidity={currentHumidity}
          maxHumidity={maxHumidity}
          humidityPercentage={humidityPercentage}
        />
      )}

      {/* Scanner Item Section */}
      {activeTab === 'scannerItem' && (
        <section className="mt-8">
          <h2 className="text-xl font-medium text-gray-800">Scanner Item</h2>
          <div>
            <ScannerItem />
          </div>
        </section>
      )}

      {/* Control Buttons */}
      
    </main>
  );
}

export default Iot;
