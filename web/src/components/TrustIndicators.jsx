import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, DollarSign } from 'lucide-react';

const indicators = [
  { icon: Shield, title: 'Private by Design' },
  { icon: Lock, title: 'Encrypted Transactions' },
  { icon: Eye, title: 'Zero Identity Exposure' },
  { icon: DollarSign, title: 'No Hidden Fees' },
];

const TrustIndicators = () => (
  <section className="py-8 bg-zinc-50 dark:bg-black border-y border-zinc-200 dark:border-zinc-900 transition-colors duration-300">
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 divide-x divide-zinc-200/0 lg:divide-zinc-200 dark:divide-zinc-900/0 dark:lg:divide-zinc-900"
      >
        {indicators.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-3 p-4 group"
            >
              <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center flex-shrink-0 border border-zinc-200 dark:border-zinc-800 group-hover:border-emerald-500/50 transition-colors shadow-sm dark:shadow-none">
                <Icon className="text-zinc-500 group-hover:text-emerald-500 transition-colors" size={18} />
              </div>
              <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{item.title}</h3>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  </section>
);

export default TrustIndicators;
