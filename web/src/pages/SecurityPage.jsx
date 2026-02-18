import React from 'react';
import { Shield } from 'lucide-react';
import { Button } from '../components/ui/button';

const SecurityPage = () => {
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-xl">
                    <Shield size={32} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Security Settings</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Manage your account security and authentication.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
                <div className="flex justify-between items-center pb-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-white">Password</h3>
                        <p className="text-sm text-zinc-500">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                </div>

                <div className="flex justify-between items-center pb-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-white">Two-Factor Authentication</h3>
                        <p className="text-sm text-zinc-500">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                </div>

                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-white">Active Sessions</h3>
                        <p className="text-sm text-zinc-500">Manage devices logged into your account</p>
                    </div>
                    <Button variant="outline">View Devices</Button>
                </div>
            </div>
        </div>
    );
};

export default SecurityPage;
