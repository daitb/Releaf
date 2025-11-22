import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

apiClient.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err.response?.status;

        if(status == 401){
            console.warn("Unauthorized! Redirecting to login...");
        }
        if(status == 403){
            console.warn("Forbidden! You don't have permission to access this resource.");
        }
        if(status >= 500){
            console.error("Server error! Please try again later.", err.response?.data.message, err.message);
        }
        return Promise.reject(err);
    }
);

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});