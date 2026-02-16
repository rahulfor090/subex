import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2, TrendingUp, ShieldCheck, Zap, Lock } from 'lucide-react';
import { Button } from './ui/button';

// --- Slider Data ---
const slides = [
  {
    id: 0,
    badge: "The #1 Subscription Manager AI",
    badgeColor: "bg-emerald-500",
    titlePrefix: "Master Your",
    title: "Digital Life.",
    gradient: "from-emerald-500 via-cyan-500 to-emerald-500",
    description: "Stop overpaying. Track, manage, and optimize every subscription in one beautiful, AI-powered dashboard.",
    dashboardContent: "savings"
  },
  {
    id: 1,
    badge: "Real-time Spending Insights",
    badgeColor: "bg-violet-500",
    titlePrefix: "Optimize Your",
    title: "Monthly Budget.",
    gradient: "from-violet-500 via-fuchsia-500 to-violet-500",
    description: "Our AI analyzes your spending habits to find hidden leaks. Save an average of 15% in your first month automatically.",
    dashboardContent: "analytics"
  },
  {
    id: 2,
    badge: "Bank-Grade Encryption",
    badgeColor: "bg-blue-500",
    titlePrefix: "Secure Your",
    title: "Financial Data.",
    gradient: "from-blue-500 via-indigo-500 to-blue-500",
    description: "Your privacy is our priority. We use AES-256 encryption and never sell your personal data to third parties.",
    dashboardContent: "security"
  }
];

// --- Components for Visual Flair ---

const FloatingIcon = ({ icon, delay, x, y, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      scale: [0.5, 1, 1, 0.5],
      x: [x, x + 20, x],
      y: [y, y - 20, y]
    }}
    transition={{
      duration: 5,
      delay: delay,
      repeat: Infinity,
      repeatDelay: 2
    }}
    className={`absolute w-12 h-12 rounded-2xl ${color} backdrop-blur-md border border-white/20 dark:border-white/10 flex items-center justify-center shadow-lg z-0 pointer-events-none`}
  >
    <div className="text-2xl">{icon}</div>
  </motion.div>
);

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const { scrollY } = useScroll();

  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 10;
    const y = (clientY / innerHeight - 0.5) * 10;
    setMousePosition({ x, y });
  };

  const activeSlide = slides[currentSlide];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[110vh] flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 overflow-hidden pt-32 pb-20 perspective-1000 transition-colors duration-500"
    >
      {/* --- Dynamic Background --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated Gradient Mesh */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[150px] animate-blob animation-delay-4000" />

        {/* Grid Texture */}
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center">

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md mb-8 hover:bg-white/80 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer group shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeSlide.badgeColor}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${activeSlide.badgeColor}`}></span>
              </span>
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                {activeSlide.badge}
              </span>
              <ArrowRight size={14} className="text-zinc-400 dark:text-zinc-500 group-hover:text-emerald-500 transition-colors group-hover:translate-x-1" />
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-zinc-900 dark:text-white mb-6 relative z-10">
              <span className="block bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
                {activeSlide.titlePrefix}
              </span>
              <div className="relative inline-block pb-2">
                <span className={`relative z-10 bg-clip-text text-transparent bg-gradient-to-r ${activeSlide.gradient} animate-gradient-x bg-[length:200%_auto]`}>
                  {activeSlide.title}
                </span>
                {/* Glow behind text */}
                <div className={`absolute inset-0 blur-3xl -z-10 opacity-30 ${activeSlide.id === 0 ? 'bg-emerald-500' : activeSlide.id === 1 ? 'bg-violet-500' : 'bg-blue-500'}`} />
              </div>
            </h1>

            {/* Subhead */}
            <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              {activeSlide.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Floating Icons Background Layer */}
        <div className="absolute inset-0 pointer-events-none max-w-5xl mx-auto z-0 opacity-40 dark:opacity-100">
          <FloatingIcon icon="🍿" delay={0.5} x={-400} y={100} color="bg-red-500/10" />
          <FloatingIcon icon="🎵" delay={1.5} x={400} y={-50} color="bg-green-500/10" />
          <FloatingIcon icon="💼" delay={2.5} x={-300} y={-150} color="bg-blue-500/10" />
          <FloatingIcon icon="☁️" delay={3.5} x={350} y={150} color="bg-purple-500/10" />
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 relative z-20 mb-12"
        >
          <Button className="h-14 px-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
            Get Started Free
          </Button>
          <Button variant="outline" className="h-14 px-8 rounded-full border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white text-lg font-medium backdrop-blur-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 bg-transparent">
            <Play size={18} fill="currentColor" /> Watch the Film
          </Button>
        </motion.div>

        {/* Slider Indicators */}
        <div className="flex gap-3 mb-12 z-20">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === i ? `w-8 ${s.badgeColor}` : 'w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* --- Hero Visual (Floating Dashboard) --- */}
        <motion.div
          style={{ y: y1, rotateX: mousePosition.y, rotateY: mousePosition.x }}
          className="relative w-full max-w-5xl mx-auto perspective-1000"
          initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
          animate={{ opacity: 1, scale: 1, rotateX: 10 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="relative rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden group transition-colors duration-500">

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20" />

            {/* Dashboard Internal Mockup */}
            <div className="relative z-10 p-2 md:p-4 bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-xl aspect-[16/9] md:aspect-[21/9] flex flex-col">
              {/* Fake UI Header */}
              <div className="h-12 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                </div>
                <div className="hidden md:flex bg-white dark:bg-zinc-900 rounded-full px-4 py-1.5 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 font-mono">
                  subex.app/dashboard
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              </div>

              {/* Main Dashboard Layout */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.dashboardContent}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden"
                >

                  {/* Left Sidebar */}
                  <div className="hidden md:block col-span-2 space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-8 w-full bg-zinc-200 dark:bg-zinc-900 rounded-lg" style={{ opacity: 1 - i * 0.15 }} />
                    ))}
                  </div>

                  {/* Center Content - Dynamic based on slide */}
                  <div className="col-span-12 md:col-span-7 flex flex-col gap-6">

                    {/* Slide 1: Savings/General */}
                    {activeSlide.id === 0 && (
                      <>
                        <div className="h-48 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 relative overflow-hidden">
                          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-500/10 to-transparent" />
                          <TrendingUp className="text-emerald-500 mb-2" />
                          <div className="text-3xl font-bold text-zinc-900 dark:text-white">$1,240.50</div>
                          <div className="text-sm text-zinc-500">Total Monthly Spend</div>
                          <svg className="absolute bottom-0 left-0 w-full h-24 stroke-emerald-500 stroke-2 fill-none" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0 20 Q 20 5, 40 15 T 70 5 T 100 15" />
                          </svg>
                        </div>
                        <div className="flex-1 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 space-y-3">
                          {[{ n: 'Netflix', p: '$15.99' }, { n: 'Spotify', p: '$9.99' }, { n: 'Figma', p: '$12.00' }].map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-default">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800" />
                                <div className="text-sm font-medium text-zinc-900 dark:text-white">{item.n}</div>
                              </div>
                              <div className="text-sm text-zinc-500">{item.p}</div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Slide 2: Analytics */}
                    {activeSlide.id === 1 && (
                      <div className="h-full rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 flex items-end gap-2">
                        {[40, 70, 50, 90, 60, 80, 40, 60].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: i * 0.1 }}
                            className="flex-1 bg-violet-500/20 rounded-t-lg relative group"
                          >
                            <div className="absolute bottom-0 left-0 w-full bg-violet-500 rounded-t-lg transition-all duration-500" style={{ height: '100%' }} />
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Slide 3: Security */}
                    {activeSlide.id === 2 && (
                      <div className="h-full rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center text-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center mb-4"
                        >
                          <Lock className="w-12 h-12 text-blue-500" />
                        </motion.div>
                        <div className="text-xl font-bold text-zinc-900 dark:text-white">AES-256 Encrypted</div>
                        <div className="text-sm text-zinc-500">Your data is completely secure.</div>
                      </div>
                    )}

                  </div>

                  {/* Right Panel - Stats */}
                  <div className="hidden md:flex col-span-3 flex-col gap-4">
                    <div className={`flex-1 rounded-2xl bg-gradient-to-br p-6 text-white relative overflow-hidden ${activeSlide.id === 0 ? 'from-emerald-600 to-teal-600' : activeSlide.id === 1 ? 'from-violet-600 to-purple-600' : 'from-blue-600 to-indigo-600'}`}>
                      <Zap className="mb-4" />
                      <div className="text-2xl font-bold">3 Alerts</div>
                      <div className="text-sm opacity-80">Requires Attention</div>
                    </div>
                    <div className="h-32 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6">
                      <ShieldCheck className={`${activeSlide.id === 0 ? 'text-emerald-500' : activeSlide.id === 1 ? 'text-violet-500' : 'text-blue-500'} mb-2`} />
                      <div className="font-bold text-zinc-900 dark:text-white">Score: 98</div>
                      <div className="text-xs text-zinc-500">Security Rating</div>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Floating Parallax Elements jumping out of dashboard */}
          <motion.div
            style={{ y: y2 }}
            className="absolute -right-12 top-20 bg-white/80 dark:bg-black/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-xl z-30 hidden lg:block"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activeSlide.id === 0 ? 'bg-emerald-500/20' : activeSlide.id === 1 ? 'bg-violet-500/20' : 'bg-blue-500/20'}`}>
                <CheckCircle2 size={24} className={`${activeSlide.id === 0 ? 'text-emerald-500' : activeSlide.id === 1 ? 'text-violet-500' : 'text-blue-500'}`} />
              </div>
              {/* ... Rest of the component */}
              <div>
                <div className="text-lg font-bold text-zinc-900 dark:text-white">Saved $420</div>
                <div className="text-sm text-zinc-500">Annual Projection</div>
              </div>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
