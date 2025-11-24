import React, { useState, useEffect, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function ChatWindow({ conversation, messages, currentUserId, onSendMessage, onFetchMessages }: any) {
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Auto-scroll to bottom (ทำงานเมื่อ messages เปลี่ยน)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 2. Polling Mechanism (ดึงข้อความใหม่ทุก 2 วินาที)
  useEffect(() => {
    if (!conversation) return;

    // ฟังก์ชันดึงข้อมูล (ใช้ onFetchMessages ที่ส่งมาจาก App.tsx ถ้ามี หรือ fetch เอง)
    // แต่เพื่อให้ง่ายและไม่ต้องแก้ App.tsx เยอะ เรา fetch เองในนี้ได้เลย หรือใช้ prop ที่ส่งมา
    // ในที่นี้ App.tsx ส่ง messages มาให้ เราจึงควร trigger ให้ App.tsx fetch ใหม่
    
    // แต่ App.tsx ปัจจุบันไม่ได้ส่งฟังก์ชัน fetch มาให้ ChatWindow โดยตรง
    // เราจึงต้องเพิ่ม interval ใน ChatWindow เพื่อเรียก fetch เอง หรือให้ App.tsx ทำ
    
    // วิธีที่ง่ายที่สุดโดยไม่ต้องรื้อ App.tsx คือทำใน ChatWindow นี้เลยครับ
    // แต่เดี๋ยวก่อน! messages ถูกส่งมาจาก App.tsx (ผ่าน props)
    // ดังนั้นการทำ Polling *ควรจะอยู่ที่ App.tsx* หรือ *ส่งฟังก์ชัน refresh มาให้*
    
  }, [conversation]); // (Logic นี้ซับซ้อนถ้าแก้ตรงนี้)

  // --- เปลี่ยนแผน! เราจะแก้ที่ App.tsx แทนครับ เพื่อให้ Clean ---
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
  };
  
  const formatTimestamp = (isoString: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg: any) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
              
              {isMe && (
                <span className="text-xs text-gray-400 mb-1">
                  {formatTimestamp(msg.timestamp)}
                </span>
              )}
              
              <div
                className={`
                  max-w-[60%] p-3 px-5 rounded-3xl text-sm font-medium
                  ${isMe
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-black'
                  }
                `}
              >
                <p>{msg.content}</p>
              </div>

              {!isMe && (
                <span className="text-xs text-gray-400 mb-1">
                  {formatTimestamp(msg.timestamp)}
                </span>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 bg-gray-200 rounded-full p-2">
          <input
            type="text"
            className="flex-1 bg-transparent rounded-full px-4 py-2 text-black
                       placeholder-gray-600 focus:outline-none"
            placeholder="Text Box"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!text.trim()}
            className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold
                       hover:bg-blue-600 disabled:opacity-50 transition"
          >
            send
          </button>
        </form>
      </div>
    </div>
  );
}