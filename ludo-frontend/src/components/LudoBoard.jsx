// src/components/LudoBoard.jsx
import React from "react";

const TRACK_LEN = 8; // must match hook

// positions[color] should be an array of 4 numbers (0..TRACK_LEN)
const getPosArray = (positions, color) => {
  const v = positions?.[color];
  if (Array.isArray(v) && v.length) return v;
  return [0, 0, 0, 0];
};

const pawnDot = (borderColor, count) => ({
  width: "14px",
  height: "14px",
  borderRadius: "999px",
  background: "white",
  boxShadow: `0 0 0 3px ${borderColor}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "10px",
  fontWeight: "bold",
  color: "#0f172a",
});

const pathCellStyle = (isGoal, color) => ({
  width: "20px",
  height: "20px",
  borderRadius: isGoal ? "4px" : "2px",
  border: `1px solid #0f172a`,
  background: isGoal ? "#0f172a" : "#020617",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: isGoal ? `0 0 0 2px ${color}` : "none",
});

const LudoBoard = ({ positions }) => {
  const colors = {
    red: "#ef4444",
    green: "#22c55e",
    yellow: "#eab308",
    blue: "#3b82f6",
  };

  const redArr = getPosArray(positions, "red");
  const greenArr = getPosArray(positions, "green");
  const yellowArr = getPosArray(positions, "yellow");
  const blueArr = getPosArray(positions, "blue");

  // Render 2x2 home block. Each of the 4 circles represents 1 token.
  const renderHome = (colorName) => {
    const color = colors[colorName];
    const posArr = getPosArray(positions, colorName);

    return (
      <div
        style={{
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <div
          style={{
            width: "60%",
            height: "60%",
            background: "#020617",
            borderRadius: "18px",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            padding: "8px",
            gap: "6px",
          }}
        >
          {posArr.map((p, i) => {
            const insideHouse = p === 0;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "999px",
                    border: "2px solid white",
                    background: insideHouse ? "white" : "transparent",
                    boxShadow: insideHouse
                      ? `0 0 0 2px ${color}`
                      : "none",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render a straight arm of the cross for one colour
  const renderArm = (colorName, orientation, posArr) => {
    const color = colors[colorName];

    const cells = Array.from({ length: TRACK_LEN }).map((_, i) => {
      const index = i + 1; // 1..TRACK_LEN
      const isGoal = index === TRACK_LEN;
      const tokensHere = posArr.filter((p) => p === index).length;

      const cell = (
        <div key={index} style={pathCellStyle(isGoal, color)}>
          {tokensHere > 0 && (
            <div style={pawnDot(color, tokensHere)}>
              {tokensHere > 1 ? tokensHere : ""}
            </div>
          )}
        </div>
      );

      return cell;
    });

    // orientation decides flex direction
    if (orientation === "down") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "2px",
            height: "100%",
          }}
        >
          {cells}
        </div>
      );
    }

    if (orientation === "up") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "2px",
            height: "100%",
          }}
        >
          {cells}
        </div>
      );
    }

    if (orientation === "right") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "2px",
            width: "100%",
          }}
        >
          {cells}
        </div>
      );
    }

    // left
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "2px",
          width: "100%",
        }}
      >
        {cells}
      </div>
    );
  };

  return (
    <div
      style={{
        background: "#020617",
        borderRadius: "24px",
        padding: "16px",
        border: "1px solid #0f172a",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* 3x3 layout mimicking Ludo cross */}
      <div
        style={{
          width: "520px",
          height: "520px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr 1fr",
          background: "#020617",
          gap: "2px",
        }}
      >
        {/* Row 1: RED home | RED path | GREEN home */}
        <div>{renderHome("red")}</div>

        <div
          style={{
            background: "#020617",
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {renderArm("red", "down", redArr)}
        </div>

        <div>{renderHome("green")}</div>

        {/* Row 2: YELLOW path | centre diamond | BLUE path */}
        <div
          style={{
            background: "#020617",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {renderArm("yellow", "right", yellowArr)}
        </div>

        {/* Centre diamond */}
        <div
          style={{
            position: "relative",
            background: "#020617",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "80%",
              height: "80%",
              background:
                "conic-gradient(from 45deg, #ef4444 0 90deg,#22c55e 90deg 180deg,#3b82f6 180deg 270deg,#eab308 270deg 360deg)",
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0 50%)",
              boxShadow: "0 0 20px rgba(15,23,42,0.9)",
            }}
          />
        </div>

        <div
          style={{
            background: "#020617",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {renderArm("blue", "left", blueArr)}
        </div>

        {/* Row 3: YELLOW home | YELLOW path | BLUE home */}
        <div>{renderHome("yellow")}</div>

        <div
          style={{
            background: "#020617",
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {renderArm("yellow", "up", yellowArr)}
        </div>

        <div>{renderHome("blue")}</div>
      </div>
    </div>
  );
};

export default LudoBoard;
