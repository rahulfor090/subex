import React from 'react';
import { motion } from 'framer-motion';
import { Star, Twitter, Linkedin } from 'lucide-react';

const testimonials = [
    {
        name: 'Sarah Chen',
        username: '@sarah_design',
        role: 'Product Designer',
        content: "I used to lose so much money on forgotten subscriptions. SubEx paid for itself in the first week. The UI is just stunning.",
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
        platform: 'twitter'
    },
    {
        name: 'Alex Rivera',
        username: '@arivera_tech',
        role: 'Senior Dev',
        content: "The encryption protocol they use is impressive. Finally, a secure way to manage all my SaaS logins.",
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
        platform: 'linkedin'
    },
    {
        name: 'Emma Watson',
        username: '@emma_w',
        role: 'Marketing Lead',
        content: "Managing 20+ tools for my agency was a nightmare. SubEx Centralized everything. The alerts are a lifesaver.",
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80',
        platform: 'twitter'
    },
    {
        name: 'David Kim',
        username: '@dkim_pm',
        role: 'Product Manager',
        content: "Simple, effective, and beautiful. It's the only subscription tracker that actually feels modern. 10/10 recommend.",
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
        platform: 'linkedin'
    },
    {
        name: 'Lisa Wang',
        username: '@lisadesigns',
        role: 'UX Researcher',
        content: "The analytics feature is genius. Found 3 subscriptions I forgot about in 2 hours. Saved money instantly.",
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
        platform: 'twitter'
    },
    {
        name: 'James Wilson',
        username: '@jwilson_vc',
        role: 'Investor',
        content: "I've tried every finance app. SubEx is the only one that stuck. It's concise and actionable.",
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80',
        platform: 'linkedin'
    },
    {
        name: 'Sophie Martin',
        username: '@sophie_m',
        role: 'Freelancer',
        content: "Saved ₹34,000 this year just by identifying duplicate cloud storage accounts. This app is essential.",
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
        platform: 'twitter'
    },
    {
        name: 'Marcus Johnson',
        username: '@marcus_j',
        role: 'Founder',
        content: "Our startup uses SubEx to track all team software spend. It's saved us thousands in unused seat costs.",
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80',
        platform: 'linkedin'
    },
    {
        name: 'Elena Rodriguez',
        username: '@elena_r',
        role: 'Architect',
        content: "Visualizing my recurring expenses was a wake-up call. SubEx helped me trim the fat immediately.",
        avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&w=150&h=150&q=80',
        platform: 'twitter'
    }
];

const TestimonialCard = ({ testimonial }) => (
    <div className="w-full break-inside-avoid mb-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover border border-zinc-100 dark:border-zinc-800"
                    />
                    <div>
                        <div className="font-semibold text-sm text-zinc-900 dark:text-white">{testimonial.name}</div>
                        <div className="text-xs text-zinc-500">{testimonial.username}</div>
                    </div>
                </div>
                {testimonial.platform === 'twitter' ? (
                    <Twitter size={16} className="text-blue-400 fill-blue-400/10" />
                ) : (
                    <Linkedin size={16} className="text-blue-600 fill-blue-600/10" />
                )}
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                "{testimonial.content}"
            </p>

            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                ))}
            </div>
        </div>
    </div>
);

const Testimonials = () => {
    // Split testimonials into 3 columns for the masonry layout
    const col1 = testimonials.slice(0, 3);
    const col2 = testimonials.slice(3, 6);
    const col3 = testimonials.slice(6, 9);

    const duplicatedCol1 = [...col1, ...col1, ...col1];
    const duplicatedCol2 = [...col2, ...col2, ...col2];
    const duplicatedCol3 = [...col3, ...col3, ...col3];

    return (
        <section className="relative h-screen max-h-[900px] bg-zinc-50 dark:bg-black overflow-hidden flex flex-col items-center justify-center">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-zinc-50 dark:from-black to-transparent z-20" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-zinc-50 dark:from-black to-transparent z-20" />

            {/* Header Overlay */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-center px-4 max-w-3xl mx-auto backdrop-blur-sm bg-zinc-50/30 dark:bg-black/30 p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-xs font-semibold uppercase tracking-wider mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Community
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight drop-shadow-sm"
                    >
                        Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">10,000+</span> creators.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto"
                    >
                        Join the fastest growing community of smart savers and subscription masters.
                    </motion.p>
                </div>
            </div>

            {/* Marquee Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto px-4 opacity-50 hover:opacity-100 transition-opacity duration-700">

                {/* Column 1 - Up */}
                <div className="relative h-[120vh] overflow-hidden -mt-20">
                    <motion.div
                        animate={{ y: ["0%", "-33.33%"] }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    >
                        {duplicatedCol1.map((t, i) => <TestimonialCard key={`col1-${i}`} testimonial={t} />)}
                    </motion.div>
                </div>

                {/* Column 2 - Down (Slower/Faster) */}
                <div className="relative h-[120vh] overflow-hidden -mt-20 hidden md:block">
                    <motion.div
                        animate={{ y: ["-33.33%", "0%"] }}
                        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    >
                        {duplicatedCol2.map((t, i) => <TestimonialCard key={`col2-${i}`} testimonial={t} />)}
                    </motion.div>
                </div>

                {/* Column 3 - Up */}
                <div className="relative h-[120vh] overflow-hidden -mt-20 hidden lg:block">
                    <motion.div
                        animate={{ y: ["0%", "-33.33%"] }}
                        transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
                    >
                        {duplicatedCol3.map((t, i) => <TestimonialCard key={`col3-${i}`} testimonial={t} />)}
                    </motion.div>
                </div>

            </div>
        </section>
    );
};

export default Testimonials;
