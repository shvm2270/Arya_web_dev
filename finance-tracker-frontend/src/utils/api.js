import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const getTransactions = async () => {
  const response = await axios.get(`${API_URL}/transactions`);
  return response.data.data;
};

export const addTransaction = async (transaction) => {
  const response = await axios.post(`${API_URL}/transactions`, transaction);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await axios.delete(`${API_URL}/transactions/${id}`);
  return response.data;
};
