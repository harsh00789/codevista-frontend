import axios from 'axios';

// The Spring Boot backend typically runs on 8081.
// We use an environment variable (VITE_API_BASE_URL) for the base URL.
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
