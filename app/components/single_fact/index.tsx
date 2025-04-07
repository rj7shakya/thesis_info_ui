import React from "react";
import EditableInfographic from "../editable_infographic";
import Change from "./change";

const getRandomImageUrl = (images: string[]) => {
  return images?.length > 0
    ? images[Math.floor(Math.random() * images.length)]
    : undefined;
};

const SingleFact = ({ data, multiFact }: any) => {
  return data?.type === "quantity_whole" || data?.type === "quantity_part" ? (
    <div className="flex flex-wrap items-center">
      {multiFact ? (
        <EditableInfographic
          data={data}
          imageUrl={getRandomImageUrl(data?.images)}
          quantity
        />
      ) : (
        <>
          <EditableInfographic
            data={data}
            imageUrl={data?.images[0]}
            quantity
          />
          <EditableInfographic
            data={data}
            imageUrl={data?.images[2]}
            quantity
            type="bar"
          />
        </>
      )}
    </div>
  ) : data?.type === "proportion" ? (
    <div className="flex flex-wrap items-center">
      {multiFact ? (
        <EditableInfographic
          data={data}
          imageUrl={getRandomImageUrl(data?.images)}
          type={Math.random() < 0.5 ? "donut" : "pie"}
        />
      ) : (
        <>
          {/* <EditableInfographic data={data} imageUrl={data?.images[2]} />
          <EditableInfographic
            data={data}
            imageUrl={data?.images[0]}
            type="bar"
          /> */}
          <EditableInfographic
            data={data}
            imageUrl={data?.images[1]}
            type="donut"
          />
          <EditableInfographic data={data} type="pie" />
        </>
      )}
    </div>
  ) : (
    <div className="flex flex-wrap items-center">
      {multiFact ? (
        <Change data={data} imageUrl={getRandomImageUrl(data?.images)} />
      ) : (
        <>
          <Change data={data} imageUrl={data?.images[1]} />
          <Change data={data} imageUrl={data?.images[0]} />
        </>
      )}
    </div>
  );
};

export default SingleFact;
