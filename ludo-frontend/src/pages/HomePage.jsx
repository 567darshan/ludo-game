// src/pages/HomePage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocket } from "../context/SocketContext.jsx";

const HomePage = () => {
  const { user, logout } = useAuth();
  const socket = useSocket(); // not used in offline mode, but kept for future
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState("");
  const [status, setStatus] = useState("");

  // OFFLINE: no real online room yet
  const handleCreateRoom = () => {
    setStatus("Online multiplayer is disabled (offline demo mode).");
  };

  const handleJoinRoom = () => {
    setStatus("Online multiplayer is disabled (offline demo mode).");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6">
      <header className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Advanced Ludo</h1>

        <div className="flex items-center gap-3 text-sm">
          <Link to="/leaderboard" className="underline">
            Leaderboard
          </Link>
          <Link to="/profile" className="underline">
            Profile
          </Link>
          {user && (
            <>
              <span>
                Logged in as <b>{user.username}</b>
              </span>
              <button
                className="px-3 py-1 rounded bg-red-500"
                onClick={logout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      <main className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
        {/* CREATE ROOM CARD */}
        <div className="bg-slate-800 p-5 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-3">Create Room</h2>
          <p className="text-sm mb-3">
            Start a new game and share the room code with your friends.
          </p>
          <button
            className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 font-semibold"
            onClick={handleCreateRoom}
          >
            Create Room
          </button>
        </div>

        {/* JOIN ROOM CARD */}
        <div className="bg-slate-800 p-5 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-3">Join Room</h2>
          <input
            className="w-full px-3 py-2 rounded bg-slate-700 outline-none mb-3 uppercase"
            placeholder="Enter room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <button
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 font-semibold"
            onClick={handleJoinRoom}
          >
            Join
          </button>
        </div>
      </main>

      {status && (
        <p className="mt-6 text-sm text-amber-300 text-center max-w-4xl">
          {status}
        </p>
      )}

      <p className="mt-8 text-sm text-slate-300">
        Just want to test the board?{" "}
        <Link to="/local" className="underline text-emerald-400">
          Open Local Ludo Demo
        </Link>
      </p>
    </div>
  );
};

export default HomePage;
