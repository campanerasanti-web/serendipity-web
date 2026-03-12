'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Send, User, ChevronLeft, MoreVertical, Paperclip, AlertCircle, Inbox, Bot } from 'lucide-react'
import { Card, Button, Badge, Skeleton, Input } from '@/components/ui-library'
import { useAuth } from '@/context/auth-context'
import { useMessaging } from '@/hooks/use-messaging'
import { useTranslation } from '@/context/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { es as esLocale } from 'date-fns/locale'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

export function MessagingWidget() {
    const { t } = useTranslation()
    const { user: currentUser } = useAuth()
    const { 
        conversations, 
        activeChatMessages, 
        selectedUserId, 
        setSelectedUserId, 
        loading, 
        loadingMore,
        hasMore,
        sendMessage, 
        loadMoreMessages,
        markAsRead 
    } = useMessaging()

    const searchParams = useSearchParams()
    const queryChatId = searchParams.get('chat')

    useEffect(() => {
        if (queryChatId && queryChatId !== selectedUserId) {
            setSelectedUserId(queryChatId)
        }
    }, [queryChatId, selectedUserId, setSelectedUserId])

    const [searchTerm, setSearchTerm] = useState('')
    const [inputValue, setInputValue] = useState('')
    const [isCritical, setIsCritical] = useState(false)
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const lastScrollHeightRef = useRef<number>(0)

    const selectedChat = conversations.find(c => c.user.id === selectedUserId)

    const filteredConversations = conversations.filter(c => 
        c.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    useEffect(() => {
        if (chatContainerRef.current && shouldAutoScroll) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        } else if (chatContainerRef.current && !shouldAutoScroll && loadingMore) {
            // Preserve scroll position when loading more
            const newScrollHeight = chatContainerRef.current.scrollHeight
            const diff = newScrollHeight - lastScrollHeightRef.current
            chatContainerRef.current.scrollTop = diff
        }
        lastScrollHeightRef.current = chatContainerRef.current?.scrollHeight || 0
    }, [activeChatMessages, shouldAutoScroll, loadingMore])

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget
        const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100
        setShouldAutoScroll(isAtBottom)

        if (target.scrollTop === 0 && hasMore && !loadingMore) {
            lastScrollHeightRef.current = target.scrollHeight
            loadMoreMessages()
        }
    }

    const handleSend = async () => {
        if (!inputValue.trim() || !selectedUserId) return
        const content = inputValue
        setInputValue('')
        await sendMessage(content, isCritical)
        setIsCritical(false)
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 h-[600px]">
                <Skeleton className="h-full rounded-3xl" />
                <Skeleton className="h-full rounded-3xl" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full space-y-3 lg:space-y-4">
            <div className="flex items-center justify-between px-6 lg:px-2">
                <h3 className="font-bold text-[var(--foreground)] text-lg lg:text-xl tracking-tight">
                    {t('dashboard.directMessaging')}
                </h3>
            </div>
            
            <Card className="flex-1 p-0 border-none ring-1 ring-[var(--border)] shadow-xl overflow-hidden flex flex-col lg:flex-row bg-[var(--card)]/30 backdrop-blur-xl rounded-[28px] lg:rounded-[32px] h-full m-1 lg:m-0">
                {/* Sidebar - Chat List */}
                <div className={cn(
                    "w-full lg:w-[350px] border-r border-[var(--border)] flex flex-col h-full bg-[var(--secondary)]/10",
                    selectedUserId && "hidden lg:flex"
                )}>
                    {/* Sidebar Header */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Sincronía de Agentes</h4>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black text-[var(--muted-foreground)] uppercase tracking-tighter">
                                    {conversations.length} En Línea
                                </span>
                            </div>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={16} />
                            <input 
                                placeholder="Buscar agentes por nombre o rol..." 
                                className="w-full bg-[var(--secondary)]/50 border border-[var(--border)] rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-2 ring-blue-500/20 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Chat List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {filteredConversations.length === 0 ? (
                            <div className="p-10 text-center space-y-2 opacity-40">
                                <Inbox className="mx-auto mb-3" size={32} />
                                <p className="text-xs font-bold uppercase tracking-widest">No hay agentes encontrados</p>
                            </div>
                        ) : (
                            <div className="pb-6">
                                {/* Recent Chats Section */}
                                {filteredConversations.filter(c => c.messages.length > 0).length > 0 && (
                                    <div className="px-6 py-2">
                                        <p className="text-[9px] font-black text-blue-500/60 uppercase tracking-[0.2em]">Recientes</p>
                                    </div>
                                )}
                                {filteredConversations.filter(c => c.messages.length > 0).map((chat) => (
                                    <ChatListItem 
                                        key={chat.user.id} 
                                        chat={chat} 
                                        selectedUserId={selectedUserId} 
                                        setSelectedUserId={setSelectedUserId}
                                        currentUser={currentUser}
                                    />
                                ))}

                                {/* Directory Section */}
                                {filteredConversations.filter(c => c.messages.length === 0).length > 0 && (
                                    <div className="px-6 py-4 mt-2">
                                        <p className="text-[9px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.2em]">Sugeridos / Directorio</p>
                                    </div>
                                )}
                                {filteredConversations.filter(c => c.messages.length === 0).map((chat) => (
                                    <ChatListItem 
                                        key={chat.user.id} 
                                        chat={chat} 
                                        selectedUserId={selectedUserId} 
                                        setSelectedUserId={setSelectedUserId}
                                        currentUser={currentUser}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className={cn(
                    "flex-1 flex flex-col h-full bg-transparent relative",
                    !selectedUserId && "hidden lg:flex"
                )}>
                    {selectedUserId ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-6 border-b border-[var(--border)] bg-[var(--secondary)]/10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setSelectedUserId(null)} className="lg:hidden p-2 -ml-2 hover:bg-[var(--secondary)] rounded-full text-[var(--muted-foreground)]">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div className="w-11 h-11 rounded-[14px] bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                                        <User size={22} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-[var(--foreground)] tracking-tight">{selectedChat?.user.name}</h4>
                                        <div className="flex items-center gap-1.5 pt-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">En Línea • {selectedChat?.user.role}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="!rounded-xl opacity-40 hover:opacity-100">
                                        <MoreVertical size={20} />
                                    </Button>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div 
                                ref={chatContainerRef} 
                                onScroll={handleScroll}
                                className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-b from-transparent to-[var(--secondary)]/5"
                            >
                                {hasMore && (
                                    <div className="flex justify-center py-4">
                                        {loadingMore ? (
                                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <p className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest opacity-40">Desliza hacia arriba para ver más</p>
                                        )}
                                    </div>
                                )}
                                <AnimatePresence mode="popLayout">
                                    {activeChatMessages.map((msg, idx) => {
                                        const isMine = msg.sender_id === currentUser?.id
                                        const showDate = idx === 0 || 
                                                       new Date(msg.created_at).setHours(0,0,0,0) !== new Date(activeChatMessages[idx-1].created_at).setHours(0,0,0,0)

                                        return (
                                            <div key={msg.id} className="w-full">
                                                {showDate && (
                                                    <div className="flex justify-center my-8">
                                                        <span className="bg-[var(--secondary)] text-[var(--muted-foreground)] px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border border-[var(--border)] shadow-sm">
                                                            {new Date(msg.created_at).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className={cn(
                                                    "flex w-full mb-1",
                                                    isMine ? "justify-end" : "justify-start"
                                                )}>
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, x: isMine ? 20 : -20 }}
                                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                                        className={cn(
                                                            "group max-w-[85%] lg:max-w-[80%] flex flex-col",
                                                            isMine ? "items-end" : "items-start"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "relative px-5 py-3.5 rounded-[22px] text-[14px] font-medium leading-relaxed shadow-sm transition-all",
                                                            isMine 
                                                                ? "bg-blue-600 text-white rounded-tr-none shadow-blue-500/10" 
                                                                : cn(
                                                                    "bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] rounded-tl-none shadow-black/5",
                                                                    msg.is_critical && "bg-red-500/5 border-red-500/20"
                                                                  )
                                                        )}>
                                                            {msg.is_critical && (
                                                                <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-current/10 opacity-90">
                                                                    <AlertCircle size={12} className={isMine ? "text-blue-100" : "text-red-500"} />
                                                                    <span className="text-[9px] font-black uppercase tracking-wider">Aviso Crítico</span>
                                                                </div>
                                                            )}
                                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                                            <div className={cn(
                                                                "text-[9px] mt-2 font-bold uppercase tracking-tighter opacity-70 flex justify-end gap-1 items-center",
                                                                isMine ? "text-blue-100" : "text-[var(--muted-foreground)]"
                                                            )}>
                                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </AnimatePresence>
                            </div>

                            {/* Chat Input */}
                            <div className="p-6 border-t border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-sm">
                                <div className="flex items-end gap-3">
                                    <div className="flex-1 relative flex flex-col gap-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <button 
                                                onClick={() => setIsCritical(!isCritical)}
                                                className={cn(
                                                    "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ring-1",
                                                    isCritical 
                                                        ? "bg-red-500 text-white ring-red-500 shadow-lg shadow-red-500/20" 
                                                        : "bg-[var(--secondary)] text-[var(--muted-foreground)] ring-[var(--border)] hover:bg-[var(--border)]"
                                                )}
                                            >
                                                Crítico
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <textarea
                                                rows={1}
                                                placeholder="Escribe un mensaje para sincronizar..."
                                                className="w-full bg-[var(--secondary)] border border-[var(--border)] rounded-2xl px-5 py-3.5 text-sm focus:ring-2 ring-blue-500/20 outline-none resize-none min-h-[50px] max-h-[150px] transition-all"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault()
                                                        handleSend()
                                                    }
                                                }}
                                            />
                                            <Button 
                                                onClick={handleSend}
                                                disabled={!inputValue.trim()}
                                                className="w-12 h-12 lg:w-14 lg:h-14 !rounded-2xl p-0 shrink-0 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center self-end"
                                            >
                                                <Send size={20} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-transparent">
                            <div className="w-24 h-24 bg-blue-500/10 rounded-[40px] flex items-center justify-center text-blue-500 mb-8 border border-blue-500/10">
                                <Bot size={48} className="animate-breathing" />
                            </div>
                            <h4 className="text-xl font-bold text-[var(--foreground)] mb-4 tracking-tight">Simetría Directa</h4>
                            <p className="text-sm text-[var(--muted-foreground)] font-medium max-w-sm leading-relaxed mb-8">
                                Selecciona una frecuencia de comunicación en el panel lateral para iniciar la sincronía con otros agentes del sistema Anthropos.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {conversations.slice(0, 3).map(chat => (
                                    <button 
                                        key={chat.user.id} 
                                        onClick={() => setSelectedUserId(chat.user.id)}
                                        className="px-4 py-2 bg-[var(--secondary)] hover:bg-[var(--border)] text-[11px] font-bold text-[var(--foreground)] rounded-full transition-all border border-[var(--border)]"
                                    >
                                        @{chat.user.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}

function ChatListItem({ chat, selectedUserId, setSelectedUserId, currentUser }: { chat: any, selectedUserId: string | null, setSelectedUserId: any, currentUser: any }) {
    const lastMsg = chat.messages[0]
    const unread = chat.messages.filter((m: any) => m.receiver_id === currentUser?.id && !m.read_at).length
    
    return (
        <div
            onClick={() => setSelectedUserId(chat.user.id)}
            className={cn(
                "px-6 py-4 flex items-center gap-4 cursor-pointer transition-all border-l-4 border-transparent hover:bg-blue-500/5",
                selectedUserId === chat.user.id ? "bg-blue-500/10 border-l-blue-500" : "hover:border-l-[var(--border)]"
            )}
        >
            <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-[var(--secondary)] flex items-center justify-center border border-[var(--border)] shadow-sm transition-transform group-hover:scale-95">
                    <User size={22} className="text-[var(--muted-foreground)]" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[var(--card)]" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-sm font-bold text-[var(--foreground)] truncate">{chat.user.name}</span>
                    {lastMsg && (
                        <span className="text-[9px] font-bold text-[var(--muted-foreground)] uppercase">
                            {formatDistanceToNow(new Date(lastMsg.created_at), { addSuffix: false, locale: esLocale })}
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between gap-4">
                    <p className={cn(
                        "text-[11px] truncate font-medium",
                        lastMsg ? "text-[var(--muted-foreground)]" : "text-blue-500/80 italic"
                    )}>
                        {lastMsg ? lastMsg.content : 'Haz clic para iniciar chat'}
                    </p>
                    {unread > 0 && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                            {unread}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
