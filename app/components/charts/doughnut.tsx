"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const DonutChart = ({ data, centerImage }: any) => {
  // Convert Chart.js data format to Recharts format
  const convertedData = data.datasets[0].data.map((value: any, index: any) => ({
    name: data.labels[index] || `Item ${index + 1}`,
    value: value,
  }));

  const COLORS = data.datasets[0].backgroundColor;
  const innerRadius = 60;
  const outerRadius = 95;

  return (
    <div className="relative w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={convertedData}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            // paddingAngle={5}
            dataKey="value"
          >
            {convertedData.map((entry: any, index: any) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {centerImage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={centerImage}
            alt="Center"
            className="w-16 h-16 rounded-full"
          />
        </div>
      )}
    </div>
  );
};

export default DonutChart;
