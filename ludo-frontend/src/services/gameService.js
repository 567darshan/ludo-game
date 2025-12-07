// for later use (leaderboard, history etc.)
import api from "./apiClient.js";

export const fetchLeaderboard = async () => {
  const res = await api.get("/leaderboard");
  return res.data;
};
