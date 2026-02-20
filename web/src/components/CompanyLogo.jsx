import React, { useState } from 'react';

// ─── Domain Map ───────────────────────────────────────────────────────────────
const DOMAIN_MAP = {
    // Streaming – Video
    'netflix': 'netflix.com',
    'disney+': 'disneyplus.com', 'disney plus': 'disneyplus.com', 'disney': 'disneyplus.com',
    'amazon prime': 'amazon.com', 'amazon prime video': 'amazon.com', 'prime video': 'amazon.com',
    'apple tv+': 'apple.com', 'apple tv': 'apple.com',
    'hbo max': 'max.com', 'hbo': 'max.com', 'max': 'max.com',
    'hulu': 'hulu.com',
    'peacock': 'peacocktv.com',
    'paramount+': 'paramountplus.com', 'paramount plus': 'paramountplus.com',
    'crunchyroll': 'crunchyroll.com',
    'youtube premium': 'youtube.com', 'youtube': 'youtube.com',
    'mubi': 'mubi.com',
    // Streaming – Music
    'spotify': 'spotify.com',
    'apple music': 'apple.com',
    'youtube music': 'music.youtube.com',
    'tidal': 'tidal.com',
    'amazon music': 'music.amazon.com',
    'deezer': 'deezer.com',
    'soundcloud': 'soundcloud.com',
    'pandora': 'pandora.com',
    // Productivity
    'microsoft 365': 'microsoft.com', 'office 365': 'microsoft.com', 'microsoft': 'microsoft.com',
    'google one': 'one.google.com', 'google workspace': 'workspace.google.com', 'google': 'google.com',
    'notion': 'notion.so',
    'slack': 'slack.com',
    'zoom': 'zoom.us',
    'dropbox': 'dropbox.com',
    'evernote': 'evernote.com',
    'todoist': 'todoist.com',
    '1password': '1password.com',
    'lastpass': 'lastpass.com',
    'dashlane': 'dashlane.com',
    'grammarly': 'grammarly.com',
    'loom': 'loom.com',
    'trello': 'trello.com',
    'asana': 'asana.com',
    'monday.com': 'monday.com',
    'airtable': 'airtable.com',
    'clickup': 'clickup.com',
    // Cloud & Storage
    'icloud': 'apple.com',
    'onedrive': 'microsoft.com',
    'google drive': 'drive.google.com',
    'box': 'box.com',
    // Creative
    'adobe creative cloud': 'adobe.com', 'adobe': 'adobe.com',
    'figma': 'figma.com',
    'canva': 'canva.com',
    'envato': 'envato.com',
    'shutterstock': 'shutterstock.com',
    'framer': 'framer.com',
    'sketch': 'sketch.com',
    // Gaming
    'xbox game pass': 'xbox.com', 'xbox': 'xbox.com',
    'playstation plus': 'playstation.com', 'playstation': 'playstation.com',
    'nintendo': 'nintendo.com',
    'ea play': 'ea.com', 'ea': 'ea.com',
    'ubisoft': 'ubisoft.com',
    'steam': 'steampowered.com',
    'twitch': 'twitch.tv',
    'discord': 'discord.com',
    // Fitness & Wellness
    'peloton': 'onepeloton.com',
    'calm': 'calm.com',
    'headspace': 'headspace.com',
    'strava': 'strava.com',
    'myfitnesspal': 'myfitnesspal.com',
    // Reading & Learning
    'audible': 'audible.com',
    'scribd': 'scribd.com',
    'medium': 'medium.com',
    'blinkist': 'blinkist.com',
    'duolingo': 'duolingo.com',
    'coursera': 'coursera.org',
    'udemy': 'udemy.com',
    'skillshare': 'skillshare.com',
    // Developer
    'github': 'github.com', 'github copilot': 'github.com',
    'gitlab': 'gitlab.com',
    'vercel': 'vercel.com',
    'netlify': 'netlify.com',
    'digitalocean': 'digitalocean.com',
    'aws': 'aws.amazon.com', 'amazon web services': 'aws.amazon.com',
    'heroku': 'heroku.com',
    'linear': 'linear.app',
    'jira': 'atlassian.com', 'confluence': 'atlassian.com', 'atlassian': 'atlassian.com',
    'datadog': 'datadoghq.com',
    'sentry': 'sentry.io',
    'cloudflare': 'cloudflare.com',
    'postman': 'postman.com',
    // Business
    'shopify': 'shopify.com',
    'hubspot': 'hubspot.com',
    'salesforce': 'salesforce.com',
    'zendesk': 'zendesk.com',
    'mailchimp': 'mailchimp.com',
    'quickbooks': 'quickbooks.intuit.com',
    // Social
    'linkedin': 'linkedin.com',
    'twitter': 'twitter.com',
    'x': 'x.com',
    'amazon': 'amazon.com',
    'apple': 'apple.com',
    'nordvpn': 'nordvpn.com',
    'expressvpn': 'expressvpn.com',
};

// Palette for fallback colored initials
const PALETTE = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
    '#3b82f6', '#ef4444', '#14b8a6', '#f97316', '#84cc16',
    '#06b6d4', '#a855f7', '#f43f5e', '#0ea5e9', '#65a30d',
];

export const colorFor = (name = '') =>
    name ? PALETTE[name.charCodeAt(0) % PALETTE.length] : PALETTE[0];

export const getDomain = (name = '') => {
    const key = name.toLowerCase().trim();
    return DOMAIN_MAP[key] || `${key.replace(/\s+/g, '').replace(/[^a-z0-9.]/g, '')}.com`;
};

// Logo sources in priority order — Google is most reliable (no deprecation issues)
const getSources = (domain) => [
    // 1. Google Favicons — always works, cached by Google's crawler
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    // 2. Clearbit — high-res but partially deprecated
    `https://logo.clearbit.com/${domain}`,
    // 3. DuckDuckGo — fallback
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
];

/**
 * CompanyLogo
 * Tries Clearbit → Google Favicons → DuckDuckGo → coloured initial
 * Props:
 *   name     — company name (string)
 *   size     — 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 *   rounded  — tailwind class e.g. 'rounded-xl', 'rounded-full'
 *   className — extra classes
 */
const CompanyLogo = ({ name = '', size = 'md', rounded = 'rounded-xl', className = '' }) => {
    const domain = getDomain(name);
    const sources = getSources(domain);
    const [srcIndex, setSrcIndex] = useState(0);
    // Reset when name changes so we retry sources for a new company
    const [currentName, setCurrentName] = useState(name);
    if (name !== currentName) {
        setCurrentName(name);
        setSrcIndex(0);
        setAllFailed(false);
    }
    const [allFailed, setAllFailed] = useState(false);

    const sizeMap = {
        xs: { wrap: 'w-7 h-7', img: 'w-4 h-4', text: 'text-xs' },
        sm: { wrap: 'w-9 h-9', img: 'w-6 h-6', text: 'text-sm' },
        md: { wrap: 'w-11 h-11', img: 'w-7 h-7', text: 'text-base' },
        lg: { wrap: 'w-14 h-14', img: 'w-10 h-10', text: 'text-xl' },
        xl: { wrap: 'w-20 h-20', img: 'w-14 h-14', text: 'text-3xl' },
    };
    const s = sizeMap[size] || sizeMap.md;

    const handleError = () => {
        const next = srcIndex + 1;
        if (next < sources.length) {
            setSrcIndex(next);
        } else {
            setAllFailed(true);
        }
    };

    return (
        <div
            className={`${s.wrap} ${rounded} flex items-center justify-center flex-shrink-0 overflow-hidden ${className}`}
            style={{
                background: allFailed ? colorFor(name) : '#ffffff',
                border: allFailed ? 'none' : '1.5px solid rgba(0,0,0,0.08)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
        >
            {!allFailed ? (
                <img
                    key={`${name}-${srcIndex}`}
                    src={sources[srcIndex]}
                    alt={name}
                    className={`${s.img} object-contain`}
                    onError={handleError}
                    loading="lazy"
                />
            ) : (
                <span className={`font-bold text-white leading-none select-none ${s.text}`}>
                    {name?.[0]?.toUpperCase() || '?'}
                </span>
            )}
        </div>
    );
};

export default CompanyLogo;
