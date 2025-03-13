import React, { useState } from 'react';
import { FaFire, FaTemperatureHigh, FaFan, FaLightbulb, FaPlug, FaCamera } from 'react-icons/fa';

function Switches({ onToggle }) {
  const [fireAlarm, setFireAlarm] = useState(false);
  const [temperatureControl, setTemperatureControl] = useState(false);
  const [fan, setFan] = useState(false);
  const [inventoryLight, setInventoryLight] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(false);
  const [cctvCamera, setCctvCamera] = useState(false);

  const handleToggle = (type) => {
    if (type === 'fireAlarm') {
      setFireAlarm((prev) => !prev);
      onToggle('fireAlarm', !fireAlarm);
    } else if (type === 'temperatureControl') {
      setTemperatureControl((prev) => !prev);
      onToggle('temperatureControl', !temperatureControl);
    } else if (type === 'fan') {
      setFan((prev) => !prev);
      onToggle('fan', !fan);
    } else if (type === 'inventoryLight') {
      setInventoryLight((prev) => !prev);
      onToggle('inventoryLight', !inventoryLight);
    } else if (type === 'currentStatus') {
      setCurrentStatus((prev) => !prev);
      onToggle('currentStatus', !currentStatus);
    } else if (type === 'cctvCamera') {
      setCctvCamera((prev) => !prev);
      onToggle('cctvCamera', !cctvCamera);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl shadow-2xl">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-900 tracking-wide uppercase">
        Device Control
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Fire Alarm */}
        <div className={`flex items-center space-x-6 p-8 rounded-3xl transition-all duration-300 ease-in-out ${fireAlarm ? 'bg-red-100 border-red-600 shadow-xl' : 'bg-white border-gray-300 shadow-md'}`}>
          <FaFire className={`text-5xl ${fireAlarm ? 'text-red-600' : 'text-gray-500'} transition-colors duration-300`} />
          <button className={`text-lg font-semibold ${fireAlarm ? 'text-red-700' : 'text-gray-700'} transition-colors duration-300`} onClick={() => handleToggle('fireAlarm')}>
            {fireAlarm ? 'Alarm On' : 'Alarm Off'}
          </button>
        </div>

        {/* Temperature Control */}
        <div className={`flex items-center space-x-6 p-8 rounded-3xl transition-all duration-300 ease-in-out ${temperatureControl ? 'bg-yellow-100 border-yellow-600 shadow-xl' : 'bg-white border-gray-300 shadow-md'}`}>
          <FaTemperatureHigh className={`text-5xl ${temperatureControl ? 'text-yellow-600' : 'text-gray-500'} transition-colors duration-300`} />
          <button className={`text-lg font-semibold ${temperatureControl ? 'text-yellow-700' : 'text-gray-700'} transition-colors duration-300`} onClick={() => handleToggle('temperatureControl')}>
            {temperatureControl ? 'Control On' : 'Control Off'}
          </button>
        </div>

        {/* Fan */}
        <div className={`flex items-center space-x-6 p-8 rounded-3xl transition-all duration-300 ease-in-out ${fan ? 'bg-blue-100 border-blue-600 shadow-xl' : 'bg-white border-gray-300 shadow-md'}`}>
          <FaFan className={`text-5xl ${fan ? 'text-blue-600' : 'text-gray-500'} transition-colors duration-300`} />
          <button className={`text-lg font-semibold ${fan ? 'text-blue-700' : 'text-gray-700'} transition-colors duration-300`} onClick={() => handleToggle('fan')}>
            {fan ? 'Fan On' : 'Fan Off'}
          </button>
        </div>

        {/* Inventory Light */}
        <div className={`flex items-center space-x-6 p-8 rounded-3xl transition-all duration-300 ease-in-out ${inventoryLight ? 'bg-green-100 border-green-600 shadow-xl' : 'bg-white border-gray-300 shadow-md'}`}>
          <FaLightbulb className={`text-5xl ${inventoryLight ? 'text-green-600' : 'text-gray-500'} transition-colors duration-300`} />
          <button className={`text-lg font-semibold ${inventoryLight ? 'text-green-700' : 'text-gray-700'} transition-colors duration-300`} onClick={() => handleToggle('inventoryLight')}>
            {inventoryLight ? 'Light On' : 'Light Off'}
          </button>
        </div>

        {/* Current Status */}
        <div className={`flex items-center space-x-6 p-8 rounded-3xl transition-all duration-300 ease-in-out ${currentStatus ? 'bg-purple-100 border-purple-600 shadow-xl' : 'bg-white border-gray-300 shadow-md'}`}>
          <FaPlug className={`text-5xl ${currentStatus ? 'text-purple-600' : 'text-gray-500'} transition-colors duration-300`} />
          <button className={`text-lg font-semibold ${currentStatus ? 'text-purple-700' : 'text-gray-700'} transition-colors duration-300`} onClick={() => handleToggle('currentStatus')}>
            {currentStatus ? 'Active' : 'Inactive'}
          </button>
        </div>

        {/* CCTV Camera */}
        <div className={`flex items-center space-x-6 p-8 rounded-3xl transition-all duration-300 ease-in-out ${cctvCamera ? 'bg-teal-100 border-teal-600 shadow-xl' : 'bg-white border-gray-300 shadow-md'}`}>
          <FaCamera className={`text-5xl ${cctvCamera ? 'text-teal-600' : 'text-gray-500'} transition-colors duration-300`} />
          <button className={`text-lg font-semibold ${cctvCamera ? 'text-teal-700' : 'text-gray-700'} transition-colors duration-300`} onClick={() => handleToggle('cctvCamera')}>
            {cctvCamera ? 'Camera On' : 'Camera Off'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Switches;