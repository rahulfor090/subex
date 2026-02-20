import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));

            // Refresh role from the server
            fetch('http://localhost:3000/api/auth/me', {
                headers: { Authorization: `Bearer ${storedToken}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.data) {
                        const updated = { ...JSON.parse(storedUser), role: data.data.role || 'user' };
                        setUser(updated);
                        localStorage.setItem('user', JSON.stringify(updated));
                    }
                })
                .catch(() => { })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = useCallback((tkn, userData) => {
        localStorage.setItem('token', tkn);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(tkn);
        setUser(userData);
    }, []);

    const signup = useCallback((tkn, userData) => {
        localStorage.setItem('token', tkn);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(tkn);
        setUser(userData);
    }, []);

    // Merge updated fields into current user state and persist to localStorage
    const updateUser = useCallback((updatedFields) => {
        setUser(prev => {
            const newUser = { ...prev, ...updatedFields };
            localStorage.setItem('user', JSON.stringify(newUser));
            return newUser;
        });
    }, []);

    const logout = useCallback(async () => {
        try {
            const currentToken = localStorage.getItem('token');
            if (currentToken) {
                await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${currentToken}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
        }
    }, []);

    const value = useMemo(() => ({
        user,
        token,
        login,
        signup,
        logout,
        updateUser,
        isAuthenticated: !!token && !!user,
        loading
    }), [user, token, loading, login, signup, logout, updateUser]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
