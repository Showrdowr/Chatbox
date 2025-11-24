import express from 'express';
import { authenticate } from '../middleware/auth';
import * as userController from '../controllers/userController';
import * as chatController from '../controllers/chatController';

const router = express.Router();

// --- User Routes ---
router.get('/roles', userController.getRoles);
router.get('/users', authenticate, userController.getUsers);
router.get('/users/me', authenticate, userController.getMe);

// --- Chat Routes ---
router.get('/conversations', authenticate, chatController.getConversations);
router.post('/conversations', authenticate, chatController.createConversation);
router.delete('/conversations/:id', authenticate, chatController.deleteConversation);

router.get('/conversations/:id/messages', authenticate, chatController.getMessages);
router.post('/conversations/:id/messages', authenticate, chatController.sendMessage);

export default router;