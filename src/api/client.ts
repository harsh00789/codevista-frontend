import axios from 'axios';

// The Spring Boot backend typically runs on 8080.
// We should use an environment variable or default to localhost:8080.
const apiClient = axios.create({
    baseURL: 'http://localhost:8081',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
