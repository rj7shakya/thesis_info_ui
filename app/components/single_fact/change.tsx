"use client";

import React from "react";
import Container from "../elements/container";
import Before from "../elements/before";
import Number from "../elements/number";
import After from "../elements/after";

interface ChangeProps {
  data: {
    before?: string;
    number: string;
    after?: string;
    type?: string;
  };
  imageUrl?: string;
}

const Change = ({ data, imageUrl }: ChangeProps) => {
  const { before, number, after,type } = data;


  return (
    <Container>
      {/* Icon section */}
      {imageUrl && (
        <div className="flex-shrink-0 mr-4">
          <img src={imageUrl} alt="Icon" className="w-24 h-24 object-contain" />
          <img src={type === "change_increase" ? "/icons/increase1.png" : "/icons/decrease1.png"} alt="Icon" className="w-24 h-24 object-contain" />
        </div>
      )}

      {/* Text content section */}
      <div className="flex flex-col">
        <Before before={before}/>
        <Number number={number}/>
        <After after={after} />
        {/* {after && <p className="text-md text-gray-600">{after}</p>} */}
      </div>
    </Container>
  );
};

export default Change; 