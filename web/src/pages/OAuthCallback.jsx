import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../lib/api';

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [status, setStatus] = useState('Processing...');

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
            setStatus('Login failed. Redirecting...');
            setTimeout(() => navigate('/login?error=oauth_failed'), 2000);
            return;
        }

        if (!token) {
            setStatus('No token received. Redirecting...');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        // Fetch user details with the token
        const fetchUser = async () => {
            try {
                const response = await apiFetch('/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();

                if (data.success) {
                    login(token, data.data);
                    setStatus('Success! Redirecting...');
                    // If the user has no password (new OAuth user), send them to create one
                    if (!data.data.hasPassword) {
                        navigate('/create-password');
                    } else {
                        navigate('/');
                    }
                } else {
                    setStatus('Authentication failed. Redirecting...');
                    setTimeout(() => navigate('/login'), 2000);
                }
            } catch (err) {
                console.error('OAuth callback error:', err);
                setStatus('Something went wrong. Redirecting...');
                setTimeout(() => navigate('/login'), 2000);
            }
        };

        fetchUser();
    }, [searchParams, login, navigate]);

    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-zinc-600 dark:text-zinc-400 text-lg">{status}</p>
            </div>
        </div>
    );
};

export default OAuthCallback;
