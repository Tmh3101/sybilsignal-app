import axios, { AxiosInstance, AxiosResponse } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 60000, // 30s timeout to handle potential Modal Backend Cold Starts
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return the data directly for easier consumption
    return response.data;
  },
  (error) => {
    // Log error for debugging and reject to allow UI handling
    console.error("API Pipeline Error:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export default apiClient;
