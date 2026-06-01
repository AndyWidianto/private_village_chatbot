import React from 'react';
import type { Chat, Message } from '../lib/types';

interface NotificationToastProps {
    message: Message;
    chat: Chat;
    onClose: () => void;
    onClick?: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ 
    message, 
    chat, 
    onClose, 
    onClick 
}) => {
    const senderName = chat.name || message.pushName || "Nomor Baru";
    const renderContent = () => {
        if (message.type !== 'text') {
            return `📷 [${message.type}]`;
        }
        return message.content;
    };

    return (
        <div 
            onClick={onClick}
            className="max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
        >
            <div className="flex-1 p-4">
                <div className="flex items-start">
                    {/* Avatar / Foto Profil */}
                    <div className="flex-shrink-0 pt-0.5 relative">
                        {chat.profileUrl ? (
                            <img
                                className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-500/20"
                                src={chat.profileUrl}
                                alt={senderName}
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold">
                                {senderName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        {/* Badging Unread Count jika lebih dari 1 */}
                        {chat.unreadCount > 1 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white dark:border-slate-800">
                                {chat.unreadCount}
                            </span>
                        )}
                    </div>

                    {/* Konten Pesan */}
                    <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                                {senderName}
                            </p>
                            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 max-w-[80px] truncate">
                                {chat.instanceName}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 break-all">
                            {renderContent()}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex border-l border-slate-200 dark:border-slate-700">
                <button
                    onClick={(e) => {
                        e.stopPropagation(); 
                        onClose();
                    }}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 focus:outline-none"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};