import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  ShieldCheck,
  Zap,
  CreditCard,
  ArrowUpRight
} from 'lucide-react';

// --- Feature Card Components ---

const FeatureCard = ({ children, className = "", delay = 0, image }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true, margin: "-50px" }}
    className={`group relative overflow-hidden rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all duration-500 ${className}`}
  >
    {/* Background Image with Zoom Effect */}
    <div className="absolute inset-0 z-0">
      <img
        src={image}
        alt="Feature Background"
        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 opacity-90 dark:opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-50/90 via-zinc-50/40 to-transparent dark:from-black/90 dark:via-black/60 dark:to-transparent" />
    </div>

    {children}
  </motion.div>
);

const FeatureHeader = ({ icon: Icon, title, description, badge }) => (
  <div className="relative z-10 p-6 md:p-8 flex flex-col h-full justify-end">
    <div className="mb-auto flex items-start justify-between">
      <div className="w-12 h-12 rounded-2xl bg-white/90 dark:bg-black/50 backdrop-blur-md flex items-center justify-center border border-zinc-200 dark:border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-300">
        <Icon size={24} className="text-zinc-900 dark:text-white group-hover:text-emerald-500 transition-colors" />
      </div>
      {badge && (
        <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-md text-xs font-medium text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/10 shadow-sm">
          {badge}
        </span>
      )}
    </div>

    <div className="mt-8">
      <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-2 leading-tight drop-shadow-sm">
        {title}
      </h3>
      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm md:text-base font-medium">
        {description}
      </p>
    </div>
  </div>
);

// --- Individual Cards ---

const AnalyticsCard = () => (
  <FeatureCard
    className="col-span-1 md:col-span-2 lg:col-span-2 h-[400px]"
    delay={0.1}
    image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
  >
    <FeatureHeader
      icon={BarChart3}
      title="Real-Time Analytics"
      description="Visualize your financial health with interactive charts. Track monthly burn rate and forecast future costs automatically."
      badge="Live Data"
    />
  </FeatureCard>
);

const SecurityCard = () => (
  <FeatureCard
    className="col-span-1 lg:col-span-1 h-[400px]"
    delay={0.2}
    image="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop"
  >
    <FeatureHeader
      icon={ShieldCheck}
      title="Bank-Grade Security"
      description="AES-256 encryption & zero-knowledge architecture. Your privacy is non-negotiable."
    />
  </FeatureCard>
);

const AlertsCard = () => (
  <FeatureCard
    className="col-span-1 lg:col-span-1 h-[400px]"
    delay={0.3}
    image="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=2006&auto=format&fit=crop"
  >
    <FeatureHeader
      icon={Zap}
      title="Smart Alerts"
      description="Never pay a late fee again. Get notified days before a renewal so you can cancel in time."
      badge="Instant"
    />
  </FeatureCard>
);

const MarketplaceCard = () => (
  <FeatureCard
    className="col-span-1 md:col-span-2 lg:col-span-2 h-[400px]"
    delay={0.4}
    image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
  >
    <FeatureHeader
      icon={CreditCard}
      title="P2P Marketplace"
      description="The first secure marketplace to buy and sell unused subscriptions. Recoup your costs instantly."
      badge="Beta"
    />
  </FeatureCard>
);

const Features = () => {
  return (
    <section id="features" className="py-24 sm:py-32 bg-zinc-50 dark:bg-black relative overflow-hidden transition-colors duration-500">

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 box-border">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Advanced Features
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6"
          >
            More than just a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">tracker.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed"
          >
            We've built the most comprehensive operating system for your digital finance.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          <AnalyticsCard />
          <SecurityCard />
          <AlertsCard />
          <MarketplaceCard />
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 flex justify-center">
          <button className="group flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-emerald-500 transition-colors">
            View all features <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default Features;
