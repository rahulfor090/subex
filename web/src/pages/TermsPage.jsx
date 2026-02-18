import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BackgroundBeams } from '../components/ui/BackgroundBeams';

const TermsPage = () => {
    useEffect(() => {
        try {
            window.scrollTo(0, 0);
        } catch (e) {
            console.error("Scroll error:", e);
        }
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white antialiased selection:bg-emerald-500/30 selection:text-emerald-900 dark:selection:text-emerald-200 relative overflow-hidden transition-colors duration-300">
            <BackgroundBeams className="fixed inset-0 z-0 hidden dark:block" />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header />

                <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto space-y-16">
                        {/* Header Section */}
                        <div className="text-center space-y-6">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-emerald-600 to-emerald-800 dark:from-white dark:via-emerald-100 dark:to-emerald-200">
                                Terms of Service
                            </h1>
                            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                                Please read these terms carefully before using our services. They govern your relationship with SubEx.
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 text-sm font-medium">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Last updated: February 18, 2026
                            </div>
                        </div>

                        {/* Content Container */}
                        <div className="grid gap-12 relative">
                            {/* Decorative line */}
                            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent hidden md:block" />

                            <PolicySection
                                number="01"
                                title="Agreement to Terms"
                                content={
                                    <p>
                                        By accessing or using the SubEx website and services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you may not access or use the services.
                                    </p>
                                }
                            />

                            <PolicySection
                                number="02"
                                title="Use of Services"
                                content={
                                    <>
                                        <p className="mb-4">
                                            You engage in our service at your own risk. The service is provided "as is" and "as available". You agree not to:
                                        </p>
                                        <ul className="space-y-4">
                                            <CheckItem text="Use the service for any illegal purpose" />
                                            <CheckItem text="Violate any laws in your jurisdiction" />
                                            <CheckItem text="Infringe upon the rights of others" />
                                            <CheckItem text="Distribute viruses or harmful code" />
                                        </ul>
                                    </>
                                }
                            />

                            <PolicySection
                                number="03"
                                title="User Accounts"
                                content={
                                    <p>
                                        To use certain features of the service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                                    </p>
                                }
                            />

                            <PolicySection
                                number="04"
                                title="Subscriptions & Payments"
                                content={
                                    <>
                                        <p className="mb-6">
                                            SubEx offers various subscription plans. By selecting a plan, you agree to pay the applicable fees.
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <InfoCard
                                                title="Billing"
                                                items={[
                                                    "Recurring billing cycle",
                                                    "Auto-renewal unless canceled",
                                                    "Secure payment processing",
                                                    "Detailed invoice history"
                                                ]}
                                            />
                                            <InfoCard
                                                title="Cancellations"
                                                items={[
                                                    "Cancel anytime via dashboard",
                                                    "Access continues until end of cycle",
                                                    "No refunds for partial months",
                                                    "Grace period for failed payments"
                                                ]}
                                            />
                                        </div>
                                    </>
                                }
                            />

                            <PolicySection
                                number="05"
                                title="Intellectual Property"
                                content={
                                    <p>
                                        The service and its original content, features, and functionality are and will remain the exclusive property of SubEx and its licensors. The service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
                                    </p>
                                }
                            />

                            <PolicySection
                                number="06"
                                title="Limitation of Liability"
                                content={
                                    <p>
                                        In no event shall SubEx, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                                    </p>
                                }
                            />

                            <PolicySection
                                number="07"
                                title="Contact Us"
                                content={
                                    <div className="bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 hover:border-emerald-500/30 transition-colors">
                                        <p className="mb-6 text-zinc-600 dark:text-zinc-300">
                                            If you have any questions about these Terms, please contact us at:
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                            <a
                                                href="mailto:legal@subex.com"
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors font-medium"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                                legal@subex.com
                                            </a>
                                            <span className="text-zinc-400 dark:text-zinc-500">or</span>
                                            <span className="text-zinc-600 dark:text-zinc-300">SubEx Inc, 123 Tech Avenue, Innovation City</span>
                                        </div>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
};

const PolicySection = ({ number, title, content }) => (
    <section className="relative md:pl-16 group">
        <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 items-center justify-center -translate-x-1/2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl group-hover:border-emerald-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] transition-all duration-500 z-10">
            <span className="text-emerald-600 dark:text-emerald-500 font-mono font-bold text-xl">{number}</span>
        </div>
        <div className="space-y-4">
            <div className="md:hidden flex items-center gap-3 mb-2">
                <span className="text-emerald-600 dark:text-emerald-500 font-mono font-bold text-xl">{number}</span>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{title}</h2>
            </div>
            <h2 className="hidden md:block text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-6 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{title}</h2>
            <div className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                {content}
            </div>
        </div>
    </section>
);

const InfoCard = ({ title, items }) => (
    <div className="bg-zinc-50 dark:bg-zinc-900/30 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-colors">
        <h3 className="text-emerald-600 dark:text-emerald-400 font-semibold mb-4 text-lg">{title}</h3>
        <ul className="space-y-3">
            {items.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-zinc-600 dark:text-zinc-300 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    {item}
                </li>
            ))}
        </ul>
    </div>
);

const CheckItem = ({ text }) => (
    <li className="flex items-start gap-3">
        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
            <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <span className="text-zinc-600 dark:text-zinc-300">{text}</span>
    </li>
);

export default TermsPage;
