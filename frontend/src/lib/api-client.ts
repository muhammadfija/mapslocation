import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // No response received
      return Promise.reject({
        error: {
          code: 'NETWORK_ERROR',
          message: 'Unable to connect to server. Please check your connection.',
        },
      });
    } else {
      return Promise.reject({
        error: {
          code: 'REQUEST_ERROR',
          message: error.message,
        },
      });
    }
  }
);
