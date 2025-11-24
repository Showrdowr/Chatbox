import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { users, conversations, messages, Conversation, Message } from '../data/store';
import { createConversationSchema, sendMessageSchema } from '../utils/validators'; // 1. นำเข้า schema

// ... (getConversations เหมือนเดิม) ...
export const getConversations = (req: AuthRequest, res: Response) => {
    // ... (โค้ดเดิม)
    try {
        const userId = req.currentUser!.id;
        const userConvs = conversations.filter(c => c.participants.includes(userId));
        
        const result = userConvs.map(c => {
          const otherUserId = c.participants.find(pid => pid !== userId);
          const otherUser = users.find(u => u.id === otherUserId);
          
          const convMessages = messages
            .filter(m => m.conversationId === c.id)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); 
    
          return {
            id: c.id,
            otherUser: otherUser ? otherUser : { id: 'unknown', name: 'Unknown User' },
            lastMessage: convMessages[0] || null,
          };
        })
        .sort((a, b) => {
          const dateA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
          const dateB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
          return dateB - dateA;
        });
    
        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Error' });
      }
};

// POST /conversations
export const createConversation = (req: AuthRequest, res: Response) => {
  // 2. ตรวจสอบข้อมูลด้วย Zod
  const validation = createConversationSchema.safeParse(req.body);
  
  if (!validation.success) {
    // ถ้าข้อมูลผิดรูปแบบ ส่ง error กลับไปทันที
    res.status(400).json({ error: validation.error.issues[0].message });
    return;
  }

  const { targetUserId } = validation.data; // ใช้ข้อมูลที่ผ่านการ validate แล้ว
  const currentUserId = req.currentUser!.id;

  if (targetUserId === currentUserId) {
    res.status(400).json({ error: 'Cannot chat with yourself' });
    return;
  }

  const existing = conversations.find(c => 
    c.participants.includes(currentUserId) && c.participants.includes(targetUserId)
  );
  
  if (existing) {
    res.json({ id: existing.id, isNew: false });
    return;
  }
  
  const newConv: Conversation = {
    id: `conv_${Date.now()}`,
    participants: [currentUserId, targetUserId]
  };
  
  conversations.push(newConv);
  res.status(201).json({ id: newConv.id, isNew: true });
};

// ... (deleteConversation และ getMessages เหมือนเดิม) ...
export const deleteConversation = (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const currentUserId = req.currentUser!.id;
    
    const convIndex = conversations.findIndex(c => c.id === id);
    if (convIndex === -1) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }
    
    const conversation = conversations[convIndex];
    if (!conversation.participants.includes(currentUserId)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
  
    // ลบ Conversation
    conversations.splice(convIndex, 1);
  
    // ลบ Messages
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].conversationId === id) {
        messages.splice(i, 1);
      }
    }
  
    res.json({ success: true });
  };
  
  // GET /conversations/:id/messages
  export const getMessages = (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const currentUserId = req.currentUser!.id;
  
    const conversation = conversations.find(c => c.id === id);
    
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }
    if (!conversation.participants.includes(currentUserId)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    
    const convMessages = messages
      .filter(m => m.conversationId === id)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
    res.json(convMessages);
  };

// POST /conversations/:id/messages
export const sendMessage = (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  // 3. ตรวจสอบข้อมูลด้วย Zod
  const validation = sendMessageSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: validation.error.issues[0].message });
    return;
  }

  const { content } = validation.data;
  const currentUserId = req.currentUser!.id;
  
  const conversation = conversations.find(c => c.id === id);
  if (!conversation) {
    res.status(404).json({ error: 'Conversation not found' });
    return;
  }
  if (!conversation.participants.includes(currentUserId)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  
  const newMessage: Message = {
    id: `msg_${Date.now()}`,
    conversationId: id,
    senderId: currentUserId,
    content,
    timestamp: new Date().toISOString()
  };
  
  messages.push(newMessage);
  res.status(201).json(newMessage);
};