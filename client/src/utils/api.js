import axios from 'axios';

const api = axios.create({
  // Use Vite's env variable, default to /api if not set
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // Important for sending/receiving cookies
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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

// Response Interceptor: Handle Token Refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Check if it's a 401 error and not a retry attempt
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is already in progress, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest); // Retry with new token
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true; // Mark as retry
      isRefreshing = true;

      try {
        // Attempt to refresh the token using the /auth/refresh endpoint
        const { data } = await api.post('/auth/refresh');

        // Store the new access token
        localStorage.setItem('accessToken', data.accessToken);

        // Update the default Authorization header for subsequent requests
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        // Also update the header for the original request being retried
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

        // Process the queue with the new token
        processQueue(null, data.accessToken);

        // Retry the original request with the new token
        return api(originalRequest);

      } catch (refreshError) {
        // If refresh fails, process the queue with an error
        processQueue(refreshError, null);

        // Clear token and redirect to login (or handle logout state)
        localStorage.removeItem('accessToken');
        // Consider calling a logout function from AuthContext if available,
        // otherwise, redirect might be necessary.
        console.error("Session expired or refresh failed. Redirecting to login.");
        // window.location.href = '/login'; // Uncomment if direct redirect is desired

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
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