import api from "./api";

export const registerUser = async (data) => {
  const response = await api.post("/users", data);
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};