import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { motion, useAnimation } from 'framer-motion';

/**
 * AuthRobot — interactive SVG robot aligned with SubEx emerald/cyan theme.
 *
 * Ref API:
 *   coverEyes(bool)      – arms rise to cover eyes when password is revealed
 *   react(state)         – 'success' | 'error' | 'idle'
 *   setTyping(bool)      – concentrating face while in password field
 *   push(dir, callback)  – robot winds up then thrusts, page switches at peak
 *                          dir: 1 = push right (→ register), -1 = push left (→ login)
 */
const AuthRobot = forwardRef(({ size = 220 }, ref) => {
    const wrapRef = useRef(null);

    // All animations driven by DOM-level controls (not SVG internals)
    const robotBodyCtrl = useAnimation();   // whole robot div lean
    const lArmCtrl = useAnimation();        // left arm wrapper div
    const rArmCtrl = useAnimation();        // right arm wrapper div

    const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
    const [blinking, setBlinking] = useState(false);
    const [covering, setCovering] = useState(false);
    const [mood, setMood] = useState('idle');
    const [speechText, setSpeechText] = useState('');
    const [pushDir, setPushDir] = useState(0);

    useImperativeHandle(ref, () => ({
        coverEyes: (val) => setCovering(val),
        react: (state) => setMood(state),
        setTyping: (val) => setMood(val ? 'typing' : 'idle'),

        push: async (dir, onNavigate) => {
            setMood('pushing');
            setPushDir(dir);
            setSpeechText(dir === 1 ? 'Off you go! →' : '← Right this way!');

            // Phase 1 — wind up (lean opposite)
            await robotBodyCtrl.start({
                x: dir * -18,
                rotate: dir * -8,
                transition: { duration: 0.25, ease: [0.4, 0, 0.6, 1] },
            });

            // Fire navigation at peak wind-up → page exits simultaneously with push thrust
            if (onNavigate) onNavigate();

            // Phase 2 — thrust forward
            await Promise.all([
                robotBodyCtrl.start({
                    x: dir * 30,
                    rotate: dir * 12,
                    transition: { duration: 0.18, ease: [0.0, 0.0, 0.2, 1] },
                }),
                (dir === 1 ? rArmCtrl : lArmCtrl).start({
                    rotate: dir * -70,
                    y: -20,
                    transition: { duration: 0.18, ease: [0.0, 0.0, 0.2, 1] },
                }),
                (dir === 1 ? lArmCtrl : rArmCtrl).start({
                    rotate: dir * 25,
                    transition: { duration: 0.18, ease: 'easeOut' },
                }),
            ]);

            // Phase 3 — spring back
            await Promise.all([
                robotBodyCtrl.start({
                    x: 0, rotate: 0,
                    transition: { type: 'spring', stiffness: 240, damping: 20, delay: 0.04 },
                }),
                lArmCtrl.start({
                    rotate: 0, y: 0,
                    transition: { type: 'spring', stiffness: 200, damping: 18, delay: 0.06 },
                }),
                rArmCtrl.start({
                    rotate: 0, y: 0,
                    transition: { type: 'spring', stiffness: 200, damping: 18, delay: 0.06 },
                }),
            ]);

            setSpeechText('');
            setPushDir(0);
            setMood('idle');
        },
    }));

    // Mouse tracking → pupils
    useEffect(() => {
        const handleMouse = (e) => {
            if (covering || mood === 'pushing') return;
            const el = wrapRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.hypot(dx, dy) || 1;
            const max = 5;
            setEyeOffset({ x: (dx / dist) * Math.min(dist, max), y: (dy / dist) * Math.min(dist, max) });
        };
        window.addEventListener('mousemove', handleMouse);
        return () => window.removeEventListener('mousemove', handleMouse);
    }, [covering, mood]);

    // Blink
    useEffect(() => {
        let t;
        const blink = () => {
            t = setTimeout(() => {
                if (!covering && mood !== 'pushing') {
                    setBlinking(true);
                    setTimeout(() => setBlinking(false), 130);
                }
                blink();
            }, 2200 + Math.random() * 3800);
        };
        blink();
        return () => clearTimeout(t);
    }, [covering, mood]);

    // Arms → covering
    useEffect(() => {
        if (covering) {
            lArmCtrl.start({ rotate: -68, y: -48, transition: { type: 'spring', stiffness: 180, damping: 16 } });
            rArmCtrl.start({ rotate: 68, y: -48, transition: { type: 'spring', stiffness: 180, damping: 16 } });
        } else if (mood !== 'pushing') {
            lArmCtrl.start({ rotate: 0, y: 0, transition: { type: 'spring', stiffness: 180, damping: 16 } });
            rArmCtrl.start({ rotate: 0, y: 0, transition: { type: 'spring', stiffness: 180, damping: 16 } });
        }
    }, [covering]);

    // Arms → mood
    useEffect(() => {
        if (mood === 'success' && !covering) {
            lArmCtrl.start({ rotate: -22, y: 0, transition: { type: 'spring', stiffness: 180, damping: 16 } });
            rArmCtrl.start({ rotate: 22, y: 0, transition: { type: 'spring', stiffness: 180, damping: 16 } });
        } else if (mood === 'idle' && !covering) {
            lArmCtrl.start({ rotate: 0, y: 0, transition: { type: 'spring', stiffness: 150, damping: 20 } });
            rArmCtrl.start({ rotate: 0, y: 0, transition: { type: 'spring', stiffness: 150, damping: 20 } });
        }
    }, [mood]);

    const C = {
        idle: { head: '#10b981', headD: '#059669', ant: '#6EE7B7', screen: '#022c22', pupil: '#10b981', mouth: '#34d399', body: '#0d9488', bodyD: '#0f766e' },
        typing: { head: '#0891b2', headD: '#0e7490', ant: '#67e8f9', screen: '#082f49', pupil: '#0891b2', mouth: '#22d3ee', body: '#0d9488', bodyD: '#0f766e' },
        success: { head: '#10b981', headD: '#047857', ant: '#6EE7B7', screen: '#022c22', pupil: '#10b981', mouth: '#34d399', body: '#10b981', bodyD: '#059669' },
        error: { head: '#ef4444', headD: '#dc2626', ant: '#fca5a5', screen: '#1c0606', pupil: '#ef4444', mouth: '#fca5a5', body: '#0d9488', bodyD: '#0f766e' },
        pushing: { head: '#f59e0b', headD: '#d97706', ant: '#fcd34d', screen: '#1c1100', pupil: '#f59e0b', mouth: '#fcd34d', body: '#0d9488', bodyD: '#0f766e' },
    };
    const c = C[mood] || C.idle;

    const mouth =
        mood === 'success' ? 'M 36 63 Q 50 77 64 63' :
            mood === 'error' ? 'M 36 70 Q 50 58 64 70' :
                mood === 'typing' ? 'M 40 67 L 60 67' :
                    mood === 'pushing' ? 'M 36 62 Q 50 76 64 62' :
                        'M 38 66 Q 50 74 62 66';

    // Float / shake handled by robotBodyCtrl when idle/success/error
    const floatAnimate =
        mood === 'pushing' ? {} :
            mood === 'success' ? { y: [0, -22, 0, -14, 0] } :
                mood === 'error' ? { x: [-7, 7, -7, 7, 0] } :
                    { y: [0, -10, 0] };
    const floatTransition =
        mood === 'pushing' ? { duration: 0 } :
            mood === 'success' ? { duration: 0.65, ease: 'easeInOut' } :
                mood === 'error' ? { duration: 0.38, ease: 'easeInOut' } :
                    { duration: 4, repeat: Infinity, ease: 'easeInOut' };

    // Arm dimensions (in px, scaled to size)
    const scale = size / 200;
    const armW = 28 * scale;
    const armH = 78 * scale;
    const armR = 14 * scale;
    const handR = 15 * scale;
    const kR = 8 * scale;

    return (
        <div ref={wrapRef} style={{ width: size, height: size + 60, position: 'relative', userSelect: 'none' }}>

            {/* ── Speech bubble ── */}
            {(speechText || mood === 'success' || mood === 'error' || mood === 'typing') && (
                <motion.div
                    key={speechText || mood}
                    initial={{ opacity: 0, scale: 0.6, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    style={{
                        position: 'absolute', top: -52, left: '50%',
                        transform: 'translateX(-50%)',
                        background: speechText
                            ? 'linear-gradient(135deg,#f59e0b,#ef4444)'
                            : mood === 'success' ? 'linear-gradient(135deg,#10b981,#06b6d4)'
                                : mood === 'error' ? '#ef4444'
                                    : 'linear-gradient(135deg,#0891b2,#10b981)',
                        color: 'white', fontSize: 12, fontWeight: 700,
                        padding: '6px 14px', borderRadius: 20,
                        whiteSpace: 'nowrap',
                        boxShadow: speechText ? '0 4px 16px rgba(245,158,11,0.5)'
                            : mood === 'success' ? '0 4px 16px rgba(16,185,129,0.4)'
                                : mood === 'error' ? '0 4px 16px rgba(239,68,68,0.4)'
                                    : '0 4px 16px rgba(8,145,178,0.4)',
                        zIndex: 10,
                    }}
                >
                    {speechText || (
                        mood === 'success' ? "🎉 You're in!" :
                            mood === 'error' ? "😬 Uh oh..." :
                                mood === 'typing' ? "🤔 Focusing..." : ''
                    )}
                    <div style={{
                        position: 'absolute', bottom: -7, left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0, height: 0,
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderTop: `8px solid ${speechText ? '#d97706' : mood === 'success' ? '#059669' : mood === 'error' ? '#ef4444' : '#0e7490'}`,
                    }} />
                </motion.div>
            )}

            {/* ── Whole robot — float/shake/lean wrapper ── */}
            <motion.div
                animate={mood === 'pushing' ? robotBodyCtrl : floatAnimate}
                transition={mood === 'pushing' ? undefined : floatTransition}
                style={{ width: '100%', height: '100%', position: 'relative' }}
            >
                {/* ── LEFT ARM (DOM div, absolutely positioned) ── */}
                <motion.div
                    animate={lArmCtrl}
                    style={{
                        position: 'absolute',
                        left: size * 0.04,
                        top: size * 0.54,
                        width: armW,
                        transformOrigin: 'top center',
                        zIndex: 1,
                    }}
                >
                    <svg width={armW} height={armH + handR * 2} viewBox={`0 0 ${armW} ${armH + handR * 2}`} overflow="visible">
                        <rect x="0" y="0" width={armW} height={armH} rx={armR} fill={c.bodyD} />
                        {/* Hand */}
                        <circle cx={armW / 2} cy={armH + handR} r={handR} fill={c.bodyD} />
                        <circle cx={armW / 2 - kR * 0.6} cy={armH + handR - kR * 0.5} r={kR} fill={c.body} />
                        <circle cx={armW / 2 + kR * 0.6} cy={armH + handR - kR * 0.5} r={kR} fill={c.body} />
                        <circle cx={armW / 2} cy={armH + handR - kR * 0.8} r={kR} fill={c.body} />
                    </svg>
                </motion.div>

                {/* ── RIGHT ARM ── */}
                <motion.div
                    animate={rArmCtrl}
                    style={{
                        position: 'absolute',
                        right: size * 0.04,
                        top: size * 0.54,
                        width: armW,
                        transformOrigin: 'top center',
                        zIndex: 1,
                    }}
                >
                    <svg width={armW} height={armH + handR * 2} viewBox={`0 0 ${armW} ${armH + handR * 2}`} overflow="visible">
                        <rect x="0" y="0" width={armW} height={armH} rx={armR} fill={c.bodyD} />
                        <circle cx={armW / 2} cy={armH + handR} r={handR} fill={c.bodyD} />
                        <circle cx={armW / 2 - kR * 0.6} cy={armH + handR - kR * 0.5} r={kR} fill={c.body} />
                        <circle cx={armW / 2 + kR * 0.6} cy={armH + handR - kR * 0.5} r={kR} fill={c.body} />
                        <circle cx={armW / 2} cy={armH + handR - kR * 0.8} r={kR} fill={c.body} />
                    </svg>
                </motion.div>

                {/* ── Main robot SVG (head + body + legs, no arms) ── */}
                <svg viewBox="0 0 200 290" width={size} height={size + 60}
                    xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible', position: 'relative', zIndex: 2 }}>
                    <defs>
                        <radialGradient id="rg-head" cx="38%" cy="32%" r="68%">
                            <stop offset="0%" stopColor={c.head} />
                            <stop offset="100%" stopColor={c.headD} />
                        </radialGradient>
                        <radialGradient id="rg-body" cx="38%" cy="28%" r="68%">
                            <stop offset="0%" stopColor={c.body} />
                            <stop offset="100%" stopColor={c.bodyD} />
                        </radialGradient>
                        <linearGradient id="rg-em" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
                            <feGaussianBlur stdDeviation="3.5" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="rgba(0,0,0,0.3)" />
                        </filter>
                    </defs>

                    {/* Ground shadow */}
                    <ellipse cx="100" cy="283" rx="52" ry="9" fill="rgba(0,0,0,0.15)" />

                    {/* Antenna */}
                    <line x1="100" y1="20" x2="100" y2="6" stroke={c.ant} strokeWidth="3.5" strokeLinecap="round" />
                    <motion.circle cx="100" cy="5" r="6" fill={c.ant} filter="url(#glow)"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.55, 1] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} />

                    {/* Head */}
                    <rect x="34" y="20" width="132" height="110" rx="28" fill="url(#rg-head)" filter="url(#shadow)" />
                    <ellipse cx="66" cy="35" rx="24" ry="14" fill="rgba(255,255,255,0.18)" transform="rotate(-22,66,35)" />

                    {/* Screen visor */}
                    <rect x="44" y="32" width="112" height="80" rx="16" fill={c.screen} opacity="0.92" />
                    <rect x="44" y="32" width="112" height="80" rx="16" fill="none" stroke="rgba(52,211,153,0.35)" strokeWidth="1.5" />

                    {/* Scan line */}
                    <motion.rect x="44" y="32" width="112" height="5" rx="2.5"
                        fill="rgba(16,185,129,0.18)"
                        animate={{ y: [32, 107] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }} />

                    {/* Eye sockets */}
                    <rect x="52" y="46" width="42" height="42" rx="13" fill={`${c.screen}dd`} />
                    <rect x="106" y="46" width="42" height="42" rx="13" fill={`${c.screen}dd`} />

                    {/* Pupils */}
                    {!blinking && !covering && (
                        <>
                            <motion.circle r="12" fill={c.pupil} filter="url(#glow)"
                                animate={{ cx: 73 + eyeOffset.x, cy: 67 + eyeOffset.y }}
                                transition={{ type: 'spring', stiffness: 260, damping: 22 }} />
                            <motion.circle r="4.5" fill="white" opacity="0.7"
                                animate={{ cx: 73 + eyeOffset.x + 3, cy: 67 + eyeOffset.y - 3 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 22 }} />
                            <motion.circle r="12" fill={c.pupil} filter="url(#glow)"
                                animate={{ cx: 127 + eyeOffset.x, cy: 67 + eyeOffset.y }}
                                transition={{ type: 'spring', stiffness: 260, damping: 22 }} />
                            <motion.circle r="4.5" fill="white" opacity="0.7"
                                animate={{ cx: 127 + eyeOffset.x + 3, cy: 67 + eyeOffset.y - 3 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 22 }} />
                        </>
                    )}

                    {/* Blink */}
                    {blinking && !covering && (
                        <>
                            <line x1="54" y1="67" x2="93" y2="67" stroke={c.head} strokeWidth="4.5" strokeLinecap="round" />
                            <line x1="107" y1="67" x2="146" y2="67" stroke={c.head} strokeWidth="4.5" strokeLinecap="round" />
                        </>
                    )}

                    {/* Covering */}
                    {covering && (
                        <>
                            <line x1="57" y1="51" x2="90" y2="84" stroke="#f43f5e" strokeWidth="4.5" strokeLinecap="round" />
                            <line x1="90" y1="51" x2="57" y2="84" stroke="#f43f5e" strokeWidth="4.5" strokeLinecap="round" />
                            <line x1="111" y1="51" x2="144" y2="84" stroke="#f43f5e" strokeWidth="4.5" strokeLinecap="round" />
                            <line x1="144" y1="51" x2="111" y2="84" stroke="#f43f5e" strokeWidth="4.5" strokeLinecap="round" />
                        </>
                    )}

                    {/* Mouth */}
                    <motion.path d={mouth} fill="none"
                        stroke={c.mouth} strokeWidth="3.5" strokeLinecap="round"
                        animate={{ d: mouth }} transition={{ duration: 0.28 }} />

                    {/* Ear-bolts */}
                    <circle cx="34" cy="66" r="10" fill={c.headD} />
                    <circle cx="34" cy="66" r="5.5" fill={c.head} />
                    <circle cx="166" cy="66" r="10" fill={c.headD} />
                    <circle cx="166" cy="66" r="5.5" fill={c.head} />

                    {/* Neck */}
                    <rect x="84" y="130" width="32" height="17" rx="7" fill={c.bodyD} />
                    {[89, 98, 107].map(x => (
                        <rect key={x} x={x} y="133" width="4" height="11" rx="2" fill="rgba(255,255,255,0.22)" />
                    ))}

                    {/* Body */}
                    <rect x="36" y="147" width="128" height="104" rx="26" fill="url(#rg-body)" filter="url(#shadow)" />
                    <ellipse cx="66" cy="164" rx="22" ry="13" fill="rgba(255,255,255,0.12)" transform="rotate(-16,66,164)" />

                    {/* Chest panel */}
                    <rect x="60" y="163" width="80" height="55" rx="13" fill={c.screen} opacity="0.75" />
                    {[
                        { cx: 78, color: '#10b981', d: 0 },
                        { cx: 100, color: '#06b6d4', d: 0.45 },
                        { cx: 122, color: '#a78bfa', d: 0.9 },
                    ].map(({ cx, color, d }) => (
                        <motion.circle key={cx} cx={cx} cy="177" r="6" fill={color}
                            animate={{ opacity: [1, 0.28, 1] }}
                            transition={{ duration: 1.3, repeat: Infinity, delay: d }} />
                    ))}

                    {/* Progress bar */}
                    <rect x="68" y="193" width="64" height="8" rx="4" fill="rgba(255,255,255,0.08)" />
                    <motion.rect x="68" y="193" height="8" rx="4"
                        fill="url(#rg-em)"
                        animate={{ width: [8, 64, 8] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} />

                    {/* Legs */}
                    <rect x="66" y="249" width="30" height="38" rx="13" fill={c.bodyD} />
                    <rect x="104" y="249" width="30" height="38" rx="13" fill={c.bodyD} />
                    {/* Feet */}
                    <rect x="56" y="278" width="46" height="18" rx="9" fill={c.headD} />
                    <rect x="98" y="278" width="46" height="18" rx="9" fill={c.headD} />

                    {/* Success sparkles */}
                    {mood === 'success' && (
                        <>
                            <motion.text x="8" y="52" fontSize="19"
                                animate={{ opacity: [0, 1, 0], y: [52, 20] }}
                                transition={{ duration: 1.1, repeat: Infinity, delay: 0 }}>⭐</motion.text>
                            <motion.text x="162" y="42" fontSize="15"
                                animate={{ opacity: [0, 1, 0], y: [42, 12] }}
                                transition={{ duration: 1.1, repeat: Infinity, delay: 0.3 }}>✨</motion.text>
                            <motion.text x="98" y="18" fontSize="13"
                                animate={{ opacity: [0, 1, 0], y: [18, -12] }}
                                transition={{ duration: 1.1, repeat: Infinity, delay: 0.6 }}>🎉</motion.text>
                        </>
                    )}

                    {/* Error sparks */}
                    {mood === 'error' && (
                        <>
                            <motion.text x="18" y="42" fontSize="18"
                                animate={{ opacity: [0, 1, 0], rotate: [0, 25, -25, 0] }}
                                transition={{ duration: 0.7, repeat: Infinity }}>⚡</motion.text>
                            <motion.text x="158" y="48" fontSize="18"
                                animate={{ opacity: [0, 1, 0], rotate: [0, -25, 25, 0] }}
                                transition={{ duration: 0.7, repeat: Infinity, delay: 0.18 }}>⚡</motion.text>
                        </>
                    )}

                    {/* Push air puffs */}
                    {mood === 'pushing' && (
                        <>
                            <motion.text
                                x={pushDir === 1 ? 155 : 10} y="110" fontSize="16"
                                animate={{ opacity: [0, 1, 0], x: pushDir === 1 ? [155, 185] : [10, -20] }}
                                transition={{ duration: 0.45, repeat: Infinity }}>💨</motion.text>
                            <motion.text
                                x={pushDir === 1 ? 158 : 8} y="130" fontSize="11"
                                animate={{ opacity: [0, 1, 0], x: pushDir === 1 ? [158, 184] : [8, -18] }}
                                transition={{ duration: 0.45, repeat: Infinity, delay: 0.15 }}>💨</motion.text>
                        </>
                    )}
                </svg>
            </motion.div>
        </div>
    );
});

AuthRobot.displayName = 'AuthRobot';
export default AuthRobot;
