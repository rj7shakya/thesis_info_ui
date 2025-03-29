"use client";

import axios from "axios";
import { useState } from "react";
import MultiFact from "./components/multi_fact";
import SingleFact from "./components/single_fact";

export default function Home() {
  const [statement, setStatement] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleGenerate = async () => {
    if (!statement) return alert("Please enter a statement");
    setLoading(true);

    try {
      setData((await axios.post("/api/generate", { statement })).data?.facts);
    } catch (error) {
      console.log(error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderInfographics = (data: any) => {
    if (!data) return <></>;
    if (data?.length > 1) {
      return <MultiFact data={data} />;
    } else {
      return <SingleFact data={data[0]} />;
    }
  };

  console.log("print", data);

  return (
    <div className="flex flex-col items-center justify-center w-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        <div className="flex justify-center">
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a statement..."
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            className="w-108 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition ml-4 py-1"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
        {!loading ? renderInfographics(data) : <>loading</>}
      </div>
    </div>
  );
}
