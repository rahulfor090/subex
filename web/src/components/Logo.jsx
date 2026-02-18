import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ className = "", showText = true }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <motion.div
                className="relative w-8 h-8 flex items-center justify-center"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-lg opacity-20 dark:opacity-30 blur-sm" />
                <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full relative z-10"
                >
                    <path
                        d="M8.5 22.5L13 25.5C14.6569 26.6046 16.8431 26.6046 18.5 25.5L24.5 21.5C26.1569 20.3954 26.1569 18.1046 24.5 17L18.5 13"
                        stroke="url(#logo_gradient)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M23.5 9.5L19 6.5C17.3431 5.39543 15.1569 5.39543 13.5 6.5L7.5 10.5C5.84315 11.6046 5.84315 13.8954 7.5 15L13.5 19"
                        stroke="url(#logo_gradient_2)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <defs>
                        <linearGradient id="logo_gradient" x1="8.5" y1="22.5" x2="26" y2="13" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#10b981" />
                            <stop offset="1" stopColor="#06b6d4" />
                        </linearGradient>
                        <linearGradient id="logo_gradient_2" x1="23.5" y1="9.5" x2="6" y2="19" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#8b5cf6" />
                            <stop offset="1" stopColor="#10b981" />
                        </linearGradient>
                    </defs>
                </svg>
            </motion.div>

            {showText && (
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-bold tracking-tight"
                >
                    <span className="text-[rgb(43,43,149)] dark:text-white">Sub</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">Ex</span>
                </motion.span>
            )}
        </div>
    );
};

export default Logo;
