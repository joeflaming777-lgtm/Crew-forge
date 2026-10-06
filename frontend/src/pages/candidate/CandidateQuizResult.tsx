import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ScoreRing } from '../../components/common/ScoreRing';
import { apiClient } from '../../api/client';

export const CandidateQuizResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState<any>(location.state?.result || null);
  const [loading, setLoading] = useState<boolean>(!result);
  const [expandedExplanation, setExpandedExplanation] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (!result) {
      fetchLatestResult();
    }
  }, []);

  const fetchLatestResult = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/quiz/result');
      if (res.data.success) {
        setResult(res.data.result);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const toggleExplanation = (qId: string) => {
    setExpandedExplanation((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Loading Assessment Results...</h3>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#f8fafc', marginBottom: '1rem' }}>
          No Assessment Results Found
        </h3>
        <button onClick={() => navigate('/candidate/quiz')} className="btn-primary">
          Take Assessment
        </button>
      </div>
    );
  }

  const scorePct = result.scorePercentage || 0;
  const correct = result.correctCount || 0;
  const total = result.totalQuestions || 20;

  return (
    <div className="container" style={{ maxWidth: '880px', padding: '3rem 1.5rem' }}>
      {/* Top Banner Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{
          padding: '3rem 2.5rem',
          borderRadius: '24px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.08) 100%)',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
          }}
        >
          <Trophy size={34} color="#fff" />
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
          Assessment Complete 🎉
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '2rem' }}>
          Your verified technical score has been recorded and factored into your HackMate ranking.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          <ScoreRing score={scorePct} size={110} strokeWidth={9} label="Assessment Score" />
          {result.overallScore !== undefined && (
            <ScoreRing score={result.overallScore} size={110} strokeWidth={9} label="Overall Candidate Score" />
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#10b981" />
            <span style={{ fontSize: '0.95rem', color: '#cbd5e1' }}>
              Correct: <strong style={{ color: '#fff' }}>{correct}</strong> / {total}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <XCircle size={18} color="#f43f5e" />
            <span style={{ fontSize: '0.95rem', color: '#cbd5e1' }}>
              Incorrect: <strong style={{ color: '#fff' }}>{total - correct}</strong>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Skill & Difficulty Performance Breakdown */}
      <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
        {/* Skill Breakdown */}
        <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem' }}>
            Skill Performance
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(result.skillBreakdown || []).map((sb: any) => (
              <div key={sb.skill}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{sb.skill}</span>
                  <span style={{ color: '#818cf8', fontWeight: 700 }}>{sb.score}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${sb.score}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #06b6d4)', borderRadius: '9999px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem' }}>
            Difficulty Breakdown
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(result.difficultyBreakdown || []).map((db: any) => (
              <div key={db.difficulty}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{db.difficulty}</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>{db.score}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${db.score}%`,
                      height: '100%',
                      background: db.difficulty === 'EASY' ? '#10b981' : db.difficulty === 'MEDIUM' ? '#f59e0b' : '#f43f5e',
                      borderRadius: '9999px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Answer Review Section */}
      {result.detailedReview && result.detailedReview.length > 0 && (
        <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', marginBottom: '2.5rem' }}>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.5rem' }}>
            Review Questions & Explanations
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {result.detailedReview.map((item: any, idx: number) => {
              const isExpanded = expandedExplanation[item.questionId];

              return (
                <div
                  key={item.questionId}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '14px',
                    background: item.isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)',
                    border: item.isCorrect ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(244, 63, 94, 0.2)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {item.isCorrect ? (
                        <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      ) : (
                        <XCircle size={20} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
                      )}
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
                          Q{idx + 1}. {item.text}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                          Topic: {item.topic} • Skill: {item.skillName}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExplanation(item.questionId)}
                      style={{
                        color: '#818cf8',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        flexShrink: 0,
                      }}
                    >
                      <HelpCircle size={14} />
                      <span>Explanation</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {/* Expandable Explanation */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={{
                        marginTop: '1rem',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        fontSize: '0.85rem',
                        color: '#cbd5e1',
                        lineHeight: 1.5,
                      }}
                    >
                      <strong style={{ color: '#818cf8' }}>Explanation: </strong>
                      {item.explanation}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => navigate('/candidate/dashboard')}
          className="btn-primary"
          style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}
        >
          Go to Candidate Dashboard <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
