import React from 'react';
import { motion } from 'framer-motion';
import { Search, Award, Cpu, Users } from 'lucide-react';

export const ScreenAbout: React.FC = () => {
  const cards = [
    {
      title: 'Discover',
      description: 'Find students based on skills, roles, departments, experience and other requirements.',
      icon: <Search size={28} color="#06b6d4" />,
      glowColor: 'rgba(6, 182, 212, 0.25)',
      gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.05))',
    },
    {
      title: 'Evaluate',
      description: 'Review quiz performance and GitHub-based technical evidence.',
      icon: <Award size={28} color="#10b981" />,
      glowColor: 'rgba(16, 185, 129, 0.25)',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.05))',
    },
    {
      title: 'Match',
      description: 'Calculate explainable compatibility scores between candidates and teams.',
      icon: <Cpu size={28} color="#6366f1" />,
      glowColor: 'rgba(99, 102, 241, 0.25)',
      gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.05))',
    },
    {
      title: 'Build',
      description: 'Team Leaders select candidates and send invitations.',
      icon: <Users size={28} color="#f59e0b" />,
      glowColor: 'rgba(245, 158, 11, 0.25)',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.05))',
    },
  ];

  return (
    <section
      id="about"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '5rem 1.5rem',
        position: 'relative',
      }}
    >
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#a5b4fc',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '1rem',
            }}
          >
            The Mission
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              color: '#f8fafc',
              letterSpacing: '-0.02em',
              marginBottom: '1.25rem',
            }}
          >
            Why SkillSync?
          </motion.h2>

          {/* Problem Statement */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: '1.1rem',
              color: '#cbd5e1',
              lineHeight: 1.7,
              maxWidth: '820px',
              margin: '0 auto 1.5rem',
            }}
          >
            Students often struggle to find teammates with the right technical skills, preferred roles, experience, department, availability and other team requirements for hackathons.
          </motion.p>

          {/* Solution Statement */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontSize: '1rem',
              color: '#94a3b8',
              lineHeight: 1.6,
              maxWidth: '780px',
              margin: '0 auto',
            }}
          >
            SkillSync provides a structured way to discover, evaluate and connect suitable teammates using student profiles, verified skills, personalized assessments, GitHub code analysis, explainable match scores, and invitation-based joining.
          </motion.p>
        </div>

        {/* 4 Feature Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="glass-card"
              style={{
                padding: '2rem 1.75rem',
                background: c.gradient,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 25px ${c.glowColor}`,
                }}
              >
                {c.icon}
              </div>

              <div>
                <h3
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: '#f8fafc',
                    marginBottom: '0.6rem',
                  }}
                >
                  {c.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.925rem',
                    color: '#94a3b8',
                    lineHeight: 1.55,
                  }}
                >
                  {c.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
