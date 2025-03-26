import { separateNumbersText } from "@/app/utils";
import React from "react";

const Number = ({ number }: { number: string }) => {
  return (
    <div className="flex flex-wrap flex-row items-center">
      {separateNumbersText(number).map((item: any, index: any) => (
        <>
          <span
            key={index}
            className={`${
              typeof item === "number"
                ? item.toString().length >= 4
                  ? "text-6xl"
                  : "text-8xl"
                : "text-2xl m-2"
            } font-bold mb-2`}
          >
            {item}
          </span>
        </>
      ))}
    </div>
  );
};

export default Number;
