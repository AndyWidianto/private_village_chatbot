import { Bot, BotIcon, FilesIcon, LogOut } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import useDashboardUser from '../../hooks/useDashboardUser';
import type { Complaint, Message } from '../../lib/types';
import useAxios from '../../lib/axios.service';
import { useAuthStore } from '../../lib/store/authStore';
import Markdown from 'react-markdown';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';


const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).format(new Date(date));
};
const DashboardWarga = () => {
  const {
    messages,
    number,
    setMessages
  } = useDashboardUser();
  const { user, logout } = useAuthStore();
  const { axiosPrivate } = useAxios();
  const [activeMenu, setActiveMenu] = useState('chatbot');
  const [compliants, setComplaints] = useState<Complaint[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputMessage, setInputMessage] = useState("");

  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!number) return;
    if (!inputMessage.trim()) return;
    try {
      const userMsg: Message = {
        id: `${Date.now()}`,
        content: inputMessage,
        pushName: user?.name || "",
        fromMe: false,
        status: "pending",
        whatsappId: number,
        remoteJid: number,
        type: "text",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMsg]);
      setInputMessage("");
      const res = await axiosPrivate.post(`/chatbot`, {
        id: number,
        message: userMsg.content
      });
      const data = res.data;
      const botMsg: Message = {
        id: `${Date.now()}`,
        content: data.message,
        pushName: user?.name || "",
        fromMe: true,
        status: "sent",
        whatsappId: number,
        remoteJid: number,
        type: "text",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Fetch error: ", err);
    }
  };
  const fetchDataComplaints = async () => {
    try {
      const res = await axiosPrivate.get(`/complaints/me`);
      const data = res.data;
      console.log(data);
      setComplaints(data);
    } catch (err) {
      console.error("Fetch Error: ", err);
    }
  }
  const handleLogout = async () => {
    if (!confirm("Apakah anda yakin ingin logout?")) return;
    try {
      await axiosPrivate.post("/logout");
      localStorage.removeItem("accessToken");
      navigate("/login");
      toast.success("Berhasil logout", {
        style: {
          borderRadius: '12px',
          background: '#1e293b',
          color: '#fff',
        },
      });
      logout();
    } catch (err: any) {
      console.error("Logout Error:", err);
      navigate("/login");
    }
  };
  useEffect(() => {
    fetchDataComplaints();
  }, [])

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>

      {/* ================= SIDEBAR (Sesuai image_103d80.png) ================= */}
      <aside className="w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-between p-5 flex-shrink-0">
        <div className="space-y-8">

          <div className="flex items-center gap-3 px-2 py-1">
            <div className="relative p-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center text-white">
              <Bot className='w-6 h-6' />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-orange-400 blur-sm opacity-60"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Chat<span className="text-blue-600 dark:text-blue-400">BOT</span>
            </span>
          </div>

          {/* Menu Navigation */}
          <nav className="space-y-1">

            {/* Menu: Chatbot */}
            <button
              onClick={() => setActiveMenu('chatbot')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeMenu === 'chatbot'
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <BotIcon className='w-6 h-6' />
              Chatbot
            </button>

            {/* Menu: Pengaduan */}
            <button
              onClick={() => setActiveMenu('pengaduan')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeMenu === 'pengaduan'
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <FilesIcon className="w-6 h-6" />
              Pengaduan
            </button>

            <button
              onClick={() => setActiveMenu('setting')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeMenu === 'setting'
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.754c-.309.23-.453.619-.395.997.015.093.023.187.023.282 0 .095-.008.189-.023.282-.058.378.086.767.395.997l1.003.754a1.125 1.125 0 0 1 .26 1.43l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.216-.456c-.356-.133-.751-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.754c.309-.23.453-.619.395-.997a6.244 6.244 0 0 1-.023-.282c0-.095.008-.189.023-.282.058-.378-.086-.767-.395-.997l-1.004-.754a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.49l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              Setting
            </button>
          </nav>
        </div>

        {/* User Profile Info Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-2 my-4 rounded-xl text-sm font-medium transition-all bg-red-200 text-red-500`}
          >
            <LogOut className="w-6 h-6" />
            Keluar Sesi
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm">
              {(user?.name || "B").slice(0, 1)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">Budi Santoso</p>
              <p className="text-[10px] text-slate-400 truncate">Warga Terverifikasi</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= AREA UTAMA (KONTEN DINAMIS) ================= */}
      <main className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950">

        {/* VIEW: CHATBOT */}
        {activeMenu === 'chatbot' && (
          <div className="flex flex-col h-full max-w-4xl mx-auto w-full p-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col h-full shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">Layanan Mandiri ChatBOT</h2>
                  <p className="text-xs text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Alur Pra-Laporan Aktif
                  </p>
                </div>
              </div>

              {/* Box Chat */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/20">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${!msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-3 px-4 rounded-2xl text-sm leading-relaxed shadow-sm ${!msg.fromMe
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                      }`}>
                      {msg.fromMe ? <Markdown>{msg.content}</Markdown> : msg.content}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Form Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ketik pesan keluhan ke bot..."
                  className="flex-1 bg-slate-50 dark:bg-slate-950 text-sm border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-xl font-medium transition shadow-sm">
                  Kirim
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: PENGADUAN */}
        {activeMenu === 'pengaduan' && (
          <div className="p-8 overflow-y-auto h-full max-w-5xl w-full mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Daftar Riwayat Pengaduan</h2>
              <p className="text-sm text-slate-400">Gunakan data Anda untuk melacak penanganan berkas resmi</p>
            </div>

            <div className="grid gap-4">
              {compliants.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded">
                        {item.id}
                      </span>
                      <h3 className="font-bold text-slate-800 dark:text-white text-base mt-2">{item.title}</h3>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.status === "RESOLVED" ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/30'
                      }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Dilaporkan pada: {formatDate(item.createdAt)}</p>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                    <strong className="block text-slate-700 dark:text-slate-200 mb-1">Hasil Tanggapan Instansi:</strong>
                    {item.officerNotes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: SETTING */}
        {activeMenu === 'setting' && (
          <div className="p-8 max-w-2xl w-full mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pengaturan Akun Warga</h2>
              <p className="text-sm text-slate-400">Konfigurasi sinkronisasi data kependudukan dan integrasi WhatsApp</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Tema Aplikasi Dashboard</h4>
                  <p className="text-xs text-slate-400">Ganti tampilan mode gelap atau terang</p>
                </div>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  {isDarkMode ? '☀️ Mode Terang' : '🌙 Mode Gelap'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default DashboardWarga;