"use client";

import React from "react";
import { parseNumberString, separateNumbersText } from "@/app/utils";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import DonutChart from "../charts/doughnut";
import Container from "../elements/container";
import Number from "../elements/number";
import Before from "../elements/before";
import After from "../elements/after";

const Infographic1 = ({ data, imageUrl, type, quantity }: any) => {
  const { before, number, after } = data;

  const chartData = parseNumberString(number).map((value, index) => ({
    name: `Item ${index + 1}`,
    value: value,
  }));

  const COLORS = ["rgba(255, 99, 132, 0.8)", "rgba(54, 162, 235, 0.8)"];

  const gdata = {
    labels: chartData.map((item) => item.name),
    datasets: [
      {
        data: chartData.map((item) => item.value),
        backgroundColor: COLORS,
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const SimplePieChart = () => {
    return (
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={95}
              fill="#8884d8"
              dataKey="value"
              // label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <Container>
      {type === "pie" ? (
        <div className="w-64 flex justify-center items-center">
          <SimplePieChart />
        </div>
      ) : type === "donut" ? (
        <div className="w-64 flex justify-center items-center">
          <DonutChart data={gdata} centerImage={imageUrl} />
        </div>
      ) : imageUrl ? (
        <div className="w-64 flex justify-center items-center">
          <img src={imageUrl} alt="Icon" className="w-48 h-48" />
        </div>
      ) : (
        <></>
      )}

      <div className="w-64 p-4 text-center md:text-left">
        <Before before={before} />
        <Number number={number} />
        <After after={after} />
      </div>
    </Container>
  );
};

export default Infographic1;
