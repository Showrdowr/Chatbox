import { Request, Response, NextFunction } from 'express';
import { users, User } from '../data/store';

// ขยาย Type ของ Request ให้มี currentUser
export interface AuthRequest extends Request {
  currentUser?: User;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  // TypeScript อาจบ่นเรื่อง string | string[] เลยต้อง cast เป็น string
  const userId = (req.headers['x-user-id'] as string) || (req.query.userId as string);

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized: Missing userId' });
    return;
  }

  const user = users.find((u) => u.id === userId);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  req.currentUser = user;
  next();
};