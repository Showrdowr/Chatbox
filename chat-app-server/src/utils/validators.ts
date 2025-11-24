import { z } from 'zod';

// Schema สำหรับสร้าง Conversation
export const createConversationSchema = z.object({
  // ลบ { required_error: ... } ออก ใช้แบบเรียบๆ แทน
  targetUserId: z.string().min(1, "targetUserId cannot be empty"), 
});

// Schema สำหรับส่ง Message
export const sendMessageSchema = z.object({
  // ลบ { required_error: ... } ออก
  content: z.string().min(1, "Content cannot be empty"), 
});