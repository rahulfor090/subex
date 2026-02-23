import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Heart, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CONTACT_EMAIL = 'subex.club@gmail.com';

// ─── Data ───────────────────────────────────────────────────────────────────

const VALUES = [
    {
        icon: Shield,
        title: 'Privacy first',
        desc: 'Your subscription data is yours. We encrypt everything at rest and in transit, and we will never sell or share your information with third parties.',
    },
    {
        icon: Zap,
        title: 'Simple by design',
        desc: 'We strip away complexity. A great subscription manager should feel effortless — not like another tool you have to manage.',
    },
    {
        icon: Heart,
        title: 'Built with care',
        desc: 'Every feature is designed with real users in mind. We obsess over the details so our users don\'t have to.',
    },
    {
        icon: Globe,
        title: 'Made for India',
        desc: 'SubEx is built from the ground up for the Indian market — rupee support, local services, and a pricing model that makes sense here.',
    },
];

const TIMELINE = [
    {
        year: '2025',
        title: 'The idea',
        desc: 'Frustrated by missed renewals and surprise charges, we started tracking subscriptions in a spreadsheet. There had to be a better way.',
    },
    {
        year: '2025',
        title: 'First version',
        desc: 'SubEx launched as a simple tracker. Core features: add a subscription, set a cycle, get reminded. Nothing more, nothing less.',
    },
    {
        year: '2026',
        title: 'Growing fast',
        desc: 'Analytics, spending projections, and category breakdowns arrived. Users could finally see the full picture of their spending.',
    },
    {
        year: 'Now',
        title: 'Building toward more',
        desc: 'We\'re expanding the team and the product. The mission remains unchanged: help people take control of what they\'re paying for.',
    },
];

// ─── Fade-in wrapper ────────────────────────────────────────────────────────
const FadeIn = ({ children, delay = 0, className = '' }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);

// ─── Page ───────────────────────────────────────────────────────────────────
const AboutPage = () => (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
        <Header />

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">
            <FadeIn>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">
                    About SubEx
                </p>
            </FadeIn>
            <FadeIn delay={0.06}>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.1] mb-6">
                    You may forget.{' '}
                    <span className="text-zinc-400 dark:text-zinc-500">SubEx won't.</span>
                </h1>
            </FadeIn>
            <FadeIn delay={0.12}>
                <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                    SubEx is a subscription management platform built for people who are tired of
                    surprise renewals, forgotten trials, and money quietly leaving their accounts.
                    We make it easy to see every subscription you pay for — and take control of it.
                </p>
            </FadeIn>
        </section>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="border-t border-zinc-100 dark:border-zinc-800" />
        </div>

        {/* ── Mission ──────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <FadeIn>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Our mission</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                        The average person pays for 8–10 subscriptions and forgets about at least two of them.
                        That's money leaving your account every month for services you may not even be using.
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        SubEx exists to fix that. We give you a single, clear view of every subscription —
                        what it costs, when it renews, and whether you're actually getting value from it.
                        No clutter, no complexity. Just clarity.
                    </p>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-5">
                        {[
                            { label: 'Subscriptions tracked', value: '10,000+' },
                            { label: 'Average savings identified', value: '₹4,200 / yr' },
                            { label: 'Renewal alerts sent', value: '50,000+' },
                            { label: 'Founded', value: '2025, India 🇮🇳' },
                        ].map((stat, i) => (
                            <div key={i} className={`flex justify-between items-center ${i > 0 ? 'pt-5 border-t border-zinc-200 dark:border-zinc-800' : ''}`}>
                                <p className="text-sm text-zinc-400 font-medium">{stat.label}</p>
                                <p className="text-sm font-bold text-zinc-900 dark:text-white">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="border-t border-zinc-100 dark:border-zinc-800" />
        </div>

        {/* ── Values ───────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <FadeIn className="mb-10">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1.5">What we stand for</h2>
                <p className="text-sm text-zinc-400 max-w-md">
                    The principles that guide every decision we make.
                </p>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
                {VALUES.map((v, i) => {
                    const Icon = v.icon;
                    return (
                        <FadeIn key={i} delay={i * 0.06}>
                            <div className="bg-white dark:bg-zinc-900 p-6 h-full group">
                                <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                                    <Icon size={16} className="text-zinc-500 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                                </div>
                                <p className="font-semibold text-zinc-900 dark:text-white text-sm mb-1.5">{v.title}</p>
                                <p className="text-xs text-zinc-400 leading-relaxed">{v.desc}</p>
                            </div>
                        </FadeIn>
                    );
                })}
            </div>
        </section>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="border-t border-zinc-100 dark:border-zinc-800" />
        </div>

        {/* ── Story / Timeline ─────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <FadeIn className="mb-10">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1.5">How we got here</h2>
                <p className="text-sm text-zinc-400 max-w-md">
                    SubEx started with a frustration, not a business plan.
                </p>
            </FadeIn>

            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[72px] top-0 bottom-0 w-px bg-zinc-100 dark:bg-zinc-800 hidden sm:block" />

                <div className="space-y-8">
                    {TIMELINE.map((item, i) => (
                        <FadeIn key={i} delay={i * 0.07}>
                            <div className="flex gap-6 sm:gap-8 items-start">
                                {/* Year badge */}
                                <div className="flex-shrink-0 w-16 sm:w-[72px] text-right">
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
                                        {item.year}
                                    </span>
                                </div>

                                {/* Dot */}
                                <div className="flex-shrink-0 hidden sm:flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600 mt-1.5 -ml-[5px]" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-2">
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">{item.title}</p>
                                    <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="border-t border-zinc-100 dark:border-zinc-800" />
        </div>

        {/* ── CTA strip ────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <FadeIn>
                <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="max-w-lg">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                            Want to get in touch?
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            Whether you have feedback, a partnership idea, or just want to say hello —
                            we'd love to hear from you at{' '}
                            <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                                {CONTACT_EMAIL}
                            </a>
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 flex-shrink-0">
                        <Link
                            to="/contact"
                            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors whitespace-nowrap"
                        >
                            Contact us <ArrowRight size={14} />
                        </Link>
                        <Link
                            to="/careers"
                            className="flex items-center gap-2 px-5 py-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-semibold rounded-lg hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors whitespace-nowrap"
                        >
                            Join the team
                        </Link>
                    </div>
                </div>
            </FadeIn>
        </section>

        <Footer />
    </div>
);

export default AboutPage;
