import axios from 'axios';  

const api = axios.create({  
  baseURL: process.env.REACT_APP_API_URL,  
  withCredentials: true  
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

api.interceptors.request.use(config => {  
  const accessToken = localStorage.getItem('accessToken');  
  const csrfToken = document.cookie  
    .split('; ')  
    .find(row => row.startsWith('XSRF-TOKEN='))  
    ?.split('=')[1];  

  if (accessToken) {  
    config.headers.Authorization = `Bearer ${accessToken}`;  
  }  
  if (csrfToken) {  
    config.headers['X-CSRF-TOKEN'] = csrfToken;  
  }  
  return config;  
});  

api.interceptors.response.use(  
  response => response,  
  async error => {  
    const originalRequest = error.config;  
    
    if (error.response?.status === 401 && !originalRequest._retry) {  
      if (isRefreshing) {  
        return new Promise((resolve, reject) => {  
          failedQueue.push({ resolve, reject });  
        }).then(() => api(originalRequest))  
          .catch(err => Promise.reject(err));  
      }  

      originalRequest._retry = true;  
      isRefreshing = true;  

      try {  
        const { data } = await api.post('/auth/refresh');  
        localStorage.setItem('accessToken', data.accessToken);  
        
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;  
        processQueue(null, data.accessToken);  
        return api(originalRequest);  
      } catch (refreshError) {  
        processQueue(refreshError, null);  
        localStorage.removeItem('accessToken');  
        window.location.href = '/login';  
        return Promise.reject(refreshError);  
      } finally {  
        isRefreshing = false;  
      }  
    }  
    return Promise.reject(error);  
  }  
);  

export default api;