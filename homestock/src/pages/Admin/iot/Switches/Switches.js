import React, { useState } from "react";
import {
  FaTint,
  FaTemperatureHigh,
  FaSnowflake,
  FaLightbulb,
  FaWifi,
} from "react-icons/fa";

function Switches() {
  const [switches, setSwitches] = useState({
    humidity: false,
    temperature: true,
    airConditioner: false,
    lights: false,
    wifi: true,
  });

  const handleToggle = (type) => {
    setSwitches((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const switchItems = [
    {
      id: "humidity",
   
      icon: FaTint,
      inactiveSince: "2 days",
    },
    {
      id: "temperature",
   
      icon: FaTemperatureHigh,
      active: true,
    },
    {
      id: "airConditioner",
  
      icon: FaSnowflake,
      inactiveSince: "1 hour",
    },
   
  ];


    return (
      <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {switchItems.map((item) => {
          const isActive = switches[item.id];
          return (
            <div
              key={item.id}
              className={`h-20 w-20 md:h-28 md:w-28 p-4 rounded-xl shadow-md flex flex-col items-center justify-center ${
                isActive ? "bg-orange-500 text-white" : "bg-white text-gray-700"
              }`}
            >
              <item.icon className={`text-3xl md:text-5xl mb-2 ${isActive ? "text-white" : "text-gray-400"}`} />
              <h3 className="text-xs md:text-sm font-semibold">{item.label}</h3>
              <p className="text-[10px] md:text-xs">{isActive ? "Active" : `Inactive since: ${item.inactiveSince}`}</p>
              <label className="mt-3 flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isActive}
                  onChange={() => handleToggle(item.id)}
                />
                <div className={`w-10 h-5 rounded-full p-1 transition-all ${isActive ? "bg-black" : "bg-gray-300"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform ${isActive ? "translate-x-5" : ""}`}></div>
                </div>
              </label>
            </div>
          );
        })}
      </div>
    );
    
 
}

export default Switches;
