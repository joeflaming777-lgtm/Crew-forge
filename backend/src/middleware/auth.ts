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

    // Look up profile IDs for convenient controller access
    let candidateProfileId: string | undefined;
    let leaderProfileId: string | undefined;

    if (decoded.role === 'candidate') {
      const profile = await prisma.candidateProfile.findUnique({
        where: { userId: decoded.userId },
        select: { id: true },
      });
      candidateProfileId = profile?.id;
    } else if (decoded.role === 'team_leader') {
      const profile = await prisma.leaderProfile.findUnique({
        where: { userId: decoded.userId },
        select: { id: true },
      });
      leaderProfileId = profile?.id;
    }

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
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to roles [${roles.join(', ')}]`,
      });
      return;
    }
    next();
  };
};
