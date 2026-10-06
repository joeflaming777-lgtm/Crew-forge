import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useToast } from '../../contexts/ToastContext';

export const CandidateQuiz: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [quizData, setQuizData] = useState<any>(null);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(20 * 60);

  useEffect(() => {
    startAssessment();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (loading || submitting || !quizData) return;
    if (timeLeftSeconds <= 0) {
      handleSubmitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeftSeconds, loading, submitting, quizData]);

  const startAssessment = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/quiz/start');
      if (res.data.success) {
        setQuizData(res.data.quiz);
        setTimeLeftSeconds(res.data.quiz.timeLimitMinutes * 60);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not load quiz questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);
      toast.info('Evaluating answers and computing scores...');

      const res = await apiClient.post('/quiz/submit', {
        roleName: quizData?.roleName,
        answers: selectedAnswers,
      });

      if (res.data.success) {
        toast.success(`Assessment submitted! Score: ${res.data.scorePercentage}%`);
        navigate('/candidate/quiz-result', { state: { result: res.data } });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Submission error.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#f8fafc', marginBottom: '1rem' }}>
          Generating Personalized Skill Assessment...
        </h3>
        <p style={{ color: '#94a3b8' }}>
          Selecting tailored questions matching your preferred roles and verified skills.
        </p>
      </div>
    );
  }

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <AlertTriangle size={48} color="#f59e0b" style={{ margin: '0 auto 1.5rem' }} />
        <h3 style={{ fontSize: '1.5rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
          Assessment Questions Unavailable
        </h3>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
          No questions currently match your role. Please try again or update your skills in profile.
        </p>
        <button onClick={() => navigate('/candidate/dashboard')} className="btn-secondary">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentQ = quizData.questions[currentIdx];
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round((answeredCount / quizData.questions.length) * 100);

  return (
    <div className="container" style={{ maxWidth: '880px', padding: '2.5rem 1.5rem' }}>
      {/* Quiz Header Bar */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem 1.75rem',
          borderRadius: '16px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase' }}>
            Assessment Track: {quizData.roleName}
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
            Question {currentIdx + 1} of {quizData.questions.length}
          </h2>
        </div>

        {/* Timer Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: timeLeftSeconds < 180 ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: timeLeftSeconds < 180 ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)',
            padding: '8px 16px',
            borderRadius: '9999px',
            color: timeLeftSeconds < 180 ? '#f43f5e' : '#f8fafc',
            fontWeight: 700,
            fontSize: '1rem',
          }}
        >
          <Clock size={18} />
          <span>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '6px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '9999px',
          marginBottom: '2rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Current Question Card */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{
          padding: '2.5rem',
          borderRadius: '24px',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          marginBottom: '2rem',
        }}
      >
        {/* Meta badges */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
          <span className="badge badge-primary">{currentQ.skillName}</span>
          <span className="badge badge-neutral">{currentQ.topic}</span>
          <span
            className={`badge ${
              currentQ.difficulty === 'EASY'
                ? 'badge-success'
                : currentQ.difficulty === 'HARD'
                ? 'badge-danger'
                : 'badge-warning'
            }`}
          >
            {currentQ.difficulty}
          </span>
        </div>

        {/* Question Text */}
        <h3
          style={{
            fontSize: '1.35rem',
            fontWeight: 700,
            color: '#f8fafc',
            lineHeight: 1.5,
            marginBottom: '2rem',
          }}
        >
          {currentQ.text}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {currentQ.options.map((opt: any, optIdx: number) => {
            const isSelected = selectedAnswers[currentQ.id] === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(currentQ.id, opt.id)}
                style={{
                  padding: '16px 20px',
                  borderRadius: '14px',
                  textAlign: 'left',
                  background: isSelected
                    ? 'rgba(99, 102, 241, 0.25)'
                    : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected
                    ? '1.5px solid #6366f1'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: isSelected ? '#6366f1' : 'rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {String.fromCharCode(65 + optIdx)}
                </div>
                <span
                  style={{
                    fontSize: '1rem',
                    color: isSelected ? '#fff' : '#cbd5e1',
                    fontWeight: isSelected ? 600 : 400,
                    flex: 1,
                  }}
                >
                  {opt.text}
                </span>
                {isSelected && <CheckCircle2 size={20} color="#6366f1" />}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Navigation & Submission Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
          className="btn-secondary"
          style={{ opacity: currentIdx === 0 ? 0.4 : 1 }}
        >
          <ChevronLeft size={18} /> Previous
        </button>

        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
          Answered: <strong style={{ color: '#fff' }}>{answeredCount}</strong> / {quizData.questions.length}
        </span>

        {currentIdx < quizData.questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx(currentIdx + 1)}
            className="btn-primary"
          >
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleSubmitQuiz}
            disabled={submitting}
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Assessment'} <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
