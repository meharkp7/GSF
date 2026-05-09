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

interface Contact {
  id: number;
  name: string;
  avatar: string;
  role: string;
  venture?: string;
  online: boolean;
  unread: number;
  lastMsg: string;
  lastTime: string;
  avatarBg: string;
}

const CONTACTS: Contact[] = [
  { id: 1, name: "Meera Patel",   avatar: "MP", role: "Expert · HealthTech",  online: true,  unread: 2, lastMsg: "Looking forward to our session!", lastTime: "2m",  avatarBg: "#EF4444" },
  { id: 2, name: "Vikram Nair",   avatar: "VN", role: "Expert · FinTech VC",  online: true,  unread: 0, lastMsg: "Great pitch deck. Let's refine slide 4.", lastTime: "1h",  avatarBg: "#3B82F6" },
  { id: 3, name: "Arjun Sharma",  avatar: "AS", role: "Founder · EduLoop",    online: false, unread: 0, lastMsg: "Thanks for the intro!", lastTime: "3h",  avatarBg: "#8B5CF6" },
  { id: 4, name: "Sanya Puri",    avatar: "SP", role: "Expert · EdTech",      online: true,  unread: 1, lastMsg: "Can you share your traction numbers?", lastTime: "5h",  avatarBg: "#10B981" },
  { id: 5, name: "Priya Mehta",   avatar: "PM", role: "Founder · Supplify",   online: false, unread: 0, lastMsg: "Session confirmed for Friday!", lastTime: "1d",  avatarBg: "#F59E0B" },
];

const INITIAL_MESSAGES: Record<number, Message[]> = {
  1: [
    { id: 1, from: "them", text: "Hi! Excited for our session next week on HealthTech market sizing.", time: "10:00 AM" },
    { id: 2, from: "me",   text: "Same! I've prepared customer interview summaries.", time: "10:02 AM", read: true },
    { id: 3, from: "them", text: "Perfect. Also bring your ICP draft — let's stress-test it.", time: "10:05 AM" },
    { id: 4, from: "me",   text: "Will do! Should I send it ahead of time?", time: "10:06 AM", read: true },
    { id: 5, from: "them", text: "Looking forward to our session!", time: "10:10 AM" },
  ],
  2: [
    { id: 1, from: "them", text: "I reviewed your pitch. Strong narrative but financials need work.", time: "9:00 AM" },
    { id: 2, from: "me",   text: "Which part — projections or unit economics?", time: "9:05 AM", read: true },
    { id: 3, from: "them", text: "Both, but unit economics most. Investors will grill you on CAC.", time: "9:08 AM" },
    { id: 4, from: "them", text: "Great pitch deck. Let's refine slide 4.", time: "1h ago" },
  ],
  3: [
    { id: 1, from: "me",   text: "Hey, thanks for connecting! EduLoop looks great.", time: "Yesterday" },
    { id: 2, from: "them", text: "Thanks for the intro!",  time: "3h ago" },
  ],
  4: [
    { id: 1, from: "them", text: "Hi! Saw your venture profile. Impressive traction for research stage.", time: "5h ago" },
    { id: 2, from: "them", text: "Can you share your traction numbers?", time: "5h ago" },
  ],
  5: [
    { id: 1, from: "me",   text: "Friday works perfectly. Looking forward to it!", time: "Yesterday" },
    { id: 2, from: "them", text: "Session confirmed for Friday!", time: "1d ago" },
  ],
};

export default function ChatPage() {
  const { user: clerkUser } = useUser();
  const session = clerkUser ? clerkUserToAuthUser(clerkUser) : null;
  const [activeId, setActiveId] = useState(1);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeContact = CONTACTS.find(c => c.id === activeId)!;
  const activeMessages = messages[activeId] ?? [];

  const filteredContacts = useFilteredData(
    CONTACTS,
    searchQuery,
    [(contact, query) => contact.name.toLowerCase().includes(query)]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  function sendMessage() {
    if (!input.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg: Message = { id: Date.now(), from: "me", text: input.trim(), time, read: false };
    setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), newMsg] }));
    setInput("");

    // Simulate reply after 1.5s
    setTimeout(() => {
      const replies = [
        "That's a great point! Let me think about it.",
        "Absolutely, I'll send you more details soon.",
        "Thanks for sharing! This is helpful.",
        "Let's discuss this in our next session.",
        "Sounds good! I'll review and get back to you.",
      ];
      const reply: Message = {
        id: Date.now() + 1,
        from: "them",
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), reply] }));
    }, 1500);
  }

  const EMOJIS = ["👍", "🔥", "💡", "🎯", "✅", "🚀", "💪", "😊", "🙌", "❤️"];

  const role = session?.role;

  return (
    <DashboardShell role={role === "expert" ? "expert" : "founder"}>
      <div className="h-[calc(100vh-64px)] flex gap-0 -m-6 overflow-hidden rounded-2xl"
        style={{ border: "1px solid var(--border-default)" }}>

        {/* ── Contact List ── */}
        <div className="w-72 flex-shrink-0 flex flex-col border-r" style={{ borderRightColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
          {/* Header */}
          <div className="p-4 border-b" style={{ borderBottomColor: "var(--border-soft)" }}>
            <h2 className="text-sm font-bold mb-3" style={{ color: "var(--text-primary)" }}>Messages</h2>
            <SearchFilter
              placeholder="Search contacts..."
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Contacts */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {filteredContacts.length > 0 ? (
              filteredContacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => setActiveId(contact.id)}
                className="w-full flex items-center gap-3 p-4 text-left transition-all border-b"
                style={{
                  borderBottomColor: "var(--border-soft)",
                  backgroundColor: activeId === contact.id ? "rgba(91,108,255,0.08)" : "transparent",
                  borderLeft: activeId === contact.id ? "3px solid var(--accent-indigo)" : "3px solid transparent",
                }}
              >
                <div className="relative flex-shrink-0">
                  <div className="size-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: contact.avatarBg }}>
                    {contact.avatar}
                  </div>
                  {contact.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2"
                      style={{ backgroundColor: "#10B981", borderColor: "var(--bg-surface)" }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{contact.name}</p>
                    <span className="text-[10px] flex-shrink-0" style={{ color: "var(--text-muted)" }}>{contact.lastTime}</span>
                  </div>
                  <p className="text-[10px] truncate mb-0.5" style={{ color: "var(--text-muted)" }}>{contact.role}</p>
                  <p className="text-[10px] truncate" style={{ color: "var(--text-secondary)" }}>{contact.lastMsg}</p>
                </div>
                {contact.unread > 0 && (
                  <div className="size-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: "var(--accent-indigo)" }}>
                    {contact.unread}
                  </div>
                )}
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

        {/* ── Chat Area ── */}
        <div className="flex-1 flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b" style={{ borderBottomColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
            <div className="relative">
              <div className="size-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: activeContact.avatarBg }}>
                {activeContact.avatar}
              </div>
              {activeContact.online && (
                <div className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2"
                  style={{ backgroundColor: "#10B981", borderColor: "var(--bg-surface)" }} />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{activeContact.name}</p>
              <p className="text-xs" style={{ color: activeContact.online ? "#10B981" : "var(--text-muted)" }}>
                {activeContact.online ? "● Online" : "Last seen recently"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-xl transition-all" style={{ color: "var(--text-muted)" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--bg-surface-2)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                title="Voice call">
                <Phone className="size-4" />
              </button>
              <button className="p-2 rounded-xl transition-all" style={{ color: "var(--accent-indigo)" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(91,108,255,0.1)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                title="Video call">
                <Video className="size-4" />
              </button>
              <button className="p-2 rounded-xl transition-all" style={{ color: "var(--text-muted)" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--bg-surface-2)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                <MoreVertical className="size-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-hide">
            {activeMessages.map((msg, i) => {
              const isMe = msg.from === "me";
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i < 10 ? 0 : 0.05 }}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} gap-2`}
                >
                  {!isMe && (
                    <div className="size-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-auto"
                      style={{ backgroundColor: activeContact.avatarBg }}>
                      {activeContact.avatar}
                    </div>
                  )}
                  <div className={`max-w-[70%] space-y-0.5`}>
                    <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? "rounded-br-sm" : "rounded-bl-sm"}`}
                      style={isMe
                        ? { backgroundColor: "var(--accent-indigo)", color: "white" }
                        : { backgroundColor: "var(--bg-surface)", color: "var(--text-primary)", border: "1px solid var(--border-soft)" }
                      }>
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

          {/* Input area */}
          <div className="px-5 py-4 border-t" style={{ borderTopColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl" style={{ color: "var(--text-muted)" }}>
                <Paperclip className="size-4" />
              </button>
              <button className="p-2 rounded-xl" style={{ color: "var(--text-muted)" }}>
                <ImageIcon className="size-4" />
              </button>

              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  className="input py-2.5 pr-24 text-sm"
                  placeholder={`Message ${activeContact.name.split(" ")[0]}…`}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                />

                {/* Emoji picker */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <div className="relative">
                    <button onClick={() => setShowEmoji(!showEmoji)} className="p-1 rounded-lg" style={{ color: "var(--text-muted)" }}>
                      <Smile className="size-4" />
                    </button>
                    <AnimatePresence>
                      {showEmoji && (
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 8 }}
                          className="absolute bottom-8 right-0 p-2 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] grid grid-cols-5 gap-1"
                          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                          {EMOJIS.map(e => (
                            <button key={e} onClick={() => { setInput(prev => prev + e); setShowEmoji(false); inputRef.current?.focus(); }}
                              className="p-1.5 text-lg rounded-lg hover:scale-110 transition-transform">
                              {e}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={sendMessage}
                disabled={!input.trim()}
                className="size-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                style={{
                  backgroundColor: input.trim() ? "var(--accent-indigo)" : "var(--bg-surface-2)",
                  color: input.trim() ? "white" : "var(--text-muted)",
                }}
              >
                <Send className="size-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
