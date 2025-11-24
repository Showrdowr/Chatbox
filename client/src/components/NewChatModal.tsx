import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function NewChatModal({ userId, onClose, onSelectUser }: any) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/users`, {
      headers: { 'x-user-id': userId }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, [userId]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50
                 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-purple-600 rounded-lg shadow-xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-purple-700/50">
          <h2 className="text-lg font-bold text-white">Start a New Chat</h2>
          <button onClick={onClose} className="text-purple-200 hover:text-white text-2xl leading-none">
            &times;
          </button>
        </div>
        
        <div className="space-y-1 max-h-64 overflow-y-auto p-2 bg-purple-600">
          {loading ? (
            <div className="p-4 text-center text-purple-200">Loading...</div>
          ) : (
            users.length > 0 ? users.map((u: any) => (
              <button
                key={u.id}
                onClick={() => onSelectUser(u.id)}
                className="w-full text-left p-3 rounded-lg mb-1
                           bg-gray-300 hover:bg-gray-400/50 transition"
              >
                <span className="font-medium text-black">{u.name}</span>
              </button>
            )) : (
              <div className="p-4 text-center text-purple-200">
                No other users to chat with.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}