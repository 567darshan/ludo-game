import { useEffect, useState } from "react";
import { fetchMe } from "../services/authService.js";

const ProfilePage = () => {
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMe();
        setMe(data);
      } catch (err) {
        console.error(err);
        setError("Could not load profile (DB might not be connected).");
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

      {me ? (
        <div className="bg-slate-800 p-5 rounded-xl max-w-md">
          <p>
            <b>Username:</b> {me.username}
          </p>
          <p>
            <b>Email:</b> {me.email}
          </p>
          <p>
            <b>Wins:</b> {me.wins} &nbsp; <b>Losses:</b> {me.losses}
          </p>
          <p>
            <b>XP:</b> {me.xp} &nbsp; <b>Level:</b> {me.level}
          </p>
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
