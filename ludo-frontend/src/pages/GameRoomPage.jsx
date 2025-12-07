// src/pages/GameRoomPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

const GameRoomPage = () => {
  const { roomCode } = useParams();
  const socket = useSocket();
  const [room, setRoom] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [lastDice, setLastDice] = useState(null);
  const [log, setLog] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleRoomUpdated = (data) => setRoom(data);
    const handleGameStarted = ({ gameState }) => setGameState(gameState);
    const handleDiceRolled = ({ dice, currentTurn }) => {
      setLastDice(dice);
      setLog((prev) => [
        `Dice: ${dice}, current turn: ${currentTurn}`,
        ...prev,
      ]);
    };
    const handleGameStateUpdated = (state) => setGameState(state);
    const handleGameFinished = ({ winnerColor }) => {
      setLog((prev) => [`Game finished. Winner: ${winnerColor}`, ...prev]);
    };

    socket.on("roomUpdated", handleRoomUpdated);
    socket.on("gameStarted", handleGameStarted);
    socket.on("diceRolled", handleDiceRolled);
    socket.on("gameStateUpdated", handleGameStateUpdated);
    socket.on("gameFinished", handleGameFinished);

    return () => {
      socket.off("roomUpdated", handleRoomUpdated);
      socket.off("gameStarted", handleGameStarted);
      socket.off("diceRolled", handleDiceRolled);
      socket.off("gameStateUpdated", handleGameStateUpdated);
      socket.off("gameFinished", handleGameFinished);
    };
  }, [socket]);

  const handleStartGame = () => {
    if (!socket) return;
    socket.emit("startGame", { roomCode }, (res) => {
      if (res?.error) {
        setLog((prev) => [`Start error: ${res.error}`, ...prev]);
      }
    });
  };

  const handleRollDice = () => {
    if (!socket) return;
    socket.emit("rollDice", { roomCode }, (res) => {
      if (res?.error) {
        setLog((prev) => [`Roll error: ${res.error}`, ...prev]);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-2">
        Room <span className="text-emerald-400">{roomCode}</span>
      </h1>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <button
              className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-sm font-semibold"
              onClick={handleStartGame}
            >
              Start Game
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-sm font-semibold"
              onClick={handleRollDice}
            >
              Roll Dice
            </button>
            {lastDice && (
              <span className="text-lg font-bold ml-4">
                Last Dice: {lastDice}
              </span>
            )}
          </div>

          <h2 className="font-semibold mb-2">Game State (raw)</h2>
          <pre className="text-xs bg-slate-900 p-3 rounded max-h-72 overflow-auto">
            {gameState ? JSON.stringify(gameState, null, 2) : "Waiting..."}
          </pre>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl">
          <h2 className="font-semibold mb-2">Players</h2>
          <ul className="text-sm mb-4">
            {room?.players?.map((p) => (
              <li key={p._id || p.socketId}>
                <span className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: p.color || "white" }}
                />
                {p.username || "Player"} ({p.color})
              </li>
            )) || <li>No data yet</li>}
          </ul>
          <h2 className="font-semibold mb-2">Log</h2>
          <ul className="text-xs max-h-48 overflow-auto space-y-1">
            {log.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameRoomPage;
