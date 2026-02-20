/**
 * Central API utility
 * All HTTP calls should use this module so the base URL
 * is driven by the VITE_API_URL environment variable.
 *
 * Development:  VITE_API_URL=http://localhost:3000  (web/.env)
 * Production:   VITE_API_URL=https://api.yourdomain.com  (set in hosting env)
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Thin wrapper around fetch that prepends the API base URL.
 *
 * @param {string} path  - The API path, e.g. '/api/auth/login'
 * @param {RequestInit} options - Standard fetch options
 * @returns {Promise<Response>}
 */
export async function apiFetch(path, options = {}) {
    const url = `${API_BASE_URL}${path}`;
    return fetch(url, options);
}

/**
 * Helper: apiFetch with a JSON body and Content-Type header pre-set.
 *
 * @param {string} path
 * @param {'POST'|'PUT'|'PATCH'|'DELETE'} method
 * @param {object} body
 * @param {Record<string,string>} [extraHeaders]
 * @returns {Promise<Response>}
 */
export async function apiJSON(path, method, body, extraHeaders = {}) {
    return apiFetch(path, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...extraHeaders,
        },
        body: JSON.stringify(body),
    });
}

/**
 * Helper: apiFetch with an Authorization Bearer token header.
 *
 * @param {string} path
 * @param {string} token
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 */
export async function apiAuth(path, token, options = {}) {
    return apiFetch(path, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });
}
