import React from "react";

const ToolBar = ({ scale, setScale }) => {
  return (
    <div className="flex items-center justify-center  bg-gray-100 px-5 py-3 rounded-lg">
      <label className="flex items-center space-x-2">
        <span className="text-gray-700 font-medium">Échelle du logo :</span>
        <input
          type="number"
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          step="0.1"
          min="0.1"
          max="5"
          className="w-20 px-3 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </label>
    </div>
  );
};

export default ToolBar;
