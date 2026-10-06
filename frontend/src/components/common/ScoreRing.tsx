import React from 'react';
import { motion } from 'framer-motion';

interface ScoreRingProps {
  score: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  showPercent?: boolean;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score = 0,
  size = 90,
  strokeWidth = 7,
  label,
  sublabel,
  showPercent = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedScore = Math.min(100, Math.max(0, Math.round(score)));
  const offset = circumference - (clampedScore / 100) * circumference;

  let strokeColor = '#6366f1'; // Primary default
  if (clampedScore >= 85) strokeColor = '#10b981'; // Emerald
  else if (clampedScore >= 75) strokeColor = '#06b6d4'; // Cyan
  else if (clampedScore >= 60) strokeColor = '#f59e0b'; // Amber
  else strokeColor = '#f43f5e'; // Rose

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Animated score arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: size * 0.26, fontWeight: 700, color: '#f8fafc', lineHeight: 1 }}>
            {clampedScore}
            {showPercent && <span style={{ fontSize: size * 0.16, opacity: 0.8 }}>%</span>}
          </span>
          {sublabel && (
            <span style={{ fontSize: size * 0.12, color: '#94a3b8', marginTop: 2 }}>{sublabel}</span>
          )}
        </div>
      </div>
      {label && (
        <span
          style={{
            marginTop: 6,
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#94a3b8',
            textAlign: 'center',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};
