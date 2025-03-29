"use client";

import { COLORS } from "@/app/utils";
import React, { useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Before from "../elements/before";
import After from "../elements/after";
import Number from "../elements/number";

const splitTextIntoLines = (text: string): string[] => {
  const words = text?.split(" ") ?? [];
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    if (currentLine.length + word.length <= 10) {
      currentLine += (currentLine.length ? " " : "") + word;
    } else {
      if (currentLine.length) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  });

  if (currentLine.length) {
    lines.push(currentLine);
  }

  return lines;
};

const CustomLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, index, name } = props;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * 0.7 * Math.sin(-midAngle * RADIAN);

  const lineX2 = cx + (outerRadius + 15) * Math.cos(-midAngle * RADIAN);
  const lineY2 = cy + (outerRadius + 15) * Math.sin(-midAngle * RADIAN);

  const textOffset = x > cx ? 10 : -10;
  const lines = splitTextIntoLines(name);

  return (
    <g>
      <line
        x1={cx + outerRadius * Math.cos(-midAngle * RADIAN)}
        y1={cy + outerRadius * Math.sin(-midAngle * RADIAN)}
        x2={lineX2}
        y2={lineY2}
        stroke={COLORS[index]}
        strokeWidth={2}
      />
      <line
        x1={lineX2}
        y1={lineY2}
        x2={x}
        y2={y}
        stroke={COLORS[index]}
        strokeWidth={2}
      />
      {lines.map((line, i) => (
        <text
          key={i}
          x={x + textOffset}
          y={y + (i - (lines.length - 1)) * 20}
          fill={COLORS[index]}
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          className="text-xl font-medium"
        >
          {line}
        </text>
      ))}
    </g>
  );
};

const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="middle"
      className="text-2xl font-bold"
      style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Infographic2 = ({ numbers, facts, whole }: any) => {
  const data = numbers.map((value: number, index: number) => ({
    name: facts[index] || "Others",
    value: value,
  }));

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-300 shadow-lg w-152 m-8 p-4">
      {whole && (
        <div className="flex flex-row items-center flex-wrap justify-center">
          <Before before={whole.before} />
          <Number number={whole.number} whole />
          <After after={whole.after} />
        </div>
      )}
      <div className="w-full h-full flex flex-row">
        <PieChart width={700} height={500}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={160}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={160}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </div>
    </div>
  );
};

export default Infographic2;
