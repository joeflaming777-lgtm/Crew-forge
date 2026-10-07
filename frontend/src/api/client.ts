import axios from 'axios';

export const API_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Bearer token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillsync_token') || localStorage.getItem('hackmate_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 unauthorized gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If expired token, clear storage unless already on login/landing page
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes('/login') &&
        !currentPath.includes('/register') &&
        currentPath !== '/'
      ) {
        localStorage.removeItem('skillsync_token');
        localStorage.removeItem('skillsync_user');
        localStorage.removeItem('hackmate_token');
        localStorage.removeItem('hackmate_user');
      }
    }
    return Promise.reject(error);
  }
);
