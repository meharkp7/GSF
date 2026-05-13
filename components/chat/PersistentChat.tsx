"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { clerkUserToAuthUser } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ArrowRight, Loader2, MessageSquare, MoreVertical, Paperclip, Phone, RefreshCw, Search, Send, Smile, Image as ImageIcon, Video } from "lucide-react";
import { toast } from "sonner";

type ConversationSummary = {
  id: string;
  counterpartName: string;
  counterpartClerkId: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageBy: string;
  updatedAt: string;
  isFounder: boolean;
};

type MessageRow = {
  id: string;
  conversationId: string;
  senderClerkId: string;
  senderName: string;
  body: string;
  readAt?: string | null;
  createdAt: string;
};

type Props = {
  role: "founder" | "expert";
};

const EMOJIS = ["👍", "🔥", "💡", "🎯", "✅", "🚀", "💪", "😊", "🙌", "❤️"];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getAvatarColor(seed: string) {
  const palette = ["#8B5CF6", "#EF4444", "#10B981", "#F59E0B", "#3B82F6", "#06B6D4", "#EC4899", "#14B8A6"];
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % palette.length;
  }

  return palette[Math.abs(hash) % palette.length];
}

export function PersistentChat({ role }: Props) {
  const { user: clerkUser, isLoaded } = useUser();
  const authUser = clerkUser ? clerkUserToAuthUser(clerkUser) : null;
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const storageKey = `gsf-chat-${role}`;

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? null,
    [activeConversationId, conversations]
  );

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return conversations.filter((conversation) => {
      return !query || conversation.counterpartName.toLowerCase().includes(query) || conversation.lastMessage.toLowerCase().includes(query);
    });
  }, [conversations, search]);

  async function loadConversations(nextConversationId?: string | null) {
    try {
      setLoadingConversations(true);
      const response = await fetch("/api/conversations", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to load conversations");
      }

      const data = (await response.json()) as ConversationSummary[];
      setConversations(data);

      const preferredId = nextConversationId ?? activeConversationId ?? data[0]?.id ?? null;
      if (preferredId && data.some((conversation) => conversation.id === preferredId)) {
        setActiveConversationId(preferredId);
      } else if (!activeConversationId && data[0]?.id) {
        setActiveConversationId(data[0].id);
      }
    } catch {
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  }

  async function loadMessages(conversationId: string) {
    try {
      setLoadingMessages(true);
      const response = await fetch(`/api/conversations/${conversationId}/messages`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to load messages");
      }

      const data = (await response.json()) as MessageRow[];
      setMessages(data);

      await fetch(`/api/conversations/${conversationId}/read`, { method: "POST" }).catch(() => {});
      setConversations((current) => current.map((conversation) => (conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation)));
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    void loadConversations();
  }, [isLoaded]);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    void loadMessages(activeConversationId);
  }, [activeConversationId]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void loadConversations(activeConversationId);
      if (activeConversationId) {
        void loadMessages(activeConversationId);
      }
    }, 10000);

    return () => window.clearInterval(interval);
  }, [activeConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const storedConversationId = window.localStorage.getItem(storageKey);
    if (storedConversationId) {
      setActiveConversationId(storedConversationId);
    }
  }, [storageKey]);

  useEffect(() => {
    if (activeConversationId) {
      window.localStorage.setItem(storageKey, activeConversationId);
    }
  }, [activeConversationId, storageKey]);

  async function handleSelectConversation(conversationId: string) {
    setActiveConversationId(conversationId);
    await loadMessages(conversationId);
  }

  async function sendMessage() {
    if (!activeConversationId || !input.trim() || !authUser) {
      return;
    }

    setSending(true);
    const messageText = input.trim();
    setInput("");

    try {
      const response = await fetch(`/api/conversations/${activeConversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          senderName: authUser.name,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send message");
      }

      const created = (await response.json()) as MessageRow;
      setMessages((current) => [...current, created]);
      await loadConversations(activeConversationId);
    } catch (error: any) {
      setInput(messageText);
      toast.error(error.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  }

  return (
    <DashboardShell role={role}>
      <div className="h-[calc(100vh-64px)] flex gap-0 -m-6 overflow-hidden rounded-2xl" style={{ border: "1px solid var(--border-default)" }}>
        <div className="w-80 flex-shrink-0 flex flex-col border-r" style={{ borderRightColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
          <div className="p-4 border-b" style={{ borderBottomColor: "var(--border-soft)" }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Messages</h2>
              <button className="p-1.5 rounded-lg transition-all" style={{ color: "var(--text-muted)" }} onClick={() => void loadConversations(activeConversationId)}>
                <RefreshCw className="size-3.5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5" style={{ color: "var(--text-muted)" }} />
              <input className="input pl-8 text-sm py-2" placeholder="Search conversations…" value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {loadingConversations ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((item) => <div key={item} className="h-20 rounded-2xl bg-[rgba(129,166,198,0.12)] animate-pulse" />)}
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;
                const avatar = getInitials(conversation.counterpartName);
                const avatarBg = getAvatarColor(conversation.counterpartName);

                return (
                  <button
                    key={conversation.id}
                    onClick={() => void handleSelectConversation(conversation.id)}
                    className="w-full flex items-center gap-3 p-4 text-left transition-all border-b"
                    style={{
                      borderBottomColor: "var(--border-soft)",
                      backgroundColor: isActive ? "rgba(91,108,255,0.08)" : "transparent",
                      borderLeft: isActive ? "3px solid var(--accent-indigo)" : "3px solid transparent",
                    }}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="size-10 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: avatarBg }}>
                        {avatar}
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2" style={{ backgroundColor: "#EF4444", borderColor: "var(--bg-surface)" }} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{conversation.counterpartName}</p>
                        <span className="text-[10px] flex-shrink-0" style={{ color: "var(--text-muted)" }}>{new Date(conversation.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
                      </div>
                      <p className="text-[10px] truncate mb-0.5" style={{ color: "var(--text-muted)" }}>{conversation.counterpartClerkId}</p>
                      <p className="text-[10px] truncate" style={{ color: "var(--text-secondary)" }}>{conversation.lastMessage || "No messages yet. Say hello."}</p>
                    </div>

                    {conversation.unreadCount > 0 && (
                      <div className="size-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: "var(--accent-indigo)" }}>
                        {conversation.unreadCount}
                      </div>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-6 text-center">
                <MessageSquare className="size-10 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>No conversations yet</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Book a session to automatically start a thread.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
          {selectedConversation ? (
            <>
              <div className="flex items-center gap-3 px-5 py-3.5 border-b" style={{ borderBottomColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
                <div className="relative">
                  <div className="size-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: getAvatarColor(selectedConversation.counterpartName) }}>
                    {getInitials(selectedConversation.counterpartName)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{selectedConversation.counterpartName}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{selectedConversation.isFounder ? "Founder thread" : "Expert thread"}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-xl transition-all" style={{ color: "var(--text-muted)" }} title="Voice call">
                    <Phone className="size-4" />
                  </button>
                  <button className="p-2 rounded-xl transition-all" style={{ color: "var(--accent-indigo)" }} title="Video call">
                    <Video className="size-4" />
                  </button>
                  <button className="p-2 rounded-xl transition-all" style={{ color: "var(--text-muted)" }}>
                    <MoreVertical className="size-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-hide">
                {loadingMessages ? (
                  <div className="flex items-center justify-center py-12 text-sm" style={{ color: "var(--text-muted)" }}>
                    <Loader2 className="size-4 mr-2 animate-spin" /> Loading messages…
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((message, index) => {
                    const isMe = message.senderClerkId === authUser?.id;
                    return (
                      <motion.div key={message.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index < 10 ? 0 : 0.05 }} className={`flex ${isMe ? "justify-end" : "justify-start"} gap-2`}>
                        {!isMe && (
                          <div className="size-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-auto" style={{ backgroundColor: getAvatarColor(selectedConversation.counterpartName) }}>
                            {getInitials(selectedConversation.counterpartName)}
                          </div>
                        )}
                        <div className="max-w-[72%] space-y-0.5">
                          <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? "rounded-br-sm" : "rounded-bl-sm"}`} style={isMe ? { backgroundColor: "var(--accent-indigo)", color: "white" } : { backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", border: "1px solid var(--border-soft)" }}>
                            {message.body}
                          </div>
                          <p className={`text-[10px] px-1 ${isMe ? "text-right" : "text-left"}`} style={{ color: "var(--text-muted)" }}>
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{isMe ? " · ✓✓" : ""}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <MessageSquare className="size-10 mb-3" style={{ color: "var(--text-muted)" }} />
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>No messages yet</p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Start the thread with a quick hello.</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="px-5 py-4 border-t" style={{ borderTopColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-xl" style={{ color: "var(--text-muted)" }}>
                    <Paperclip className="size-4" />
                  </button>
                  <button className="p-2 rounded-xl" style={{ color: "var(--text-muted)" }}>
                    <ImageIcon className="size-4" />
                  </button>

                  <div className="flex-1 relative">
                    <input className="input py-2.5 pr-24 text-sm" placeholder={`Message ${selectedConversation.counterpartName.split(" ")[0]}…`} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && !event.shiftKey && sendMessage()} />

                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <div className="relative">
                        <button onClick={() => setShowEmoji((current) => !current)} className="p-1 rounded-lg" style={{ color: "var(--text-muted)" }}>
                          <Smile className="size-4" />
                        </button>
                        <AnimatePresence>
                          {showEmoji && (
                            <motion.div initial={{ opacity: 0, scale: 0.9, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 8 }} className="absolute bottom-8 right-0 p-2 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] grid grid-cols-5 gap-1" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                              {EMOJIS.map((emoji) => (
                                <button key={emoji} onClick={() => { setInput((current) => `${current}${emoji}`); setShowEmoji(false); }} className="p-1.5 text-lg rounded-lg hover:scale-110 transition-transform">
                                  {emoji}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  <motion.button whileTap={{ scale: 0.92 }} onClick={sendMessage} disabled={!input.trim() || sending} className="size-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0" style={{ backgroundColor: input.trim() ? "var(--accent-indigo)" : "var(--bg-surface-2)", color: input.trim() ? "white" : "var(--text-muted)" }}>
                    {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div className="max-w-md space-y-4">
                <div className="size-16 rounded-2xl mx-auto flex items-center justify-center" style={{ backgroundColor: "rgba(129,166,198,0.12)", color: "var(--accent-indigo)" }}>
                  <MessageSquare className="size-7" />
                </div>
                <h3 className="text-2xl font-semibold text-[#1A2332]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Your cross-role inbox
                </h3>
                <p className="text-sm text-[#4A5668]">
                  Conversations are loaded from the backend and kept in sync across founder and expert dashboards.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-[#D2C4B4] text-sm text-[#4A5668]">
                  <ArrowRight className="size-4" /> Book a session to start a thread
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
