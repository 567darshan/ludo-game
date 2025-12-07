// src/components/Dice.jsx
import React from "react";

const Dice = ({ value, onRoll, disabled }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        marginBottom: "12px",
      }}
    >
      <button
        onClick={onRoll}
        disabled={disabled}
        style={{
          padding: "8px 16px",
          borderRadius: "999px",
          border: "none",
          background: disabled ? "#475569" : "#22c55e",
          color: "white",
          fontWeight: "600",
          cursor: disabled ? "default" : "pointer",
        }}
      >
        Roll Dice
      </button>
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "8px",
          border: "2px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        {value || "-"}
      </div>
    </div>
  );
};

export default Dice;
