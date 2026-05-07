"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useUser } from "@clerk/nextjs";
import { clerkUserToAuthUser } from "@/lib/auth";
import { Send, Search, Paperclip, MoreVertical, Video, Phone, Smile, Image as ImageIcon } from "lucide-react";
import SearchFilter from "@/components/ui/SearchFilter";
import EmptyState from "@/components/ui/EmptyState";
import { useFilteredData } from "@/hooks/useFilteredData";

interface Message {
  id: number;
  from: "me" | "them";
  text: string;
  time: string;
  read?: boolean;
}

const CONTACTS = [
  { id: 1, name: "Arjun Sharma",  avatar: "AS", role: "Founder · EduLoop",      online: true,  unread: 3, lastMsg: "When is our next session?",  lastTime: "5m",  avatarBg: "#8B5CF6" },
  { id: 2, name: "Priya Mehta",   avatar: "PM", role: "Founder · Supplify",      online: true,  unread: 0, lastMsg: "Thanks for reviewing my MVP!", lastTime: "2h",  avatarBg: "#10B981" },
  { id: 3, name: "Rahul Kumar",   avatar: "RK", role: "Founder · HealthBridge",  online: false, unread: 1, lastMsg: "Can you check my pitch deck?", lastTime: "4h",  avatarBg: "#EF4444" },
  { id: 4, name: "Sneha Rao",     avatar: "SR", role: "Founder · FitMind",       online: true,  unread: 0, lastMsg: "Really appreciate the intro!", lastTime: "1d",  avatarBg: "#F59E0B" },
];

const INITIAL_MESSAGES: Record<number, Message[]> = {
  1: [
    { id: 1, from: "them", text: "Hi Vikram! Really looking forward to our session on fundraising strategy.", time: "10:00 AM" },
    { id: 2, from: "me",   text: "Hey Arjun! Same here. I reviewed EduLoop — strong ICP, just needs tightening.", time: "10:10 AM", read: true },
    { id: 3, from: "them", text: "Great! Should I send updated pitch before the call?", time: "10:12 AM" },
    { id: 4, from: "me",   text: "Yes please — send it by Thursday.", time: "10:13 AM", read: true },
    { id: 5, from: "them", text: "When is our next session?", time: "5m ago" },
  ],
  2: [
    { id: 1, from: "them", text: "Thank you for the detailed MVP feedback. Cut 3 features as you suggested!", time: "Yesterday" },
    { id: 2, from: "me",   text: "That's the right call. Shipping faster is priority one.", time: "Yesterday", read: true },
    { id: 3, from: "them", text: "Thanks for reviewing my MVP!", time: "2h ago" },
  ],
  3: [
    { id: 1, from: "them", text: "I updated the deck based on your notes.", time: "4h ago" },
    { id: 2, from: "them", text: "Can you check my pitch deck?", time: "4h ago" },
  ],
  4: [
    { id: 1, from: "them", text: "Vikram! The investor intro you made last week led to a call.", time: "Yesterday" },
    { id: 2, from: "me",   text: "That's amazing! Keep me posted.", time: "Yesterday", read: true },
    { id: 3, from: "them", text: "Really appreciate the intro!", time: "1d ago" },
  ],
};

const EMOJIS = ["👍", "🔥", "💡", "🎯", "✅", "🚀", "💪", "😊", "🙌", "❤️"];

export default function ExpertChatPage() {
  const { user: clerkUser } = useUser();
  const session = clerkUser ? clerkUserToAuthUser(clerkUser) : null;
  const [activeId, setActiveId] = useState(1);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const active = CONTACTS.find(c => c.id === activeId)!;
  const activeMessages = messages[activeId] ?? [];

  const filteredContacts = useFilteredData(
    CONTACTS,
    searchQuery,
    [(contact, query) => contact.name.toLowerCase().includes(query)]
  );

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeMessages]);

  function sendMessage() {
    if (!input.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg: Message = { id: Date.now(), from: "me", text: input.trim(), time, read: false };
    setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), newMsg] }));
    setInput("");
    setTimeout(() => {
      const replies = ["Thanks for the quick reply!", "Got it! I'll prepare accordingly.", "Perfect, see you then!", "Can you elaborate on that?", "Much appreciated!"];
      const reply: Message = { id: Date.now() + 1, from: "them", text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
      setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), reply] }));
    }, 1500);
  }

  return (
    <DashboardShell role="expert">
      <div className="h-[calc(100vh-64px)] flex gap-0 -m-6 overflow-hidden rounded-2xl" style={{ border: "1px solid var(--border-default)" }}>
        {/* Contact list */}
        <div className="w-72 flex-shrink-0 flex flex-col border-r" style={{ borderRightColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
          <div className="p-4 border-b" style={{ borderBottomColor: "var(--border-soft)" }}>
            <h2 className="text-sm font-bold mb-3" style={{ color: "var(--text-primary)" }}>Messages</h2>
            <SearchFilter
              placeholder="Search contacts..."
              onSearchChange={setSearchQuery}
            />
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {filteredContacts.length > 0 ? (
              filteredContacts.map(c => (
              <button key={c.id} onClick={() => setActiveId(c.id)}
                className="w-full flex items-center gap-3 p-4 text-left transition-all border-b"
                style={{
                  borderBottomColor: "var(--border-soft)",
                  backgroundColor: activeId === c.id ? "rgba(91,108,255,0.08)" : "transparent",
                  borderLeft: activeId === c.id ? "3px solid var(--accent-indigo)" : "3px solid transparent",
                }}>
                <div className="relative flex-shrink-0">
                  <div className="size-10 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: c.avatarBg }}>{c.avatar}</div>
                  {c.online && <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2" style={{ backgroundColor: "#10B981", borderColor: "var(--bg-surface)" }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{c.name}</p>
                    <span className="text-[10px] flex-shrink-0" style={{ color: "var(--text-muted)" }}>{c.lastTime}</span>
                  </div>
                  <p className="text-[10px] truncate mb-0.5" style={{ color: "var(--text-muted)" }}>{c.role}</p>
                  <p className="text-[10px] truncate" style={{ color: "var(--text-secondary)" }}>{c.lastMsg}</p>
                </div>
                {c.unread > 0 && <div className="size-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: "var(--accent-indigo)" }}>{c.unread}</div>}
              </button>
            ))
            ) : (
              <EmptyState
                icon="💬"
                title="No contacts found"
                description="Try adjusting your search to find contacts."
              />
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
          <div className="flex items-center gap-3 px-5 py-3.5 border-b" style={{ borderBottomColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
            <div className="relative">
              <div className="size-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: active.avatarBg }}>{active.avatar}</div>
              {active.online && <div className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2" style={{ backgroundColor: "#10B981", borderColor: "var(--bg-surface)" }} />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{active.name}</p>
              <p className="text-xs" style={{ color: active.online ? "#10B981" : "var(--text-muted)" }}>{active.online ? "● Online" : "Last seen recently"}</p>
            </div>
            <div className="flex items-center gap-1">
              {[{ icon: Phone, color: "var(--text-muted)" }, { icon: Video, color: "var(--accent-indigo)" }, { icon: MoreVertical, color: "var(--text-muted)" }].map(({ icon: Icon, color }, idx) => (
                <button key={idx} className="p-2 rounded-xl transition-all" style={{ color }}>
                  <Icon className="size-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-hide">
            {activeMessages.map((msg, i) => {
              const isMe = msg.from === "me";
              return (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i < 10 ? 0 : 0.05 }}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} gap-2`}>
                  {!isMe && (
                    <div className="size-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-auto" style={{ backgroundColor: active.avatarBg }}>{active.avatar}</div>
                  )}
                  <div className="max-w-[70%] space-y-0.5">
                    <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? "rounded-br-sm" : "rounded-bl-sm"}`}
                      style={isMe ? { backgroundColor: "var(--accent-indigo)", color: "white" } : { backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", border: "1px solid var(--border-soft)" }}>
                      {msg.text}
                    </div>
                    <p className={`text-[10px] px-1 ${isMe ? "text-right" : "text-left"}`} style={{ color: "var(--text-muted)" }}>
                      {msg.time}{isMe && msg.read && " · ✓✓"}
                    </p>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t" style={{ borderTopColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
            <div className="flex items-center gap-2">
              {[Paperclip, ImageIcon].map((Icon, i) => (
                <button key={i} className="p-2 rounded-xl" style={{ color: "var(--text-muted)" }}><Icon className="size-4" /></button>
              ))}
              <div className="flex-1 relative">
                <input ref={inputRef} className="input py-2.5 text-sm" placeholder={`Message ${active.name.split(" ")[0]}…`}
                  value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <div className="relative">
                    <button onClick={() => setShowEmoji(!showEmoji)} className="p-1 rounded-lg" style={{ color: "var(--text-muted)" }}><Smile className="size-4" /></button>
                    <AnimatePresence>
                      {showEmoji && (
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute bottom-8 right-0 p-2 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] grid grid-cols-5 gap-1"
                          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                          {EMOJIS.map(e => (
                            <button key={e} onClick={() => { setInput(p => p + e); setShowEmoji(false); inputRef.current?.focus(); }}
                              className="p-1.5 text-lg rounded-lg hover:scale-110 transition-transform">{e}</button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.92 }} onClick={sendMessage} disabled={!input.trim()}
                className="size-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                style={{ backgroundColor: input.trim() ? "var(--accent-indigo)" : "var(--bg-surface-2)", color: input.trim() ? "white" : "var(--text-muted)" }}>
                <Send className="size-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
