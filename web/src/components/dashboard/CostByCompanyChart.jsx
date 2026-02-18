import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CostByCompanyChart = ({ subscriptions }) => {
    const data = useMemo(() => {
        // Aggregate cost by company
        const companyCosts = subscriptions.reduce((acc, sub) => {
            const name = sub.company?.name || 'Unknown';
            const value = parseFloat(sub.value || 0);

            // Normalize to monthly cost for fair comparison
            let monthlyCost = value;
            if (sub.cycle === 'yearly') monthlyCost /= 12;
            if (sub.cycle === 'weekly') monthlyCost *= 4;
            if (sub.cycle === 'daily') monthlyCost *= 30;

            acc[name] = (acc[name] || 0) + monthlyCost;
            return acc;
        }, {});

        // Convert to array and sort by cost
        return Object.keys(companyCosts)
            .map(name => ({
                name,
                cost: companyCosts[name]
            }))
            .sort((a, b) => b.cost - a.cost)
            .slice(0, 10); // Top 10 expensive
    }, [subscriptions]);

    if (data.length === 0) {
        return (
            <div className="h-[350px] flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                No data available
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg shadow-xl text-sm">
                    <p className="font-semibold text-zinc-900 dark:text-white mb-1">{label}</p>
                    <p className="text-emerald-500 font-bold">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[0].value)} / mo
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" opacity={0.2} />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        width={100}
                        tick={{ fill: '#71717a', fontSize: 12, fontWeight: 500 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }} />
                    <Bar dataKey="cost" radius={[0, 4, 4, 0]} barSize={24}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="#10b981" fillOpacity={0.8 + (index * -0.05)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CostByCompanyChart;
