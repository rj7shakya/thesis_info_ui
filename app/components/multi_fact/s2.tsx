"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Cell } from "recharts";

const Infographic2Bar = ({ numbers, facts, quantity }: any) => {
  const data = facts
    .map((fact: string, index: number) => ({
      name: fact,
      value: numbers[index],
    }))
    .filter((item: any) => !isNaN(item.value));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const splitTextIntoLines = (text: string): string[] => {
    const words = text?.split(" ") ?? [];
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      if (currentLine.length + word.length <= 15) {
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
    const { x, y, width, height, value, index } = props;
    const lines = splitTextIntoLines(data[index].name);

    const startX = x + width / 2;
    const startY = y;
    const endX = startX;
    const endY = y - 20;
    const textY = endY - 10;

    return (
      <g>
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={COLORS[index]}
          strokeWidth={2}
        />
        {lines.map((line, i) => (
          <text
            key={i}
            x={startX}
            y={textY - (lines.length - i - 1) * 20}
            textAnchor="middle"
            fill={COLORS[index]}
            className="text-xl font-medium"
          >
            {line}
          </text>
        ))}
        {!quantity && (
          <text
            x={startX}
            y={y + height / 2}
            textAnchor="middle"
            fill="#fff"
            className="text-2xl font-bold"
            style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
          >
            {`${(
              (value /
                data.reduce((sum: number, item: any) => sum + item.value, 0)) *
              100
            ).toFixed(0)}%`}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="flex flex-row items-center justify-center bg-gray-50 rounded-lg border border-gray-300 shadow-lg w-128 m-8">
      <BarChart
        width={600}
        height={400}
        data={data}
        margin={{
          top: 120,
          right: 10,
          left: 10,
          bottom: 5,
        }}
        barSize={80}
        barGap={0}
      >
        <XAxis dataKey="name" hide />
        <YAxis hide />
        <Bar dataKey="value" fill="#8884d8" label={<CustomLabel />}>
          {data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
};

export default Infographic2Bar;
