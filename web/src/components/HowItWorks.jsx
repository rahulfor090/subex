import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Bell, ShieldCheck, ArrowRight } from 'lucide-react';

const steps = [
  { icon: Plus, title: 'Add Your Subscriptions', description: 'Track Netflix, Spotify, SaaS tools, and all your recurring payments in one secure place.', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80', badge: 'Quick Setup' },
  { icon: Bell, title: 'Get Smart Email Alerts', description: 'Receive timely reminders days before renewal so you never face unexpected charges again.', image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=800&q=80', badge: 'AI-Powered' },
  { icon: ShieldCheck, title: 'Trade Securely & Anonymously', description: 'Buy or sell vouchers without revealing your identity through our encrypted marketplace.', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80', badge: 'Zero Knowledge' },
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
                  <a href="#" className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:text-emerald-500 dark:hover:text-emerald-300 group-hover:underline decoration-emerald-500/30 underline-offset-4 transition-all">
                    Learn more
                    <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
                <div className={isEven ? 'lg:order-2' : 'lg:order-1'}>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 group-hover:border-zinc-300 dark:group-hover:border-zinc-700 transition-colors duration-300 h-64 sm:h-72 md:h-80">
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-black/80 to-transparent z-10" />
                    <img src={step.image} alt={step.title} className="w-full h-full object-cover opacity-90 dark:opacity-60 group-hover:opacity-100 dark:group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" loading="lazy" />
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
