import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../services/gameService.js";

const LeaderboardPage = () => {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchLeaderboard();
        setRows(data || []);
      } catch (err) {
        console.error(err);
        setError("Could not load leaderboard (DB might not be connected).");
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      <table className="w-full max-w-xl text-sm bg-slate-800 rounded-lg overflow-hidden">
        <thead className="bg-slate-700">
          <tr>
            <th className="px-3 py-2 text-left">#</th>
            <th className="px-3 py-2 text-left">Player</th>
            <th className="px-3 py-2 text-left">Wins</th>
            <th className="px-3 py-2 text-left">XP</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u, idx) => (
            <tr key={u._id || idx} className="border-t border-slate-700">
              <td className="px-3 py-2">{idx + 1}</td>
              <td className="px-3 py-2">{u.username}</td>
              <td className="px-3 py-2">{u.wins}</td>
              <td className="px-3 py-2">{u.xp}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="px-3 py-3 text-center" colSpan={4}>
                No data yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardPage;
