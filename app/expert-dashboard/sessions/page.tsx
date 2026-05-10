"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Calendar, Clock, CheckCircle2, Video, Search, ChevronDown, Plus, Inbox, Trash2 } from "lucide-react";

const ALL_SESSIONS = [
  { id: 1, founder: "Arjun Sharma",  venture: "EduLoop",      date: "Apr 8, 2026",  time: "3:00 PM", duration: 45, status: "completed", earned: 80,  avatar: "AS", topic: "ICP refinement & customer interview analysis", recordingUrl: "/session-room/demo-1/recording" },
  { id: 2, founder: "Priya Mehta",   venture: "Supplify",     date: "Apr 6, 2026",  time: "11:00 AM",duration: 60, status: "completed", earned: 100, avatar: "PM", topic: "MVP scope review and feature prioritisation", recordingUrl: "/session-room/demo-2/recording" },
  { id: 3, founder: "Rahul Kumar",   venture: "HealthBridge", date: "Apr 12, 2026", time: "4:00 PM", duration: 30, status: "upcoming",  earned: 0,   avatar: "RK", topic: "Investor pitch prep & term sheet review", meetingUrl: "/session-room/demo-3" },
  { id: 4, founder: "Sneha Rao",     venture: "FitMind",      date: "Apr 15, 2026", time: "2:00 PM", duration: 45, status: "pending",   earned: 0,   avatar: "SR", topic: "GTM strategy for consumer wellness app", meetingUrl: "/session-room/demo-4" },
  { id: 5, founder: "Dev Singh",     venture: "AgriChain",    date: "Mar 30, 2026", time: "10:00 AM",duration: 60, status: "completed", earned: 100, avatar: "DS", topic: "Blockchain implementation for supply chain", recordingUrl: "/session-room/demo-5/recording" },
  { id: 6, founder: "Anika Roy",     venture: "FoodSense",    date: "Mar 25, 2026", time: "5:00 PM", duration: 30, status: "completed", earned: 80,  avatar: "AR", topic: "User research synthesis & insight mapping", recordingUrl: "/session-room/demo-6/recording" },
];

const STATUS_FILTERS = ["All", "upcoming", "pending", "completed"];

const STATUS_STYLES: Record<string, { label: string; badgeClass: string; icon: React.ReactNode }> = {
  completed: { label: "Completed", badgeClass: "badge-live",  icon: <CheckCircle2 className="size-3" /> },
  upcoming:  { label: "Upcoming",  badgeClass: "badge-blue",  icon: <Calendar className="size-3" /> },
  pending:   { label: "Pending",   badgeClass: "badge-warn",  icon: <Clock className="size-3" /> },
};

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: d, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function ExpertSessionsPage() {
  const [statusFilter, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [availabilitySlots, setAvailabilitySlots] = useState<Array<{
    id: string;
    expertName: string;
    startAt: string;
    endAt: string;
    timezone?: string;
    notes?: string;
    isBooked?: boolean;
  }>>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [slotForm, setSlotForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    time: "09:00",
    duration: "60",
    notes: "",
  });

  const filtered = ALL_SESSIONS.filter(s => {
    const q = search.toLowerCase();
    const matchQ = !q || s.founder.toLowerCase().includes(q) || s.venture.toLowerCase().includes(q) || s.topic.toLowerCase().includes(q);
    const matchS = statusFilter === "All" || s.status === statusFilter;
    return matchQ && matchS;
  });

  const totalEarned = ALL_SESSIONS.filter(s => s.status === "completed").reduce((a, s) => a + s.earned, 0);
  const upcoming = ALL_SESSIONS.filter(s => s.status === "upcoming" || s.status === "pending");

  useEffect(() => {
    async function loadAvailability() {
      try {
        setLoadingAvailability(true);
        const res = await fetch("/api/expert-availability?mine=1");
        if (!res.ok) throw new Error("Failed to load availability");
        const data = await res.json();
        setAvailabilitySlots(data);
      } catch {
        setAvailabilitySlots([]);
      } finally {
        setLoadingAvailability(false);
      }
    }

    loadAvailability();
  }, []);

  async function handleSaveAvailability() {
    setSavingAvailability(true);
    try {
      const start = new Date(`${slotForm.date}T${slotForm.time}:00`);
      const end = new Date(start.getTime() + Math.max(30, Number(slotForm.duration) || 60) * 60000);

      const res = await fetch("/api/expert-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startAt: start.toISOString(),
          endAt: end.toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          notes: slotForm.notes,
        }),
      });

      if (!res.ok) throw new Error("Failed to save availability");
      const created = await res.json();
      setAvailabilitySlots(prev => [created, ...prev]);
      setShowAvailabilityForm(false);
      setSlotForm(prev => ({ ...prev, notes: "" }));
    } catch (error) {
      console.error("Save availability failed:", error);
      alert("Could not save availability slot.");
    } finally {
      setSavingAvailability(false);
    }
  }

  async function handleDeleteAvailability(slotId: string) {
    try {
      const res = await fetch(`/api/expert-availability?slotId=${slotId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete slot");
      setAvailabilitySlots(prev => prev.filter(slot => slot.id !== slotId));
    } catch (error) {
      console.error("Delete availability failed:", error);
      alert("Could not delete slot.");
    }
  }

  return (
    <DashboardShell role="expert">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div {...fadeUp(0)} className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
              Sessions
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              All your 1-on-1 founder sessions — track history, upcoming, and credits earned.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge badge-teal text-xs">{totalEarned} credits earned</span>
            <button onClick={() => setShowAvailabilityForm(v => !v)} className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
              <Plus className="size-3.5" /> Set Availability
            </button>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.03)} className="card p-5">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <div>
              <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Availability slots</h2>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Publish live slots so founders can book them from Connect.
              </p>
            </div>
            <span className="badge badge-blue text-xs">{availabilitySlots.length} slots</span>
          </div>

          {showAvailabilityForm && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Date</label>
                <input type="date" className="input text-sm" value={slotForm.date} onChange={e => setSlotForm(prev => ({ ...prev, date: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Time</label>
                <input type="time" className="input text-sm" value={slotForm.time} onChange={e => setSlotForm(prev => ({ ...prev, time: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Duration</label>
                <input type="number" min="30" step="15" className="input text-sm" value={slotForm.duration} onChange={e => setSlotForm(prev => ({ ...prev, duration: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Note</label>
                <input type="text" className="input text-sm" placeholder="Office hours, fundraising..." value={slotForm.notes} onChange={e => setSlotForm(prev => ({ ...prev, notes: e.target.value }))} />
              </div>
            </div>
          )}

          {showAvailabilityForm && (
            <div className="flex items-center gap-2 mb-4">
              <button onClick={handleSaveAvailability} disabled={savingAvailability} className="btn-primary text-sm py-2 px-4">
                {savingAvailability ? "Saving…" : "Save slot"}
              </button>
              <button onClick={() => setShowAvailabilityForm(false)} className="btn-outline text-sm py-2 px-4">Cancel</button>
            </div>
          )}

          {loadingAvailability ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
              <div className="h-20 rounded-2xl" style={{ backgroundColor: "var(--bg-surface-2)" }} />
              <div className="h-20 rounded-2xl" style={{ backgroundColor: "var(--bg-surface-2)" }} />
            </div>
          ) : availabilitySlots.length > 0 ? (
            <div className="space-y-3">
              {availabilitySlots.map(slot => (
                <div key={slot.id} className="flex items-center justify-between gap-3 rounded-2xl border p-4" style={{ borderColor: "var(--border-default)" }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{slot.expertName}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      {new Date(slot.startAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                      {slot.notes ? ` · ${slot.notes}` : ""}
                    </p>
                  </div>
                  <button onClick={() => handleDeleteAvailability(slot.id)} className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5">
                    <Trash2 className="size-3.5" /> Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No availability slots published yet.</p>
          )}
        </motion.div>

        {/* Upcoming callout */}
        {upcoming.length > 0 && (
          <motion.div {...fadeUp(0.05)} className="p-4 rounded-2xl flex items-center gap-4"
            style={{ background: "linear-gradient(135deg, rgba(91,108,255,0.08), rgba(79,209,197,0.06))", border: "1px solid rgba(91,108,255,0.2)" }}>
            <Calendar className="size-5 flex-shrink-0" style={{ color: "var(--accent-indigo)" }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {upcoming.length} upcoming session{upcoming.length > 1 ? "s" : ""}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Next: {upcoming[0].founder} — {upcoming[0].venture} on {upcoming[0].date} at {upcoming[0].time}
              </p>
            </div>
            <button className="ml-auto btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5 flex-shrink-0">
              <Video className="size-3" /> Join
            </button>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div {...fadeUp(0.08)} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: "var(--text-muted)" }} />
            <input className="input pl-9" placeholder="Search sessions…" value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="relative">
            <select className="input pr-8 pl-3 py-2 text-sm appearance-none cursor-pointer"
              value={statusFilter} onChange={e => setStatus(e.target.value)}>
              {STATUS_FILTERS.map(f => <option key={f} value={f}>{f === "All" ? "All Status" : STATUS_STYLES[f]?.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 pointer-events-none" style={{ color: "var(--text-muted)" }} />
          </div>
        </motion.div>

        {/* Sessions list */}
        <div className="space-y-3">
          {filtered.map((s, i) => {
            const style = STATUS_STYLES[s.status];
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} className="card p-4 flex items-start gap-4 hover-scale">

                <div className="size-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #5B6CFF, #4FD1C5)" }}>
                  {s.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{s.founder}</p>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>·</span>
                    <p className="text-xs font-medium" style={{ color: "var(--accent-indigo)" }}>{s.venture}</p>
                    <span className={`badge text-[10px] flex items-center gap-0.5 ${style.badgeClass}`}>
                      {style.icon} {style.label}
                    </span>
                  </div>
                  <p className="text-xs mb-1.5" style={{ color: "var(--text-secondary)" }}>{s.topic}</p>
                  <div className="flex items-center gap-3 text-[10px]" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1"><Calendar className="size-3" />{s.date}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3" />{s.time} · {s.duration}min</span>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  {s.status === "completed" && (
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-emerald-500 mb-1">+{s.earned} cr</p>
                      {s.recordingUrl && (
                        <Link href={s.recordingUrl} className="btn-outline text-xs py-1 px-3 inline-flex items-center gap-1">
                          <Video className="size-3" /> Recording
                        </Link>
                      )}
                    </div>
                  )}
                  {s.status === "upcoming" && (
                    <Link href={s.meetingUrl || "/session-room/demo-upcoming"} className="btn-primary text-xs py-1 px-3 flex items-center gap-1">
                      <Video className="size-3" /> Join
                    </Link>
                  )}
                  {s.status === "pending" && (
                    <Link href={s.meetingUrl || "/session-room/demo-pending"} className="btn-outline text-xs py-1 px-3 inline-flex items-center gap-1">
                      <Clock className="size-3" /> Hold link
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Inbox className="size-10 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No sessions match your filters</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
