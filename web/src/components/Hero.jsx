import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Spotlight } from './ui/Spotlight';
import ThreeDTiltCard from './ui/ThreeDTiltCard';
import { useTheme } from '../lib/ThemeProvider';

const Hero = () => {
  const { theme } = useTheme();

  return (
    <section className="relative min-h-screen flex items-center bg-white dark:bg-black/[0.96] antialiased bg-grid-black/[0.02] dark:bg-grid-white/[0.02] overflow-hidden pt-20 transition-colors duration-300">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20 hidden dark:block"
        fill="white"
      />
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20 block dark:hidden"
        fill="#10b981" // emerald-500
      />

      <div className="absolute inset-0 bg-white/90 dark:bg-black/[0.96] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none transition-colors duration-300" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16">

        {/* Text Content */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm font-medium gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Trusted by 10,000+ smart savers
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight"
          >
            Master your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-500">
              digital life.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
          >
            Stop overpaying for forgotten subscriptions. Track expenses, discover deals, and secure your digital footprint—all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm">
              View Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 pt-8 border-t border-zinc-200 dark:border-zinc-900"
          >
            <div className="text-center lg:text-left">
              <div className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-1">$2.4M+</div>
              <div className="text-sm text-zinc-500">User Savings</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-1">50K+</div>
              <div className="text-sm text-zinc-500">Active Trackers</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-1">100%</div>
              <div className="text-sm text-zinc-500">Secure</div>
            </div>
          </motion.div>
        </div>

        {/* Visual Content - Keeps dark aesthetics for dashboard mockup as it looks better */}
        <div className="flex-1 w-full max-w-[600px] lg:max-w-none relative perspective-1000">
          <ThreeDTiltCard className="w-full">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl">
              {/* Mock Browser/Dashboard UI */}
              <div className="h-8 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
              </div>

              <div className="relative aspect-[4/3] bg-zinc-950 p-6 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-grid-white/[0.03]" />
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Dashboard Content Mockup */}
                <div className="relative grid gap-4">
                  {/* Stat Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 p-4 rounded-xl">
                      <div className="text-xs text-zinc-500 mb-1">Monthly Cost</div>
                      <div className="text-xl font-bold text-white">$142.50</div>
                      <div className="text-xs text-emerald-500 mt-1 flex items-center">
                        <TrendingUp size={12} className="mr-1" /> -12% vs last month
                      </div>
                    </div>
                    <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 p-4 rounded-xl">
                      <div className="text-xs text-zinc-500 mb-1">Upcoming</div>
                      <div className="text-xl font-bold text-white">4 Renewals</div>
                      <div className="text-xs text-zinc-400 mt-1">Next: Netflix (Tomorrow)</div>
                    </div>
                  </div>

                  {/* Main List */}
                  <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-xl overflow-hidden">
                    {[
                      { name: 'Netflix Premium', price: '$19.99', status: 'Active', icon: 'N', color: 'bg-red-600' },
                      { name: 'Spotify Duo', price: '$14.99', status: 'Active', icon: 'S', color: 'bg-green-500' },
                      { name: 'Adobe Cloud', price: '$54.99', status: 'Expiring', icon: 'A', color: 'bg-blue-600' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center text-white font-bold text-xs`}>
                            {item.icon}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{item.name}</div>
                            <div className="text-xs text-zinc-500">Renews monthly</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-white">{item.price}</div>
                          <div className={`text-xs ${item.status === 'Expiring' ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {item.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Notifications */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 top-20 bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl max-w-[200px]"
              >
                <div className="flex gap-3 items-start">
                  <div className="bg-emerald-500/20 p-1.5 rounded-md">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Subscription Cancelled</div>
                    <div className="text-[10px] text-zinc-400">You saved $12.99/mo</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </ThreeDTiltCard>
        </div>
      </div>
    </section>
  );
};

export default Hero;
