// import React from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// const BarGraph = ({ title, data, dataKey, maxValue, color }) => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold mb-1">{title}: {data[0][dataKey]}</h2>
//       <div className="w-full bg-gray-700 rounded h-6 overflow-hidden">
//         <div
//           className="h-6 rounded"
//           style={{
//             width: `${(data[0][dataKey] / maxValue) * 100}%`,
//             backgroundColor: color,
//             transition: "width 0.5s ease-in-out",
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default BarGraph;


import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const BarGraph = ({ title, data, dataKey, color, maxValue }) => {
  return (
    <div className="p-4 bg-gray-800 rounded-2xl shadow-md">
      <h2 className="text-white text-xl font-semibold mb-2">{title}</h2>
      <ResponsiveContainer width="80%" height={80}>
        <BarChart layout="vertical" data={data} margin={{ left: 30 }}>
          <XAxis 
            type="number" 
            tick={{ fill: "white" }} 
            domain={[0, maxValue]} // Set the range using maxValue
          />
          <YAxis type="category" dataKey="name" tick={{ fill: "white" }} />
          <Tooltip />
          <Bar dataKey={dataKey} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarGraph;