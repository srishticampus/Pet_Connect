import axios from 'axios';
import Cookies from 'js-cookie'; // Using js-cookie for easier cookie handling

const api = axios.create({
  // Use Vite's env variable, default to /api if not set
  baseURL: import.meta.env.VITE_API_URL || '/api',
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

// Request Interceptor: Add Access Token and CSRF Token
api.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken'); // Get token from storage
    const csrfToken = Cookies.get('XSRF-TOKEN'); // Read CSRF token from cookie

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Add CSRF token header for relevant methods (POST, PUT, DELETE, PATCH)
    // The server checks this header (see server/controllers/auth/index.js line 156)
    const method = config.method?.toUpperCase();
    if (csrfToken && method && !['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      config.headers['X-XSRF-TOKEN'] = csrfToken; // Correct header name
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
        // The refresh request itself needs the XSRF-TOKEN header, which the request interceptor should add
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

export default api;