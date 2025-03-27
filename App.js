import React, { useState, useEffect } from "react";
import BarGraph from "./components/BarGraph";

const MAX_VALUES = {
  "Core_Clocks_avg_MHz": 5000,
  "Ring_LLC_Clock_MHz": 5000,
  "Core_Usage_avg_percent": 100,
  "Core_Temperatures_avg_C": 100,
  "CPU_Package_Power_W": 200,
  "CPU_Package_C": 100
};

function App() {
  const [hwInfo, setHwInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/dashboard");
        const data = await response.json();

        console.log("Received Data:", data);

        if (data.length > 0) {
          setHwInfo(data[data.length - 1]); // Get the latest data entry
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // Fetch data every 2 seconds
    return () => clearInterval(interval);
  }, []);

  if (!hwInfo) {
    return <h1 className="text-white text-center mt-10">Loading data...</h1>;
  }

  const graphData = [
    {
      name: "Core Clocks",
      value: hwInfo.Core_Clocks_avg_MHz,
      max: MAX_VALUES["Core_Clocks_avg_MHz"],
    },
    {
      name: "Ring Clocks",
      value: hwInfo.Ring_LLC_Clock_MHz,
      max: MAX_VALUES["Ring_LLC_Clock_MHz"],
    },
    {
      name: "Core Usage",
      value: hwInfo.Core_Usage_avg_percent,
      max: MAX_VALUES["Core_Usage_avg_percent"],
    },
    {
      name: "CPU Core Temp",
      value: hwInfo.Core_Temperatures_avg_C,
      max: MAX_VALUES["Core_Temperatures_avg_C"],
    },
    {
      name: "CPU Package Temp",
      value: hwInfo.CPU_Package_C,
      max: MAX_VALUES["CPU_Package_C"],
    },
    {
      name: "Package Power",
      value: hwInfo.CPU_Package_Power_W,
      max: MAX_VALUES["CPU_Package_Power_W"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">HWInfo Dashboard</h1>
      <div className="space-y-4">
        {graphData.map((item, index) => (
          <BarGraph
            key={index}
            title={item.name}
            data={[item]}
            dataKey="value"
            maxValue={item.max} // Pass the max value
            color="#4CAF50"
          />
        ))}
      </div>
    </div>
  );
}

export default App;
