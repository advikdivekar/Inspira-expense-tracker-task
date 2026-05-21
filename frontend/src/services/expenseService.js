import api from "./api";

export const submitExpense = async (data) => {
  const response = await api.post("/expenses", data);
  return response.data;
};

export const getExpensesByUser = async (userId) => {
  const response = await api.get(`/expenses/user/${userId}`);
  return response.data;
};

// manager only
export const getAllExpenses = async (status = null) => {
  const params = status ? { status } : {};
  const response = await api.get("/expenses", { params });
  return response.data;
};

// manager only
export const reviewExpense = async (expenseId, data) => {
  const response = await api.patch(`/expenses/${expenseId}/review`, data);
  return response.data;
};