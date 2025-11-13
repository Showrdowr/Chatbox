import { useState, useEffect } from 'react';

// Types (ไม่เปลี่ยน)
interface User { id: string; name: string; }
interface Conversation { 
  id: string; 
  otherUser: User; 
  lastMessage: string; 
  lastMessageTimestamp: number; 
}
interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  senderName: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");

  // --- Data Fetching Logic (ไม่เปลี่ยน) ---
  useEffect(() => {
    fetch('http://localhost:3001/users').then(res => res.json()).then(setUsers);
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    fetchConversations();
  }, [currentUser]);

  useEffect(() => {
    if (!selectedConversationId || !currentUser) return;
    fetchMessages(selectedConversationId);
    const interval = setInterval(() => fetchMessages(selectedConversationId), 2000);
    return () => clearInterval(interval);
  }, [selectedConversationId, currentUser]);

  const fetchConversations = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('http://localhost:3001/conversations', {
        headers: { 'x-user-id': currentUser.id }
      });
      if (res.ok) setConversations(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchMessages = async (convId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`http://localhost:3001/conversations/${convId}/messages`, {
        headers: { 'x-user-id': currentUser.id }
      });
      if (res.ok) setMessages(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !selectedConversationId || !currentUser) return;
    try {
      await fetch(`http://localhost:3001/conversations/${selectedConversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser.id },
        body: JSON.stringify({ content: inputText })
      });
      setInputText("");
      fetchMessages(selectedConversationId);
      fetchConversations();
    } catch (err) { console.error(err); }
  };

  const startConversation = async (targetUserId: string) => {
     if (!currentUser) return;
     const res = await fetch('http://localhost:3001/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser.id },
        body: JSON.stringify({ targetUserId })
     });
     const newConv = await res.json();
     await fetchConversations();
     setSelectedConversationId(newConv.id);
  };

  // --- UI START (ส่วนที่ถูกปรับแต่ง) ---

  // Login Screen
  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 font-sans">
        <div className="p-10 bg-white rounded-2xl shadow-xl text-center w-96 max-w-sm">
          <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Welcome to TeleChat</h1>
          <p className="text-gray-600 mb-6">Select a user to log in and start chatting.</p>
          <div className="space-y-4">
            {users.map(u => (
              <button key={u.id} onClick={() => setCurrentUser(u)}
                className="block w-full px-5 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 ease-in-out transform hover:-translate-y-1">
                Login as {u.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Chat Screen
  return (
    <div className="flex h-screen bg-slate-100 font-sans antialiased">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-lg">
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md">
          <h2 className="font-bold text-xl">TeleChat</h2>
          <p className="text-sm opacity-90">Logged in: {currentUser.name}</p>
        </div>
        
        <div className="p-3 border-b border-slate-200">
            <select className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-indigo-500 focus:border-indigo-500 transition"
                onChange={(e) => startConversation(e.target.value)} value="">
                <option value="" disabled>+ Start New Conversation</option>
                {users.filter(u => u.id !== currentUser.id).map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                ))}
            </select>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map(c => (
            <div key={c.id} onClick={() => setSelectedConversationId(c.id)}
              className={`flex items-center gap-3 p-4 border-b border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors duration-150 ${selectedConversationId === c.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-indigo-800 font-bold text-lg">
                {c.otherUser?.name[0]} {/* Initial for profile pic */}
              </div>
              <div>
                <div className="font-semibold text-gray-800">{c.otherUser?.name}</div>
                <div className="text-sm text-gray-500 truncate">{c.lastMessage || 'No messages yet'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversationId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md">
               <h3 className="font-bold text-xl">{conversations.find(c => c.id === selectedConversationId)?.otherUser?.name || 'Chat Room'}</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {messages.map(m => {
                const isMe = m.senderId === currentUser.id;
                return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-md ${isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-slate-200'}`}>
                            {!isMe && <div className="text-xs font-bold mb-1 text-slate-500">{m.senderName}</div>}
                            <div>{m.content}</div>
                            <div className={`text-xs mt-1 ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                              {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                );
              })}
            </div>

            <div className="p-4 bg-white border-t border-slate-200 shadow-lg">
              <div className="flex gap-3 w-full">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 border border-slate-300 rounded-full px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition"
                  placeholder="Type your message..."
                />
                <button 
                  onClick={handleSendMessage}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 font-medium shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5">
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-lg bg-slate-50">
            <p className="p-4 rounded-xl bg-white shadow-lg border border-slate-200">
              👋 Select a conversation or start a new one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;