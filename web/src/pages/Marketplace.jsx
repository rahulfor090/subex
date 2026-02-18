import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Marketplace = () => {
    return (
        <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-full">
                <ShoppingBag size={48} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Marketplace</h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
                Discover new subscriptions and exclusive deals. Coming soon!
            </p>
        </div>
    );
};

export default Marketplace;
