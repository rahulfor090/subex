// Admin API service — centralised fetch wrapper for /api/admin/* endpoints

const API_BASE = 'http://localhost:3000/api/admin';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
};

// ── Dashboard ──
export const fetchDashboardStats = () =>
    fetch(`${API_BASE}/dashboard/stats`, { headers: getHeaders() }).then(handleResponse);

export const fetchDashboardCharts = () =>
    fetch(`${API_BASE}/dashboard/charts`, { headers: getHeaders() }).then(handleResponse);

// ── Users ──
export const fetchUsers = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/users?${query}`, { headers: getHeaders() }).then(handleResponse);
};

export const fetchUserById = (id) =>
    fetch(`${API_BASE}/users/${id}`, { headers: getHeaders() }).then(handleResponse);

export const updateUser = (id, data) =>
    fetch(`${API_BASE}/users/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    }).then(handleResponse);

export const createUser = (data) =>
    fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    }).then(handleResponse);

export const deleteUser = (id) =>
    fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    }).then(handleResponse);

export const restoreUser = (id) =>
    fetch(`${API_BASE}/users/${id}/restore`, {
        method: 'POST',
        headers: getHeaders()
    }).then(handleResponse);

// ── Plans ──
export const fetchPlans = () =>
    fetch(`${API_BASE}/plans`, { headers: getHeaders() }).then(handleResponse);

export const fetchPlanById = (id) =>
    fetch(`${API_BASE}/plans/${id}`, { headers: getHeaders() }).then(handleResponse);

export const createPlan = (data) =>
    fetch(`${API_BASE}/plans`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    }).then(handleResponse);

export const updatePlan = (id, data) =>
    fetch(`${API_BASE}/plans/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    }).then(handleResponse);

export const deletePlan = (id) =>
    fetch(`${API_BASE}/plans/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    }).then(handleResponse);

// ── Transactions ──
export const fetchTransactions = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/transactions?${query}`, { headers: getHeaders() }).then(handleResponse);
};

export const fetchTransactionById = (id) =>
    fetch(`${API_BASE}/transactions/${id}`, { headers: getHeaders() }).then(handleResponse);

// ── System Health ──
export const fetchSystemHealth = () =>
    fetch(`${API_BASE}/system/health`, { headers: getHeaders() }).then(handleResponse);
