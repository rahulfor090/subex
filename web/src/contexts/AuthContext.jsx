import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = useCallback((token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(token);
        setUser(userData);
    }, []);

    const signup = useCallback((token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(token);
        setUser(userData);
    }, []);

    const logout = useCallback(async () => {
        try {
            // Call logout API
            const currentToken = localStorage.getItem('token');
            if (currentToken) {
                await fetch('http://localhost:3000/api/auth/logout', {
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
            // Clear local storage and state regardless of API response
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
        }
    }, []);

    // Role-based access helpers
    const isAdmin = useMemo(() => {
        return user?.role === 'admin' || user?.role === 'super_admin';
    }, [user]);

    const isSuperAdmin = useMemo(() => {
        return user?.role === 'super_admin';
    }, [user]);

    const value = useMemo(() => ({
        user,
        token,
        login,
        signup,
        logout,
        isAuthenticated: !!token && !!user,
        isAdmin,
        isSuperAdmin,
        loading
    }), [user, token, loading, login, signup, logout, isAdmin, isSuperAdmin]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
