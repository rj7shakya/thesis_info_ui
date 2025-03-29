import { separateNumbersText } from "@/app/utils";
import React from "react";

const Number = ({ number, whole }: { number: string; whole?: boolean }) => {
  return (
    <div className={`flex flex-wrap flex-row items-center mr-1`}>
      {separateNumbersText(number).map((item: any, index: any) => (
        <>
          <span
            key={index}
            className={`${
              whole
                ? "text-3xl ml-1"
                : typeof item === "number"
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
