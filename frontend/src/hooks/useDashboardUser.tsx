import { useEffect, useState } from "react";
import type { Message } from "../lib/types";
import { useParams } from "react-router";
import useAxios from "../lib/axios.service";

export default function useDashboardUser() {
    const { axiosPrivate } = useAxios();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const { number } = params;


    const fetchMessages = async () => {
        if (!number) return;
        setLoading(true);
        try {
            const res = await axiosPrivate.get(`/messages/${number}`);
            const data = res.data;
            setMessages(data);
            console.log(data);
            
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMessages();
    }, []);

    return {
        number,
        loading,
        setLoading,
        messages,
        setMessages
    }
}