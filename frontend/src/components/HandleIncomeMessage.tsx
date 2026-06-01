import { toast } from 'sonner';
import { NotificationToast } from './NotificationToast';
import type { Chat, Message } from '../lib/types';


export const handleIncomingMessage = (newMessage: Message, chatData: Chat) => {
    if (newMessage.fromMe) return;
    toast.custom((id) => (
        <NotificationToast
            message={newMessage}
            chat={chatData}
            onClose={() => toast.dismiss(id)} // Menggunakan ID dari Sonner untuk menutup
            onClick={() => {
                console.log("Buka chat ID:", newMessage.chatId);

                toast.dismiss(id);
            }}
        />
    ), {
        duration: 5000, // Durasi tayang (5 detik)
        position: 'top-right', // Posisi toast
    });
};