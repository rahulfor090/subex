import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Clock, ChevronDown, ArrowRight, Send,
    Wifi, TrendingUp, Coffee, Heart, BookOpen, Code
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CONTACT_EMAIL = 'subex.club@gmail.com';

// ─── Perks ─────────────────────────────────────────────────────────────────
const PERKS = [
    { icon: Wifi, label: 'Remote-first', desc: 'Work from anywhere — we care about outcomes, not location.' },
    { icon: TrendingUp, label: 'High ownership', desc: 'Small team means your work matters and ships fast.' },
    { icon: Coffee, label: 'Async by default', desc: 'Deep work over endless meetings. Your calendar is yours.' },
    { icon: Heart, label: 'Flexible hours', desc: 'Work when you\'re most productive. Results over schedules.' },
    { icon: BookOpen, label: 'Learning budget', desc: 'Annual stipend for courses, books, and conferences.' },
    { icon: Code, label: 'Ship real things', desc: 'Every line of code reaches real users from day one.' },
];

// ─── Open Roles ────────────────────────────────────────────────────────────
const ROLES = [
    {
        title: 'Full‑Stack Engineer',
        team: 'Engineering',
        type: 'Full-time',
        location: 'Remote · India',
        tags: ['React', 'Node.js', 'PostgreSQL'],
        desc: 'Own end-to-end product features — from database schema to polished UI. You\'ll work on the core subscription tracking platform, APIs, and developer tooling.',
    },
    {
        title: 'Product Designer',
        team: 'Design',
        type: 'Full-time',
        location: 'Remote · India',
        tags: ['Figma', 'UX Research', 'Design Systems'],
        desc: 'Shape the look, feel, and flow of SubEx. You\'ll create wireframes, run user interviews, maintain our design system, and raise the bar on every pixel.',
    },
    {
        title: 'Growth & Marketing Intern',
        team: 'Growth',
        type: 'Internship · 3–6 months',
        location: 'Remote',
        tags: ['Content', 'SEO', 'Analytics'],
        desc: 'Drive awareness and user growth through content, SEO, and community. Ideal if you love building audiences and experimenting with distribution channels.',
    },
];

// ─── Role Card ─────────────────────────────────────────────────────────────
const RoleCard = ({ role, index }) => {
    const [open, setOpen] = useState(false);

    const applyLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        `Job Application — ${role.title}`
    )}&body=${encodeURIComponent(
        `Hi SubEx team,\n\nI'd like to apply for the ${role.title} role.\n\nAbout me:\n\n\nPortfolio / GitHub / LinkedIn:\n\n`
    )}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06, duration: 0.4 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden"
        >
            {/* Header */}
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 flex-1 min-w-0">
                    <h3 className="font-semibold text-zinc-900 dark:text-white text-base">{role.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                        <span className="flex items-center gap-1"><Clock size={11} />{role.type}</span>
                        <span className="flex items-center gap-1"><MapPin size={11} />{role.location}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium">
                            {role.team}
                        </span>
                    </div>
                </div>
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 flex-shrink-0 text-zinc-400"
                >
                    <ChevronDown size={16} />
                </motion.span>
            </button>

            {/* Expandable body */}
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 border-t border-zinc-100 dark:border-zinc-800 pt-5 space-y-4">
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{role.desc}</p>

                            <div className="flex flex-wrap gap-2">
                                {role.tags.map(tag => (
                                    <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <a
                                href={applyLink}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors"
                            >
                                <Send size={13} />
                                Apply for this role
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ─── Page ──────────────────────────────────────────────────────────────────
const CareersPage = () => (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
        <Header />

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16 text-center">
            <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4"
            >
                Careers at SubEx
            </motion.p>
            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 }}
                className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.1] mb-5"
            >
                Help people take control of their subscriptions
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed max-w-xl mx-auto mb-8"
            >
                We're a small, focused team building the smartest subscription manager in India.
                If that excites you, we'd love to hear from you.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
                <a
                    href="#roles"
                    className="flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors"
                >
                    View open roles <ArrowRight size={15} />
                </a>
                <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Open Application — SubEx')}`}
                    className="flex items-center gap-2 px-6 py-3 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-semibold rounded-lg hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
                >
                    Send open application
                </a>
            </motion.div>
        </section>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="border-t border-zinc-100 dark:border-zinc-800" />
        </div>

        {/* ── Why SubEx ────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
            >
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1.5">Why join SubEx?</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-lg">
                    We're early-stage and fully remote. The upside is enormous — and so is the impact you'll have.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
                {PERKS.map((perk, i) => {
                    const Icon = perk.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white dark:bg-zinc-900 p-6 group"
                        >
                            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                                <Icon size={16} className="text-zinc-500 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                            </div>
                            <p className="font-semibold text-zinc-900 dark:text-white text-sm mb-1">{perk.label}</p>
                            <p className="text-xs text-zinc-400 leading-relaxed">{perk.desc}</p>
                        </motion.div>
                    );
                })}
            </div>
        </section>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="border-t border-zinc-100 dark:border-zinc-800" />
        </div>

        {/* ── Open Roles ───────────────────────────────────────────────── */}
        <section id="roles" className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
            >
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1.5">Open positions</h2>
                <p className="text-sm text-zinc-400">
                    {ROLES.length} open role{ROLES.length !== 1 ? 's' : ''} · All fully remote
                </p>
            </motion.div>

            <div className="space-y-3">
                {ROLES.map((role, i) => (
                    <RoleCard key={i} role={role} index={i} />
                ))}
            </div>
        </section>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="border-t border-zinc-100 dark:border-zinc-800" />
        </div>

        {/* ── Open application prompt ───────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between"
            >
                <div className="max-w-lg">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                        Don't see the right role?
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        We hire for talent and passion over open headcount. If you believe in what
                        we're building, send us a note — we reply to every message personally at{' '}
                        <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                            {CONTACT_EMAIL}
                        </a>
                    </p>
                </div>
                <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Open Application — SubEx')}&body=${encodeURIComponent('Hi SubEx team,\n\nI\'d love to explore opportunities at SubEx.\n\nAbout me:\n\n\nPortfolio / GitHub / LinkedIn:\n\n')}`}
                    className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors whitespace-nowrap"
                >
                    <Send size={13} />
                    Get in touch
                </a>
            </motion.div>
        </section>

        <Footer />
    </div>
);

export default CareersPage;
