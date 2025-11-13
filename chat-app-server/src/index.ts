import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { users, conversations, messages, Conversation, Message } from './db';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Middleware
const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'] as string;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  (req as any).currentUser = user;
  next();
};

// 1. Get Users
app.get('/users', (req, res) => {
  res.json(users);
});

// 2. List Conversations
app.get('/conversations', authenticateUser, (req, res) => {
  const currentUser = (req as any).currentUser;
  const userConversations = conversations.filter(c => c.participantIds.includes(currentUser.id));
  
  const responseData = userConversations.map(c => {
    const otherUserId = c.participantIds.find(id => id !== currentUser.id);
    const otherUser = users.find(u => u.id === otherUserId);
    return {
      id: c.id,
      otherUser: otherUser ? { id: otherUser.id, name: otherUser.name } : null,
      lastMessage: c.lastMessage || "",
      lastMessageTimestamp: c.lastMessageTimestamp || 0
    };
  });
  
  responseData.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
  res.json(responseData);
});

// 3. Start Conversation
app.post('/conversations', authenticateUser, (req, res) => {
  const currentUser = (req as any).currentUser;
  const { targetUserId } = req.body;
  
  if (!targetUserId) return res.status(400).json({ error: 'Target required' });
  if (currentUser.id === targetUserId) return res.status(400).json({ error: 'Self-chat not allowed' });

  const existing = conversations.find(c => 
    c.participantIds.includes(currentUser.id) && c.participantIds.includes(targetUserId)
  );
  if (existing) return res.json(existing);

  const newConv: Conversation = {
    id: Math.random().toString(36).substr(2, 9),
    participantIds: [currentUser.id, targetUserId],
    lastMessage: undefined,
    lastMessageTimestamp: undefined
  };
  conversations.push(newConv);
  res.status(201).json(newConv);
});

// 4. Get Messages
app.get('/conversations/:id/messages', authenticateUser, (req, res) => {
  const { id } = req.params;
  const currentUser = (req as any).currentUser;
  
  const conversation = conversations.find(c => c.id === id);
  if (!conversation?.participantIds.includes(currentUser.id)) return res.status(403).json({ error: 'Forbidden' });

  const roomMessages = messages.filter(m => m.conversationId === id);
  const results = roomMessages.map(m => {
    const sender = users.find(u => u.id === m.senderId);
    return { ...m, senderName: sender?.name || "Unknown" };
  });
  res.json(results);
});

// 5. Send Message
app.post('/conversations/:id/messages', authenticateUser, (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const currentUser = (req as any).currentUser;

  if (!content) return res.status(400).json({ error: 'Content empty' });
  
  const conversation = conversations.find(c => c.id === id);
  if (!conversation?.participantIds.includes(currentUser.id)) return res.status(403).json({ error: 'Forbidden' });

  const newMessage: Message = {
    id: Math.random().toString(36).substr(2, 9),
    conversationId: id,
    senderId: currentUser.id,
    content,
    timestamp: Date.now()
  };
  messages.push(newMessage);
  
  conversation.lastMessage = content;
  conversation.lastMessageTimestamp = newMessage.timestamp;
  
  res.status(201).json(newMessage);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));