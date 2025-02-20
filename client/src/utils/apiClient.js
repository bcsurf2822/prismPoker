import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:4000/api",
});
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      const errMsg = error.response.data.error;
      if (errMsg === "Token expired") {
        localStorage.removeItem("authToken");

        console.warn("Token expired. Removed from localStorage.");
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
