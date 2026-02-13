import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, DollarSign, Repeat, BarChart3, UserCheck, TrendingDown } from 'lucide-react';

const benefits = [
  { icon: AlertCircle, title: 'Avoid Surprise Charges', description: 'Stay ahead with proactive alerts before any renewal hits your account.' },
  { icon: DollarSign, title: 'Save Money Every Month', description: 'Cut unnecessary subscriptions and keep more money in your pocket.' },
  { icon: Repeat, title: 'Monetize Unused Subscriptions', description: 'Turn unused extras into cash through our secure marketplace.' },
  { icon: BarChart3, title: 'Stay Organized', description: 'All subscriptions visible in one unified, beautiful dashboard.' },
  { icon: UserCheck, title: 'Total Privacy Control', description: 'Your identity stays protected with zero-knowledge encryption.' },
  { icon: TrendingDown, title: 'Reduce Subscription Bloat', description: "Smart insights help you identify and trim what you don't use." },
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '$2.4M+', label: 'Money Saved' },
  { value: '50K+', label: 'Subscriptions' },
  { value: '100%', label: 'Privacy Protected' },
];

const Benefits = () => (
  <section className="py-24 sm:py-32 bg-white dark:bg-black relative overflow-hidden transition-colors duration-300">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
    <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center mb-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mb-3"
        >
          Benefits
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight transition-colors duration-300"
        >
          Why choose SubEx?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
        >
          Experience the benefits of smart subscription management
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <div className="group flex flex-col justify-between p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 backdrop-blur-sm hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:border-emerald-500/30 transition-all duration-300 h-full shadow-sm dark:shadow-none">
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-6 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 group-hover:border-emerald-200 dark:group-hover:border-emerald-500/30 transition-colors duration-300 shadow-inner">
                    <Icon className="text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors duration-300" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{benefit.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mt-24"
      >
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur p-10 sm:p-14 shadow-xl dark:shadow-none">
          {/* Background glow */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white text-center mb-12">Join thousands of happy users</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divider-x divide-zinc-200 dark:divide-white/5">
              {stats.map((stat, i) => (
                <div key={stat.label} className="text-center relative group cursor-default">
                  {/* Vertical divider for non-last items on desktop */}
                  {i !== stats.length - 1 && (
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-zinc-200 dark:bg-zinc-800" />
                  )}
                  <div className="text-3xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-zinc-500 font-medium uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Benefits;
