import React from 'react';
import { Mail, Twitter, Github, Linkedin, Heart } from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Security', 'Roadmap', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Press Kit', 'Contact'],
  Resources: ['Documentation', 'API', 'Support', 'Community', 'Status'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR', 'Compliance'],
};

const socials = [
  { icon: Twitter, label: 'Twitter' },
  { icon: Github, label: 'GitHub' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Mail, label: 'Email' },
];

const Footer = () => (
  <footer className="bg-zinc-50 dark:bg-black text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-900 transition-colors duration-300">
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Main Grid */}
      <div className="py-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
        {/* Brand Column */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-2">
          <a
            href="#"
            className="inline-block mb-6 group"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-500">
              SubEx.
            </span>
          </a>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-8 max-w-sm leading-relaxed">
            Smart subscription management with privacy-first design. Never miss a renewal, never
            overpay, never expose your identity.
          </p>
          <div className="flex gap-4">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 flex items-center justify-center transition-all border border-zinc-200 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-500/30 group shadow-sm dark:shadow-none"
                >
                  <Icon size={18} className="text-zinc-500 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors" />
                </a>
              )
            })}
          </div>
        </div>

        {/* Link Columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title} className="col-span-1">
            <h3 className="font-semibold text-zinc-900 dark:text-white text-sm mb-6">{title}</h3>
            <ul className="space-y-4">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-zinc-600 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-sm block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="py-8 border-t border-zinc-200 dark:border-zinc-900">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 dark:text-zinc-600 text-xs flex items-center gap-1.5">
            &copy; {new Date().getFullYear()} SubEx. Made with <Heart size={12} className="text-red-500 fill-red-500/20" /> globally.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((t) => (
              <a key={t} href="#" className="text-zinc-600 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors text-xs font-medium">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
