import React from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronUp } from 'lucide-react';

interface ScreenHeroProps {
  onExploreClick: () => void;
}

export const ScreenHero: React.FC<ScreenHeroProps> = ({ onExploreClick }) => {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem 1.5rem',
        overflow: 'hidden',
      }}
    >
      {/* Background Animated Glow Orbs */}
      <div
        className="glow-orb"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.1) 60%, transparent 100%)',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
      <div
        className="glow-orb"
        style={{
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(217, 70, 239, 0.15) 0%, transparent 70%)',
          bottom: '10%',
          right: '15%',
          animationDelay: '3s',
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '850px', margin: '0 auto' }}>
        {/* Animated Centered Logo Reveal */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'inline-flex',
            marginBottom: '1.75rem',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 50px rgba(99, 102, 241, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.3)',
            }}
          >
            <Users size={52} color="#ffffff" />
          </div>
        </motion.div>

        {/* Project Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '1.25rem',
          }}
        >
          CREWFORGE
        </motion.h1>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)',
            fontWeight: 700,
            lineHeight: 1.25,
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #ffffff 30%, #a5b4fc 70%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Find Your People. Build Your Team.
        </motion.div>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#94a3b8',
            lineHeight: 1.6,
            maxWidth: '680px',
            margin: '0 auto 2.5rem',
          }}
        >
          A smart platform that helps students discover, evaluate and connect with the right teammates for hackathons.
        </motion.p>
      </div>

      {/* Bottom Animated Swipe Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          zIndex: 20,
        }}
        onClick={onExploreClick}
      >
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#a5b4fc',
          }}
        >
          <ChevronUp size={18} />
        </motion.div>
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: '#a5b4fc',
          }}
        >
          Swipe up to explore ↑
        </span>
      </motion.div>
    </section>
  );
};
