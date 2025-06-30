import axios from 'axios';

const API_URL = 'https://backendgen-hgewftfphagrcbg7.southindia-01.azurewebsites.net/api';

// Create axios instance with optimized defaults
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const signup = async (userData) => {
  const response = await apiClient.post('/signup', userData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await apiClient.post('/login', loginData);
  return response.data;
};

export default apiClient;