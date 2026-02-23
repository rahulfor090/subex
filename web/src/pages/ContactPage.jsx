import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, MessageCircle, MapPin, Clock, Send, CheckCircle2,
    ChevronDown, ArrowLeft, Sparkles, Phone, Globe, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CONTACT_EMAIL = 'subex.club@gmail.com';

// ─── FAQ data ──────────────────────────────────────────────────────────────
const FAQS = [
    {
        q: 'How quickly do you respond to queries?',
        a: 'We aim to respond to all emails within 24–48 hours on business days. For urgent issues, please mention "URGENT" in your subject line.'
    },
    {
        q: 'Can I request a feature or report a bug?',
        a: 'Absolutely! Feature requests and bug reports are our top priority. Use the contact form and select the appropriate topic. We read every single message.'
    },
    {
        q: 'Is my data safe with SubEx?',
        a: 'Yes. We take privacy very seriously. Your subscription data is encrypted at rest and in transit. We never sell or share your data with third parties. Read our Privacy Policy for full details.'
    },
    {
        q: 'Do you offer a free trial or refunds?',
        a: 'SubEx is currently free to use. If we introduce paid plans in the future, we will offer a free trial period and a clear refund policy.'
    },
    {
        q: 'I forgot my password. What should I do?',
        a: 'Use the "Forgot Password" link on the login page to reset your password via your registered email address. If you have further trouble, contact us directly at subex.club@gmail.com.'
    },
];

// ─── FAQ Item ───────────────────────────────────────────────────────────────
const FaqItem = ({ q, a, index }) => {
    const [open, setOpen] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.07 }}
            className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden"
        >
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-6 py-5 text-left bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors group"
            >
                <span className="text-sm font-semibold text-zinc-900 dark:text-white pr-4">{q}</span>
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0 text-zinc-400 group-hover:text-emerald-500 transition-colors"
                >
                    <ChevronDown size={18} />
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <p className="px-6 pb-5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-4">
                            {a}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ─── Contact Card ───────────────────────────────────────────────────────────
const ContactCard = ({ icon: Icon, title, value, href, color, delay }) => (
    <motion.a
        href={href}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        whileHover={{ y: -4, scale: 1.02 }}
        className="flex items-start gap-4 p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
    >
        <div className={`p-3 rounded-xl ${color} flex-shrink-0`}>
            <Icon size={20} className="text-white" />
        </div>
        <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-0.5">{title}</p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {value}
            </p>
        </div>
    </motion.a>
);

// ─── Main ───────────────────────────────────────────────────────────────────
const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', topic: 'General', message: '' });
    const [sent, setSent] = useState(false);
    const [errors, setErrors] = useState({});

    const topics = ['General', 'Bug Report', 'Feature Request', 'Billing', 'Security', 'Other'];

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
        if (!form.message.trim()) e.message = 'Message is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        // Open mail client — no backend required
        const subject = encodeURIComponent(`[SubEx – ${form.topic}] Message from ${form.name}`);
        const body = encodeURIComponent(
            `Name: ${form.name}\nEmail: ${form.email}\nTopic: ${form.topic}\n\nMessage:\n${form.message}`
        );
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        setSent(true);
    };

    const fieldClass = (err) =>
        `w-full px-4 py-3 rounded-xl text-sm transition-all bg-white/80 dark:bg-zinc-800/80 border ${err
            ? 'border-red-400 ring-2 ring-red-400/20'
            : 'border-zinc-200 dark:border-zinc-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30'
        } text-zinc-900 dark:text-white placeholder-zinc-400 outline-none`;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
            <Header />

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden pt-28 pb-20">
                {/* Blurred gradient orbs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-20 left-[15%] w-48 h-48 bg-cyan-500/8 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute top-10 right-[12%] w-64 h-64 bg-violet-500/8 rounded-full blur-2xl pointer-events-none" />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-6"
                    >
                        <Sparkles size={13} />
                        Get in touch
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-white mb-5 leading-[1.08]"
                    >
                        We'd love to{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-500">
                            hear from you
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.16 }}
                        className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Got a question, found a bug, or have an idea to make SubEx better?
                        Drop us a message — we read every single one.
                    </motion.p>
                </div>
            </section>

            {/* ── Contact cards row ────────────────────────────────────── */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ContactCard
                        icon={Mail} title="Email us" value={CONTACT_EMAIL}
                        href={`mailto:${CONTACT_EMAIL}`}
                        color="bg-gradient-to-br from-emerald-500 to-cyan-500"
                        delay={0.05}
                    />
                    <ContactCard
                        icon={Clock} title="Response time" value="Within 24–48 hours"
                        href={null}
                        color="bg-gradient-to-br from-violet-500 to-purple-600"
                        delay={0.1}
                    />
                    <ContactCard
                        icon={Shield} title="Privacy" value="Your data stays safe"
                        href="/privacy-policy"
                        color="bg-gradient-to-br from-amber-500 to-orange-500"
                        delay={0.15}
                    />
                    <ContactCard
                        icon={Globe} title="Based in" value="India 🇮🇳"
                        href={null}
                        color="bg-gradient-to-br from-rose-500 to-pink-600"
                        delay={0.2}
                    />
                </div>
            </section>

            {/* ── Form + FAQ ────────────────────────────────────────────── */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                    {/* ── Contact Form (3 cols) ─────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-3"
                    >
                        <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/40 dark:shadow-zinc-900/60 overflow-hidden">
                            {/* Top stripe */}
                            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-500" />

                            <div className="p-8">
                                <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-1">Send a message</h2>
                                <p className="text-sm text-zinc-400 mb-8">We'll reply to your email directly.</p>

                                <AnimatePresence mode="wait">
                                    {sent ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                                            className="flex flex-col items-center justify-center py-16 text-center gap-5"
                                        >
                                            <motion.div
                                                animate={{ scale: [0.8, 1.1, 1] }}
                                                transition={{ duration: 0.5 }}
                                                className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-emerald-500/30"
                                            >
                                                <CheckCircle2 size={36} className="text-white" />
                                            </motion.div>
                                            <div>
                                                <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">
                                                    Message sent! 🎉
                                                </h3>
                                                <p className="text-zinc-400 text-sm max-w-xs mx-auto">
                                                    Your email client should have opened. We'll reply to <strong className="text-zinc-600 dark:text-zinc-300">{form.email}</strong> within 24–48 hours.
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => { setSent(false); setForm({ name: '', email: '', topic: 'General', message: '' }); }}
                                                className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-semibold flex items-center gap-1.5 transition-colors"
                                            >
                                                <ArrowLeft size={14} /> Send another message
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            key="form"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            onSubmit={handleSubmit}
                                            noValidate
                                            className="space-y-5"
                                        >
                                            {/* Name + Email */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                                                        Name <span className="text-red-400">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Rahul Sharma"
                                                        value={form.name}
                                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                                        className={fieldClass(errors.name)}
                                                    />
                                                    {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                                                        Email <span className="text-red-400">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        value={form.email}
                                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                                        className={fieldClass(errors.email)}
                                                    />
                                                    {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                                                </div>
                                            </div>

                                            {/* Topic pills */}
                                            <div>
                                                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Topic</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {topics.map(t => (
                                                        <button
                                                            key={t}
                                                            type="button"
                                                            onClick={() => setForm(f => ({ ...f, topic: t }))}
                                                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${form.topic === t
                                                                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md shadow-emerald-500/20'
                                                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                                                }`}
                                                        >
                                                            {t}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Message */}
                                            <div>
                                                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                                                    Message <span className="text-red-400">*</span>
                                                </label>
                                                <textarea
                                                    rows={5}
                                                    placeholder="Tell us what's on your mind…"
                                                    value={form.message}
                                                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                                    className={`${fieldClass(errors.message)} resize-none`}
                                                />
                                                {errors.message && <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>}
                                                <p className="mt-1 text-xs text-zinc-400 text-right">{form.message.length} chars</p>
                                            </div>

                                            {/* Submit */}
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
                                            >
                                                <Send size={16} />
                                                Send Message
                                            </motion.button>

                                            <p className="text-center text-xs text-zinc-400">
                                                This will open your email client with the message pre-filled.
                                            </p>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── FAQ (2 cols) ─────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                        className="lg:col-span-2 space-y-4"
                    >
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-1">FAQs</h2>
                            <p className="text-sm text-zinc-400">Quick answers to common questions.</p>
                        </div>

                        <div className="space-y-3">
                            {FAQS.map((faq, i) => (
                                <FaqItem key={i} {...faq} index={i} />
                            ))}
                        </div>

                        {/* Direct email CTA */}
                        <motion.a
                            href={`mailto:${CONTACT_EMAIL}`}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.02 }}
                            className="mt-4 flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20 flex-shrink-0">
                                <Mail size={18} className="text-white" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-zinc-400 font-medium mb-0.5">Or simply email us at</p>
                                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 transition-colors truncate">
                                    {CONTACT_EMAIL}
                                </p>
                            </div>
                        </motion.a>
                    </motion.div>

                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ContactPage;
