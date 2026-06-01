import React, { useState } from 'react';

// Mock data chat
const mockChats = [
  { id: 1, name: 'Budi Setiawan', lastMsg: 'Mas, fitur broadcastnya sudah aman?', time: '10:42', unread: 2 },
  { id: 2, name: 'Siti Rahma (Desa Sejahtera)', lastMsg: 'Terima kasih informasinya pak.', time: '09:15', unread: 0 },
  { id: 3, name: 'Andi Wijaya', lastMsg: 'P', time: 'Kemarin', unread: 0 },
];


interface ChatDashboardProps {
  instance: any;
  onDisconnect: () => void;
}
export default function ChatDashboard({ instance, onDisconnect }: ChatDashboardProps) {
  const [activeChat, setActiveChat] = useState(mockChats[0]);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Halo, ada yang bisa dibantu dari layanan desa?', sender: 'me', time: '10:30' },
    { id: 2, text: 'Mas, fitur broadcastnya sudah aman? Saya mau coba kirim pengumuman warga.', sender: 'them', time: '10:42' },
  ]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    // Tambah pesan baru ke state (simulasi real-time)
    setMessages([
      ...messages,
      { id: Date.now(), text: messageInput, sender: 'me', time: '10:43' }
    ]);
    setMessageInput('');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      
      {/* SIDEBAR KIRI: Daftar Chat */}
      <div className="w-80 sm:w-96 flex flex-col bg-slate-900 border-r border-slate-800">
        
        {/* Info Instance Aktif */}
        <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="truncate pr-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <h2 className="font-bold text-sm text-slate-200 truncate">{instance.name}</h2>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">{instance.phone}</p>
          </div>
          <button 
            onClick={onDisconnect}
            className="text-xs text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-rose-950/30 p-2 rounded-lg border border-slate-700 hover:border-rose-900/50 transition-colors shrink-0"
            title="Ganti Instance"
          >
            Keluar
          </button>
        </div>

        {/* Input Pencarian Obrolan */}
        <div className="p-3">
          <input 
            type="text" 
            placeholder="Cari kontak atau pesan..." 
            className="w-full px-4 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-200 placeholder-slate-500"
          />
        </div>

        {/* Daftar Kontak Chat */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
          {mockChats.map((chat) => {
            const isActive = activeChat?.id === chat.id;
            return (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${isActive ? 'bg-indigo-600/10 border-l-4 border-indigo-500' : 'hover:bg-slate-850'}`}
              >
                <div className="flex items-center space-x-3 truncate">
                  {/* Avatar Inisial */}
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300 uppercase tracking-wider text-sm shrink-0">
                    {chat.name.substring(0, 2)}
                  </div>
                  <div className="truncate">
                    <h4 className="text-sm font-semibold text-slate-200 truncate">{chat.name}</h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{chat.lastMsg}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-center ml-2 shrink-0">
                  <span className="text-[10px] text-slate-500">{chat.time}</span>
                  {chat.unread > 0 && (
                    <span className="mt-1 px-1.5 py-0.5 text-[10px] font-bold bg-indigo-500 text-white rounded-full min-w-5 text-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PANEL KANAN: Ruang Obrolan Utamanya */}
      <div className="flex-1 flex flex-col bg-slate-950">
        {activeChat ? (
          <>
            {/* Header Ruang Obrolan */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300 uppercase text-sm">
                  {activeChat.name.substring(0, 2)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">{activeChat.name}</h3>
                  <span className="text-[11px] text-emerald-400">Online via WhatsApp</span>
                </div>
              </div>
            </div>

            {/* Kontainer Pesan (Bubble Chat) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
              {messages.map((msg) => {
                const isMe = msg.sender === 'me';
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md p-3 rounded-xl shadow-md text-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                      <p className="leading-relaxed">{msg.text}</p>
                      <span className={`block text-[10px] text-right mt-1.5 ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Form Kirim Pesan */}
            <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 border-t border-slate-800 flex items-center space-x-3">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Ketik pesan balasan..."
                className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-sm text-slate-200 placeholder-slate-500"
              />
              <button 
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-indigo-600/20 shrink-0"
              >
                Kirim
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <p className="text-sm">Pilih obrolan di sebelah kiri untuk mulai membaca pesan.</p>
          </div>
        )}
      </div>

    </div>
  );
}