"use client";

import { extractPercentage, parseNumberString } from "@/app/utils";
import React from "react";
import Container from "../elements/container";
import Number from "../elements/number";
import After from "../elements/after";

const Infographic1Bar = ({ data, imageUrl, quantity }: any) => {
  const { number } = data;
  const percentage =
    extractPercentage(number) ?? Math.min(...parseNumberString(number));

  return (
    <Container col>
      <Number number={number} />

      {!quantity && (
        <div className="w-104 bg-gray-200 h-6 mb-4">
          <div
            className="h-full bg-blue-400"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      )}

      <div className="text-center mb-4 flex justify-center items-center">
        {imageUrl && <img src={imageUrl} alt="Icon" className="w-24 mr-4" />}
        <After after={data?.statement} />
      </div>
    </Container>
  );
};

export default Infographic1Bar;
