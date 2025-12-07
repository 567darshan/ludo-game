import { useState } from "react";

export const useGameState = () => {
  const [gameState, setGameState] = useState(null);
  const [lastDice, setLastDice] = useState(null);
  const [log, setLog] = useState([]);

  return {
    gameState,
    setGameState,
    lastDice,
    setLastDice,
    log,
    setLog,
  };
};
