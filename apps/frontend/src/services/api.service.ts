import axios, { AxiosInstance } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Optional: basic response interceptor to unwrap data and normalize errors later if needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Surface a friendly error message while preserving original error
    if (error?.response?.data?.error) {
      // eslint-disable-next-line no-console
      console.warn('API error:', error.response.data.error);
    }
    return Promise.reject(error);
  }
);

export default api;


