import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hackmate_super_secret_jwt_key_2026_sih_secure_token';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'candidate' | 'team_leader' | 'admin';
}

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
