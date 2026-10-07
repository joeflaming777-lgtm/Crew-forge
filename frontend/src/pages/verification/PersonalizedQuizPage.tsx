import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  Award,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

interface Question {
  id: string;
  topic: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'q-1',
    topic: 'System Architecture',
    question: 'In a high-throughput hackathon backend, which pattern best guarantees decoupled communication between an ingestion API and asynchronous processing workers?',
    options: [
      { id: 'a', text: 'Direct HTTP REST calls with synchronous retries' },
      { id: 'b', text: 'Message Queue / Pub-Sub pattern (e.g. Kafka, RabbitMQ, SQS)' },
      { id: 'c', text: 'Shared in-memory JavaScript global object' },
      { id: 'd', text: 'Sequential cron job polling SQLite every 5 seconds' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q-2',
    topic: 'Frontend State Management',
    question: 'When optimizing React application re-renders in a real-time collaborative whiteboard, what is the best strategy for state sharing?',
    options: [
      { id: 'a', text: 'Lift all state into the root App component with single useState' },
      { id: 'b', text: 'Use granular state selectors / signals / atomic state (e.g. Zustand, Jotai) to isolate re-renders' },
      { id: 'c', text: 'Force window.location.reload() on incoming WebSocket messages' },
      { id: 'd', text: 'Duplicate state in localStorage and poll with setInterval' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q-3',
    topic: 'Model Optimization & AI',
    question: 'When deploying a PyTorch vision model to edge mobile devices or microcontrollers during an SIH prototype, which technique minimizes inference latency without retraining from scratch?',
    options: [
      { id: 'a', text: 'Post-training INT8 Quantization and ONNX runtime optimization' },
      { id: 'b', text: 'Increasing batch size to 256 on the mobile CPU' },
      { id: 'c', text: 'Adding 10 more linear layers before softmax' },
      { id: 'd', text: 'Converting the model to a plain CSV spreadsheet' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q-4',
    topic: 'API Security',
    question: 'How should sensitive API keys and cryptographic secrets be handled across multi-developer hackathon code repositories?',
    options: [
      { id: 'a', text: 'Hardcoded in public client components for quick testing' },
      { id: 'b', text: 'Stored in git-ignored .env files with server-side proxying' },
      { id: 'c', text: 'Committed to repository README files' },
      { id: 'd', text: 'Passed as URL query parameters in plain text' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q-5',
    topic: 'Database Engineering',
    question: 'To efficiently perform nearest-neighbor semantic search over 100,000 document vector embeddings, what database indexing method is recommended?',
    options: [
      { id: 'a', text: 'B-Tree index on raw text strings' },
      { id: 'b', text: 'HNSW (Hierarchical Navigable Small World) index in a vector database' },
      { id: 'c', text: 'Linear table scan with nested SQL LIKE %...% queries' },
      { id: 'd', text: 'JSON blob array inside local storage' },
    ],
    correctOptionId: 'b',
  },
];

export const PersonalizedQuizPage: React.FC = () => {
  const { user, submitQuiz } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes
  const [submitting, setSubmitting] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const currentQ = SAMPLE_QUESTIONS[currentIdx];

  const handleSelect = (optionId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: optionId,
    });
  };

  const handleSubmit = () => {
    setSubmitting(true);
    toast.info('Evaluating answers and computing assessment score...');

    // Calculate score
    let correctCount = 0;
    SAMPLE_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / SAMPLE_QUESTIONS.length) * 100) || 85;

    const roleName = user?.preferredRoles[0]?.name || 'Full Stack Developer';
    submitQuiz(roleName, selectedAnswers, score);

    setTimeout(() => {
      navigate('/quiz/result');
    }, 600);
  };

  return (
    <div style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Top Header with Timer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
              <Award size={16} /> Mandatory Profile Verification: Step 6 of 6
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: '#f8fafc' }}>
              Personalized Skill Assessment
            </h1>
          </div>

          {/* Timer Clock */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '9999px',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#f43f5e',
              fontSize: '1.1rem',
              fontWeight: 800,
            }}
          >
            <Clock size={18} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>
            <span>Question {currentIdx + 1} of {SAMPLE_QUESTIONS.length}</span>
            <span>{Math.round(((currentIdx + 1) / SAMPLE_QUESTIONS.length) * 100)}% Progress</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${((currentIdx + 1) / SAMPLE_QUESTIONS.length) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                borderRadius: '9999px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
          style={{
            padding: '2.5rem',
            borderRadius: '24px',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'inline-block', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '3px 10px', borderRadius: '6px', marginBottom: '1rem' }}>
            {currentQ.topic}
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.5, marginBottom: '2rem' }}>
            {currentQ.question}
          </h2>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentQ.options.map((opt) => {
              const isSelected = selectedAnswers[currentQ.id] === opt.id;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt.id)}
                  style={{
                    padding: '1.1rem 1.25rem',
                    borderRadius: '14px',
                    textAlign: 'left',
                    background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: isSelected ? '#f8fafc' : '#cbd5e1',
                    fontSize: '0.95rem',
                    fontWeight: isSelected ? 600 : 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: isSelected ? '#6366f1' : 'rgba(255,255,255,0.08)',
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    {opt.id.toUpperCase()}
                  </span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            className="btn-secondary btn-sm"
            style={{
              opacity: currentIdx === 0 ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          {currentIdx < SAMPLE_QUESTIONS.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIdx((prev) => prev + 1)}
              className="btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Next Question <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="btn-primary btn-sm"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Submit Assessment <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
