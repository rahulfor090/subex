import React from 'react';
import { motion } from 'framer-motion';
import { Brain, BellRing, ShoppingBag, CreditCard, LayoutDashboard, Calendar } from 'lucide-react';

const features = [
  { icon: Brain, title: 'Smart Subscription Intelligence', description: 'AI-powered tracking that learns your patterns and optimizes your subscription portfolio.', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80', span: 'col-span-1 md:col-span-2' },
  { icon: BellRing, title: 'Auto Email Reminder System', description: 'Never miss a renewal date. Get intelligent alerts delivered straight to your inbox.', image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=800&q=80', span: 'col-span-1' },
  { icon: ShoppingBag, title: 'Anonymous Voucher Marketplace', description: 'Buy and sell subscription vouchers with complete privacy and secure transactions.', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80', span: 'col-span-1' },
  { icon: CreditCard, title: 'Encrypted Payment System', description: 'Bank-level security for all transactions with zero-knowledge architecture.', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80', span: 'col-span-1 md:col-span-2' },
  { icon: LayoutDashboard, title: 'Clean Dashboard Overview', description: 'Beautiful, intuitive interface showing all your subscriptions and spending at a glance.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', span: 'col-span-1' },
  { icon: Calendar, title: 'Spending Insights & Calendar', description: 'Visual analytics and renewal calendar help you plan and budget effectively.', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80', span: 'col-span-1' },
];

const Features = () => (
  <section id="features" className="py-24 sm:py-32 bg-zinc-50 dark:bg-black relative overflow-hidden transition-colors duration-300">
    {/* Background Pattern */}
    <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white dark:from-black to-transparent z-10 transition-colors duration-300" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="text-center mb-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-semibold text-emerald-500 uppercase tracking-widest mb-3"
        >
          Features
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight transition-colors duration-300"
        >
          Everything you need to <br className="hidden sm:block" /> master <span className="text-zinc-500 dark:text-zinc-500">your subscriptions.</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`group relative h-[320px] bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-zinc-200 dark:border-zinc-800/50 overflow-hidden hover:border-emerald-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all duration-500 shadow-sm dark:shadow-none ${feature.span}`}
            >
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

              <img
                src={feature.image}
                alt={feature.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-90 dark:opacity-60 group-hover:opacity-100 dark:group-hover:opacity-80"
              />

              <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                <div className="w-12 h-12 rounded-xl bg-white/90 dark:bg-black/50 backdrop-blur-md border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors duration-300">
                  <Icon className="text-black dark:text-white group-hover:text-black transition-colors" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors shadow-black drop-shadow-md">{feature.title}</h3>
                <p className="text-zinc-200 dark:text-zinc-400 leading-relaxed text-sm drop-shadow-md">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Features;
