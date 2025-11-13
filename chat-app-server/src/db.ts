// src/db.ts
export interface User {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  participantIds: string[]; // IDs of users in the chat
  lastMessage?: string;
  lastMessageTimestamp?: number;
}

// Mock Data Store (In-memory)
export const users: User[] = [
  { id: "user1", name: "Sakura" },
  { id: "user2", name: "Naruto" },
  { id: "user3", name: "Sasuke" },
];

export const conversations: Conversation[] = [];
export const messages: Message[] = [];