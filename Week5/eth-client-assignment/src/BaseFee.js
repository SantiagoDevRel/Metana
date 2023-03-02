import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./BaseFee.css";

function BaseFee() {
  const data = [
    { name: "Jan", value: Math.floor(Math.random() * 100) },
    { name: "Feb", value: Math.floor(Math.random() * 100) },
    { name: "Mar", value: Math.floor(Math.random() * 100) },
    { name: "Apr", value: Math.floor(Math.random() * 100) },
    { name: "May", value: Math.floor(Math.random() * 100) },
    { name: "Jun", value: Math.floor(Math.random() * 100) },
    { name: "Jul", value: Math.floor(Math.random() * 100) },
    { name: "Aug", value: Math.floor(Math.random() * 100) },
    { name: "Sep", value: Math.floor(Math.random() * 100) },
    { name: "Oct", value: Math.floor(Math.random() * 100) },
    { name: "Nov", value: Math.floor(Math.random() * 100) },
    { name: "Dec", value: Math.floor(Math.random() * 100) },
  ];

  return (
    <div className="main">
      BaseFee * gas used by a TX == burn ETH
      <div className="chart-container">
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </div>
    </div>
  );
}

export default BaseFee;
