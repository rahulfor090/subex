import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, Eye, FileCheck, CheckCircle } from 'lucide-react';

const privacyFeatures = [
  { icon: Lock, title: 'End-to-End Encryption', description: 'Military-grade encryption protects every transaction and personal detail.' },
  { icon: Shield, title: 'Advanced Identity Protection', description: 'Your personal identity is masked and protected with state-of-the-art security protocols.' },
  { icon: Eye, title: 'Zero-Knowledge Authentication', description: 'We never store or see your sensitive data. Complete privacy guaranteed.' },
  { icon: FileCheck, title: 'No Data Selling Policy', description: 'Your information is yours alone. We never share or sell your data. Ever.' },
];

const certifications = ['SOC 2 Type II', 'GDPR', 'CCPA', 'ISO 27001', 'PCI DSS'];

const PrivacySection = () => (
  <section id="security" className="py-20 sm:py-28 bg-white dark:bg-black relative overflow-hidden transition-colors duration-300">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent opacity-50" />
    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent opacity-50" />
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
        >
          <Shield className="text-emerald-600 dark:text-emerald-500" size={32} />
        </motion.div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight leading-tight transition-colors duration-300"
        >
          Privacy isn't a feature.<br /><span className="text-zinc-500 dark:text-zinc-500">It's our foundation.</span>
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed"
        >
          Built from the ground up with privacy-first architecture, SubEx ensures your data and identity remain completely protected at every step.
        </motion.p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {privacyFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group h-full bg-white dark:bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/30 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-all duration-300 shadow-sm dark:shadow-none"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-colors duration-300">
                  <Icon className="text-zinc-500 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors" size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{feature.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed group-hover:text-zinc-900 dark:group-hover:text-zinc-300">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center"
      >
        <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-white dark:bg-zinc-900/60 backdrop-blur rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-lg dark:shadow-none">
          <div>
            <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Bank-Level Security Certified</h4>
            <div className="flex flex-wrap gap-3 justify-center">
              {certifications.map((cert) => (
                <span key={cert} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-white transition-colors cursor-default">
                  <CheckCircle size={12} className="text-emerald-500" />
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default PrivacySection;
