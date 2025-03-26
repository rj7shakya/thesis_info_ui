import { checkRelatedFact } from "@/app/utils";
import React from "react";
import Infographic2 from "./s1";
import Infographic2Bar from "./s2";
import SingleFact from "../single_fact";

const MultiFact = ({ data }: any) => {
  const { isRelated, type, numbers } = checkRelatedFact(data);

  console.log("isRelated, type, numbers", isRelated, type, numbers);

  return (
    <div>
      {type === "proportion" && isRelated ? (
        <div className="flex flex-wrap items-center">
          <Infographic2
            numbers={numbers}
            facts={data.map((d: any) => d.statement)}
          />
          <Infographic2Bar
            numbers={numbers}
            facts={data.map((d: any) => d.statement)}
          />
        </div>
      ) : type === "quantity" && isRelated ? (
        <Infographic2Bar
          numbers={numbers}
          facts={data.map((d: any) => d.statement)}
          quantity
        />
      ) : (
        // <>Multidfact</>
        <div className="flex flex-wrap items-center">
          {data.map((i: any) => (
            <SingleFact data={i} multiFact />
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiFact;
