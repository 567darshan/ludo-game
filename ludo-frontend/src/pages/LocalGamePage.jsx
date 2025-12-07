// src/pages/LocalGamePage.jsx
import React from "react";
import LudoBoard from "../components/LudoBoard";
import { useLocalLudo } from "../hooks/useLocalLudo";

const LocalGamePage = () => {
  const {
    dice,
    currentPlayer,
    tokenPositions,
    log,
    winner,
    rollDice,
    moveToken,
  } = useLocalLudo();

  const colorHex = {
    red: "#ef4444",
    green: "#22c55e",
    yellow: "#eab308",
    blue: "#3b82f6",
  };

  const currentColor = colorHex[currentPlayer];
  const winnerColor = winner ? colorHex[winner] : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#e5e7eb",
        padding: "16px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Winner banner */}
        {winner && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 18px",
              borderRadius: "999px",
              background: winnerColor,
              color: "#020617",
              fontWeight: 800,
              textAlign: "center",
              fontSize: "20px",
              letterSpacing: "0.06em",
              boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
              textTransform: "uppercase",
            }}
          >
            {winner.toUpperCase()} WINS THE GAME! 🎉
          </div>
        )}

        {/* Status row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: 600 }}>
            Current Player:{" "}
            <span style={{ color: currentColor }}>
              {currentPlayer.toUpperCase()}
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {/* Roll Dice button */}
            <button
              onClick={rollDice}
              disabled={winner || dice !== null}
              style={{
                padding: "8px 18px",
                borderRadius: "999px",
                border: "none",
                fontWeight: 700,
                fontSize: "14px",
                cursor: winner ? "not-allowed" : "pointer",
                background: winner ? "#16a34a44" : "#16a34a",
                color: "#e5e7eb",
                opacity: winner ? 0.7 : 1,
              }}
            >
              Roll Dice
            </button>

            {/* Dice value */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                border: "2px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "18px",
              }}
            >
              {dice ?? "-"}
            </div>

            {/* Move token button */}
            <button
              onClick={moveToken}
              disabled={!dice || winner}
              style={{
                padding: "8px 18px",
                borderRadius: "999px",
                border: "none",
                fontWeight: 600,
                fontSize: "14px",
                cursor: !dice || winner ? "not-allowed" : "pointer",
                background: !dice || winner ? "#4b556366" : "#3b82f6",
                color: "#e5e7eb",
              }}
            >
              Move Token
            </button>
          </div>
        </div>

        {/* Board */}
        <LudoBoard positions={tokenPositions} />

        {/* Activity log */}
        <div style={{ marginTop: "24px" }}>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 800,
              marginBottom: "8px",
            }}
          >
            Activity Log
          </h2>
          <ul style={{ fontSize: "14px", lineHeight: 1.6 }}>
            {log.map((entry, idx) => (
              <li key={idx}>• {entry}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LocalGamePage;
