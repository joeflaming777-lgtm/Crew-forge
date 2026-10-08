import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { prisma } from '../config/prisma';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload & {
    candidateProfileId?: string;
    leaderProfileId?: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Look up profile IDs for convenient controller access across unified user
    const cand = await prisma.candidateProfile.findUnique({
      where: { userId: decoded.userId },
      select: { id: true },
    });
    const lead = await prisma.leaderProfile.findUnique({
      where: { userId: decoded.userId },
      select: { id: true },
    });

    const candidateProfileId = cand?.id;
    const leaderProfileId = lead?.id;

    req.user = {
      ...decoded,
      candidateProfileId,
      leaderProfileId,
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    return;
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Access restricted',
      });
      return;
    }

    // Allow admin, direct role match, or any unified user possessing the corresponding profile
    if (
      req.user.role === 'admin' ||
      roles.includes(req.user.role) ||
      (roles.includes('candidate') && req.user.candidateProfileId) ||
      (roles.includes('team_leader') && req.user.leaderProfileId) ||
      roles.includes('candidate') // every user is a participant candidate by default
    ) {
      return next();
    }

    next();
  };
};
