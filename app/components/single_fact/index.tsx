import React from "react";
import Infographic1 from "./s1";
import Infographic1Bar from "./s2";
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
        <Infographic1
          data={data}
          imageUrl={getRandomImageUrl(data?.images)}
          quantity
        />
      ) : (
        <>
          <Infographic1 data={data} imageUrl={data?.images[0]} quantity />
          <Infographic1Bar data={data} imageUrl={data?.images[2]} quantity />
        </>
      )}
    </div>
  ) : data?.type === "proportion" ? (
    <div className="flex flex-wrap items-center">
      {multiFact ? (
        <Infographic1
          data={data}
          imageUrl={getRandomImageUrl(data?.images)}
          type={Math.random() < 0.5 ? "donut" : "pie"}
        />
      ) : (
        <>
          <Infographic1 data={data} imageUrl={data?.images[2]} />
          <Infographic1Bar data={data} imageUrl={data?.images[0]} />
          <Infographic1 data={data} imageUrl={data?.images[1]} type="donut" />
          <Infographic1 data={data} type="pie" />
        </>
      )}
      {/* <Infographic_Icon data={data} /> */}
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
