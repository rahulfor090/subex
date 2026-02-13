import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import TrustIndicators from '../components/TrustIndicators';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import PrivacySection from '../components/PrivacySection';
import Benefits from '../components/Benefits';
import Testimonials from '../components/Testimonials';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white antialiased overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      <Header />
      <main>
        <Hero />
        <TrustIndicators />
        <HowItWorks />
        <Features />
        <PrivacySection />
        <Benefits />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
