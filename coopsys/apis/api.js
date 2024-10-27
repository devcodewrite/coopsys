import axios from "axios";
import settingModel from "../models/settingModel";

const api = axios.create();

api.interceptors.request.use(
  async (config) => {
    const token = await settingModel.getAccessToken(); // Replace with your storage method
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for a 403 status with a specific error code for expired token
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data.code === 4 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = await settingModel.getRefreshToken("refreshToken"); // Replace with your storage method

      // Request a new token using the refresh token
      try {
        const { data } = await axios.post(
          `${process.env.EXPO_PUBLIC_ACCOUNTS_URL}/auth/refresh`,
          {
            refresh_token: refreshToken,
          }
        );
    
        // Save the new token
        await settingModel.setAccessToken(data.access_token);
        await settingModel.setRefreshToken(data.refresh_token);

        // Set the Authorization header with the new token
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

        return api(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.error("Token refresh error:", refreshError);
        // Handle token refresh failure (e.g., redirect to login)
        throw { refreshError: true };
      }
    }
    return Promise.reject(error);
  }
);

export default api;
