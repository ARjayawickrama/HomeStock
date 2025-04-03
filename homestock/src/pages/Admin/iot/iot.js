import React, { useState } from "react";
import Temperature from "./Temperature/Temperature";
import ScannerItem from "./ScannerItems/ScannerItems";
import ItemTep from "./Temperature/itemTep";
import War from "../iot/Messages/WarningMessage";
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
      icon: <FaThermometerHalf />,
      label: "Temperature",
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
      icon: <FaBox />,
      label: "Inventory",
      component: <ItemTep />,
    },
    {
      id: "scannerItem",
      icon: <FaBarcode />,
      label: "Scanner",
      component: <ScannerItem />,
    },
  ];

  return (
    <main className="bg-white bg-opacity-80 p-6 rounded-lg ">
      <div className="flex justify-center sm:justify-start space-x-6  relative bottom-6 ">
        <div className="flex space-x-2 mb-8 bg-white rounded-xl p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className=" absolute top-16 ">
          <War />
          <hr className=" h-px w-72 my-8 bg-black border-0 dark:bg-gray-700"></hr>
        </div>
      </div>

      <section className="mt-8">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </section>
    </main>
  );
}

export default Iot;
