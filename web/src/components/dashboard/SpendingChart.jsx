import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, addMonths, startOfMonth, parseISO } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg shadow-xl">
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-1">{label}</p>
                <p className="text-emerald-500 font-bold text-lg">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payload[0].value)}
                </p>
            </div>
        );
    }
    return null;
};

const SpendingChart = ({ subscriptions }) => {
    // Generate projection data for next 6 months
    const data = useMemo(() => {
        const currentDate = new Date();
        const months = [];

        for (let i = 0; i < 6; i++) {
            const date = addMonths(currentDate, i);
            const monthName = format(date, 'MMM');

            // Calculate total for this month based on recurring subscriptions
            const total = subscriptions.reduce((acc, sub) => {
                if (!sub.recurring) return acc;
                // Simple calculation (assuming monthly for now for projection)
                let montlyCost = parseFloat(sub.listed_price || 0);
                if (sub.cycle === 'yearly') montlyCost /= 12;
                if (sub.cycle === 'weekly') montlyCost *= 4;
                return acc + montlyCost;
            }, 0);

            // Add some random variation for demo purposes if data is flat
            // In a real app, calculate precise payment dates
            const variance = i > 0 ? (Math.random() * 50 - 25) : 0;

            months.push({
                name: monthName,
                amount: Math.max(0, total + variance)
            });
        }
        return months;
    }, [subscriptions]);

    if (subscriptions.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                Not enough data to display chart
            </div>
        );
    }

    return (
        <div className="w-full" style={{ height: '300px', minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%" debounce={0}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.4} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#71717a', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#71717a', fontSize: 12 }}
                        tickFormatter={(value) => `₹${value}`}
                        dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10b981', strokeWidth: 2 }} />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SpendingChart;
