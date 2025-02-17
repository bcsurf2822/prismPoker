import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      const errMsg = error.response.data.error;
      if (errMsg === "Token expired") {
        // Remove the expired token from localStorage
        localStorage.removeItem("authToken");
        // Optionally, you could also dispatch a logout action here if you have access to your store
        console.warn("Token expired. Removed from localStorage.");
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;