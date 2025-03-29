import React from "react";

const After = ({ after }: { after?: string }) => {
  return after ? <p className="text-2xl font-medium mb-2">{after}</p> : <></>;
};

export default After;
