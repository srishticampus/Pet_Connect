import axios from 'axios';

const api = axios.create({
  // Use Vite's env variable, default to /api if not set
  baseURL: import.meta.env.VITE_API_URL + "/api",
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

// Custom post function to handle FormData
api.post = async (url, data, config = {}) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const headers = {
      ...config.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    if (data instanceof FormData) {
      // If data is FormData, do not set Content-Type, let axios handle it
      delete headers['Content-Type'];
    } else {
      headers['Content-Type'] = 'application/json';
    }

    const response = await axios.post(url, data, {
      ...config,
      baseURL: api.defaults.baseURL,
      withCredentials: true,
      headers,
    });
    return response;
  } catch (error) {
    console.error('API POST error:', error);
    throw error;
  }
};

export default api;