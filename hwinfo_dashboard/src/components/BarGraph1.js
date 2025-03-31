import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const BarGraph1 = ({ title, data, dataKey, color }) => {
  return (
    <div className="p-4 bg-gray-800 rounded-2xl shadow-md">
      <h2 className="text-white text-xl font-semibold mb-2">{title}</h2>
      <ResponsiveContainer width="80%" height={80}>
        <BarChart layout="vertical" data={data} margin={{ left: 30 }}>
          <XAxis type="number" tick={{ fill: "white" }} />
          <YAxis type="category" dataKey="name" tick={{ fill: "white" }} />
          <Tooltip />
          <Bar dataKey={dataKey} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarGraph1;
