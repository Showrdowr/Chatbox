// กำหนด Types (เพื่อให้ Backend มั่นใจว่าข้อมูลหน้าตาเป็นแบบนี้)
export interface User {
  id: string;
  name: string;
}

export interface Conversation {
  id: string;
  participants: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

// Mock Data
export const users: User[] = [
  { id: '1', name: 'David' },
  { id: '2', name: 'Simo' },
  { id: '3', name: 'Loki' },
  { id: '4', name: 'Thor' },
];

export const conversations: Conversation[] = [
  { id: 'conv_1', participants: ['1', '2'] },
];

export const messages: Message[] = [
  { id: 'msg_1', conversationId: 'conv_1', senderId: '2', content: 'Hey David, how are you?', timestamp: new Date(Date.now() - 100000).toISOString() },
  { id: 'msg_2', conversationId: 'conv_1', senderId: '1', content: 'I am good Simo! Ready for deployment?', timestamp: new Date().toISOString() },
];