import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
        Accept: 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        config.headers['Content-Type'] =
            config.data instanceof FormData
                ? 'multipart/form-data'
                : 'application/json';

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Error from server
        }

        return Promise.reject(error);
    }
);

export default api;
