import React from 'react';
import { Bell } from 'lucide-react';

const RenewalAlerts = () => {
    return (
        <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/20 p-4 rounded-full">
                <Bell size={48} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Renewal Alerts</h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
                Stay on top of your upcoming payments. Renewal notifications will appear here.
            </p>
        </div>
    );
};

export default RenewalAlerts;
