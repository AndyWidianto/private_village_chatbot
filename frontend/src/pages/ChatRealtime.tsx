import { Clock, Download, FileText, Image, Paperclip, Send, X } from "lucide-react";
import useChatRealtime from "../hooks/chatRealtime";

export default function ChatDashboard() {
    const {
        theme,
        toggleTheme,
        onDisconnect,
        handleSearch,
        containerRef,
        triggerRef,
        chats,
        handleSelectChat,
        handleSelectContact,
        contacts,
        messageInput,
        messages,
        setMessageInput,
        activeChat,
        activeContact,
        instance,
        hasMore,
        loading,
        onFormSubmit,
        selectedFile,
        fileType,
        cancelFileSelection,
        handleFileChange,
        imageInputRef,
        docInputRef,
        focusRef,
        messageRef,
        containerMessageRef,
        loadingMessage
    } = useChatRealtime();

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 transition-colors duration-300">
            <div className="w-80 sm:w-96 flex flex-col bg-white dark:bg-[#111827] border-r border-slate-200/80 dark:border-slate-800/60 transition-colors duration-300">

                {/* Info Instance Aktif & Tombol Toggle Tema */}
                <div className="p-4 bg-slate-50/60 dark:bg-[#1e293b]/40 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/60 flex items-center justify-between transition-colors duration-300">
                    <div className="truncate pr-2">
                        <div className="flex items-center space-x-2.5">
                            <div className="relative flex">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                                <span className="absolute top-0 left-0 w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-ping opacity-75" />
                            </div>
                            <h2 className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate tracking-wide">{instance?.name}</h2>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 tracking-wider truncate">{instance?.number}</p>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                        {/* Tombol Toggle Dark / Light */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80 rounded-xl transition-all duration-200 shadow-sm hover:scale-105 active:scale-95"
                            title={theme === 'dark' ? "Ubah ke Light Mode" : "Ubah ke Dark Mode"}
                        >
                            {theme === 'dark' ? (
                                <span className="text-xs block">☀️</span>
                            ) : (
                                <span className="text-xs block">🌙</span>
                            )}
                        </button>

                        {/* Tombol Keluar */}
                        <button
                            onClick={onDisconnect}
                            className="text-xs px-3 py-2 font-medium text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-white hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/20 border border-slate-200 dark:border-slate-700/80 rounded-xl transition-all duration-200 shadow-sm"
                            title="Ganti Instance"
                        >
                            Keluar
                        </button>
                    </div>
                </div>

                {/* Input Pencarian Obrolan */}
                <div className="p-3.5">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari kontak atau pesan..."
                            onChange={handleSearch}
                            className="w-full px-4 py-2 text-xs bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl transition-all"
                        />
                    </div>
                </div>

                {/* Daftar Kontak Chat */}
                <div ref={containerRef} className="flex-1 overflow-y-auto px-2 space-y-1 divide-y divide-transparent">
                    {chats.map((chat) => {
                        const isActive = activeChat?.id === chat.id;
                        return (
                            <div
                                key={chat.id}
                                onClick={() => handleSelectChat(chat)}
                                className={`group flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-200 relative ${isActive
                                    ? 'bg-indigo-600/10 dark:bg-indigo-600/15 shadow-sm shadow-indigo-500/5'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-3.5 bottom-3.5 w-1 bg-indigo-500 rounded-full" />
                                )}

                                <div className="flex items-center space-x-3 truncate pl-1">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 flex items-center justify-center font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-xs border border-indigo-500/10 shrink-0 shadow-inner">
                                        <img src={chat.profileUrl || "/public/default.png"} alt={chat.name || "profile"} className="object-cover w-full h-full rounded-full" />
                                    </div>
                                    <div className="truncate">
                                        <h4 className={`text-xs sm:text-sm font-medium transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {chat.name || "unknow"}
                                        </h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-1 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors">
                                            {chat.lastMessage}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-between h-9 ml-2 shrink-0">
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">{new Date(chat.updatedAt).toLocaleTimeString('id-ID', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })}</span>
                                    {chat.unreadCount > 0 && (
                                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-600 text-white rounded-md min-w-4 text-center shadow-sm shadow-indigo-600/20">
                                            {chat.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <div className="flex items-center my-2 px-4">
                        <div className="flex-1 border-t border-gray-200 dark:border-zinc-800"></div>
                        <span className="px-3 text-xs font-semibold tracking-wider text-gray-400 uppercase bg-transparent">
                            Contacts
                        </span>
                        <div className="flex-1 border-t border-gray-200 dark:border-zinc-800"></div>
                    </div>
                    {contacts.map((chat) => {
                        const isActive = activeContact?.id === chat.id;
                        return (
                            <div
                                key={chat.id}
                                onClick={() => handleSelectContact(chat)}
                                className={`group flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-200 relative ${isActive
                                    ? 'bg-indigo-600/10 dark:bg-indigo-600/15 shadow-sm shadow-indigo-500/5'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                    }`}
                            >
                                {/* Indikator Aktif Minimalis */}
                                {isActive && (
                                    <div className="absolute left-0 top-3.5 bottom-3.5 w-1 bg-indigo-500 rounded-full" />
                                )}

                                <div className="flex items-center space-x-3 truncate pl-1">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 flex items-center justify-center font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-xs border border-indigo-500/10 shrink-0 shadow-inner">
                                        <img src={chat.profileUrl || "/public/default.png"} alt="" className='object-cover w-full h-full rounded-full' />
                                    </div>
                                    <div className="truncate">
                                        <h4 className={`text-xs sm:text-sm font-medium transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {chat.name || "unknow"}
                                        </h4>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-1 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors">

                                        </p>
                                    </div>
                                </div>

                                {/* <div className="flex flex-col items-end justify-between h-9 ml-2 shrink-0">
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">{chat.time}</span>
                                    {chat.unread > 0 && (
                                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-600 text-white rounded-md min-w-4 text-center shadow-sm shadow-indigo-600/20">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div> */}
                            </div>
                        );
                    })}
                    <div
                        ref={triggerRef}
                        className="w-full h-[20px] py-6 flex items-center justify-center text-sm text-gray-500"
                    >
                        {loading && (
                            <div className="flex items-center gap-2">
                                {/* Efek spinner loading muter pakai bawaan Tailwind */}
                                <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Memuat data berikutnya...</span>
                            </div>
                        )}

                        {!hasMore && (
                            <span className="text-xs tracking-wide bg-gray-100 px-3 py-1 rounded-full">
                                🎉 Semua data obrolan telah dimuat
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-slate-100/60 dark:bg-[#101622] transition-colors duration-300">
                {activeChat || activeContact ? (
                    <>
                        {/* Header Ruang Obrolan */}
                        <div className="p-4 bg-white dark:bg-[#111827] border-b border-slate-200/80 dark:border-slate-800/60 flex items-center justify-between transition-colors duration-300 shadow-sm shadow-slate-100/10">
                            <div className="flex items-center space-x-3.5">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 dark:from-indigo-500/20 dark:to-cyan-500/20 flex items-center justify-center font-semibold text-indigo-600 dark:text-indigo-400 uppercase text-xs border border-indigo-500/10">
                                    <img src={activeChat?.profileUrl || activeContact?.profileUrl || "/public/default.png"} alt="" className="object-cover w-full h-full rounded-full" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wide">{activeChat?.name || activeContact?.name || activeContact?.number}</h3>
                                    <div className="flex items-center space-x-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
                                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium tracking-wide">Online via WhatsApp</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kontainer Pesan (Bubble Chat) */}
                        <div ref={containerMessageRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#efeae2] dark:bg-[#0b141a] transition-all duration-300">
                            <div ref={messageRef} className="p-2 w-full flex justify-center">
                                {loadingMessage && (
                                    <div className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {messages.map((msg) => {
                                const isMe = msg.fromMe;

                                const chatTime = new Date(msg.updatedAt).toLocaleTimeString('id-ID', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                });

                                const isImage = msg.type === 'image';
                                const isDocument = msg.type === 'document';

                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full mb-2`}>
                                        <div
                                            className={`relative max-w-[75%] md:max-w-[65%] rounded-xl shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] text-[14.2px] leading-normal group ${isImage ? 'p-1' : 'p-2 px-3' // Gambar di WA biasanya memiliki padding lebih tipis
                                                } ${isMe
                                                    ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] rounded-tr-none'
                                                    : 'bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-tl-none'
                                                }`}
                                        >
                                            {!isMe && msg.pushName && (
                                                <span className={`block text-xs font-semibold text-teal-600 dark:text-teal-400 mb-0.5 hover:underline cursor-pointer ${isImage ? 'pt-1 px-2' : ''}`}>
                                                    {msg.pushName}
                                                </span>
                                            )}

                                            {isImage && msg.url && (
                                                <div className="overflow-hidden rounded-lg max-w-full max-h-[300px] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                                    <img
                                                        src={msg.url}
                                                        alt={msg.content || "Gambar WhatsApp"}
                                                        className="object-cover w-full h-full cursor-pointer hover:opacity-95 transition-opacity"
                                                        loading="lazy"
                                                        onClick={() => window.open(msg.url || "", '_blank')} // Klik untuk buka gambar penuh
                                                    />
                                                </div>
                                            )}

                                            {/* RENDER MEDIA DOKUMEN */}
                                            {isDocument && msg.url && (
                                                <div className="flex items-center justify-between p-3 my-1 bg-[#f0f2f5] dark:bg-[#182229] rounded-lg border border-neutral-200 dark:border-neutral-700 max-w-sm">
                                                    <div className="flex items-center space-x-3 overflow-hidden">
                                                        <div className="p-2 bg-red-500 rounded-md text-white flex-shrink-0">
                                                            <FileText size={20} />
                                                        </div>
                                                        <div className="flex flex-col overflow-hidden text-left">
                                                            <span className="text-sm font-medium truncate pr-2">
                                                                Document
                                                            </span>
                                                            <span className="text-[11px] text-[#667781] dark:text-[#8696a0] uppercase">
                                                                {msg.mimetype?.split('/')[1] || 'FILE'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={msg.url}
                                                        download
                                                        className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full text-[#667781] dark:text-[#8696a0] flex-shrink-0"
                                                        title="Unduh Dokumen"
                                                    >
                                                        <Download size={18} />
                                                    </a>
                                                </div>
                                            )}

                                            {(!isImage && !isDocument || (msg.content && msg.content.trim() !== '')) && (
                                                <div className={`relative block break-words whitespace-pre-wrap ${isImage ? 'pt-2 px-2 pb-1' : 'pr-12'}`}>
                                                    {isDocument ? <p className="mt-2 text-sm">{msg.content}</p> : msg.content}
                                                    <span className="absolute bottom-[-2px] right-[-4px] flex items-center space-x-1 text-[10px] select-none tracking-tight text-[#667781] dark:text-[#8696a0]">

                                                        <span>{chatTime}</span>

                                                        {isMe && msg.status === 'pending' && (
                                                            <Clock size={10} className="animate-pulse mr-0.5" />
                                                        )}

                                                        {isMe && msg.status !== 'pending' && (
                                                            <span className={`text-[13px] leading-none ${msg.status === 'read' ? 'text-[#53bdeb]' : 'text-[#8696a0]'}`}>
                                                                {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓✓' : msg.status === 'sent' ? '✓' : ''}
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            {isImage && (!msg.content || msg.content.trim() === '') && (
                                                <span className="absolute bottom-2 right-2 flex items-center space-x-1 text-[10px] text-white bg-black/40 backdrop-blur-[1px] px-1.5 py-0.5 rounded-full select-none tracking-tight">
                                                    {isMe && msg.status === 'pending' && (
                                                        <Clock size={10} className="animate-pulse text-white/80 mr-0.5" />
                                                    )}

                                                    <span>{chatTime}</span>

                                                    {isMe && msg.status !== 'pending' && (
                                                        <span className={`text-[13px] leading-none ${msg.status === 'read' ? 'text-[#53bdeb]' : 'text-white/70'}`}>
                                                            {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓✓' : msg.status === 'sent' ? '✓' : ''}
                                                        </span>
                                                    )}
                                                </span>
                                            )}

                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={focusRef} className="p-2 w-full"></div>
                        </div>

                        {/* Input Form Kirim Pesan */}
                        <div className="flex flex-col bg-[#f0f2f5] dark:bg-[#111b21]">
                            {/* PREVIEW FILE SEBELUM DIKIRIM (Melayang di atas input chat) */}
                            {selectedFile && (
                                <div className="px-4 py-2 bg-white dark:bg-[#222e35] border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-between transition-all duration-200">
                                    <div className="flex items-center space-x-3 text-sm">
                                        {fileType === 'image' ? (
                                            <Image className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <FileText className="w-5 h-5 text-blue-500" />
                                        )}
                                        <div className="truncate max-w-xs md:max-w-md">
                                            <p className="text-slate-800 dark:text-slate-200 font-medium truncate text-xs">{selectedFile.name}</p>
                                            <p className="text-[10px] text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={cancelFileSelection}
                                        className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* UTAMA FORM CHAT */}
                            <form onSubmit={onFormSubmit} className="p-2.5 px-4 bg-[#f0f2f5] dark:bg-[#202c33] flex items-center space-x-2 transition-colors duration-300 relative">
                                <input
                                    type="file"
                                    ref={imageInputRef}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, 'image')}
                                />
                                <input
                                    type="file"
                                    ref={docInputRef}
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, 'document')}
                                />

                                {/* TOMBOL ATTACHMENT (Dropdown/Grup Tombol) */}
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                    {/* Tombol Gambar */}
                                    <button
                                        type="button"
                                        onClick={() => imageInputRef.current?.click()}
                                        className="p-2 rounded-full text-slate-500 dark:text-[#aebac1] hover:bg-slate-200 dark:hover:bg-[#374248] transition-colors"
                                        title="Kirim Gambar"
                                    >
                                        <Image className="w-5 h-5" />
                                    </button>

                                    {/* Tombol Dokumen */}
                                    <button
                                        type="button"
                                        onClick={() => docInputRef.current?.click()}
                                        className="p-2 rounded-full text-slate-500 dark:text-[#aebac1] hover:bg-slate-200 dark:hover:bg-[#374248] transition-colors"
                                        title="Kirim Dokumen"
                                    >
                                        <Paperclip className="w-5 h-5 rotate-45" />
                                    </button>
                                </div>

                                {/* INPUT TEXT BOX */}
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder={selectedFile ? "Tambahkan keterangan pesan..." : "Ketik pesan..."}
                                    className="flex-1 px-4 py-2 bg-white dark:bg-[#2a3942] border-none focus:outline-none text-[15px] text-[#111b21] dark:text-[#e9edef] placeholder-[#667781] dark:placeholder-[#8696a0] rounded-lg shadow-sm transition-all"
                                />

                                {/* TOMBOL SUBMIT / SEND */}
                                <button
                                    type="submit"
                                    disabled={!messageInput.trim() && !selectedFile}
                                    className={`p-2.5 rounded-full flex-shrink-0 transition-all shadow-sm ${(messageInput.trim() || selectedFile)
                                        ? 'bg-emerald-600 hover:bg-emerald-500 dark:bg-[#00a884] dark:hover:bg-[#00bfa5] text-white hover:scale-105 active:scale-95'
                                        : 'bg-transparent text-slate-400 dark:text-[#8696a0] cursor-not-allowed'
                                        }`}
                                >
                                    <Send className="w-4 h-4 translate-x-[1px]" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-50/20 dark:bg-transparent">
                        <div className="p-6 rounded-full bg-slate-100 dark:bg-[#1e293b]/30 mb-3 border border-slate-200/40 dark:border-slate-800/40 shadow-inner">
                            <span className="text-2xl block opacity-60">💬</span>
                        </div>
                        <p className="text-xs sm:text-sm font-medium tracking-wide">Pilih obrolan di sebelah kiri untuk mulai membaca pesan.</p>
                    </div>
                )}
            </div>

        </div>
    );
}