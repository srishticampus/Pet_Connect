import axios from 'axios';

const api = axios.create({
  // Use Vite's env variable, default to /api if not set
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // Important for sending/receiving cookies
});

// Request Interceptor: Add Access Token
api.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken'); // Get token from storage

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 errors by clearing token and redirecting
api.interceptors.response.use(
  response => response,
  async error => {
    // Check if it's a 401 error
    if (error.response?.status === 401) {
      // Clear token and redirect to login (or handle logout state)
      localStorage.removeItem('accessToken');
      console.error("Unauthorized. Redirecting to login.");
      window.location.href = '/login'; // Redirect to login
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

// New function to fetch all pet owners from the admin endpoint
export const getAllPetOwners = async () => {
  try {
    const response = await api.get('/api/admin/pet-owners');
    return response.data;
  } catch (error) {
    console.error('Error fetching pet owners:', error);
    throw error;
  }
};

export default api;