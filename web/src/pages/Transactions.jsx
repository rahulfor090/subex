import React from 'react';
import { FileText } from 'lucide-react';

const Transactions = () => {
    return (
        <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-full">
                <FileText size={48} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Transaction History</h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
                View your past payments and download invoices here.
            </p>
        </div>
    );
};

export default Transactions;
