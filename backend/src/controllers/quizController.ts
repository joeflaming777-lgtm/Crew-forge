import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/auth';
import { CandidateScoringService } from '../services/candidateScoringService';

export class QuizController {
  // START PERSONALIZED QUIZ
  public static async startQuiz(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const candidateProfileId = req.user?.candidateProfileId;
      if (!candidateProfileId) {
        res.status(404).json({ success: false, message: 'Candidate profile not found.' });
        return;
      }

      // 1. Fetch candidate's preferred roles and skills
      const profile = await prisma.candidateProfile.findUnique({
        where: { id: candidateProfileId },
        include: {
          preferredRoles: { include: { role: true } },
          skills: { include: { skill: true } },
        },
      });

      if (!profile) {
        res.status(404).json({ success: false, message: 'Candidate profile not found.' });
        return;
      }

      const roleIds = profile.preferredRoles.map((r) => r.roleId);
      const skillIds = profile.skills.map((s) => s.skillId);
      const primaryRoleName = profile.preferredRoles[0]?.role?.name || 'General Developer';

      // 2. Fetch questions matching candidate's roles OR skills OR general
      let matchedQuestions = await prisma.question.findMany({
        where: {
          OR: [
            ...(roleIds.length > 0 ? [{ roleId: { in: roleIds } }] : []),
            ...(skillIds.length > 0 ? [{ skillId: { in: skillIds } }] : []),
          ],
        },
        include: {
          options: {
            select: { id: true, text: true }, // Exclude isCorrect for client
          },
          skill: true,
          role: true,
        },
      });

      // If fewer than 20 questions matched, include general questions
      if (matchedQuestions.length < 20) {
        const fallbackQuestions = await prisma.question.findMany({
          where: {
            id: { notIn: matchedQuestions.map((q) => q.id) },
          },
          include: {
            options: {
              select: { id: true, text: true },
            },
            skill: true,
            role: true,
          },
          take: 30,
        });
        matchedQuestions = [...matchedQuestions, ...fallbackQuestions];
      }

      // Group by difficulty: 5 Easy, 10 Medium, 5 Hard
      const easyQuestions = matchedQuestions.filter((q) => q.difficulty === 'EASY');
      const mediumQuestions = matchedQuestions.filter((q) => q.difficulty === 'MEDIUM');
      const hardQuestions = matchedQuestions.filter((q) => q.difficulty === 'HARD');

      const shuffle = <T>(arr: T[]): T[] => arr.sort(() => Math.random() - 0.5);

      const selectedEasy = shuffle(easyQuestions).slice(0, 5);
      const selectedMedium = shuffle(mediumQuestions).slice(0, 10);
      const selectedHard = shuffle(hardQuestions).slice(0, 5);

      let finalQuestions = [...selectedEasy, ...selectedMedium, ...selectedHard];

      // If we don't have enough by strict difficulty, fill from remaining
      if (finalQuestions.length < 20) {
        const selectedIds = new Set(finalQuestions.map((q) => q.id));
        const remaining = matchedQuestions.filter((q) => !selectedIds.has(q.id));
        finalQuestions.push(...shuffle(remaining).slice(0, 20 - finalQuestions.length));
      }

      // Final shuffle of question order and randomize options order
      const sanitizedQuestions = shuffle(finalQuestions).map((q) => ({
        id: q.id,
        text: q.text,
        difficulty: q.difficulty,
        topic: q.topic,
        skillName: q.skill?.name || 'General',
        roleName: q.role?.name || primaryRoleName,
        options: shuffle(q.options),
      }));

      res.json({
        success: true,
        quiz: {
          roleName: primaryRoleName,
          totalQuestions: sanitizedQuestions.length,
          timeLimitMinutes: 20,
          questions: sanitizedQuestions,
        },
      });
    } catch (error: any) {
      console.error('Start quiz error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // SUBMIT QUIZ
  public static async submitQuiz(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const candidateProfileId = req.user?.candidateProfileId;
      if (!candidateProfileId) {
        res.status(404).json({ success: false, message: 'Candidate profile not found.' });
        return;
      }

      const { roleName, answers } = req.body;
      // answers: Record<string, string> (questionId -> selectedOptionId)
      if (!answers || typeof answers !== 'object') {
        res.status(400).json({ success: false, message: 'Invalid quiz answers payload.' });
        return;
      }

      const questionIds = Object.keys(answers);
      if (questionIds.length === 0) {
        res.status(400).json({ success: false, message: 'No answers provided.' });
        return;
      }

      // Fetch all questions with their correct options
      const questions = await prisma.question.findMany({
        where: { id: { in: questionIds } },
        include: {
          options: true,
          skill: true,
        },
      });

      let correctCount = 0;
      const detailedReview: any[] = [];

      const skillStats: Record<string, { total: number; correct: number }> = {};
      const diffStats: Record<string, { total: number; correct: number }> = {
        EASY: { total: 0, correct: 0 },
        MEDIUM: { total: 0, correct: 0 },
        HARD: { total: 0, correct: 0 },
      };

      const quizAnswersToCreate: {
        questionId: string;
        selectedOptionId: string | null;
        isCorrect: boolean;
      }[] = [];

      for (const q of questions) {
        const selectedOptionId = answers[q.id] || null;
        const correctOption = q.options.find((o) => o.isCorrect);
        const isCorrect = Boolean(selectedOptionId && correctOption && selectedOptionId === correctOption.id);

        if (isCorrect) correctCount++;

        // Skill stats
        const skillName = q.skill?.name || 'General';
        if (!skillStats[skillName]) skillStats[skillName] = { total: 0, correct: 0 };
        skillStats[skillName].total++;
        if (isCorrect) skillStats[skillName].correct++;

        // Difficulty stats
        if (diffStats[q.difficulty]) {
          diffStats[q.difficulty].total++;
          if (isCorrect) diffStats[q.difficulty].correct++;
        }

        quizAnswersToCreate.push({
          questionId: q.id,
          selectedOptionId,
          isCorrect,
        });

        detailedReview.push({
          questionId: q.id,
          text: q.text,
          topic: q.topic,
          difficulty: q.difficulty,
          skillName,
          selectedOptionId,
          correctOptionId: correctOption?.id,
          isCorrect,
          explanation: q.explanation,
          options: q.options.map((o) => ({
            id: o.id,
            text: o.text,
            isCorrect: o.isCorrect,
          })),
        });
      }

      const totalQuestions = questions.length;
      const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

      // Compute skill breakdown percentages
      const skillBreakdown = Object.entries(skillStats).map(([skill, stat]) => ({
        skill,
        score: Math.round((stat.correct / stat.total) * 100),
        total: stat.total,
        correct: stat.correct,
      }));

      // Compute difficulty breakdown percentages
      const difficultyBreakdown = Object.entries(diffStats)
        .filter(([, stat]) => stat.total > 0)
        .map(([diff, stat]) => ({
          difficulty: diff,
          score: Math.round((stat.correct / stat.total) * 100),
          total: stat.total,
          correct: stat.correct,
        }));

      // Create QuizAttempt record
      const attempt = await prisma.quizAttempt.create({
        data: {
          candidateProfileId,
          roleName: roleName || 'Skill Assessment',
          totalQuestions,
          correctCount,
          scorePercentage,
          skillBreakdown: JSON.stringify(skillBreakdown),
          difficultyBreakdown: JSON.stringify(difficultyBreakdown),
          answers: {
            create: quizAnswersToCreate,
          },
        },
      });

      // Update Candidate Profile quiz score
      await prisma.candidateProfile.update({
        where: { id: candidateProfileId },
        data: { quizScore: scorePercentage },
      });

      // Recalculate Candidate Overall Score
      const scores = await CandidateScoringService.recalculateScore(candidateProfileId);

      // Create notification
      await prisma.notification.create({
        data: {
          userId: req.user!.userId,
          title: 'Assessment Complete 🎯',
          message: `You scored ${scorePercentage}% in your ${roleName || 'skill'} assessment. Overall score updated to ${scores.overallScore}%.`,
          type: 'QUIZ',
          link: '/candidate/dashboard',
        },
      });

      res.json({
        success: true,
        attemptId: attempt.id,
        scorePercentage,
        correctCount,
        totalQuestions,
        skillBreakdown,
        difficultyBreakdown,
        overallScore: scores.overallScore,
        detailedReview,
      });
    } catch (error: any) {
      console.error('Submit quiz error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // GET LATEST QUIZ RESULT
  public static async getLatestResult(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const candidateProfileId = req.user?.candidateProfileId;
      if (!candidateProfileId) {
        res.status(404).json({ success: false, message: 'Candidate profile not found.' });
        return;
      }

      const attempt = await prisma.quizAttempt.findFirst({
        where: { candidateProfileId },
        orderBy: { completedAt: 'desc' },
        include: {
          answers: {
            include: {
              question: {
                include: { options: true, skill: true },
              },
              selectedOption: true,
            },
          },
        },
      });

      if (!attempt) {
        res.status(404).json({ success: false, message: 'No quiz attempts found.' });
        return;
      }

      res.json({
        success: true,
        result: {
          id: attempt.id,
          roleName: attempt.roleName,
          totalQuestions: attempt.totalQuestions,
          correctCount: attempt.correctCount,
          scorePercentage: attempt.scorePercentage,
          skillBreakdown: JSON.parse(attempt.skillBreakdown || '[]'),
          difficultyBreakdown: JSON.parse(attempt.difficultyBreakdown || '[]'),
          completedAt: attempt.completedAt,
          answers: attempt.answers.map((a) => ({
            questionId: a.questionId,
            questionText: a.question.text,
            topic: a.question.topic,
            skillName: a.question.skill?.name,
            explanation: a.question.explanation,
            selectedOptionText: a.selectedOption?.text || 'Not answered',
            isCorrect: a.isCorrect,
            correctOptionText: a.question.options.find((o) => o.isCorrect)?.text,
          })),
        },
      });
    } catch (error: any) {
      console.error('Get latest result error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }
}
