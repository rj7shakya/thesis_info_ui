import { checkRelatedFact } from "@/app/utils";
import React from "react";
import Infographic2 from "./s1";
import Infographic2Bar from "./s2";
import SingleFact from "../single_fact";

const MultiFact = ({ data }: any) => {
  const isQuantityMix =
    data.length > 2 &&
    (data[0].type === "quantity_whole" ||
      data[0].type === "change_increase" ||
      data[0].type === "change_decrease") &&
    data
      .slice(1)
      .every(
        (fact: any) =>
          fact.type === "proportion" ||
          fact.type === "quantity_part" ||
          fact.type === "quantity_whole"
      );

  console.log("isQuantityMix", isQuantityMix);

  let whole = null;
  let rest = [];
  if (isQuantityMix) {
    [whole, ...rest] = data;
  } else {
    [...rest] = data;
  }

  const { isRelated, type, numbers } = checkRelatedFact(rest, whole);
  console.log("isRelated, type, numbers", isRelated, type, numbers);

  return (
    <div>
      {type === "proportion" && isRelated ? (
        <div className="flex flex-wrap items-center">
          <Infographic2
            whole={whole}
            numbers={numbers}
            facts={rest.map((d: any) => d.statement)}
          />
          <Infographic2Bar
            whole={whole}
            numbers={numbers}
            facts={rest.map((d: any) => d.statement)}
          />
        </div>
      ) : type === "quantity" && isRelated ? (
        <Infographic2Bar
          whole={whole}
          numbers={numbers}
          facts={rest.map((d: any) => d.statement)}
          quantity
        />
      ) : (
        // <>Multidfact</>
        <div className="flex flex-wrap items-center">
          {rest.map((i: any) => (
            <SingleFact data={i} multiFact />
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiFact;
