// src/services/authService.js
import api from "./apiClient.js";

export const fetchMe = async () => {
  const res = await api.get("/users/me");
  return res.data;
};
