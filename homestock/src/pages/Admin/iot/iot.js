import React, { useState } from 'react';
import Temperature from './Temperature/Temperature';
import ScannerItem from './ScannerItems/ScannerItems';
import ItemTep from './Temperature/itemTep';
import Switches from './Switches/Switches';
import { FaThermometerHalf, FaBox, FaBarcode, FaToggleOn } from "react-icons/fa";
function Iot() {
  const currentTemperature = 22;
  const maxTemperature = 40;
  const currentHumidity = 60;
  const maxHumidity = 100;

  const temperaturePercentage = (currentTemperature / maxTemperature) * 100;
  const humidityPercentage = (currentHumidity / maxHumidity) * 100;

  const [activeTab, setActiveTab] = useState('temperature');

  return (
    <main className="bg-white p-6 rounded-lg">
      {/* Tab navigation */}
      <div className="flex justify-center sm:justify-start space-x-9 mt-6">
  {[
    { id: "temperature", icon: <FaThermometerHalf className="text-2xl" /> },
    { id: "ItemTep", icon: <FaBox className="text-2xl" /> },
    { id: "scannerItem", icon: <FaBarcode className="text-2xl" /> },
    { id: "Switches", icon: <FaToggleOn className="text-2xl" /> },
  ].map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`flex items-center justify-center  rounded-xl transition-all duration-300 ease-in-out w-20 h-10 focus:outline-none focus:ring-2 transform ${
        activeTab === tab.id
          ? "bg-black text-white shadow-xl scale-110"
          : "text-gray-800 hover:bg-gradient-to-r from-indigo-500 to-black hover:text-white hover:shadow-lg hover:scale-105"
      }`}
    >
      {tab.icon}
    </button>
  ))}
</div>

      {/* Temperature Section */}
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

      {/* Switches Section */}
      {activeTab === 'Switches' && (
        <section className="mt-8">
          <div>
            <Switches />
          </div>
        </section>
      )}
    </main>
  );
}

export default Iot;
