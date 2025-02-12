import React from "react";

const ToolBar = ({ scale, setScale }) => {
  return (
    <div style={{ margin: "10px 0" }}>
      <label>
        Échelle du logo :
        <input
          type="number"
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          step="0.1"
          min="0.1"
          max="5"
          style={{ width: "60px", marginLeft: "10px" }}
        />
      </label>
    </div>
  );
};

export default ToolBar;
