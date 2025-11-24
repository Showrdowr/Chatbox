import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow'; 
import ConversationList from './components/ConversationList';
import NewChatModal from './components/NewChatModal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const getInitialUser = () => {
  const savedUser = localStorage.getItem('chat-user');
  try { return savedUser ? JSON.parse(savedUser) : null; } 
  catch (e) { return null; }
}

// --- ส่วนที่แก้ไข: RoleLoginScreen ---
function RoleLoginScreen({ onLogin }: any) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${API_BASE}/roles`);
        if (!res.ok) throw new Error('Failed to fetch roles');
        const data = await res.json();
        setRoles(data);
      } catch (err: any) { setError(err.message); } 
      finally { setLoading(false); }
    };
    fetchRoles();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center bg-purple-600 text-white font-bold text-xl">Loading...</div>;
  if (error) return <div className="h-screen flex items-center justify-center bg-purple-600 text-red-200 font-bold">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-purple-600 font-sans">
      <h1 className="text-3xl font-bold text-white mb-12 tracking-wide drop-shadow-md">
        Select Your Role
      </h1>
      
      <div className="flex flex-wrap justify-center gap-10 px-4">
        {roles.map((role: any) => (
          <button
            key={role.id}
            onClick={() => onLogin(role)}
            className="flex flex-col items-center group transition-transform duration-200 hover:scale-110 focus:outline-none"
          >
            {/* วงกลมโปรไฟล์ */}
            <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center 
                          shadow-lg ring-4 ring-gray-300/30 group-hover:ring-white/60 transition-all duration-300 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-gray-500" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              </svg>
            </div>
            
            {/* ชื่อ Role: ตัวดำ กรอบขาว */}
            <div className="bg-white px-4 py-1 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300">
              <span className="text-lg font-bold text-black tracking-wide">
                {role.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ... (ส่วนอื่นๆ เหมือนเดิม) ...
export default function App() {
  const [currentUser, setCurrentUser] = useState(getInitialUser); 
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogin = (user: any) => { setCurrentUser(user); localStorage.setItem('chat-user', JSON.stringify(user)); };
  const handleLogout = () => { setCurrentUser(null); localStorage.removeItem('chat-user'); setConversations([]); setActiveConvId(null); setMessages([]); };
  
  useEffect(() => {
    if (!currentUser) { setLoading(false); return; }
    setLoading(true); setError(null);
    const loadChatData = async () => {
      try { await fetchConversations(currentUser.id); } 
      catch (err: any) { console.error(err); setError(err.message); } 
      finally { setLoading(false); }
    };
    loadChatData();
  }, [currentUser]);

  const fetchConversations = async (userId: string) => {
    const res = await fetch(`${API_BASE}/conversations`, { headers: { 'x-user-id': userId } });
    if (!res.ok) throw new Error('Failed to fetch conversations');
    const data = await res.json();
    setConversations(data);
  };

   useEffect(() => {
    if (!activeConvId || !currentUser) { 
      setMessages([]); 
      return; 
    }
    // สร้างฟังก์ชันนี้ขึ้นมาเพื่อให้เรียกใช้ซ้ำได้
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_BASE}/conversations/${activeConvId}/messages`, { 
          headers: { 'x-user-id': currentUser.id } 
        });
        if (res.ok) { 
          const data = await res.json(); 
          // เช็คก่อน set เพื่อลดการ re-render ที่ไม่จำเป็น (Optional optimization)
          setMessages(data); 
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };
    fetchMessages(); // เรียกครั้งแรก
    // ตั้งเวลาให้เรียกทุก 2 วินาที (2000 ms)
    const interval = setInterval(fetchMessages, 2000);
    // ล้างเวลาเมื่อเปลี่ยนห้องแชท
    return () => clearInterval(interval);
  }, [activeConvId, currentUser]);

  const handleSendMessage = async (content: string) => {
    const res = await fetch(`${API_BASE}/conversations/${activeConvId}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser.id }, body: JSON.stringify({ content }) });
    if (res.ok) { const newMsg = await res.json(); setMessages([...messages, newMsg] as any); await fetchConversations(currentUser.id); } 
    else { console.error('Failed to send message.'); }
  };

  const handleCreateConversation = async (targetUserId: string) => {
    const res = await fetch(`${API_BASE}/conversations`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser.id }, body: JSON.stringify({ targetUserId }) });
    if (res.ok) { const data = await res.json(); await fetchConversations(currentUser.id); setActiveConvId(data.id); setIsModalOpen(false); } 
    else { console.error('Failed to create conversation.'); }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (!confirm('Are you sure you want to delete this chat?')) return;
    const res = await fetch(`${API_BASE}/conversations/${conversationId}`, { method: 'DELETE', headers: { 'x-user-id': currentUser.id } });
    if (res.ok) { if (activeConvId === conversationId) { setActiveConvId(null); setMessages([]); } await fetchConversations(currentUser.id); } 
    else { console.error('Failed to delete conversation'); }
  };
  
  if (!currentUser) return <RoleLoginScreen onLogin={handleLogin} />;
  
  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans text-slate-800">
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 flex items-center justify-between bg-purple-600 shadow-md z-10">
          <span className="font-bold text-2xl text-white tracking-tight">{currentUser.name}</span>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold
                       hover:bg-red-600 transition shadow-sm"
          >
            Log-Out
          </button>
        </div>
        
        <ConversationList 
          conversations={conversations} 
          activeId={activeConvId} 
          onSelect={setActiveConvId}
          onDelete={handleDeleteConversation} 
          onNewChat={() => setIsModalOpen(true)}
        />
      </div>

      <div className="flex-1 flex flex-col relative bg-white">
        {activeConvId ? (
          <ChatWindow 
            conversation={conversations.find((c: any) => c.id === activeConvId)}
            messages={messages}
            currentUserId={currentUser.id}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white">
            <p className="font-medium text-xl text-gray-400">Select a conversation</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <NewChatModal userId={currentUser.id} onClose={() => setIsModalOpen(false)} onSelectUser={handleCreateConversation} />
      )}
    </div>
  );
}