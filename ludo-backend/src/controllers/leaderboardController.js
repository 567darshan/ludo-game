import User from "../models/User.js";

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ wins: -1, xp: -1 })
      .limit(20)
      .select("username wins xp level");

    res.json(users);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
