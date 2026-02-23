import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = [
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#8b5cf6', // violet
    '#f59e0b', // amber
    '#3b82f6', // blue
    '#ec4899', // pink
    '#f97316', // orange
];

const fmt = (n) => {
    try {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency', currency: 'INR', maximumFractionDigits: 0
        }).format(n);
    } catch { return `₹${Math.round(n)}`; }
};

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg px-3 py-2 text-xs">
            <p className="font-semibold text-zinc-900 dark:text-white mb-0.5">{d.name}</p>
            <p className="text-zinc-400">{fmt(d.value)} · {d.pct}%</p>
        </div>
    );
};

const CategoryPieChart = ({ subscriptions }) => {
    const { data, total } = useMemo(() => {
        const spend = {};

        subscriptions.forEach(s => {
            const category = s.tags?.length > 0 ? s.tags[0].name : 'Uncategorized';
            const v = parseFloat(s.value) || 0;
            // Normalise to monthly equivalent
            const monthly =
                s.cycle === 'yearly' ? v / 12 :
                    s.cycle === 'quarterly' ? v / 3 :
                        s.cycle === 'weekly' ? v * 4.33 : v;
            spend[category] = (spend[category] || 0) + monthly;
        });

        const total = Object.values(spend).reduce((a, b) => a + b, 0);

        const arr = Object.entries(spend)
            .map(([name, value]) => ({
                name,
                value: Math.round(value),
                pct: total > 0 ? Math.round((value / total) * 100) : 0,
            }))
            .filter(d => d.value > 0)
            .sort((a, b) => b.value - a.value);

        return { data: arr, total: Math.round(total) };
    }, [subscriptions]);

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
                <p className="text-sm text-zinc-400">No category data yet</p>
                <p className="text-xs text-zinc-300 dark:text-zinc-600">Add subscriptions with tags to see the breakdown</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Donut */}
            <div className="relative h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={52}
                            outerRadius={72}
                            paddingAngle={3}
                            dataKey="value"
                            cornerRadius={4}
                            stroke="none"
                            startAngle={90}
                            endAngle={-270}
                        >
                            {data.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-base font-bold text-zinc-900 dark:text-white tabular-nums leading-tight">
                        {fmt(total)}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mt-0.5">/ month</p>
                </div>
            </div>

            {/* Legend rows */}
            <div className="space-y-2.5">
                {data.slice(0, 5).map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2.5">
                        {/* Colour dot */}
                        <span
                            className="flex-shrink-0 w-2 h-2 rounded-full"
                            style={{ background: COLORS[i % COLORS.length] }}
                        />
                        {/* Label + bar */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300 truncate">{d.name}</p>
                                <p className="text-xs font-semibold text-zinc-900 dark:text-white tabular-nums ml-2 flex-shrink-0">{d.pct}%</p>
                            </div>
                            <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${d.pct}%`, background: COLORS[i % COLORS.length] }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
                {data.length > 5 && (
                    <p className="text-xs text-zinc-400 pl-4">+{data.length - 5} more categories</p>
                )}
            </div>
        </div>
    );
};

export default CategoryPieChart;
