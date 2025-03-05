import React, { useState } from 'react';
import { FaTemperatureHigh, FaBarcode, FaBoxOpen } from 'react-icons/fa'; 
import Temperature from './Temperature/Temperature';
import ScannerItem from './ScannerItems/ScannerItems'; 
import ItemTep from './Temperature/itemTep'; 

function Iot() {
  const currentTemperature = 22; 
  const maxTemperature = 40;
  const currentHumidity = 60;
  const maxHumidity = 100; 

  const temperaturePercentage = (currentTemperature / maxTemperature) * 100;
  const humidityPercentage = (currentHumidity / maxHumidity) * 100;

  const [activeTab, setActiveTab] = useState('temperature'); 

  return (
    <main className="bg-white p-6 rounded-lg ">
      {/* Tab navigation */}
      <div className="flex justify-center sm:justify-start space-x-4 mt-6">
        <button
          onClick={() => setActiveTab('temperature')}
          className={`px-4 py-2 text-sm rounded-lg transition duration-200 ease-in-out w-full sm:w-24 md:w-28 lg:w-32 xl:w-36 hover:bg-black focus:outline-none focus:ring-2 focus:ring-black ${activeTab === 'temperature' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <FaTemperatureHigh className="inline-block mr-2" /> Inventory Tep
        </button>

        <button
          onClick={() => setActiveTab('ItemTep')}
          className={`px-4 py-2 text-sm rounded-lg transition duration-200 ease-in-out w-full sm:w-24 md:w-28 lg:w-32 xl:w-36 hover:bg-black focus:outline-none focus:ring-2 focus:ring-black ${activeTab === 'ItemTep' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <FaBoxOpen className="inline-block mr-2" /> Item Tep
        </button>

        <button
          onClick={() => setActiveTab('scannerItem')}
          className={`px-4 py-2 text-sm rounded-lg transition duration-200 ease-in-out w-full sm:w-24 md:w-28 lg:w-32 xl:w-36 hover:bg-black focus:outline-none focus:ring-2 focus:ring-black ${activeTab === 'scannerItem' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <FaBarcode className="inline-block mr-2" /> Scanner Item
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

      {/* Scanner Item Section */}
      {activeTab === 'scannerItem' && (
        <section className="mt-8">
          <h2 className="text-xl font-medium text-gray-800">Scanner Item</h2>
          <div>
            <ScannerItem />
          </div>
        </section>
      )}

      {/* ItemTep Section */}
      {activeTab === 'ItemTep' && (
        <section className="mt-8">
     
          <div>
            <ItemTep />
          </div>
        </section>
      )}
    </main>
  );
}

export default Iot;
