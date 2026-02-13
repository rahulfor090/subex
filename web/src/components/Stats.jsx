import React, { useEffect, useState, useRef } from 'react';
import { Users, DollarSign, Activity, Award } from 'lucide-react';

const stats = [
    { label: 'Active Users', numValue: 10000, prefix: '', suffix: '+', icon: Users, description: 'Trusting our platform daily' },
    { label: 'Money Saved', numValue: 2400000, prefix: '$', suffix: '+', icon: DollarSign, description: 'In unwanted subscriptions' },
    { label: 'Subscriptions', numValue: 50000, prefix: '', suffix: '+', icon: Activity, description: 'Managed and optimized' },
    { label: 'Privacy Protected', numValue: 100, prefix: '', suffix: '%', icon: Award, description: 'Data security guaranteed' }
];

const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${Math.floor(num / 1000)}K`;
    return num.toString();
};

const InfoCard = ({ stat }) => {
    const Icon = stat.icon;
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); }
        }, { threshold: 0.3 });
        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        const duration = 2000;
        const steps = 60;
        const stepValue = stat.numValue / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += stepValue;
            if (current >= stat.numValue) { setCount(stat.numValue); clearInterval(timer); }
            else { setCount(Math.floor(current)); }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [isVisible, stat.numValue]);

    return (
        <div ref={cardRef} className="group p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 hover:border-[#008060]/30 hover:shadow-sm transition-all duration-300 text-center">
            <div className="mb-4 mx-auto w-12 h-12 rounded-xl bg-[#F1F8F5] flex items-center justify-center group-hover:bg-[#008060] transition-colors duration-300">
                <Icon size={22} className="text-[#008060] group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight tabular-nums mb-1">
                {stat.prefix}{formatNumber(count)}{count >= stat.numValue ? stat.suffix : ''}
            </h3>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">{stat.label}</p>
            <p className="text-xs text-gray-500">{stat.description}</p>
        </div>
    );
};

const Stats = () => (
    <section className="py-20 sm:py-28 bg-[#FAFAFA]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 fade-in-section">
                <p className="text-sm font-semibold text-[#008060] uppercase tracking-wide mb-3">Our Impact</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">The numbers speak for themselves</h2>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">Experience the platform that's changing how people manage their digital lives.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="fade-in-section" style={{ transitionDelay: `${index * 100}ms` }}>
                        <InfoCard stat={stat} />
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Stats;
