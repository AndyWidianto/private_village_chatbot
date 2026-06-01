import { create } from 'zustand';
import type { Message } from '../types';

interface RoomChat {
    id: string;
    nextId: string | null; // Bisa null kalau data sudah habis
    hasMore: boolean;
    totalPage: number;
    messages: Message[];
}

interface MessageStore {
    objectMessage: Record<string, RoomChat>;
    setMessage: (id: string, data: Partial<RoomChat>) => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
    objectMessage: {},
    setMessage: (id, data) => set((state) => {
        const currentRoom = state.objectMessage[id];
        const oldMessages = currentRoom?.messages || [];
        const newMessages = data.messages || [];
        const combinedMessages = [...newMessages, ...oldMessages];
        const uniqueMessages = combinedMessages.filter(
            (msg, index, self) => self.findIndex((m) => m.id === msg.id) === index
        );

        return {
            objectMessage: {
                ...state.objectMessage,
                [id]: {
                    ...currentRoom, 
                    ...data,        
                    messages: uniqueMessages, 
                } as RoomChat
            }
        };
    }),
}));