import React from 'react';

export default function ConversationList({ conversations, activeId, onSelect, onDelete, onNewChat }: any) {
  
  const formatTimestamp = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    // (เปลี่ยนพื้นหลังเป็นสีขาว)
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="p-2 bg-purple-600 pb-4"> {/* (ให้ส่วนปุ่มอยู่บนพื้นม่วง เชื่อมกับ Header) */}
        <button 
          onClick={onNewChat}
          className="w-full text-center py-2 bg-purple-500/80 text-white rounded-md 
                     hover:bg-purple-500 transition font-medium border border-purple-400"
        >
          + New Chat
        </button>
      </div>
      
      <div className="space-y-1 p-2">
        {conversations.length === 0 && <div className="p-4 text-gray-400 text-sm text-center">No chats yet.</div>}
        
        {conversations.map((conv: any) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`
              p-3 cursor-pointer transition-colors border-b border-gray-100
              ${activeId === conv.id 
                ? 'bg-gray-400' // (สีเทาเข้มเมื่อเลือก - ตามต้นแบบ)
                : 'bg-gray-200 hover:bg-gray-300' // (สีเทาอ่อนปกติ - ตามต้นแบบ)
              }
            `}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-black truncate text-lg">
                  {conv.otherUser?.name || 'Unknown'}
                </h3>
                <p className="text-sm text-gray-700 truncate">
                  {conv.lastMessage ? conv.lastMessage.content : 'No messages'}
                </p>
                <span className="text-xs text-gray-600">
                  {formatTimestamp(conv.lastMessage?.timestamp)}
                </span>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
                className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-md 
                           ml-2 flex-shrink-0 hover:bg-red-600 transition h-fit mt-1"
              >
                ลบแชท
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}