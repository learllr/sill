import React from "react";

export default function MarketInfo({ projectId }) {
  return (
    <div className="border p-4 rounded-lg bg-gray-100">
      <h3 className="text-lg font-semibold">Marché</h3>
      <p className="text-gray-600">Details : {projectId}</p>
    </div>
  );
}
