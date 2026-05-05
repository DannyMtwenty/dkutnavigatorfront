import axios from 'axios';

// Get the environment mode
const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.MODE === 'production';

// Define URLs
const devUrl = 'http://localhost:5129/api';
const prodUrl = 'http://41.89.227.241:8100/api';

// Automatically select the correct URL based on environment
const getApiBaseUrl = () => {
  // First priority: Check environment variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Second priority: Check mode
  if (isProduction) {
    return prodUrl;
  }
  
  // Default to development
  return devUrl;
};

const API_BASE_URL = getApiBaseUrl();

// Log the current environment and API URL (only in development)
if (isDevelopment) {
  console.log('🚀 Environment:', import.meta.env.MODE);
  console.log('🌐 API Base URL:', API_BASE_URL);
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (isDevelopment) {
      console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    if (isDevelopment) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (isDevelopment) {
      console.log('📥 Response:', response.config.url, response.status);
    }
    return response;
  },
  (error) => {
    // Log errors in development
    if (isDevelopment) {
      console.error('❌ Response Error:', error.response?.status, error.message);
    }

    if (error.response) {
      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('token');
          if (isProduction) {
            window.location.href = '/login';
          } else {
            console.warn('🔒 Unauthorized - Token removed');
          }
          break;
        case 403:
          console.error('🚫 Forbidden access');
          break;
        case 404:
          console.error('❓ Resource not found');
          break;
        case 500:
          console.error('💥 Server error');
          break;
        case 503:
          console.error('🔧 Service unavailable');
          break;
        default:
          console.error('⚠️ An error occurred');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('📡 No response from server - Check your connection');
    }

    return Promise.reject(error);
  }
);

// Export both the instance and the base URL for reference
export default axiosInstance;
export { API_BASE_URL, isDevelopment, isProduction };