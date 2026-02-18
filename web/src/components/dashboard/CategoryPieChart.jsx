import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#3b82f6', '#f59e0b', '#ec4899'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-lg shadow-xl text-xs">
                <span className="font-medium text-zinc-900 dark:text-white mr-2">{payload[0].name}:</span>
                <span className="text-emerald-500 font-bold">{payload[0].value}</span>
            </div>
        );
    }
    return null;
};

const CategoryPieChart = ({ subscriptions }) => {
    const data = useMemo(() => {
        const counts = {};
        subscriptions.forEach(sub => {
            const category = sub.tags && sub.tags.length > 0 ? sub.tags[0].name : 'Uncategorized';
            counts[category] = (counts[category] || 0) + 1; // Count or sum value? Count is safer for distribution
            // Or maybe sum value for realistic "spending distribution"
            // Let's sum value for spending distribution
            // counts[category] = (counts[category] || 0) + parseFloat(sub.value || 0);
        });

        // Mapping to array
        return Object.keys(counts).map(key => ({
            name: key,
            value: counts[key]
        })).filter(item => item.value > 0);
    }, [subscriptions]);

    if (data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                No data available
            </div>
        );
    }

    return (
        <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        cornerRadius={5}
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{ fontSize: '12px', paddingLeft: '20px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
            {/* Center Text for Donut Chart (Total Count) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <div className="text-3xl font-bold text-zinc-900 dark:text-white">{subscriptions.length}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Total</div>
            </div>
        </div>
    );
};

export default CategoryPieChart;
