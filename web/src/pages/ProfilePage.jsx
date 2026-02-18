import React from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';

const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{user?.name || 'User Name'}</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">{user?.email || 'user@example.com'}</p>
                </div>
                <Button className="rounded-full px-6">Edit Profile</Button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Personal Details</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-zinc-500 uppercase font-semibold">Full Name</label>
                            <p className="text-zinc-900 dark:text-white font-medium">{user?.name || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-xs text-zinc-500 uppercase font-semibold">Email</label>
                            <p className="text-zinc-900 dark:text-white font-medium">{user?.email || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
