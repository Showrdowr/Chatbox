import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { users } from '../data/store';

export const getRoles = (req: AuthRequest, res: Response) => {
  res.json(users);
};

export const getMe = (req: AuthRequest, res: Response) => {
  res.json(req.currentUser);
};

export const getUsers = (req: AuthRequest, res: Response) => {
  // กรอง user ปัจจุบันออก
  const otherUsers = users.filter(u => u.id !== req.currentUser?.id);
  res.json(otherUsers);
};
