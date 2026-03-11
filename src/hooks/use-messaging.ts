import { useState, useEffect, useCallback, useMemo } from 'react';
import { MessagingService, Message } from '@/services/messaging.service';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/auth-context';
import { useChat } from '@/context/chat-context';
import { useNotifications } from '@/context/notification-context';

export function useMessaging() {
    const { user } = useAuth();
    const { activeChatId, setActiveChatId } = useChat();
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = useCallback(async () => {
        if (!user) return;
        const data = await MessagingService.getMessages(user.id);
        setMessages(data);
    }, [user]);

    const fetchUsers = useCallback(async () => {
        const data = await MessagingService.getUsers();
        setUsers(data.filter(u => u.id !== user?.id));
    }, [user]);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([fetchMessages(), fetchUsers()]);
            setLoading(false);
        };
        init();

        const supabase = createClient();
        if (!supabase || !user) return;

        const channel = supabase
            .channel('realtime:messages')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'messages',
                },
                () => {
                    fetchMessages();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, fetchMessages, fetchUsers]);

    const conversations = useMemo(() => {
        if (!user) return [];
        
        const groups: Record<string, { user: any, messages: Message[] }> = {};
        
        messages.forEach(msg => {
            const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
            if (!groups[otherId]) {
                const otherUser = msg.sender_id === user.id ? msg.receiver : msg.sender;
                groups[otherId] = { user: { ...otherUser, id: otherId }, messages: [] };
            }
            groups[otherId].messages.push(msg);
        });

        // Add users with no messages yet to allow starting new chats
        users.forEach(u => {
            if (!groups[u.id]) {
                groups[u.id] = { user: u, messages: [] };
            }
        });

        return Object.values(groups).sort((a, b) => {
            const aTime = a.messages[0]?.created_at || '0';
            const bTime = b.messages[0]?.created_at || '0';
            return bTime.localeCompare(aTime);
        });
    }, [messages, users, user]);

    const activeChatMessages = useMemo(() => {
        if (!activeChatId) return [];
        return messages
            .filter(m => (m.sender_id === activeChatId && m.receiver_id === user?.id) || 
                         (m.sender_id === user?.id && m.receiver_id === activeChatId))
            .sort((a, b) => a.created_at.localeCompare(b.created_at));
    }, [messages, activeChatId, user]);

    const sendMessage = async (content: string, isCritical: boolean = false) => {
        if (!user || !activeChatId) return;
        const newMessage = await MessagingService.sendMessage(user.id, activeChatId, content, isCritical);
        await fetchMessages();
        return newMessage;
    };

    const markAsRead = async (msgId: string) => {
        await MessagingService.markAsRead(msgId);
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, read_at: new Date().toISOString() } : m));
    };

    return {
        conversations,
        activeChatMessages,
        selectedUserId: activeChatId,
        setSelectedUserId: setActiveChatId,
        loading,
        sendMessage,
        markAsRead,
        refresh: fetchMessages
    };
}
