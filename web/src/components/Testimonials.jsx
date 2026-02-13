import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  { name: 'Sarah Chen', role: 'Freelance Designer', content: 'SubEx saved me over $200 in forgotten subscriptions. The reminders are a game-changer!', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80' },
  { name: 'Michael Park', role: 'Software Engineer', content: 'Finally, a privacy-first platform I can trust. Love the anonymous marketplace feature.', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80' },
  { name: 'Emma Rodriguez', role: 'Marketing Manager', content: 'Clean interface, powerful features. Managing my 15+ subscriptions has never been easier.', rating: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80' },
  { name: 'James Wilson', role: 'Entrepreneur', content: "The email alerts are perfectly timed. I haven't missed a renewal date since joining SubEx.", rating: 5, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80' },
  { name: 'Olivia Foster', role: 'Content Creator', content: 'Being able to sell unused vouchers anonymously is brilliant. Great side income!', rating: 5, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80' },
  { name: 'David Kim', role: 'Product Manager', content: 'The spending insights helped me cut my monthly costs by 40%. Highly recommend!', rating: 5, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80' },
];

const brands = ['Netflix', 'Spotify', 'Adobe', 'Microsoft', 'Apple', 'Amazon', 'Disney+', 'Hulu'];

const Testimonials = () => (
  <section className="py-20 sm:py-28 bg-zinc-50 dark:bg-black relative overflow-hidden transition-colors duration-300">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
    <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />

    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mb-3"
        >
          Testimonials
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight transition-colors duration-300"
        >
          Loved by users worldwide
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
        >
          See what people are saying about SubEx
        </motion.p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex"
          >
            <div className="w-full bg-white dark:bg-zinc-900/50 backdrop-blur rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition-all duration-300 flex flex-col items-start shadow-sm dark:shadow-none">
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed flex-1">&ldquo;{t.content}&rdquo;</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-800" loading="lazy" />
                <div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-white">{t.name}</div>
                  <div className="text-xs text-zinc-500">{t.role}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 text-center">
        <p className="text-sm text-zinc-400 dark:text-zinc-600 mb-10 uppercase tracking-widest font-semibold opacity-75">Trusted by teams at top companies</p>
        <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          {brands.map((name) => (
            <span key={name} className="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-default tracking-tight">{name}</span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Testimonials;
