import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  getTasks: () => apiClient.get('/tasks'),
  createTask: (task) => apiClient.post('/tasks', task),
  updateTask: (id, task) => apiClient.put(`/tasks/${id}`, task),
  deleteTask: (id) => apiClient.delete(`/tasks/${id}`),
  toggleCompleteTask: (id) => apiClient.patch(`/tasks/${id}/complete`),
  archiveTask: (id) => apiClient.patch(`/tasks/${id}/archive`),
};

export const progressService = {
  getAllProgress: () => apiClient.get('/progress'),
  saveProgress: (progress) => apiClient.post('/progress', progress),
  getProgressByDate: (date) => apiClient.get(`/progress/${date}`),
};

export const calendarService = {
  getCalendarData: () => apiClient.get('/calendar'),
};

export const dashboardService = {
  getDashboardStats: () => apiClient.get('/dashboard'),
};

export default apiClient;
