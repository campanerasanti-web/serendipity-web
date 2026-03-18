import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/auth-context';

/**
 * Hook ligero que mantiene el conteo de mensajes no leídos en tiempo real.
 * Se suscribe a cambios en la tabla messages para actualizar el badge
 * sin necesidad de cargar toda la lista de conversaciones.
 */
export function useUnreadCount() {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = useCallback(async () => {
        if (!user) return;
        const supabase = createClient();
        if (!supabase) return;

        const { count, error } = await supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .eq('receiver_id', user.id)
            .is('read_at', null);

        if (!error && count !== null) {
            setUnreadCount(count);
        }
    }, [user]);

    useEffect(() => {
        fetchUnreadCount();

        const supabase = createClient();
        if (!supabase || !user) return;

        // Suscripción realtime: actualiza el badge cuando llega un mensaje nuevo
        // o cuando se marca como leído
        const channel = supabase
            .channel('unread-badge')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` },
                () => fetchUnreadCount()
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` },
                () => fetchUnreadCount()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, fetchUnreadCount]);

    return unreadCount;
}
