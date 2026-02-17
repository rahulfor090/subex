// Admin API Service
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

// Create axios instance with auth headers
const adminApi = axios.create({
    baseURL: `${API_BASE}/admin`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach token to every request
adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses globally
adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Dashboard
export const fetchDashboard = () => adminApi.get('/dashboard');

// Users
export const fetchUsers = (params) => adminApi.get('/users', { params });
export const fetchUserById = (id) => adminApi.get(`/users/${id}`);
export const updateUser = (id, data) => adminApi.patch(`/users/${id}`, data);
export const deleteUser = (id) => adminApi.delete(`/users/${id}`);

// Plans
export const fetchPlans = () => adminApi.get('/plans');
export const fetchPlanById = (id) => adminApi.get(`/plans/${id}`);
export const createPlan = (data) => adminApi.post('/plans', data);
export const updatePlan = (id, data) => adminApi.patch(`/plans/${id}`, data);
export const deletePlan = (id) => adminApi.delete(`/plans/${id}`);

// Transactions
export const fetchTransactions = (params) => adminApi.get('/transactions', { params });
export const fetchTransactionById = (id) => adminApi.get(`/transactions/${id}`);

// Auth API (uses base URL, not admin)
const authApi = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const loginAdmin = (credentials) => authApi.post('/auth/login', credentials);
export const getMe = () => authApi.get('/auth/me');

export default adminApi;
