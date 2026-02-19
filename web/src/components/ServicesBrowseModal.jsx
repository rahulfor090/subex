import React, { useState, useMemo } from 'react';
import { X, Search, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CompanyLogo from './CompanyLogo';

// ─── Curated worldwide subscription services ───────────────────────────────
const SERVICES = [
    // Streaming – Video
    { name: 'Netflix', category: 'Streaming', color: '#E50914', textColor: '#fff', logo: 'https://logo.clearbit.com/netflix.com' },
    { name: 'Disney+', category: 'Streaming', color: '#0C3572', textColor: '#fff', logo: 'https://logo.clearbit.com/disneyplus.com' },
    { name: 'Amazon Prime', category: 'Streaming', color: '#00A8E1', textColor: '#fff', logo: 'https://logo.clearbit.com/amazon.com' },
    { name: 'Apple TV+', category: 'Streaming', color: '#1C1C1E', textColor: '#fff', logo: 'https://logo.clearbit.com/apple.com' },
    { name: 'HBO Max', category: 'Streaming', color: '#1B0533', textColor: '#fff', logo: 'https://logo.clearbit.com/max.com' },
    { name: 'Hulu', category: 'Streaming', color: '#3DBB3D', textColor: '#fff', logo: 'https://logo.clearbit.com/hulu.com' },
    { name: 'Peacock', category: 'Streaming', color: '#000000', textColor: '#fff', logo: 'https://logo.clearbit.com/peacocktv.com' },
    { name: 'Paramount+', category: 'Streaming', color: '#0064FF', textColor: '#fff', logo: 'https://logo.clearbit.com/paramountplus.com' },
    { name: 'Crunchyroll', category: 'Streaming', color: '#F47521', textColor: '#fff', logo: 'https://logo.clearbit.com/crunchyroll.com' },
    { name: 'YouTube Premium', category: 'Streaming', color: '#FF0000', textColor: '#fff', logo: 'https://logo.clearbit.com/youtube.com' },
    { name: 'Mubi', category: 'Streaming', color: '#0F2027', textColor: '#fff', logo: 'https://logo.clearbit.com/mubi.com' },
    // Streaming – Music
    { name: 'Spotify', category: 'Music', color: '#1DB954', textColor: '#fff', logo: 'https://logo.clearbit.com/spotify.com' },
    { name: 'Apple Music', category: 'Music', color: '#FC3C44', textColor: '#fff', logo: 'https://logo.clearbit.com/apple.com' },
    { name: 'YouTube Music', category: 'Music', color: '#FF0000', textColor: '#fff', logo: 'https://logo.clearbit.com/music.youtube.com' },
    { name: 'Tidal', category: 'Music', color: '#000000', textColor: '#fff', logo: 'https://logo.clearbit.com/tidal.com' },
    { name: 'Amazon Music', category: 'Music', color: '#00A8E1', textColor: '#fff', logo: 'https://logo.clearbit.com/music.amazon.com' },
    { name: 'Deezer', category: 'Music', color: '#A238FF', textColor: '#fff', logo: 'https://logo.clearbit.com/deezer.com' },
    { name: 'SoundCloud', category: 'Music', color: '#FF5500', textColor: '#fff', logo: 'https://logo.clearbit.com/soundcloud.com' },
    // Productivity & Tools
    { name: 'Microsoft 365', category: 'Productivity', color: '#D83B01', textColor: '#fff', logo: 'https://logo.clearbit.com/microsoft.com' },
    { name: 'Google One', category: 'Productivity', color: '#4285F4', textColor: '#fff', logo: 'https://logo.clearbit.com/one.google.com' },
    { name: 'Notion', category: 'Productivity', color: '#000000', textColor: '#fff', logo: 'https://logo.clearbit.com/notion.so' },
    { name: 'Slack', category: 'Productivity', color: '#4A154B', textColor: '#fff', logo: 'https://logo.clearbit.com/slack.com' },
    { name: 'Zoom', category: 'Productivity', color: '#2D8CFF', textColor: '#fff', logo: 'https://logo.clearbit.com/zoom.us' },
    { name: 'Dropbox', category: 'Productivity', color: '#0061FF', textColor: '#fff', logo: 'https://logo.clearbit.com/dropbox.com' },
    { name: 'Evernote', category: 'Productivity', color: '#00A82D', textColor: '#fff', logo: 'https://logo.clearbit.com/evernote.com' },
    { name: 'Todoist', category: 'Productivity', color: '#DC4C3E', textColor: '#fff', logo: 'https://logo.clearbit.com/todoist.com' },
    { name: '1Password', category: 'Productivity', color: '#1A8CFF', textColor: '#fff', logo: 'https://logo.clearbit.com/1password.com' },
    { name: 'LastPass', category: 'Productivity', color: '#D32D27', textColor: '#fff', logo: 'https://logo.clearbit.com/lastpass.com' },
    { name: 'Grammarly', category: 'Productivity', color: '#15C39A', textColor: '#fff', logo: 'https://logo.clearbit.com/grammarly.com' },
    // Cloud
    { name: 'iCloud', category: 'Cloud', color: '#3478F6', textColor: '#fff', logo: 'https://logo.clearbit.com/apple.com' },
    { name: 'OneDrive', category: 'Cloud', color: '#094AB2', textColor: '#fff', logo: 'https://logo.clearbit.com/microsoft.com' },
    // Design & Creative
    { name: 'Adobe Creative', category: 'Creative', color: '#DA1F26', textColor: '#fff', logo: 'https://logo.clearbit.com/adobe.com' },
    { name: 'Figma', category: 'Creative', color: '#000000', textColor: '#fff', logo: 'https://logo.clearbit.com/figma.com' },
    { name: 'Canva', category: 'Creative', color: '#00C4CC', textColor: '#fff', logo: 'https://logo.clearbit.com/canva.com' },
    { name: 'Envato', category: 'Creative', color: '#82B541', textColor: '#fff', logo: 'https://logo.clearbit.com/envato.com' },
    { name: 'Shutterstock', category: 'Creative', color: '#EE2020', textColor: '#fff', logo: 'https://logo.clearbit.com/shutterstock.com' },
    // Gaming
    { name: 'Xbox Game Pass', category: 'Gaming', color: '#107C10', textColor: '#fff', logo: 'https://logo.clearbit.com/xbox.com' },
    { name: 'PlayStation Plus', category: 'Gaming', color: '#003087', textColor: '#fff', logo: 'https://logo.clearbit.com/playstation.com' },
    { name: 'Nintendo Online', category: 'Gaming', color: '#E4000F', textColor: '#fff', logo: 'https://logo.clearbit.com/nintendo.com' },
    { name: 'EA Play', category: 'Gaming', color: '#FF4500', textColor: '#fff', logo: 'https://logo.clearbit.com/ea.com' },
    { name: 'Ubisoft+', category: 'Gaming', color: '#0070CB', textColor: '#fff', logo: 'https://logo.clearbit.com/ubisoft.com' },
    // Fitness
    { name: 'Peloton', category: 'Fitness', color: '#CC0000', textColor: '#fff', logo: 'https://logo.clearbit.com/onepeloton.com' },
    { name: 'Calm', category: 'Fitness', color: '#3A3A8C', textColor: '#fff', logo: 'https://logo.clearbit.com/calm.com' },
    { name: 'Headspace', category: 'Fitness', color: '#F47D20', textColor: '#fff', logo: 'https://logo.clearbit.com/headspace.com' },
    { name: 'Strava', category: 'Fitness', color: '#FC4C02', textColor: '#fff', logo: 'https://logo.clearbit.com/strava.com' },
    { name: 'MyFitnessPal', category: 'Fitness', color: '#0074B3', textColor: '#fff', logo: 'https://logo.clearbit.com/myfitnesspal.com' },
    // News & Reading
    { name: 'The New York Times', category: 'News', color: '#000000', textColor: '#fff', logo: 'https://logo.clearbit.com/nytimes.com' },
    { name: 'The Guardian', category: 'News', color: '#115688', textColor: '#fff', logo: 'https://logo.clearbit.com/theguardian.com' },
    { name: 'Medium', category: 'News', color: '#000000', textColor: '#fff', logo: 'https://logo.clearbit.com/medium.com' },
    { name: 'Audible', category: 'Reading', color: '#F8991D', textColor: '#fff', logo: 'https://logo.clearbit.com/audible.com' },
    { name: 'Kindle Unlimited', category: 'Reading', color: '#FF9900', textColor: '#fff', logo: 'https://logo.clearbit.com/amazon.com' },
    { name: 'Scribd', category: 'Reading', color: '#1E7B88', textColor: '#fff', logo: 'https://logo.clearbit.com/scribd.com' },
    // Developer Tools
    { name: 'GitHub Copilot', category: 'Developer', color: '#24292F', textColor: '#fff', logo: 'https://logo.clearbit.com/github.com' },
    { name: 'Vercel', category: 'Developer', color: '#000000', textColor: '#fff', logo: 'https://logo.clearbit.com/vercel.com' },
    { name: 'Netlify', category: 'Developer', color: '#00C7B7', textColor: '#fff', logo: 'https://logo.clearbit.com/netlify.com' },
    { name: 'DigitalOcean', category: 'Developer', color: '#0080FF', textColor: '#fff', logo: 'https://logo.clearbit.com/digitalocean.com' },
    { name: 'AWS', category: 'Developer', color: '#FF9900', textColor: '#fff', logo: 'https://logo.clearbit.com/aws.amazon.com' },
    { name: 'Heroku', category: 'Developer', color: '#430098', textColor: '#fff', logo: 'https://logo.clearbit.com/heroku.com' },
    { name: 'Linear', category: 'Developer', color: '#5E6AD2', textColor: '#fff', logo: 'https://logo.clearbit.com/linear.app' },
    // Shopping
    { name: 'Amazon Prime', category: 'Shopping', color: '#FF9900', textColor: '#fff', logo: 'https://logo.clearbit.com/amazon.com' },
    { name: 'Costco', category: 'Shopping', color: '#005DAA', textColor: '#fff', logo: 'https://logo.clearbit.com/costco.com' },
    // Finance
    { name: 'QuickBooks', category: 'Finance', color: '#2CA01C', textColor: '#fff', logo: 'https://logo.clearbit.com/quickbooks.intuit.com' },
    { name: 'Mint', category: 'Finance', color: '#3EB489', textColor: '#fff', logo: 'https://logo.clearbit.com/mint.com' },
];

const CATEGORIES = ['All', ...Array.from(new Set(SERVICES.map(s => s.category)))];

const ServicesBrowseModal = ({ onClose, onSelect }) => {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const filtered = useMemo(() =>
        SERVICES.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
            return matchesSearch && matchesCategory;
        }),
        [search, activeCategory]
    );


    return (
        <AnimatePresence>
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col"
                    style={{ maxHeight: '85vh' }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                    <Zap size={20} className="text-emerald-500" />
                                    Browse Services
                                </h2>
                                <p className="text-sm text-zinc-500 mt-0.5">
                                    {filtered.length} services available worldwide
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search services…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                autoFocus
                                className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            />
                        </div>

                        {/* Category Pills */}
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${activeCategory === cat
                                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="overflow-y-auto flex-1 p-6">
                        {filtered.length === 0 ? (
                            <div className="text-center py-16 text-zinc-400">
                                <Search size={40} className="mx-auto mb-3 opacity-30" />
                                <p>No services found for "{search}"</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {filtered.map((service, i) => (
                                    <motion.button
                                        key={service.name + service.category}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: Math.min(i * 0.02, 0.3) }}
                                        onClick={() => { onSelect(service); onClose(); }}
                                        className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer text-left group"
                                    >
                                        <CompanyLogo name={service.name} size="md" rounded="rounded-xl" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                {service.name}
                                            </p>
                                            <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-700 px-2 py-0.5 rounded-full">
                                                {service.category}
                                            </span>
                                        </div>
                                        <div
                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: service.color }}
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ServicesBrowseModal;
