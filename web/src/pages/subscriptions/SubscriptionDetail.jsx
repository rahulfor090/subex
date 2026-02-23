import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Edit, Trash2, AlertCircle, Loader2, CheckCircle2,
    ExternalLink, CreditCard, RefreshCw, Tag, Folder,
    Globe, FileText, IndianRupee, Clock, Shield, StickyNote,
    Zap, Star, TrendingUp, Calendar, Bell
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CompanyLogo from '../../components/CompanyLogo';

// ─── Extended Brand Registry ────────────────────────────────────────────────
const BRANDS = {
    // ── Streaming ──────────────────────────────────────────────────────────
    'netflix': {
        bg: '#E50914', accent: '#B20710', text: '#fff',
        gradient: 'linear-gradient(135deg,#E50914 0%,#8B0000 100%)',
        glow: 'rgba(229,9,20,0.45)', pattern: 'stripes',
        tagline: 'Unlimited movies, TV shows, and more.',
        font: "'Bebas Neue', sans-serif",
    },
    'disney+': {
        bg: '#0C3572', accent: '#1A5BB5', text: '#fff',
        gradient: 'linear-gradient(135deg,#0C3572 0%,#001F47 100%)',
        glow: 'rgba(12,53,114,0.5)', pattern: 'stars',
        tagline: 'The best of Disney, Pixar, Marvel, Star Wars & Nat Geo.',
    },
    'disney plus': { ref: 'disney+' },
    'disney': { ref: 'disney+' },
    'amazon prime': {
        bg: '#00A8E1', accent: '#0077A8', text: '#fff',
        gradient: 'linear-gradient(135deg,#00A8E1 0%,#00374F 100%)',
        glow: 'rgba(0,168,225,0.4)', pattern: 'dots',
        tagline: 'Watch anywhere. Cancel anytime.',
    },
    'prime video': { ref: 'amazon prime' },
    'apple tv+': {
        bg: '#1C1C1E', accent: '#3A3A3C', text: '#fff',
        gradient: 'linear-gradient(135deg,#1C1C1E 0%,#000000 100%)',
        glow: 'rgba(255,255,255,0.15)', pattern: 'grid',
        tagline: 'Original shows and movies from Apple.',
    },
    'apple tv': { ref: 'apple tv+' },
    'hbo max': {
        bg: '#5822B8', accent: '#7B3FE4', text: '#fff',
        gradient: 'linear-gradient(135deg,#1B0533 0%,#5822B8 100%)',
        glow: 'rgba(88,34,184,0.5)', pattern: 'stripes',
        tagline: 'It\'s All Here.',
    },
    'hbo': { ref: 'hbo max' },
    'max': { ref: 'hbo max' },
    'hulu': {
        bg: '#3DBB3D', accent: '#2D9C2D', text: '#fff',
        gradient: 'linear-gradient(135deg,#3DBB3D 0%,#1A6E1A 100%)',
        glow: 'rgba(61,187,61,0.4)', pattern: 'dots',
        tagline: 'Watch TV and movies anytime, anywhere.',
    },
    'youtube premium': {
        bg: '#FF0000', accent: '#CC0000', text: '#fff',
        gradient: 'linear-gradient(135deg,#FF0000 0%,#282828 100%)',
        glow: 'rgba(255,0,0,0.4)', pattern: 'grid',
        tagline: 'Ad-free. Background play. Downloads.',
    },
    'youtube': { ref: 'youtube premium' },
    'crunchyroll': {
        bg: '#F47521', accent: '#D4611A', text: '#fff',
        gradient: 'linear-gradient(135deg,#F47521 0%,#8B3A08 100%)',
        glow: 'rgba(244,117,33,0.4)', pattern: 'dots',
        tagline: 'The World\'s Most Popular Anime Site.',
    },
    // ── Music ──────────────────────────────────────────────────────────────
    'spotify': {
        bg: '#1DB954', accent: '#17A349', text: '#fff',
        gradient: 'linear-gradient(135deg,#1DB954 0%,#121212 100%)',
        glow: 'rgba(29,185,84,0.45)', pattern: 'wave',
        tagline: 'Music for everyone.',
    },
    'apple music': {
        bg: '#FC3C44', accent: '#E0353C', text: '#fff',
        gradient: 'linear-gradient(135deg,#FC3C44 0%,#1C1C1E 100%)',
        glow: 'rgba(252,60,68,0.4)', pattern: 'wave',
        tagline: 'One subscription. All the music you love.',
    },
    'tidal': {
        bg: '#000000', accent: '#222', text: '#fff',
        gradient: 'linear-gradient(135deg,#000000 0%,#1A1A2E 100%)',
        glow: 'rgba(0,204,255,0.3)', pattern: 'wave',
        tagline: 'HiFi music. Millions of songs.',
    },
    'deezer': {
        bg: '#A238FF', accent: '#8020E0', text: '#fff',
        gradient: 'linear-gradient(135deg,#A238FF 0%,#3D0080 100%)',
        glow: 'rgba(162,56,255,0.4)', pattern: 'wave',
        tagline: 'Feel the music.',
    },
    'soundcloud': {
        bg: '#FF5500', accent: '#E04B00', text: '#fff',
        gradient: 'linear-gradient(135deg,#FF5500 0%,#2E1000 100%)',
        glow: 'rgba(255,85,0,0.4)', pattern: 'wave',
        tagline: 'Hear the world\'s sounds.',
    },
    // ── Productivity ───────────────────────────────────────────────────────
    'microsoft 365': {
        bg: '#D83B01', accent: '#B33000', text: '#fff',
        gradient: 'linear-gradient(135deg,#D83B01 0%,#742100 100%)',
        glow: 'rgba(216,59,1,0.4)', pattern: 'grid',
        tagline: 'Be more productive. Do more together.',
    },
    'microsoft': { ref: 'microsoft 365' },
    'office 365': { ref: 'microsoft 365' },
    'google one': {
        bg: '#4285F4', accent: '#3367D6', text: '#fff',
        gradient: 'linear-gradient(135deg,#4285F4 0%,#185ABC 100%)',
        glow: 'rgba(66,133,244,0.4)', pattern: 'dots',
        tagline: 'More storage. More features. More Google.',
    },
    'google': { ref: 'google one' },
    'notion': {
        bg: '#000000', accent: '#333', text: '#fff',
        gradient: 'linear-gradient(135deg,#000000 0%,#2D2D2D 100%)',
        glow: 'rgba(255,255,255,0.1)', pattern: 'grid',
        tagline: 'One workspace. Every team.',
    },
    'slack': {
        bg: '#4A154B', accent: '#611F69', text: '#fff',
        gradient: 'linear-gradient(135deg,#4A154B 0%,#2D0E2E 100%)',
        glow: 'rgba(74,21,75,0.5)', pattern: 'grid',
        tagline: 'Where work happens.',
    },
    'zoom': {
        bg: '#2D8CFF', accent: '#1A6ED9', text: '#fff',
        gradient: 'linear-gradient(135deg,#2D8CFF 0%,#0A3870 100%)',
        glow: 'rgba(45,140,255,0.4)', pattern: 'dots',
        tagline: 'Meet happily ever after.',
    },
    'dropbox': {
        bg: '#0061FF', accent: '#0047CC', text: '#fff',
        gradient: 'linear-gradient(135deg,#0061FF 0%,#002899 100%)',
        glow: 'rgba(0,97,255,0.4)', pattern: 'grid',
        tagline: 'Keep life organised.',
    },
    'grammarly': {
        bg: '#15C39A', accent: '#0DAA85', text: '#fff',
        gradient: 'linear-gradient(135deg,#15C39A 0%,#0A6B54 100%)',
        glow: 'rgba(21,195,154,0.4)', pattern: 'dots',
        tagline: 'Great Writing, Simplified.',
    },
    'icloud': {
        bg: '#3478F6', accent: '#1A5FD9', text: '#fff',
        gradient: 'linear-gradient(135deg,#3478F6 0%,#1C1C1E 100%)',
        glow: 'rgba(52,120,246,0.4)', pattern: 'grid',
        tagline: 'Everything in its place.',
    },
    // ── Creative ───────────────────────────────────────────────────────────
    'adobe creative cloud': {
        bg: '#DA1F26', accent: '#B51920', text: '#fff',
        gradient: 'linear-gradient(135deg,#DA1F26 0%,#4A0A0A 100%)',
        glow: 'rgba(218,31,38,0.4)', pattern: 'grid',
        tagline: 'Create. Collaborate. Transform.',
    },
    'adobe': { ref: 'adobe creative cloud' },
    'figma': {
        bg: '#000000', accent: '#1E1E1E', text: '#fff',
        gradient: 'linear-gradient(135deg,#000000 0%,#2D1B69 100%)',
        glow: 'rgba(162,89,255,0.3)', pattern: 'dots',
        tagline: 'The collaborative interface design tool.',
    },
    'canva': {
        bg: '#00C4CC', accent: '#00A8B0', text: '#fff',
        gradient: 'linear-gradient(135deg,#00C4CC 0%,#7D2AE8 100%)',
        glow: 'rgba(0,196,204,0.4)', pattern: 'dots',
        tagline: 'Design anything. Publish anywhere.',
    },
    // ── Gaming ─────────────────────────────────────────────────────────────
    'xbox game pass': {
        bg: '#107C10', accent: '#0D6A0D', text: '#fff',
        gradient: 'linear-gradient(135deg,#107C10 0%,#052505 100%)',
        glow: 'rgba(16,124,16,0.45)', pattern: 'grid',
        tagline: 'Hundreds of high-quality games.',
    },
    'xbox': { ref: 'xbox game pass' },
    'playstation plus': {
        bg: '#003087', accent: '#002570', text: '#fff',
        gradient: 'linear-gradient(135deg,#003087 0%,#00439C 100%)',
        glow: 'rgba(0,48,135,0.5)', pattern: 'stripes',
        tagline: 'Games. Multiplayer. Exclusive deals.',
    },
    'playstation': { ref: 'playstation plus' },
    'nintendo': {
        bg: '#E4000F', accent: '#C7000D', text: '#fff',
        gradient: 'linear-gradient(135deg,#E4000F 0%,#7A0008 100%)',
        glow: 'rgba(228,0,15,0.4)', pattern: 'dots',
        tagline: 'Play together. Anytime, anywhere.',
    },
    'ea play': {
        bg: '#FF4500', accent: '#E03A00', text: '#fff',
        gradient: 'linear-gradient(135deg,#FF4500 0%,#1A0A00 100%)',
        glow: 'rgba(255,69,0,0.4)', pattern: 'stripes',
        tagline: 'Your favorite EA games, all in one place.',
    },
    // ── Wellness ───────────────────────────────────────────────────────────
    'calm': {
        bg: '#3A3A8C', accent: '#2E2E78', text: '#fff',
        gradient: 'linear-gradient(135deg,#3A3A8C 0%,#1B5E7C 100%)',
        glow: 'rgba(58,58,140,0.4)', pattern: 'wave',
        tagline: 'Sleep more. Stress less. Live better.',
    },
    'headspace': {
        bg: '#F47D20', accent: '#D96B18', text: '#fff',
        gradient: 'linear-gradient(135deg,#F47D20 0%,#E8445A 100%)',
        glow: 'rgba(244,125,32,0.4)', pattern: 'dots',
        tagline: 'Meditation and sleep made simple.',
    },
    'strava': {
        bg: '#FC4C02', accent: '#E04000', text: '#fff',
        gradient: 'linear-gradient(135deg,#FC4C02 0%,#7A1500 100%)',
        glow: 'rgba(252,76,2,0.4)', pattern: 'stripes',
        tagline: 'The social network for athletes.',
    },
    // ── Dev Tools ──────────────────────────────────────────────────────────
    'github copilot': {
        bg: '#24292F', accent: '#1C2028', text: '#fff',
        gradient: 'linear-gradient(135deg,#24292F 0%,#413A94 100%)',
        glow: 'rgba(100,80,255,0.3)', pattern: 'grid',
        tagline: 'Your AI pair programmer.',
    },
    'github': { ref: 'github copilot' },
    'vercel': {
        bg: '#000000', accent: '#111', text: '#fff',
        gradient: 'linear-gradient(135deg,#000000 0%,#333 100%)',
        glow: 'rgba(255,255,255,0.1)', pattern: 'grid',
        tagline: 'Develop. Preview. Ship.',
    },
    'netlify': {
        bg: '#00C7B7', accent: '#00AEA0', text: '#fff',
        gradient: 'linear-gradient(135deg,#00C7B7 0%,#005249 100%)',
        glow: 'rgba(0,199,183,0.4)', pattern: 'wave',
        tagline: 'Build & Deploy the Future of the Web.',
    },
    'digitalocean': {
        bg: '#0080FF', accent: '#0066CC', text: '#fff',
        gradient: 'linear-gradient(135deg,#0080FF 0%,#003380 100%)',
        glow: 'rgba(0,128,255,0.4)', pattern: 'dots',
        tagline: 'The developer cloud.',
    },
    'aws': {
        bg: '#FF9900', accent: '#E88A00', text: '#232F3E',
        gradient: 'linear-gradient(135deg,#FF9900 0%,#232F3E 100%)',
        glow: 'rgba(255,153,0,0.4)', pattern: 'grid',
        tagline: 'Build. Scale. Innovate.',
    },
    'linear': {
        bg: '#5E6AD2', accent: '#4A55C2', text: '#fff',
        gradient: 'linear-gradient(135deg,#5E6AD2 0%,#1E2048 100%)',
        glow: 'rgba(94,106,210,0.4)', pattern: 'grid',
        tagline: 'The issue tracking tool you\'ll enjoy.',
    },
    // ── Business ───────────────────────────────────────────────────────────
    'shopify': {
        bg: '#96BF48', accent: '#7BA339', text: '#fff',
        gradient: 'linear-gradient(135deg,#96BF48 0%,#3A5C00 100%)',
        glow: 'rgba(150,191,72,0.4)', pattern: 'dots',
        tagline: 'Commerce that grows with you.',
    },
    'hubspot': {
        bg: '#FF7A59', accent: '#E86744', text: '#fff',
        gradient: 'linear-gradient(135deg,#FF7A59 0%,#6B1A08 100%)',
        glow: 'rgba(255,122,89,0.4)', pattern: 'dots',
        tagline: 'Grow better with HubSpot.',
    },
    'discord': {
        bg: '#5865F2', accent: '#4752C4', text: '#fff',
        gradient: 'linear-gradient(135deg,#5865F2 0%,#23272A 100%)',
        glow: 'rgba(88,101,242,0.45)', pattern: 'grid',
        tagline: 'Your place to talk.',
    },
    'twitch': {
        bg: '#9146FF', accent: '#772CE8', text: '#fff',
        gradient: 'linear-gradient(135deg,#9146FF 0%,#1A0A3B 100%)',
        glow: 'rgba(145,70,255,0.45)', pattern: 'stripes',
        tagline: 'Live streaming for gamers.',
    },
    'audible': {
        bg: '#F8991D', accent: '#D9820F', text: '#fff',
        gradient: 'linear-gradient(135deg,#F8991D 0%,#4A2700 100%)',
        glow: 'rgba(248,153,29,0.4)', pattern: 'wave',
        tagline: 'Audiobooks, podcasts & more.',
    },
    'duolingo': {
        bg: '#58CC02', accent: '#46A601', text: '#fff',
        gradient: 'linear-gradient(135deg,#58CC02 0%,#1A3D00 100%)',
        glow: 'rgba(88,204,2,0.4)', pattern: 'dots',
        tagline: 'Learn a language for free.',
    },
    'cloudflare': {
        bg: '#F48120', accent: '#D96E10', text: '#fff',
        gradient: 'linear-gradient(135deg,#F48120 0%,#3D1A00 100%)',
        glow: 'rgba(244,129,32,0.4)', pattern: 'grid',
        tagline: 'The Web Performance & Security Company.',
    },
    '1password': {
        bg: '#1A8CFF', accent: '#1475D9', text: '#fff',
        gradient: 'linear-gradient(135deg,#1A8CFF 0%,#003B80 100%)',
        glow: 'rgba(26,140,255,0.4)', pattern: 'grid',
        tagline: 'Remember one password.',
    },
    'nordvpn': {
        bg: '#4687C4', accent: '#3670A8', text: '#fff',
        gradient: 'linear-gradient(135deg,#4687C4 0%,#1A2F4A 100%)',
        glow: 'rgba(70,135,196,0.4)', pattern: 'stripes',
        tagline: 'Online security starts with a click.',
    },
    // ── Indian Services ────────────────────────────────────────────────────
    'swiggy': {
        bg: '#FC8019', accent: '#E56B0A', text: '#fff',
        gradient: 'linear-gradient(135deg,#FC8019 0%,#D85800 100%)',
        glow: 'rgba(252,128,25,0.5)', pattern: 'dots',
        tagline: 'Delivery in 30 minutes. Guaranteed.',
    },
    'zomato': {
        bg: '#E23744', accent: '#C42233', text: '#fff',
        gradient: 'linear-gradient(135deg,#E23744 0%,#7A0F18 100%)',
        glow: 'rgba(226,55,68,0.5)', pattern: 'dots',
        tagline: 'Discover great food & drinks.',
    },
    'hotstar': {
        bg: '#1F80E0', accent: '#0F6AC4', text: '#fff',
        gradient: 'linear-gradient(135deg,#1F80E0 0%,#0A1F66 100%)',
        glow: 'rgba(31,128,224,0.5)', pattern: 'stars',
        tagline: 'India\'s largest premium streaming platform.',
    },
    'disney+ hotstar': { ref: 'hotstar' },
    'jiocinema': {
        bg: '#003791', accent: '#002778', text: '#fff',
        gradient: 'linear-gradient(135deg,#003791 0%,#001440 100%)',
        glow: 'rgba(0,55,145,0.5)', pattern: 'stripes',
        tagline: 'New entertainment every day.',
    },
    'jio': { ref: 'jiocinema' },
    'sonyliv': {
        bg: '#0866C8', accent: '#064FA8', text: '#fff',
        gradient: 'linear-gradient(135deg,#0866C8 0%,#012350 100%)',
        glow: 'rgba(8,102,200,0.5)', pattern: 'stripes',
        tagline: 'Best of Sony Entertainment.',
    },
    'zee5': {
        bg: '#6B2D8B', accent: '#561970', text: '#fff',
        gradient: 'linear-gradient(135deg,#6B2D8B 0%,#2A0040 100%)',
        glow: 'rgba(107,45,139,0.5)', pattern: 'dots',
        tagline: 'India\'s biggest OTT platform.',
    },
    'airtel': {
        bg: '#ED1C24', accent: '#C8141C', text: '#fff',
        gradient: 'linear-gradient(135deg,#ED1C24 0%,#6B0008 100%)',
        glow: 'rgba(237,28,36,0.5)', pattern: 'stripes',
        tagline: 'The smartphone network.',
    },
    'amazon': { ref: 'amazon prime' },
    'apple': {
        bg: '#1d1d1f', accent: '#2d2d2f', text: '#fff',
        gradient: 'linear-gradient(135deg,#1d1d1f 0%,#000 100%)',
        glow: 'rgba(255,255,255,0.1)', pattern: 'grid',
        tagline: 'Think different.',
    },
};

const resolveBrand = (name = '') => {
    const key = name.toLowerCase().trim();
    let brand = BRANDS[key];
    if (!brand) return null;
    if (brand.ref) brand = BRANDS[brand.ref];
    return brand || null;
};

const hexToRgba = (hex = '#000000', alpha = 1) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.slice(0, 2), 16) || 0;
    const g = parseInt(clean.slice(2, 4), 16) || 0;
    const b = parseInt(clean.slice(4, 6), 16) || 0;
    return `rgba(${r},${g},${b},${alpha})`;
};

// ─── Background SVG patterns ────────────────────────────────────────────────
const BgPattern = ({ type, color }) => {
    const c = hexToRgba(color, 0.12);
    if (type === 'dots') return (
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.4 }}>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill={c} />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
    );
    if (type === 'stripes') return (
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.35 }}>
            <pattern id="stripes" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="20" stroke={c} strokeWidth="4" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#stripes)" />
        </svg>
    );
    if (type === 'wave') return (
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
            <pattern id="wave" x="0" y="0" width="60" height="20" patternUnits="userSpaceOnUse">
                <path d="M0 10 Q15 0 30 10 Q45 20 60 10" fill="none" stroke={c} strokeWidth="2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#wave)" />
        </svg>
    );
    if (type === 'stars') return (
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
            <pattern id="stars" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                <text x="5" y="20" fontSize="12" fill={c}>★</text>
            </pattern>
            <rect width="100%" height="100%" fill="url(#stars)" />
        </svg>
    );
    // grid (default)
    return (
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.2 }}>
            <pattern id="grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0L0 0 0 20" fill="none" stroke={c} strokeWidth="0.8" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
    );
};

// ─── Animated floating orb ──────────────────────────────────────────────────
const FloatOrb = ({ style, color, delay = 0 }) => (
    <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ background: hexToRgba(color, 0.18), ...style }}
        animate={{ y: [0, -18, 0], scale: [1, 1.07, 1] }}
        transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
);

// ─── Detail Chip ────────────────────────────────────────────────────────────
const Chip = ({ icon: Icon, label, value, brandColor, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="flex flex-col gap-1.5 p-4 rounded-2xl backdrop-blur border shadow-sm
                   bg-white/70 dark:bg-zinc-900/60 border-zinc-200/80 dark:border-zinc-700/50
                   hover:scale-[1.02] transition-transform duration-200 cursor-default"
    >
        <div className="flex items-center gap-1.5">
            <Icon size={12} style={{ color: brandColor }} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{label}</span>
        </div>
        <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{value || '—'}</p>
    </motion.div>
);

// ─── Payment Bar ─────────────────────────────────────────────────────────────
const PaymentBar = ({ days, brandColor }) => {
    if (days === null) return null;
    const total = 30;
    const pct = Math.max(0, Math.min(100, ((total - Math.abs(days)) / total) * 100));
    const overdue = days < 0;
    return (
        <div className="mt-3">
            <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Billing cycle</span>
                <span style={{ color: overdue ? '#ef4444' : brandColor }}>
                    {overdue ? `${Math.abs(days)} days overdue` : days === 0 ? 'Due today' : `${days} days left`}
                </span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
                    className="h-full rounded-full"
                    style={{ background: overdue ? '#ef4444' : brandColor }}
                />
            </div>
        </div>
    );
};

// ─── Main ────────────────────────────────────────────────────────────────────
const SubscriptionDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();

    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteStatus, setDeleteStatus] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => { fetchSubscription(); }, [id]);

    const fetchSubscription = async () => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:3000/api/subscriptions/${id}`, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (res.ok && data.success) { setSubscription(data.data); setError(null); }
            else setError(data.message || 'Failed to load subscription');
        } catch { setError('Unable to connect to server.'); }
        finally { setLoading(false); }
    };

    const handleDelete = async () => {
        try {
            setDeleteStatus('loading');
            const res = await fetch(`http://localhost:3000/api/subscriptions/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setDeleteStatus('success');
                setTimeout(() => navigate('/dashboard/subscriptions'), 1500);
            } else { setDeleteStatus('error'); setError(data.message || 'Delete failed'); }
        } catch { setDeleteStatus('error'); setError('Unable to connect to server.'); }
    };

    const fmt = (ds) => {
        if (!ds) return 'N/A';
        return new Date(ds).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };
    const fmtCurrency = (amt, cur) => {
        if (!amt) return 'N/A';
        try { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: cur || 'INR', maximumFractionDigits: 2 }).format(amt); }
        catch { return `₹${amt}`; }
    };
    const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—';
    const daysUntil = (ds) => {
        if (!ds) return null;
        return Math.ceil((new Date(ds) - new Date()) / 86400000);
    };

    // ── Loading state ─────────────────────────────────────────────────────
    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-400 flex items-center justify-center shadow-xl"
            >
                <Loader2 size={24} className="text-white" />
            </motion.div>
            <p className="text-zinc-400 text-sm">Loading subscription…</p>
        </div>
    );

    if (error && !subscription) return (
        <div className="max-w-lg mx-auto mt-16 p-5 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-4">
            <AlertCircle className="text-red-500 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
        </div>
    );

    if (!subscription) return null;

    const companyName = subscription.company?.name || '';
    const brand = resolveBrand(companyName);
    const brandColor = brand?.bg || '#10b981';
    const brandAccent = brand?.accent || brandColor;
    const brandText = brand?.text || '#fff';
    const brandGradient = brand?.gradient || `linear-gradient(135deg,${brandColor} 0%,${brandAccent} 100%)`;
    const brandGlow = brand?.glow || `rgba(16,185,129,0.4)`;
    const brandPattern = brand?.pattern || 'grid';
    const brandTagline = brand?.tagline || '';
    const isLight = brandText !== '#fff';

    const days = daysUntil(subscription.next_payment_date);
    const urgentDays = days !== null && days <= 7 && days >= 0;
    const overdue = days !== null && days < 0;

    return (
        <div className="max-w-3xl mx-auto pb-16">

            {/* ── Back ─────────────────────────────────────────────────────── */}
            <motion.button
                onClick={() => navigate('/dashboard/subscriptions')}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors text-sm mb-6 group"
            >
                <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Subscriptions
            </motion.button>

            {/* ── Hero Banner ──────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-3xl overflow-hidden mb-5 shadow-2xl"
                style={{
                    background: brandGradient,
                    boxShadow: `0 25px 60px ${brandGlow}, 0 8px 24px rgba(0,0,0,0.2)`,
                }}
            >
                {/* Background pattern */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <BgPattern type={brandPattern} color={isLight ? '#000' : '#fff'} />
                </div>

                {/* Floating orbs */}
                <FloatOrb color={isLight ? '#000' : '#fff'} style={{ width: 220, height: 220, top: -60, right: -60 }} delay={0} />
                <FloatOrb color={isLight ? '#000' : '#fff'} style={{ width: 150, height: 150, bottom: -50, left: -30 }} delay={2} />
                <FloatOrb color={isLight ? '#000' : '#fff'} style={{ width: 80, height: 80, top: '40%', right: '25%' }} delay={4} />

                {/* Main content */}
                <div className="relative z-10 p-7 sm:p-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

                        {/* Logo */}
                        <motion.div
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.15 }}
                            className="flex-shrink-0"
                        >
                            <div
                                className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl"
                                style={{ background: hexToRgba(isLight ? '#000' : '#fff', 0.15), backdropFilter: 'blur(12px)', border: `2px solid ${hexToRgba(isLight ? '#000' : '#fff', 0.2)}` }}
                            >
                                <CompanyLogo name={companyName} size="xl" rounded="rounded-xl" />
                            </div>
                        </motion.div>

                        {/* Text info */}
                        <div className="flex-1 min-w-0">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                <span
                                    className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur"
                                    style={{ background: hexToRgba(isLight ? '#000' : '#fff', 0.18), color: brandText }}
                                >
                                    {cap(subscription.type)}
                                </span>
                                {subscription.recurring && (
                                    <span
                                        className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur"
                                        style={{ background: hexToRgba(isLight ? '#000' : '#fff', 0.18), color: brandText }}
                                    >
                                        <RefreshCw size={9} /> Recurring
                                    </span>
                                )}
                                {(urgentDays || overdue) && (
                                    <motion.span
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1"
                                        style={{ background: overdue ? 'rgba(239,68,68,0.35)' : 'rgba(251,191,36,0.3)', color: overdue ? '#fca5a5' : '#fde68a' }}
                                    >
                                        <Bell size={9} /> {overdue ? 'Overdue' : 'Due Soon'}
                                    </motion.span>
                                )}
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none mb-1" style={{ color: brandText }}>
                                {companyName || 'Unknown'}
                            </h1>
                            {brandTagline && (
                                <p className="text-xs font-medium mb-2 opacity-60 italic" style={{ color: brandText }}>
                                    {brandTagline}
                                </p>
                            )}

                            {/* Price */}
                            <div className="flex items-baseline gap-2 mt-3">
                                <span className="text-3xl font-black" style={{ color: brandText }}>
                                    {fmtCurrency(subscription.value, subscription.currency)}
                                </span>
                                <span className="text-sm font-semibold opacity-60" style={{ color: brandText }}>
                                    / {subscription.cycle}
                                </span>
                            </div>

                            {/* Payment progress bar */}
                            <PaymentBar days={days} brandColor={brandText === '#fff' ? '#fff' : brandColor} />
                        </div>

                        {/* Days badge */}
                        {days !== null && (
                            <motion.div
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 180, delay: 0.3 }}
                                className="flex-shrink-0 text-center px-5 py-4 rounded-2xl backdrop-blur"
                                style={{ background: hexToRgba(isLight ? '#000' : '#fff', overdue ? 0.3 : 0.15), border: `1.5px solid ${hexToRgba(isLight ? '#000' : '#fff', 0.2)}` }}
                            >
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5" style={{ color: brandText }}>
                                    {days < 0 ? 'Overdue' : days === 0 ? 'Due Today' : 'Due in'}
                                </p>
                                <p className="text-5xl font-black leading-none" style={{ color: overdue ? '#fca5a5' : brandText }}>
                                    {Math.abs(days)}
                                </p>
                                <p className="text-[10px] font-medium opacity-60" style={{ color: brandText }}>days</p>
                            </motion.div>
                        )}
                    </div>

                    {/* Action bar */}
                    <div className="flex flex-wrap gap-2 mt-6">
                        <button
                            onClick={() => navigate(`/dashboard/subscriptions/edit/${id}`)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-100 shadow-md"
                            style={{ background: hexToRgba(isLight ? '#000' : '#fff', 0.18), color: brandText, border: `1.5px solid ${hexToRgba(brandText, 0.25)}` }}
                        >
                            <Edit size={14} /> Edit
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-100"
                            style={{ background: 'rgba(239,68,68,0.25)', color: '#fca5a5', border: '1.5px solid rgba(239,68,68,0.35)' }}
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                        {subscription.url_link && (
                            <a
                                href={subscription.url_link} target="_blank" rel="noopener noreferrer"
                                className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-100"
                                style={{ background: hexToRgba(isLight ? '#000' : '#fff', 0.13), color: brandText, border: `1.5px solid ${hexToRgba(brandText, 0.2)}` }}
                            >
                                <Globe size={14} /> Visit <ExternalLink size={11} />
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ── Delete confirm ──────────────────────────────────────────── */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4"
                    >
                        <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <p className="text-red-700 dark:text-red-300 font-semibold mb-4">
                                ⚠️ Delete <strong>{companyName}</strong>? This cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={handleDelete} disabled={deleteStatus === 'loading'}
                                    className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center gap-2">
                                    {deleteStatus === 'loading' ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                    {deleteStatus === 'loading' ? 'Deleting…' : 'Yes, delete'}
                                </button>
                                <button onClick={() => setShowDeleteConfirm(false)}
                                    className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-semibold rounded-xl text-sm transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Delete success ──────────────────────────────────────────── */}
            <AnimatePresence>
                {deleteStatus === 'success' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 mb-4">
                        <CheckCircle2 size={18} />
                        <span className="font-medium">Deleted! Redirecting…</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Error banner ───────────────────────────────────────────── */}
            {error && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 mb-4">
                    <AlertCircle size={16} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {/* ── Quick Stats Row ─────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                <Chip icon={IndianRupee} label="Amount" value={fmtCurrency(subscription.value, subscription.currency)} brandColor={brandColor} delay={0.1} />
                <Chip icon={RefreshCw} label="Billing" value={`Every ${subscription.frequency || 1} ${subscription.cycle}`} brandColor={brandColor} delay={0.15} />
                <Chip icon={Shield} label="Recurring" value={subscription.recurring ? 'Yes' : 'No'} brandColor={brandColor} delay={0.2} />
                <Chip icon={Clock} label="Next Due" value={fmt(subscription.next_payment_date)} brandColor={brandColor} delay={0.25} />
                <Chip icon={Calendar} label="Expires" value={fmt(subscription.contract_expiry)} brandColor={brandColor} delay={0.3} />
                <Chip icon={CreditCard} label="Payment" value={cap(subscription.payment_method) || 'Not set'} brandColor={brandColor} delay={0.35} />
            </div>

            {/* ── Folder + Tags ───────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4"
            >
                <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur border border-zinc-200/80 dark:border-zinc-700/50 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-3">
                        <Folder size={12} style={{ color: brandColor }} />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Folder</span>
                    </div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">
                        {subscription.folder?.name || <span className="text-zinc-400 font-normal italic">No folder</span>}
                    </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur border border-zinc-200/80 dark:border-zinc-700/50 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-3">
                        <Tag size={12} style={{ color: brandColor }} />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {subscription.tags?.length > 0 ? subscription.tags.map(tag => (
                            <span key={tag.id}
                                className="px-3 py-1 rounded-full text-xs font-semibold transition-transform hover:scale-105"
                                style={{ background: hexToRgba(brandColor, 0.12), color: brandColor, border: `1px solid ${hexToRgba(brandColor, 0.3)}` }}>
                                {tag.name}
                            </span>
                        )) : <span className="text-zinc-400 text-sm italic">No tags</span>}
                    </div>
                </div>
            </motion.div>

            {/* ── Brand Spotlight Card ────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                className="relative overflow-hidden rounded-2xl mb-4 p-5"
                style={{
                    background: `linear-gradient(135deg, ${hexToRgba(brandColor, 0.08)} 0%, ${hexToRgba(brandAccent, 0.04)} 100%)`,
                    border: `1.5px solid ${hexToRgba(brandColor, 0.2)}`,
                }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: hexToRgba(brandColor, 0.15) }}>
                        <Star size={14} style={{ color: brandColor }} />
                    </div>
                    <span className="text-sm font-bold" style={{ color: brandColor }}>Brand Insights</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Total Spent', value: fmtCurrency(subscription.value * 12, subscription.currency), icon: TrendingUp },
                        { label: 'Cycle', value: cap(subscription.cycle), icon: RefreshCw },
                        { label: 'Type', value: cap(subscription.type), icon: Zap },
                        { label: 'Status', value: subscription.recurring ? 'Active' : 'One-time', icon: Shield },
                    ].map(({ label, value, icon: Ico }) => (
                        <div key={label} className="text-center">
                            <div className="flex justify-center mb-1">
                                <Ico size={14} style={{ color: brandColor }} />
                            </div>
                            <p className="text-xs text-zinc-400 mb-0.5">{label}</p>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">{value}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── Notes / Description ─────────────────────────────────────── */}
            {(subscription.description || subscription.notes) && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="space-y-3">
                    {subscription.description && (
                        <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur border border-zinc-200/80 dark:border-zinc-700/50 shadow-sm">
                            <div className="flex items-center gap-1.5 mb-2">
                                <FileText size={12} style={{ color: brandColor }} />
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Description</span>
                            </div>
                            <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">{subscription.description}</p>
                        </div>
                    )}
                    {subscription.notes && (
                        <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur border border-zinc-200/80 dark:border-zinc-700/50 shadow-sm">
                            <div className="flex items-center gap-1.5 mb-2">
                                <StickyNote size={12} style={{ color: brandColor }} />
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Notes</span>
                            </div>
                            <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">{subscription.notes}</p>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default SubscriptionDetail;
