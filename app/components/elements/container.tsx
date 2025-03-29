import React from "react";

const Container = ({
  children,
  col,
}: {
  children: React.ReactNode;
  col?: boolean;
}) => {
  return (
    <div
      className={`flex ${
        col ? "flex-col" : "flex-row"
      } items-center justify-center bg-gray-50 rounded-lg border border-gray-300 shadow-lg w-120 m-8 py-6 px-4`}
    >
      {children}
    </div>
  );
};

export default Container;
