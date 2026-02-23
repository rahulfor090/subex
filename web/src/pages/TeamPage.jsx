import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Github, Linkedin, Twitter,
    ArrowRight, Quote, Sparkles,
    Cpu, Rocket, Shield, FastForward,
    ArrowUpRight, X, ChevronRight,
    Terminal, Globe, Command
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthRobot from '../components/AuthRobot';

gsap.registerPlugin(ScrollTrigger);

// ─── Team Members Data ──────────────────────────────────────────────────────
const TEAM = [
    {
        id: 3,
        name: 'Vikas Singh',
        role: 'CEO',
        tier: 'board',
        tagline: 'The Visionary Leader',
        bio: "Veteran in the banking sector with 14+ years of insight. Vikas combines traditional financial wisdom with social entrepreneurship and FinTech innovation.",
        color: 'from-amber-500 to-orange-500',
        accent: '#f59e0b',
        image: '/uploads/Vikas%20Singh.jpeg',
        social: { linkedin: '#', twitter: '#' },
        skills: ['Strategy', 'FinTech', 'Growth']
    },
    {
        id: 1,
        name: 'Rahul Kumar Tiwari',
        role: 'Founding Partner',
        tier: 'board',
        tagline: 'The Strategic Architect',
        bio: "With over a decade of full-stack excellence, Rahul bridges the gap between complex engineering and human-centric leadership. He has steered teams of 10+, delivering mission-critical projects across PHP, Laravel, and Flutter.",
        color: 'from-emerald-500 to-teal-500',
        accent: '#10b981',
        image: '/uploads/Rahul%20Kumar%20Tiwari.png',
        social: { github: '#', linkedin: '#', twitter: '#' },
        skills: ['Architecture', 'Leadership', 'Strategy']
    },
    {
        id: 2,
        name: 'Amardeep',
        role: 'Full-Stack Lead',
        tier: 'board',
        tagline: 'The Master Builder',
        bio: "A polyglot engineer with mastery from MySQL to React Native. Amardeep crafts digital ecosystems. His expertise in cloud architecture ensures SubEx stands on an unshakeable foundation.",
        color: 'from-violet-500 to-indigo-500',
        accent: '#8b5cf6',
        image: '/uploads/Amardeep_professional_photo.png',
        social: { github: '#', linkedin: '#' },
        skills: ['Full-Stack', 'Cloud', 'Performance']
    },
    {
        id: 7,
        name: 'Ansh Kumar Pandey',
        role: 'Frontend Lead',
        tier: 'builders',
        tagline: 'The Visual Architect',
        bio: "Bridging complex logic with pixel-perfect precision. Ansh leads our frontend initiatives to ensure world-class user experiences.",
        color: 'from-indigo-500 to-violet-500',
        accent: '#4f46e5',
        image: '/uploads/Ansh%20Kumar%20Pandey.jpg',
        social: { github: '#', linkedin: '#' },
        skills: ['React', 'UX/UI', 'Design Systems']
    },
    {
        id: 4,
        name: 'Anand Nath Thakur',
        role: 'Researcher',
        tier: 'builders',
        tagline: 'The Knowledge Seeker',
        bio: 'Pushing browser boundaries and investigating emerging technologies. Anand ensures SubEx stays at the cutting edge of what is possible.',
        color: 'from-sky-500 to-blue-500',
        accent: '#0ea5e9',
        image: '/uploads/Anand%20Nath%20Thakur.jpeg',
        social: { github: '#', linkedin: '#' },
        skills: ['R&D', 'New Tech', 'Prototypes']
    },
    {
        id: 8,
        name: 'Smarth Gupta',
        role: 'Backend Lead',
        tier: 'builders',
        tagline: 'The Architecture Catalyst',
        bio: "Bridging the gap between design vision and technical feasibility. Smarth fosters our vibrant engineering culture and scales our core services.",
        color: 'from-orange-500 to-red-500',
        accent: '#ea580c',
        image: '/uploads/Smarth%20Gupta.jpeg',
        social: { github: '#', linkedin: '#', twitter: '#' },
        skills: ['Node.js', 'Scaling', 'API Design']
    },
    {
        id: 5,
        name: 'Ali Vaqar',
        role: 'Backend',
        tier: 'builders',
        tagline: 'The System Guard',
        bio: "Scaling SubEx globally by building robust and invisible systems handling millions of requests with military-grade security.",
        color: 'from-rose-500 to-pink-500',
        accent: '#f43f5e',
        image: '/uploads/Ali%20Vaqar.jpeg',
        social: { linkedin: '#', twitter: '#' },
        skills: ['Infra', 'Security', 'Database']
    },
    {
        id: 6,
        name: 'Dipesh Negi',
        role: 'Frontend',
        tier: 'builders',
        tagline: 'The UI Craftsman',
        bio: "Translating user needs into visionary roadmaps and fluid interfaces. Dipesh filters noise to focus on undeniable visual value.",
        color: 'from-cyan-500 to-blue-500',
        accent: '#06b6d4',
        image: '/uploads/Dipesh%20Negi.jpeg',
        social: { linkedin: '#', twitter: '#' },
        skills: ['CSS/WebGL', 'Motion', 'UX']
    },
];

const PROCESS = [
    { title: 'Precision', desc: 'Architecting systems that scale.', icon: Cpu, color: 'emerald' },
    { title: 'Speed', desc: 'Rapid CI/CD workflows.', icon: Rocket, color: 'blue' },
    { title: 'Security', desc: 'Encrypted by default.', icon: Shield, color: 'violet' },
    { title: 'Zero Latency', desc: 'Optimized byte-level perf.', icon: FastForward, color: 'rose' }
];

const MemberCard = ({ member, isDetailed = false }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`group relative bg-card/40 dark:bg-zinc-900/40 border border-border dark:border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-emerald-500/30 ${isDetailed ? 'p-8 pb-12' : 'p-6'}`}
        >
            <div className={`relative aspect-square rounded-2xl overflow-hidden mb-6 bg-muted ${isDetailed ? 'md:aspect-[4/3]' : ''}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-10 group-hover:opacity-30 transition-opacity`} />
                <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />

                <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-background/40 backdrop-blur-md border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={14} className="text-foreground" />
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <p className="text-emerald-600 dark:text-emerald-500 font-mono text-[9px] uppercase tracking-[0.3em] mb-1">{member.role}</p>
                    <h3 className={`font-black uppercase italic tracking-tighter ${isDetailed ? 'text-3xl' : 'text-xl'}`}>{member.name}</h3>
                </div>

                {isDetailed && (
                    <p className="text-muted-foreground text-sm leading-relaxed font-light">{member.bio}</p>
                )}

                <div className="flex flex-wrap gap-2">
                    {member.skills.map((s, idx) => (
                        <span key={idx} className="px-2 py-1 rounded bg-muted text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                            {s}
                        </span>
                    ))}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-border">
                    <div className="flex gap-3">
                        {Object.entries(member.social).map(([p, l]) => (
                            <a key={p} href={l} className="text-muted-foreground hover:text-emerald-500 transition-colors">
                                {p === 'github' ? <Github size={14} /> : p === 'linkedin' ? <Linkedin size={14} /> : <Twitter size={14} />}
                            </a>
                        ))}
                    </div>
                    <button className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        View Profile <ChevronRight size={10} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const TeamPage = () => {
    const mainRef = useRef(null);
    const robotRef = useRef(null);
    const cursorRef = useRef(null);

    useEffect(() => {
        const moveCursor = (e) => {
            gsap.to(cursorRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out'
            });
        };
        window.addEventListener('mousemove', moveCursor);

        // --- Animations ---
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.from('.hero-content > *', { y: 60, opacity: 0, stagger: 0.1, duration: 1.2 })
            .from('.hero-robot', { scale: 0.9, opacity: 0, duration: 1.5 }, '-=0.8');

        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    const board = TEAM.filter(m => m.tier === 'board');
    const builders = TEAM.filter(m => m.tier === 'builders');

    return (
        <div ref={mainRef} className="bg-background text-foreground min-h-screen selection:bg-emerald-500/30 font-sans overflow-x-hidden">
            <Header />

            <div ref={cursorRef} className="fixed w-4 h-4 rounded-full bg-emerald-500/40 pointer-events-none z-[999] blur-sm -translate-x-1/2 -translate-y-1/2 hidden md:block" />

            {/* ─── Hero: The Command Center ─── */}
            <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] bg-emerald-500/[0.03] blur-[150px] rounded-full" />
                    <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(to_right,#88888805_1px,transparent_1px),linear-gradient(to_bottom,#88888805_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="hero-content space-y-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono uppercase tracking-[0.3em]">
                            <Terminal size={12} />
                            SubEx Executive Cluster
                        </div>

                        <h1 className="text-[9vw] lg:text-[7vw] font-black leading-[0.85] tracking-tighter uppercase italic">
                            The <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 dark:to-white">Builders</span> <br />
                            Collective.
                        </h1>

                        <p className="max-w-lg text-muted-foreground text-lg font-light leading-relaxed">
                            A high-trust network of architects, growth engineers, and product philosophers building the ultimate financial operating system.
                        </p>

                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-3 p-4 bg-card/50 rounded-2xl border border-border">
                                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-500">
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Reach</p>
                                    <p className="text-xl font-black italic">40+ COUNTRIES</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-card/50 rounded-2xl border border-border">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-500">
                                    <Command size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Efficiency</p>
                                    <p className="text-xl font-black italic">99.9% UPTIME</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hero-robot relative flex justify-center">
                        <div className="relative p-12 bg-card/30 backdrop-blur-3xl rounded-[3rem] border border-border shadow-2xl">
                            <AuthRobot ref={robotRef} size={300} />
                            <div className="absolute -bottom-6 -right-6 p-6 bg-background border border-border rounded-3xl shadow-2xl space-y-2">
                                <p className="text-emerald-600 dark:text-emerald-500 text-[10px] font-mono uppercase">Protocol: Active</p>
                                <p className="text-xs text-muted-foreground">"Meet the minds behind the machine."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── The Board: Strategic Tier ─── */}
            <section className="py-32 relative bg-background dark:bg-[#060606]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
                        <div className="space-y-4">
                            <span className="text-emerald-600 dark:text-emerald-500 text-[10px] font-mono tracking-[0.5em] uppercase">Phase 01</span>
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">The Executive <br /> Board.</h2>
                        </div>
                        <p className="max-w-md text-muted-foreground text-sm font-light leading-relaxed">
                            Providing the vision, capital, and strategic architecture to scale SubEx into a global financial powerhouse.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {board.map(m => (
                            <MemberCard key={m.id} member={m} isDetailed={true} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── The Workflow: 'Work' Section ─── */}
            <section className="py-40 bg-muted/20 dark:bg-[#050505] border-y border-border overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24 space-y-4">
                        <span className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.5em]">Operational Excellence</span>
                        <h2 className="text-4xl md:text-6xl font-black uppercase italic">How We Shift Perspectives.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-border rounded-[2.5rem] overflow-hidden border border-border">
                        {PROCESS.map((p, i) => (
                            <div key={i} className="group bg-card p-12 space-y-8 hover:bg-muted/50 transition-colors duration-500 cursor-help">
                                <div className="text-muted-foreground/20 text-6xl font-black select-none group-hover:text-emerald-500 transition-colors">0{i + 1}</div>
                                <div className="space-y-4">
                                    <div className="p-3 bg-muted w-fit rounded-xl group-hover:scale-110 transition-transform">
                                        <p.icon size={24} className="text-muted-foreground group-hover:text-foreground" />
                                    </div>
                                    <h4 className="text-xl font-black uppercase italic">{p.title}</h4>
                                    <p className="text-muted-foreground text-sm font-light leading-relaxed">{p.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── The Builders: Implementation Tier ─── */}
            <section className="py-32 relative bg-background dark:bg-[#060606]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
                        <div className="space-y-4">
                            <span className="text-emerald-600 dark:text-emerald-500 text-[10px] font-mono tracking-[0.5em] uppercase">Phase 02</span>
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">The Engineering <br /> Core.</h2>
                        </div>
                        <p className="max-w-md text-muted-foreground text-sm font-light leading-relaxed">
                            Master builders, infrastructure guards, and growth architects ensuring every line of code serves our mission.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {builders.map(m => (
                            <MemberCard key={m.id} member={m} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── The Manifesto: 'Full Structure' ─── */}
            <section className="py-48 px-6 bg-background dark:bg-black relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <span className="text-emerald-600 dark:text-emerald-500 font-mono tracking-[0.5em] uppercase text-xs">Our Collective Manifesto</span>
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85]">
                        Structured <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-t from-muted-foreground to-foreground">To Perfection.</span>
                    </h2>
                    <p className="text-muted-foreground text-xl font-light leading-relaxed">
                        SubEx isn't just a platform; it's a testament to what happens when you combine radical transparency with military-grade engineering. Every member listed here is a vital node in our high-frequency network.
                        <br /><br />
                        We don't settle for "good enough." We only ship excellence.
                    </p>
                    <div className="flex justify-center gap-12 pt-8">
                        <div className="text-left">
                            <p className="text-4xl font-black italic">100%</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">COMMITMENT</p>
                        </div>
                        <div className="text-left border-l border-border pl-12">
                            <p className="text-4xl font-black italic">60y+</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">XP COMBINED</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Final CTA ─── */}
            <section className="py-64 text-center relative overflow-hidden bg-muted/20 dark:bg-zinc-950">
                <div className="absolute inset-0 bg-grid-zinc-900/[0.02] dark:bg-grid-white/[0.02]" />
                <div className="relative z-10 space-y-16">
                    <h2 className="text-[12vw] font-black uppercase italic tracking-tighter leading-none">
                        Deploy <br />
                        With <span className="text-emerald-600 dark:text-emerald-500">Us.</span>
                    </h2>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <Link to="/careers" className="px-16 py-8 bg-foreground text-background font-black uppercase tracking-widest text-xs hover:bg-emerald-500 hover:text-white transition-all duration-500 group relative overflow-hidden">
                            <span className="relative z-10">Join The Cluster</span>
                            <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </Link>
                        <Link to="/contact" className="px-16 py-8 border border-border font-black uppercase tracking-widest text-xs hover:bg-muted transition-all">
                            Partner Collaboration
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default TeamPage;
