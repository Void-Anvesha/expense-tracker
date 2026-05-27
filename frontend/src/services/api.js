import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getCurrentUser: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/profile', data)
};

export const transactionAPI = {
  addTransaction: (data) => apiClient.post('/transactions', data),
  getTransactions: (params) => apiClient.get('/transactions', { params }),
  getTransaction: (id) => apiClient.get(`/transactions/${id}`),
  updateTransaction: (id, data) => apiClient.put(`/transactions/${id}`, data),
  deleteTransaction: (id) => apiClient.delete(`/transactions/${id}`),
  getMonthlySummary: (year, month) => apiClient.get('/transactions/summary/monthly', { params: { year, month } }),
  getCategoryBreakdown: (params) => apiClient.get('/transactions/breakdown/category', { params })
};

export const budgetAPI = {
  setBudget: (data) => apiClient.post('/budgets', data),
  getBudgets: (params) => apiClient.get('/budgets', { params }),
  getBudgetByCategory: (category) => apiClient.get(`/budgets/${category}`),
  deleteBudget: (id) => apiClient.delete(`/budgets/${id}`),
  getBudgetAlerts: () => apiClient.get('/budgets/alerts/status')
};

export const insightAPI = {
  getDashboardInsights: () => apiClient.get('/insights/dashboard'),
  getSpendingComparison: (category) => apiClient.get('/insights/comparison', { params: { category } }),
  getOverspendingPatterns: () => apiClient.get('/insights/patterns'),
  getSavingsRecommendations: () => apiClient.get('/insights/recommendations'),
  getComprehensiveInsights: () => apiClient.get('/insights/comprehensive'),
  getSpendingTrends: (months) => apiClient.get('/insights/trends', { params: { months } })
};

export const goalAPI = {
  createGoal: (data) => apiClient.post('/goals', data),
  getGoals: (params) => apiClient.get('/goals', { params }),
  getGoal: (id) => apiClient.get(`/goals/${id}`),
  updateGoal: (id, data) => apiClient.put(`/goals/${id}`, data),
  deleteGoal: (id) => apiClient.delete(`/goals/${id}`),
  getGoalProgress: (id) => apiClient.get(`/goals/${id}/progress`)
};

export default apiClient;
