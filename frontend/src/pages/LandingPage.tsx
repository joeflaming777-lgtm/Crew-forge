import React, { useEffect, useState } from 'react';
import { ScreenHero } from '../components/landing/ScreenHero';
import { ScreenAbout } from '../components/landing/ScreenAbout';
import { ScreenChoosePath } from '../components/landing/ScreenChoosePath';

export const LandingPage: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentScroll = window.scrollY;
        setScrollProgress((currentScroll / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Scroll Progress Bar at Top */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3px',
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, #6366f1, #06b6d4, #10b981)',
          zIndex: 9999,
          transition: 'width 0.1s ease-out',
        }}
      />

      {/* Vertical 3-Screen Sequence */}
      {/* SCREEN 1: HERO / PROJECT LOGO */}
      <ScreenHero onExploreClick={scrollToAbout} />

      {/* SCREEN 2: ABOUT THE PROJECT */}
      <ScreenAbout />

      {/* SCREEN 3: CHOOSE YOUR PATH */}
      <ScreenChoosePath />
    </div>
  );
};
