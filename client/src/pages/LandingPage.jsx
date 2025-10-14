import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import LandingHero from '../components/LandingHero';
import LandingFeatures from '../components/LandingFeatures';
import LandingStats from '../components/LandingStats';
import LandingTestimonials from '../components/LandingTestimonials';
import LandingCTA from '../components/LandingCTA';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

const LandingPage = ({ 
  onLogin, 
  authMode, 
  setAuthMode, 
  showAuthModal, 
  setShowAuthModal, 
  handleAuthModalClose 
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleAuthModalClose}
        onLogin={onLogin}
        initialMode={authMode}
        canClose={true}
      />
      
      {/* Landing Page Content */}
      <LandingNavbar 
        setShowAuthModal={setShowAuthModal}
        setAuthMode={setAuthMode}
      />
      
      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>
      
      <main className="pb-20">
        <LandingHero 
          setShowAuthModal={setShowAuthModal}
          setAuthMode={setAuthMode}
        />
        <LandingFeatures 
          setShowAuthModal={setShowAuthModal}
          setAuthMode={setAuthMode}
        />
        <LandingStats 
          setShowAuthModal={setShowAuthModal}
          setAuthMode={setAuthMode}
        />
        <LandingTestimonials 
          setShowAuthModal={setShowAuthModal}
          setAuthMode={setAuthMode}
        />
        <LandingCTA 
          setShowAuthModal={setShowAuthModal}
          setAuthMode={setAuthMode}
        />
      </main>
      
      <Footer />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1, boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;