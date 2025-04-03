import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { WiThermometer, WiHumidity } from "react-icons/wi";
import axios from "axios";

function TmpTracker() {
  const [data, setData] = useState([]);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://192.168.14.103/temperature");
      setTemperature(response.data.temperature);
      setHumidity(response.data.humidity);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    fetchData();

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setData((prevData) => [
      ...prevData,
      {
        name: new Date().toLocaleTimeString(),
        Temperature: temperature,
        Humidity: humidity,
      },
    ]);
  }, [temperature, humidity]);

  return (
    <div className="  relative h-64 p-4 rounded-lg bg-white shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-center">
        <p className="text-center text-red-800 flex justify-center items-center gap-2">
          <WiThermometer className="text-red-500 text-3xl" /> {temperature}°C •
          <WiHumidity className="text-blue-500 text-3xl" /> {humidity}% Humidity
        </p>
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Temperature" stroke="#FF5733" />
          <Line type="monotone" dataKey="Humidity" stroke="#3498DB" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TmpTracker;
