// src/hooks/useLocalLudo.js
import { useState } from "react";

const PLAYERS = ["green", "yellow", "red", "blue"];
const NUM_TOKENS = 4;
const TRACK_LEN = 8; // steps from house to goal

export const useLocalLudo = () => {
  const [dice, setDice] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState("green");

  // positions[color] = [p1, p2, p3, p4]
  // 0 = in house, 1..TRACK_LEN = on path (TRACK_LEN = goal)
  const [tokenPositions, setTokenPositions] = useState({
    green: Array(NUM_TOKENS).fill(0),
    yellow: Array(NUM_TOKENS).fill(0),
    red: Array(NUM_TOKENS).fill(0),
    blue: Array(NUM_TOKENS).fill(0),
  });

  const [log, setLog] = useState([]);
  const [winner, setWinner] = useState(null);

  const rollDice = () => {
    if (winner || dice !== null) return; // do nothing if game finished or dice already rolled

    const val = Math.floor(Math.random() * 6) + 1;
    setDice(val);
    setLog((prev) => [`${currentPlayer.toUpperCase()} rolled ${val}`, ...prev]);
  };

  const moveToken = () => {
    if (!dice || winner) return;

    let movedToGoal = false;

    setTokenPositions((prev) => {
      const updated = { ...prev };
      const arr = [...updated[currentPlayer]];

      // choose first token that is not finished yet
      const idx = arr.findIndex((p) => p < TRACK_LEN);
      if (idx === -1) {
        // all tokens already at goal
        return prev;
      }

      const newPos = Math.min(arr[idx] + dice, TRACK_LEN);
      arr[idx] = newPos;
      updated[currentPlayer] = arr;

      if (newPos === TRACK_LEN) {
        movedToGoal = true;
      }

      // check if this player has won (all tokens at goal)
      if (arr.every((p) => p === TRACK_LEN)) {
        setWinner(currentPlayer);
      }

      return updated;
    });

    setLog((prev) => [
      movedToGoal
        ? `${currentPlayer.toUpperCase()} moved a token to GOAL!`
        : `${currentPlayer.toUpperCase()} moved a token`,
      ...prev,
    ]);

    // next player's turn
    const idx = PLAYERS.indexOf(currentPlayer);
    const next = PLAYERS[(idx + 1) % PLAYERS.length];
    setCurrentPlayer(next);

    setDice(null);
  };

  return {
    dice,
    currentPlayer,
    tokenPositions,
    log,
    winner,
    rollDice,
    moveToken,
  };
};
