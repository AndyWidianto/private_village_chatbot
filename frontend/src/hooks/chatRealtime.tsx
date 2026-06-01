import React, { useContext, useEffect, useRef, useState } from 'react';
import { ThemeContext } from '../ThemeProvider';
import { useNavigate, useParams } from 'react-router';
import { useInstanceStore } from '../lib/store/instanceStore';
import useAxios from '../lib/axios.service';
import type { Message, Chat, Contact } from '../lib/types';
import { toast } from 'sonner';
import useSocket from '../lib/socket';
import { useMessageStore } from '../lib/store/messageStore';
import { handleIncomingMessage } from '../components/HandleIncomeMessage';

export default function useChatRealtime() {
    const themeContext = useContext(ThemeContext);
    if (themeContext === undefined) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    const { theme, toggleTheme } = themeContext;

    const { instance, setInstance } = useInstanceStore();
    const { axiosPrivate } = useAxios();
    const { socket } = useSocket();
    const { id } = useParams();
    const { objectMessage, setMessage } = useMessageStore();


    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [activeContact, setActiveContact] = useState<Contact | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState(false);

    // cursor
    const [nextChatId, setNextChatId] = useState<string | null>(null);
    const [nextContactId, setNextContactId] = useState<string | null>(null);
    const [chats, setChats] = useState<Chat[]>([]);

    const [search, setSearch] = useState("");
    const [totalPage, setTotalPage] = useState(10);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileType, setFileType] = useState<'image' | 'document' | null>(null);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const docInputRef = useRef<HTMLInputElement>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const focusRef = useRef<HTMLDivElement | null>(null);

    const containerMessageRef = useRef<HTMLDivElement>(null);
    const messageRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const itemPerPage = 10;
    const itemsPerPageMessage = 10;

    const handleSendMessage = async () => {
        if (!messageInput.trim() && !selectedFile) return;
        if (!activeChat && !activeContact) return;
        if (!instance) return;
        const temporaryId = Date.now().toString();
        const temporaryMessage = messageInput;
        try {
            const urlFile = selectedFile ? URL.createObjectURL(selectedFile) : null;
            const typeMessage = selectedFile ? selectedFile?.type.startsWith("image/") ? "image" : "document" : "text";
            const newMessage: Message = {
                id: temporaryId,
                updatedAt: new Date().toISOString(),
                whatsappId: activeChat?.id || activeContact?.remoteJid || "",
                fromMe: true,
                remoteJid: activeChat?.id || activeContact?.remoteJid || "",
                pushName: activeChat?.name || activeContact?.pushName || "other",
                chatId: activeChat?.id || activeContact?.remoteJid || "",
                content: temporaryMessage,
                url: urlFile,
                type: typeMessage,
                status: "pending",
                createdAt: new Date().toISOString(),
            }
            setMessages([...messages, newMessage]);
            if (!activeChat && activeContact) {
                const newChat: Chat = {
                    id: activeContact.remoteJid,
                    instanceName: instance.instanceName,
                    lastMessage: messageInput,
                    name: activeContact.name || "",
                    profileUrl: activeContact.profileUrl,
                    unreadCount: 0,
                    updatedAt: new Date().toISOString(),
                }
                setChats(prev => [newChat, ...prev])
            }
            if (focusRef.current) {
                focusRef.current.scrollIntoView({ behavior: "smooth" });
            }
            setMessageInput('');
            const remoteJid = activeChat?.id || activeContact?.remoteJid || "";
            const dataToSend = new FormData();
            dataToSend.append("instanceName", instance?.instanceName);
            dataToSend.append("remoteJid", remoteJid);
            dataToSend.append("message", temporaryMessage);
            dataToSend.append("deviceId", instance.id);
            if (selectedFile) {
                dataToSend.append("file", selectedFile);
            }
            const res = await axiosPrivate.post("/messages/send", dataToSend);
            const data: Message = res.data;
            setMessages(prev => prev.map(p => p.id === temporaryId ? data : p));
        } catch (err) {
            setMessageInput(temporaryMessage);
            console.error("Fetch Error: ", err);
        }
    };
    const fetchMessages = async () => {
        if (!instance) return;
        if (!activeChat) return;
        setLoadingMessage(true);
        try {
            const findMessages = objectMessage[activeChat.id];
            if (!findMessages) {
                const res = await axiosPrivate.get(`/messages/${activeChat.id}?limit=${itemsPerPageMessage}`);
                const data = res.data;
                const sortMessages: Message[] = data.messages.sort((a: Message, b: Message) => {
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                });
                setMessages(prev => [...sortMessages, ...prev]);
                setMessage(activeChat.id, {
                    id: activeChat.id,
                    nextId: data.nextId,
                    hasMore: data.messages.length === itemsPerPageMessage,
                    messages: sortMessages,
                    totalPage: data.totalPage,
                });
            }
            if (findMessages && findMessages.hasMore) {
                const res = await axiosPrivate.get(`/messages/${activeChat.id}?limit=${itemsPerPageMessage}&lastId=${findMessages.nextId}`);
                const data = res.data;
                const sortMessages: Message[] = data.messages.sort((a: Message, b: Message) => {
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                });
                setMessages([...sortMessages, ...findMessages.messages]);
                setMessage(activeChat.id, {
                    id: activeChat.id,
                    nextId: data.nextId,
                    hasMore: data.messages.length === itemsPerPageMessage,
                    totalPage: data.totalPage,
                    messages: [...sortMessages, ...findMessages.messages]
                });
            }
            console.log("Berjalan min...");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal mengambil messages";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });

            console.error("Fetch Error:", err);
        } finally {
            setLoadingMessage(false);
        }
    }
    const onDisconnect = () => {
        if (!confirm("Apakah Anda yakin ingin keluar?")) return;
        navigate("/dashboard/chat-realtime");
    }

    const handleFetchInstance = async () => {
        if (instance) return;
        try {
            const res = await axiosPrivate.get(`/devices/${id}`);
            const data = res.data;
            setInstance(data);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal mengambil instance";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });

            console.error("Fetch Error:", err);
        }
    }

    const handleFetchChats = async () => {
        if (currentPage >= totalPage) return;
        setLoading(true);
        try {
            let query = "";
            if (nextChatId) {
                query += `&lastId=${nextChatId}`;
            }
            if (search) {
                query += `&search=${search}`;
            }
            const res = await axiosPrivate.get(`/chats?limit=${itemPerPage}${query}`);
            const data = res.data;
            console.log(data);
            setTotalPage(data.totalPage);
            setChats(prev => [...prev, ...data.chats]);
            setNextChatId(data.nextId);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal mengambil chats";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });

            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    }
    const handleFetchContacts = async () => {
        if (currentPage < totalPage) return;
        setLoading(true);
        try {
            let query = "";
            if (nextContactId) {
                query += `&lastId=${nextContactId}`;
            }
            if (search) {
                query += `&search=${search}`;
            }
            const res = await axiosPrivate.get(`/contacts?limit=${itemPerPage}${query}`);
            const data = res.data;
            setNextContactId(data.nextId);
            setContacts(prev => [...prev, ...data.contacts]);
            console.log(data);
            if (data.contacts.length < itemPerPage) {
                setHasMore(false);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal membuat device";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });

            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    }
    const handleSelectChat = (data: Chat) => {
        setActiveChat(data);
        setActiveContact(null);
        setMessages([]);
    }
    const handleSelectContact = (data: Contact) => {
        setActiveContact(data);
        setActiveChat(null);
        setMessages([]);
    }
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (value.trim()) {
            setTimeout(() => {
                setNextChatId(null);
                setNextContactId(null);
                setChats([]);
                setContacts([]);
                setSearch(value);
            }, 200);
        }
    }

    useEffect(() => {
        handleFetchInstance();
    }, []);
    useEffect(() => {
        const currentTarget = focusRef.current;
        socket.on("income_message", (data) => {
            if (activeChat && activeChat.id === data.chat.id) {
                setMessages(prev => [...prev, data.message]);
            }
            const findMessage = objectMessage[data.chat.id];
            if (findMessage) {
                setMessage(data.chat.id, {
                    ...findMessage,
                    id: data.chat.id,
                    messages: [...findMessage.messages, data.message],
                })
            }
            if (currentTarget) {
                currentTarget.scrollIntoView({ behavior: "smooth" });
            }
            setChats(prev => prev.map(p => {
                if (p.id === data.chat.id) {
                    p.lastMessage = data.message.content;
                    if (activeChat && activeChat.id === p.id) {
                        p.unreadCount = 0;
                    }
                }
                return p;
            }));
            handleIncomingMessage(data.message, data.chat);
        });
        socket.on("update_message", (data) => {
            const findMessage = objectMessage[data.chatId];
            if (findMessage) {
                setMessage(data.chatId, {
                    ...findMessage,
                    id: data.chatId,
                    messages: findMessage.messages.map(message => message.id === data.id ? ({
                        ...message,
                        status: data.status
                    }) : (message)),
                })
            }
        })
        return () => {
            socket.off("income_message");
        };
    }, [activeChat, messages]);
    useEffect(() => {
        const currentMessageTarget = messageRef.current;
        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                if (entries[0].isIntersecting && !loadingMessage) {
                    fetchMessages();
                }
            },
            {
                root: containerMessageRef.current,
                threshold: 0.5
            }
        )
        if (currentMessageTarget) {
            observer.observe(currentMessageTarget);
        }
        return () => {
            if (currentMessageTarget) observer.unobserve(currentMessageTarget);
        }
    }, [activeChat, objectMessage, loadingMessage])
    useEffect(() => {
        if (hasMore) {
            handleFetchChats();
            handleFetchContacts();
        }
    }, [currentPage]);
    useEffect(() => {
        if (messages.length <= (itemsPerPageMessage * 2) && focusRef.current) {
            focusRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages])
    useEffect(() => {
        const trigger = triggerRef.current;
        const container = containerRef.current;
        if (!hasMore) return;
        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                if (entries[0].isIntersecting && !loading) {
                    setCurrentPage(prev => prev + 1);
                }
            },
            {
                root: container,
                threshold: 0.5,
                rootMargin: "0px",
            }
        )
        if (trigger) {
            observer.observe(trigger);
        }
        return () => {
            if (trigger) observer.unobserve(trigger);
        };

    }, [loading, hasMore]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFileType(type);
        }
    };

    const cancelFileSelection = () => {
        setSelectedFile(null);
        setFileType(null);
        if (imageInputRef.current) imageInputRef.current.value = '';
        if (docInputRef.current) docInputRef.current.value = '';
    };

    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage();
        cancelFileSelection();
    };

    return {
        theme,
        toggleTheme,
        handleFetchChats,
        handleFetchContacts,
        handleFetchInstance,
        chats,
        contacts,
        handleSendMessage,
        onDisconnect,
        containerRef,
        triggerRef,
        messages,
        messageInput,
        setMessageInput,
        handleSelectChat,
        handleSelectContact,
        handleSearch,
        instance,
        activeChat,
        activeContact,
        hasMore,
        loading,
        imageInputRef,
        selectedFile,
        handleFileChange,
        onFormSubmit,
        fileType,
        setFileType,
        docInputRef,
        cancelFileSelection,
        focusRef,
        containerMessageRef,
        messageRef,
        loadingMessage
    }
}