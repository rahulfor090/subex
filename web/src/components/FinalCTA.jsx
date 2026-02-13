import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from './ui/button';

const FinalCTA = () => (
  <section className="py-24 sm:py-32 bg-white dark:bg-black relative overflow-hidden transition-colors duration-300">
    {/* Background Glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />

    <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      {/* Badge */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white mb-8 shadow-lg backdrop-blur-md"
      >
        <span className="relative flex h-2 w-2 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-sm font-medium">Start your free trial today</span>
      </motion.div>

      {/* Headline */}
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white mb-8 leading-tight tracking-tight"
      >
        Take control of your <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-500">
          digital life today.
        </span>
      </motion.h2>

      {/* Subtext */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed"
      >
        Start free. Stay secure. Stay anonymous.
        <br />
        Join 10,000+ users who never miss a renewal.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
      >
        <Button
          size="lg"
          className="text-base px-10 py-7 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all w-full sm:w-auto"
        >
          Start free trial
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
        </Button>
        <p className="text-zinc-500 dark:text-zinc-500 text-sm font-medium">
          No credit card required
        </p>
      </motion.div>

      {/* Social Proof */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 border-t border-zinc-200 dark:border-zinc-900"
      >
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {[
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
              'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80',
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80',
            ].map((src, i) => (
              <img key={i} src={src} alt="" className="w-10 h-10 rounded-full border-2 border-white dark:border-black object-cover" loading="lazy" />
            ))}
          </div>
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">10,000+ happy users</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">4.9/5 rating</span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default FinalCTA;
