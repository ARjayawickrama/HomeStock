import React, { useState } from "react";
import Temperature from "./Temperature/Temperature";
import ScannerItem from "./ScannerItems/ScannerItems";
import ItemTep from "./Temperature/itemTep";
import Switches from "./Switches/Switches";
import {
  FaThermometerHalf,
  FaBox,
  FaBarcode,
  FaToggleOn,
} from "react-icons/fa";

function Iot() {
  const [activeTab, setActiveTab] = useState("temperature");

  const tabs = [
    {
      id: "temperature",
      icon: <FaThermometerHalf className="text-2xl" />,
      component: (
        <Temperature
          currentTemperature={22}
          maxTemperature={40}
          temperaturePercentage={(22 / 40) * 100}
        />
      ),
    },
    {
      id: "ItemTep",
      icon: <FaBox className="text-2xl" />,
      component: <ItemTep />,
    },
    {
      id: "scannerItem",
      icon: <FaBarcode className="text-2xl" />,
      component: <ScannerItem />,
    },
    {
      id: "Switches",
      icon: <FaToggleOn className="text-2xl" />,
      component: <Switches />,
    },
  ];

  return (
    <main className="bg-white bg-opacity-90 p-6 rounded-lg">
   
      <div className="flex justify-center sm:justify-start space-x-6 mt-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center rounded-xl transition-all duration-300 ease-in-out w-16 h-10 focus:outline-none transform ${
              activeTab === tab.id
                ? "bg-black text-white shadow-xl scale-110"
                : "text-gray-800 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:scale-105"
            }`}
          >
            {tab.icon}
          </button>
        ))}
      </div>

      {/* Dynamic Content Rendering */}
      <section className="mt-8">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </section>
    </main>
  );
}

export default Iot;
