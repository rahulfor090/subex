import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Bell, ShieldCheck, Check, Mail, Lock, RefreshCw, CreditCard, MousePointer2 } from 'lucide-react';

// --- Realistic UI Components ---

// Step 1: Real Dashboard Simulation
const StepOneAnimation = () => (
  <div className="relative w-full h-full bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center overflow-hidden font-sans transition-colors duration-500">
    {/* Dashboard Window */}
    <div className="relative w-72 h-80 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden transition-colors duration-500">
      {/* Window Header */}
      <div className="h-8 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-3 gap-1.5 transition-colors duration-500">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
        <div className="ml-auto text-[10px] text-zinc-500 font-medium tracking-wide">dashboard.subex.app</div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex justify-between items-center mb-1">
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">My Subscriptions</div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-5 h-5 rounded bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center"
          >
            <Plus size={12} className="text-emerald-600 dark:text-emerald-500" />
          </motion.div>
        </div>

        {/* Subscription Item 1 (Netflix) */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 transition-colors duration-500"
        >
          <div className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center text-white font-bold text-xs tracking-tighter">N</div>
          <div className="flex-1">
            <div className="text-xs font-medium text-zinc-900 dark:text-zinc-200">Netflix Standard</div>
            <div className="text-[10px] text-zinc-500">$15.49 / mo</div>
          </div>
          <div className="w-4 h-4 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
            <Check size={10} className="text-emerald-600 dark:text-emerald-500" />
          </div>
        </motion.div>

        {/* Subscription Item 2 (Spotify) */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
          className="flex items-center gap-3 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 transition-colors duration-500"
        >
          <div className="w-8 h-8 rounded bg-[#1DB954] flex items-center justify-center text-black font-bold text-xs">
            <span className="scale-75"><RefreshCw size={16} /></span>
          </div>
          <div className="flex-1">
            <div className="text-xs font-medium text-zinc-900 dark:text-zinc-200">Spotify Premium</div>
            <div className="text-[10px] text-zinc-500">$10.99 / mo</div>
          </div>
          <div className="w-4 h-4 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
            <Check size={10} className="text-emerald-600 dark:text-emerald-500" />
          </div>
        </motion.div>

        {/* Adding Animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.3 }}
          className="flex items-center gap-3 p-2 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 opacity-50"
        >
          <div className="w-8 h-8 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          <div className="space-y-1 flex-1">
            <div className="h-2 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-2 w-10 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          </div>
        </motion.div>
      </div>

      {/* Simulated Cursor */}
      <motion.div
        animate={{ x: [100, 200, 160, 240], y: [200, 150, 180, 260] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute z-20 pointer-events-none"
      >
        <MousePointer2 size={20} className="text-zinc-900 dark:text-white fill-white dark:fill-black drop-shadow-md" />
      </motion.div>
    </div>
  </div>
);

// Step 2: Realistic Notification
const StepTwoAnimation = () => (
  <div className="relative w-full h-full bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center font-sans overflow-hidden transition-colors duration-500">
    {/* Background Grid */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />

    <div className="relative w-64 h-[400px] bg-white dark:bg-black rounded-[2rem] border-4 border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col items-center pt-8 transition-colors duration-500">
      {/* Dynamic Notch */}
      <div className="absolute top-0 w-32 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-b-xl z-20" />

      {/* Time */}
      <div className="w-full px-6 flex justify-between items-center text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mb-4">
        <span>9:41</span>
        <div className="flex gap-1">
          <div className="w-3 h-2 bg-zinc-800 dark:bg-zinc-600 rounded-[1px]" />
          <div className="w-3 h-2 bg-zinc-800 dark:bg-zinc-600 rounded-[1px]" />
          <div className="w-4 h-2 bg-zinc-400 rounded-[1px]" />
        </div>
      </div>

      {/* Notification Banner */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4, repeat: Infinity, repeatDelay: 5 }}
        className="w-[90%] bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-2xl p-3 border border-zinc-200 dark:border-zinc-800 shadow-xl relative z-10"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-[8px]">S</span>
            </div>
            <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300">SubEx • Now</span>
          </div>
        </div>
        <div className="text-xs font-medium text-zinc-900 dark:text-white mb-0.5">Renewal Warning</div>
        <div className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-tight">
          Your <span className="text-zinc-900 dark:text-white font-medium">Netflix Standard</span> subscription will renew for <span className="text-zinc-900 dark:text-white font-medium">$15.49</span> tomorrow.
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 py-1.5 rounded-lg text-center text-[10px] font-medium text-zinc-600 dark:text-zinc-300 cursor-pointer transition-colors">
            Cancel
          </div>
          <div className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 py-1.5 rounded-lg text-center text-[10px] font-medium text-emerald-600 dark:text-emerald-500 cursor-pointer transition-colors">
            Keep
          </div>
        </div>
      </motion.div>

      {/* Email Simulation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="w-[90%] mt-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl p-3 border border-zinc-200 dark:border-zinc-800 opacity-60 scale-95"
      >
        <div className="flex items-center gap-2 mb-2">
          <Mail size={12} className="text-zinc-500" />
          <span className="text-[10px] text-zinc-500">Weekly Summary</span>
        </div>
        <div className="h-1.5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded mb-1" />
        <div className="h-1.5 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
      </motion.div>
    </div>
  </div>
);

// Step 3: Realistic Transaction/Marketplace
const StepThreeAnimation = () => (
  <div className="relative w-full h-full bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center font-sans overflow-hidden transition-colors duration-500">

    <div className="relative w-72 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-4 transition-colors duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Transfer Subscription</div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <Lock size={8} className="text-emerald-600 dark:text-emerald-500" />
          <span className="text-[8px] font-medium text-emerald-600 dark:text-emerald-500">SECURE</span>
        </div>
      </div>

      {/* Card Details */}
      <div className="space-y-3">
        {/* Product Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
            <CreditCard size={18} className="text-zinc-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-900 dark:text-white">Equinox Gym Membership</div>
            <div className="text-[10px] text-zinc-500">3 Months Remaining</div>
          </div>
        </div>

        {/* Transfer Status Line */}
        <div className="relative py-4">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2" />
          <motion.div
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
            className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2"
          />

          <div className="relative flex justify-between text-[10px] items-center z-10">
            <div className="bg-white dark:bg-zinc-900 px-1 text-zinc-400">Listed</div>
            <motion.div
              animate={{ color: ["#71717a", "#10b981", "#71717a"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="bg-white dark:bg-zinc-900 px-1"
            >
              Encrypting...
            </motion.div>
            <div className="bg-white dark:bg-zinc-900 px-1 text-zinc-400">Sold</div>
          </div>
        </div>

        {/* Amount */}
        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-lg p-3 border border-zinc-200 dark:border-zinc-800 flex justify-between items-center transition-colors duration-500">
          <div className="text-[10px] text-zinc-500">Estimated Value</div>
          <div className="text-sm font-bold text-zinc-900 dark:text-white">$240.00</div>
        </div>
      </div>

      {/* Shield Overlay Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: [0, 1, 0], scale: [0.9, 1, 1.1] }}
        transition={{ delay: 1.5, duration: 1.5, repeat: Infinity, repeatDelay: 3.5 }}
        className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-zinc-900/60 backdrop-blur-[1px] rounded-xl z-20"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <ShieldCheck size={32} className="text-emerald-600 dark:text-emerald-500" />
        </div>
      </motion.div>

    </div>
  </div>
);

const steps = [
  { icon: Plus, title: 'Add Your Subscriptions', description: 'Track Netflix, Spotify, SaaS tools, and all your recurring payments in one secure place.', animation: StepOneAnimation, badge: 'Quick Setup' },
  { icon: Bell, title: 'Get Smart Email Alerts', description: 'Receive timely reminders days before renewal so you never face unexpected charges again.', animation: StepTwoAnimation, badge: 'AI-Powered' },
  { icon: ShieldCheck, title: 'Trade Securely & Anonymously', description: 'Have a subscription you no longer need? Sell the remaining time securely on our encrypted marketplace.', animation: StepThreeAnimation, badge: 'Zero Knowledge' },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-20 bg-white dark:bg-black overflow-hidden relative transition-colors duration-300">
    <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wide mb-3"
        >
          How It Works
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight"
        >
          Three steps to freedom
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
        >
          Take control of your subscriptions in minutes
        </motion.p>
      </div>

      <div className="space-y-20 lg:space-y-28">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const AnimationComponent = step.animation;
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="group"
            >
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className={`space-y-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-lg group-hover:border-emerald-500/50 transition-colors duration-300">
                      <Icon className="text-emerald-600 dark:text-emerald-500" size={26} />
                    </div>
                    <span className="text-5xl font-bold text-zinc-200 dark:text-zinc-800 select-none group-hover:text-zinc-300 dark:group-hover:text-zinc-700 transition-colors">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-xs font-semibold">{step.badge}</span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white leading-tight">{step.title}</h3>
                  <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">{step.description}</p>
                </div>

                <div className={isEven ? 'lg:order-2' : 'lg:order-1'}>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 group-hover:border-emerald-500/30 transition-colors duration-300 h-80 sm:h-96 w-full">
                    {/* Dark gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/5 dark:from-black/20 to-transparent pointer-events-none" />

                    {/* Animation Component */}
                    <div className="absolute inset-0 z-10">
                      <AnimationComponent />
                    </div>

                    {/* Ambient Glow */}
                    <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default HowItWorks;
