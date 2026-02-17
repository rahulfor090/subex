import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, DollarSign, Repeat, BarChart3, UserCheck, TrendingDown } from 'lucide-react';

const benefits = [
  { icon: AlertCircle, title: 'Avoid Surprise Charges', description: 'Stay ahead with proactive alerts before any renewal hits your account.', color: 'text-red-500', bg: 'bg-red-500/10' },
  { icon: DollarSign, title: 'Save Money Every Month', description: 'Cut unnecessary subscriptions and keep more money in your pocket.', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: Repeat, title: 'Monetize Unused', description: 'Turn unused extras into cash through our secure marketplace.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: BarChart3, title: 'Stay Organized', description: 'All subscriptions visible in one unified, beautiful dashboard.', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { icon: UserCheck, title: 'Total Privacy Control', description: 'Your identity stays protected with zero-knowledge encryption.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: TrendingDown, title: 'Reduce Bloat', description: "Smart insights help you identify and trim what you don't use.", color: 'text-pink-500', bg: 'bg-pink-500/10' },
];

const BenefitsCard = ({ benefit, index }) => {
  const Icon = benefit.icon;
  return (
    <div
      className="relative group w-[300px] sm:w-[380px] h-[160px] flex-shrink-0 bg-white dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-[1.5rem] p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all duration-500 flex items-start gap-5 overflow-hidden shadow-sm hover:shadow-md cursor-pointer"
    >
      {/* Decorative Blob */}
      <div className={`absolute top-0 right-0 w-24 h-24 ${benefit.bg} rounded-bl-[60px] opacity-30 group-hover:scale-150 transition-transform duration-700 ease-in-out`} />

      {/* Icon */}
      <div className={`relative z-10 w-12 h-12 flex-shrink-0 rounded-xl ${benefit.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
        <Icon className={`${benefit.color}`} size={24} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors pr-8">
            {benefit.title}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed line-clamp-2">
            {benefit.description}
          </p>
        </div>

        <div className="flex items-center justify-end text-xs font-medium text-zinc-400 mt-auto">
          0{index + 1}
        </div>
      </div>
    </div>
  );
};

const Benefits = () => {
  // Triple the items to ensure seamless loop on wide screens
  const duplicatedBenefits = [...benefits, ...benefits, ...benefits];

  return (
    <section className="relative py-20 bg-zinc-50 dark:bg-black transition-colors duration-300 overflow-hidden">

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full mb-12 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Platform
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight"
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">Subscription</span> OS
          </motion.h2>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            Everything you need to master your digital life, running continuously in the background.
          </p>
        </div>
      </div>

      {/* Infinite Scroll Rows */}
      <div className="relative w-full z-10 flex flex-col gap-8">

        {/* Row 1 - Leftward Scroll (Right to Left) */}
        <div className="relative flex overflow-hidden mask-fade-sides">
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-zinc-50 dark:from-black to-transparent z-20" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-zinc-50 dark:from-black to-transparent z-20" />

          <motion.div
            className="flex gap-6 px-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 40,
              ease: "linear",
              repeat: Infinity,
            }}
            style={{ width: "max-content" }}
          >
            {duplicatedBenefits.map((benefit, index) => (
              <BenefitsCard key={`row1-${index}`} benefit={benefit} index={index % benefits.length} />
            ))}
          </motion.div>
        </div>

        {/* Row 2 - Rightward Scroll (Left to Right) */}
        <div className="relative flex overflow-hidden mask-fade-sides">
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-zinc-50 dark:from-black to-transparent z-20" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-zinc-50 dark:from-black to-transparent z-20" />

          <motion.div
            className="flex gap-6 px-6"
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              duration: 40,
              ease: "linear",
              repeat: Infinity,
            }}
            style={{ width: "max-content" }}
          >
            {duplicatedBenefits.map((benefit, index) => (
              <BenefitsCard key={`row2-${index}`} benefit={benefit} index={index % benefits.length} />
            ))}
          </motion.div>
        </div>

      </div>

    </section>
  );
};

export default Benefits;
