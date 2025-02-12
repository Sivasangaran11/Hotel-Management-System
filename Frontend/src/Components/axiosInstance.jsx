import axios from "axios";

const backendUri = import.meta.env.VITE_BACKEND_URI;

const axiosInstance = axios.create({
  baseURL: backendUri,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure cookies are sent with every request
});

// Request Interceptor: Attach Access Token to Every Request
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiry
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        // Request a new access token using refresh token stored in cookies
        const refreshResponse = await axios.post(
          `${backendUri}/api/refresh`,
          {},
          { withCredentials: true } // Send cookies with the request
        );

        const newAccessToken = refreshResponse.data.accessToken;

        // Store the new token in localStorage
        localStorage.setItem("token", newAccessToken);

        // Retry the original request with the new token
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(error.config);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // If refresh fails, log the user out
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
