import React, { useState, useEffect } from "react";
import BarGraph from "./components/BarGraph";

// schema = {
//   {
//     "CPU_Package_C": 58,
//     "CPU_Package_Power_W": 26.0,
//     "Core_Clocks_avg_MHz": 4214,
//     "Core_Distance_to_TjMAX_avg_C": 51.0,
//     "Core_Temperatures_avg_C": 49.0,
//     "Core_Thermal_Throttling": 0.0,
//     "Core_Usage_avg_percent": 3.9,
//     "Core_VIDs_avg_V": 1.419,
//     "Date": "30.3.2025",
//     "PL1_Power_Limit_Dynamic_W": 75.0,
//     "PL1_Power_Limit_Static_W": 140.0,
//     "PL2_Power_Limit_Dynamic_W": 119.0,
//     "PL2_Power_Limit_Static_W": 190.0,
//     "Ring_LLC_Clock_MHz": 4588.8,
//     "Time": " 19:4:36.476"
// },
// }

// function getBarColor(name, value) {
//   switch (name) {
//     case "CPU Package Temp":
//       return value > 90 ? "red" : value > 70 ? "orange" : "green";
//     case "Core Usage":
//       return value > 80 ? "red" : value > 50 ? "yellow" : "green";
//     case "Package Power":
//       return value > 150 ? "red" : value > 100 ? "orange" : "green";
//     case "Distance to TjMAX":
//       return value < 20 ? "red" : value > 40 ? "green" : "orange";
//     default:
//       return "green"; // Default green color
//   }
// }

const MAX_VALUES = {
  "Core_VIDs_avg_V": 1.5,
  "Core_Clocks_avg_MHz": 5000,
  "Ring_LLC_Clock_MHz": 5000,
  "Core_Usage_avg_percent": 100,
  "Core_Temperatures_avg_C": 100,
  "CPU_Package_C": 100,
  "Core_Distance_to_TjMAX_avg_C": 100,
  "CPU_Package_Power_W": 200,
  "PL1_Power_Limit_Dynamic_W": 140,
  "PL2_Power_Limit_Dynamic_W": 190
};

// function App() {
//   const [hwInfo, setHwInfo] = useState(null);
//   const [isThrottling, setIsThrottling] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/dashboard");
//         const data = await response.json();

//         // console.log("Received Data:", data);

//         if (data.length > 0) {
//           const latestData = data[data.length - 1]; // Get latest entry
//           setHwInfo(latestData);

//           if (latestData.Core_Thermal_Throttling === 1.0) {
//             const userConfirmed = window.confirm("⚠️ Thermal Throttling Detected! Continue?");
//             if (!userConfirmed) return;
//           }
//         }
//       } catch (error) { 
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//     const interval = setInterval(fetchData, 2000); // Fetch data every 2 seconds
//     return () => clearInterval(interval);
//   }, []);

//   if (!hwInfo) {
//     return <h1 className="text-white text-center mt-10">Loading data...</h1>;
//   }

//   const graphData = [
//     {
//       name: "Core VID",
//       value: hwInfo.Core_VIDs_avg_V,
//       max: MAX_VALUES["Core_VIDs_avg_V"],
//     },
//     {
//       name: "Core Clocks",
//       value: hwInfo.Core_Clocks_avg_MHz,
//       max: MAX_VALUES["Core_Clocks_avg_MHz"],
//     },
//     {
//       name: "Ring Clocks",
//       value: hwInfo.Ring_LLC_Clock_MHz,
//       max: MAX_VALUES["Ring_LLC_Clock_MHz"],
//     },
//     {
//       name: "Core Usage",
//       value: hwInfo.Core_Usage_avg_percent,
//       max: MAX_VALUES["Core_Usage_avg_percent"],
//     },
//     {
//       name: "CPU Core Temp",
//       value: hwInfo.Core_Temperatures_avg_C,
//       max: MAX_VALUES["Core_Temperatures_avg_C"],
//     },
//     {
//       name: "CPU Package Temp",
//       value: hwInfo.CPU_Package_C,
//       max: MAX_VALUES["CPU_Package_C"],
//     },
//     {
//       name: "Distance to TjMAX",
//       value: hwInfo.Core_Distance_to_TjMAX_avg_C,
//       max: MAX_VALUES["Core_Distance_to_TjMAX_avg_C"],
//     },
//     {
//       name: "Package Power",
//       value: hwInfo.CPU_Package_Power_W,
//       max: MAX_VALUES["CPU_Package_Power_W"],
//     },
//     {
//       name: "PL1 Dyanmic Power",
//       value: hwInfo.PL1_Power_Limit_Dynamic_W,
//       max: MAX_VALUES["PL1_Power_Limit_Dynamic_W"],
//     },
//     {
//       name: "PL2 Dynamic Power",
//       value: hwInfo.PL2_Power_Limit_Dynamic_W,
//       max: MAX_VALUES["PL2_Power_Limit_Dynamic_W"],
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6 relative">
//       <h1 className="text-3xl font-bold text-center mb-6">HWInfo Dashboard</h1>

//       {/* Render graphs only if there's no throttling */}
//       <div className="space-y-4">
//         {graphData.map((item, index) => (
//           <BarGraph
//             key={index}
//             title={item.name}
//             data={[item]}
//             dataKey="value"
//             maxValue={item.max}
//             color={getBarColor(item.name, item.value)}
//           />
//         ))}
//       </div>
//     </div>
//   );
  

// }

// export default App;

function App() {
  const [hwInfo, setHwInfo] = useState(null);
  const [isThrottling, setIsThrottling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/dashboard");
        const data = await response.json();

        if (data.length > 0) {
          const latestData = data[data.length - 1]; // Get latest entry
          setHwInfo(latestData);

          // Check for thermal throttling
          setIsThrottling(latestData.Core_Thermal_Throttling === 1.0);
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
      name: "Core VID",
      value: hwInfo.Core_VIDs_avg_V,
      max: MAX_VALUES["Core_VIDs_avg_V"],
    },
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
      name: "Distance to TjMAX",
      value: hwInfo.Core_Distance_to_TjMAX_avg_C,
      max: MAX_VALUES["Core_Distance_to_TjMAX_avg_C"],
    },
    {
      name: "Package Power",
      value: hwInfo.CPU_Package_Power_W,
      max: MAX_VALUES["CPU_Package_Power_W"],
    },
    {
      name: "PL1 Dynamic Power",
      value: hwInfo.PL1_Power_Limit_Dynamic_W,
      max: MAX_VALUES["PL1_Power_Limit_Dynamic_W"],
    },
    {
      name: "PL2 Dynamic Power",
      value: hwInfo.PL2_Power_Limit_Dynamic_W,
      max: MAX_VALUES["PL2_Power_Limit_Dynamic_W"],
    },
  ];

  function getBarColor(name, value) {
    if (isThrottling) return "red"; // Force all bars to red on throttling
    switch (name) {
      case "CPU Package Temp":
        return value > 90 ? "red" : value > 70 ? "orange" : "green";
      case "Core Usage":
        return value > 80 ? "red" : value > 50 ? "yellow" : "green";
      case "Package Power":
        return value > 150 ? "red" : value > 100 ? "orange" : "green";
      case "Distance to TjMAX":
        return value < 20 ? "red" : value > 40 ? "green" : "orange";
      default:
        return "green"; // Default green color
    }
  }

  return (
    <div className={`min-h-screen p-6 relative transition-all duration-300 ${isThrottling ? "bg-red-900" : "bg-gray-900"} text-white`}>
      <h1 className="text-3xl font-bold text-center mb-6">HWInfo Dashboard</h1>

      {/* Warning banner */}
      {isThrottling && (
        <div className="bg-red-600 text-white text-lg font-bold p-3 text-center rounded-md mb-4 animate-pulse">
          ⚠️ Thermal Throttling Detected! System Performance May Be Affected.
        </div>
      )}

      {/* Graphs */}
      <div className="space-y-4">
        {graphData.map((item, index) => (
          <BarGraph
            key={index}
            title={item.name}
            data={[item]}
            dataKey="value"
            maxValue={item.max}
            color={getBarColor(item.name, item.value)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
