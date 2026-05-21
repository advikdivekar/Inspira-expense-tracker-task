import api from "./api";

export const loginAdmin = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });
  return response.data;   // { access_token, token_type }
};