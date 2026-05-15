"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Calendar, Clock, CheckCircle2, Video, Search, ChevronDown, Plus, Inbox, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [slotForm, setSlotForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    time: "09:00",
    duration: "60",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notes: "",
    recurrence: "none",
    recurrenceCount: 4,
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

      const payload: any = {
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        timezone: slotForm.timezone,
        notes: slotForm.notes,
      };

      if (slotForm.recurrence !== "none") {
        payload.recurrence = {
          freq: slotForm.recurrence,
          count: slotForm.recurrenceCount,
        };
      }

      const res = await fetch("/api/expert-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save availability");
      const created = await res.json();
      
      if (Array.isArray(created)) {
        setAvailabilitySlots(prev => [...created, ...prev]);
      } else {
        setAvailabilitySlots(prev => [created, ...prev]);
      }
      
      setShowAvailabilityForm(false);
      setSlotForm(prev => ({ ...prev, notes: "", recurrence: "none" }));
      toast.success("Availability slots saved");
    } catch (error) {
      console.error("Save availability failed:", error);
      toast.error("Could not save availability slot.");
    } finally {
      setSavingAvailability(false);
    }
  }

  async function handleDeleteAvailability(slotId: string) {
    try {
      const res = await fetch(`/api/expert-availability?slotId=${slotId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete slot");
      setAvailabilitySlots(prev => prev.filter(slot => slot.id !== slotId));
      toast.success("Slot removed");
    } catch (error) {
      console.error("Delete availability failed:", error);
      toast.error("Could not delete slot.");
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

        <motion.div {...fadeUp(0.03)} className="card p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
            <div>
              <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Availability slots</h2>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Publish live slots so founders can book them from Connect.
              </p>
            </div>
            <span className="badge badge-blue text-xs">{availabilitySlots.length} active slots</span>
          </div>

          {showAvailabilityForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 mb-6 p-4 rounded-2xl bg-[var(--bg-surface-2)]/50 border border-[var(--border-soft)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>Date</label>
                  <input type="date" className="input text-sm" value={slotForm.date} onChange={e => setSlotForm(prev => ({ ...prev, date: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>Time</label>
                  <input type="time" className="input text-sm" value={slotForm.time} onChange={e => setSlotForm(prev => ({ ...prev, time: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>Duration (min)</label>
                  <select className="input text-sm" value={slotForm.duration} onChange={e => setSlotForm(prev => ({ ...prev, duration: e.target.value }))}>
                    <option value="30">30 mins</option>
                    <option value="45">45 mins</option>
                    <option value="60">60 mins</option>
                    <option value="90">90 mins</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>Timezone</label>
                  <select className="input text-sm" value={slotForm.timezone} onChange={e => setSlotForm(prev => ({ ...prev, timezone: e.target.value }))}>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Kolkata">India (IST)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                    <option value="Australia/Sydney">Sydney (AEST)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>Note (optional)</label>
                  <input type="text" className="input text-sm" placeholder="Office hours..." value={slotForm.notes} onChange={e => setSlotForm(prev => ({ ...prev, notes: e.target.value }))} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>Recurrence</label>
                  <select className="input text-sm" value={slotForm.recurrence} onChange={e => setSlotForm(prev => ({ ...prev, recurrence: e.target.value }))}>
                    <option value="none">One-time</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                {slotForm.recurrence !== "none" && (
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>Occurrences</label>
                    <input type="number" min="2" max="12" className="input text-sm" value={slotForm.recurrenceCount} onChange={e => setSlotForm(prev => ({ ...prev, recurrenceCount: parseInt(e.target.value) }))} />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button onClick={handleSaveAvailability} disabled={savingAvailability} className="btn-primary text-sm py-2.5 px-6">
                  {savingAvailability ? "Saving…" : "Save Slots"}
                </button>
                <button onClick={() => setShowAvailabilityForm(false)} className="btn-outline text-sm py-2.5 px-6">Cancel</button>
              </div>
            </motion.div>
          )}

          {loadingAvailability ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
              <div className="h-20 rounded-2xl bg-[var(--bg-surface-2)]" />
              <div className="h-20 rounded-2xl bg-[var(--bg-surface-2)]" />
            </div>
          ) : availabilitySlots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availabilitySlots.map(slot => (
                <div key={slot.id} className={`flex items-center justify-between gap-3 rounded-2xl border p-4 transition-all ${slot.isBooked ? 'bg-emerald-50/30 border-emerald-100' : 'bg-white border-[var(--border-default)]'}`}>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                        {new Date(slot.startAt).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      {slot.isBooked && <span className="badge badge-teal text-[10px]">Booked</span>}
                    </div>
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                      <Clock className="size-3" />
                      {new Date(slot.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {slot.notes ? ` · ${slot.notes}` : ""}
                    </p>
                  </div>
                  {!slot.isBooked && (
                    <button onClick={() => handleDeleteAvailability(slot.id)} className="p-2 hover:bg-red-50 text-red-400 hover:text-red-500 rounded-xl transition-colors shrink-0">
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 rounded-3xl border-2 border-dashed border-[var(--border-soft)]">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No availability slots published yet.</p>
              <button onClick={() => setShowAvailabilityForm(true)} className="mt-2 text-[var(--accent-indigo)] text-sm font-medium hover:underline">Add your first slot</button>
            </div>
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

        {/* View Toggle */}
        <motion.div {...fadeUp(0.08)} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-[var(--accent-indigo)] text-white' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)]'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                viewMode === 'calendar' ? 'bg-[var(--accent-indigo)] text-white' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)]'
              }`}
            >
              Calendar View
            </button>
          </div>
        </motion.div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <motion.div {...fadeUp(0.1)} className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                  className="p-2 hover:bg-[var(--bg-surface-2)] rounded-lg transition-colors"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  onClick={() => setCurrentMonth(new Date())}
                  className="px-3 py-1.5 text-sm text-[var(--accent-indigo)] hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                  className="p-2 hover:bg-[var(--bg-surface-2)] rounded-lg transition-colors"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 42 }, (_, i) => {
                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i - new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() + 1);
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                const isToday = date.toDateString() === new Date().toDateString();
                const daySlots = availabilitySlots.filter(slot => {
                  const slotDate = new Date(slot.startAt);
                  return slotDate.toDateString() === date.toDateString();
                });

                return (
                  <div
                    key={i}
                    className={`min-h-[80px] p-2 border rounded-lg cursor-pointer transition-all ${
                      isCurrentMonth ? 'border-[var(--border-default)] hover:border-[var(--accent-indigo)]' : 'border-transparent'
                    } ${isToday ? 'bg-indigo-50 border-indigo-200' : ''}`}
                    onClick={() => isCurrentMonth && setSelectedDate(date)}
                  >
                    <div className={`text-sm font-medium mb-1 ${isCurrentMonth ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {daySlots.slice(0, 2).map((slot, idx) => (
                        <div
                          key={slot.id}
                          className={`text-xs px-1 py-0.5 rounded text-white ${
                            slot.isBooked ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}
                          title={`${new Date(slot.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${slot.notes || 'Available'}`}
                        >
                          {new Date(slot.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      ))}
                      {daySlots.length > 2 && (
                        <div className="text-xs text-[var(--text-muted)]">
                          +{daySlots.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedDate && (
              <div className="mt-4 p-4 bg-[var(--bg-surface-2)] rounded-lg">
                <h4 className="font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h4>
                {availabilitySlots.filter(slot => {
                  const slotDate = new Date(slot.startAt);
                  return slotDate.toDateString() === selectedDate.toDateString();
                }).length > 0 ? (
                  <div className="space-y-2">
                    {availabilitySlots
                      .filter(slot => {
                        const slotDate = new Date(slot.startAt);
                        return slotDate.toDateString() === selectedDate.toDateString();
                      })
                      .map(slot => (
                        <div key={slot.id} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div>
                            <p className="text-sm font-medium">
                              {new Date(slot.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {slot.notes && <p className="text-xs text-[var(--text-muted)]">{slot.notes}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            {slot.isBooked && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Booked</span>}
                            {!slot.isBooked && (
                              <button
                                onClick={() => handleDeleteAvailability(slot.id)}
                                className="p-1 hover:bg-red-50 text-red-500 rounded"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--text-muted)]">No availability slots for this date.</p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Sessions list */}
        {viewMode === 'list' && (
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
                    <div className="flex flex-col gap-2">
                      <Link href={s.meetingUrl || "/session-room/demo-upcoming"} className="btn-primary text-xs py-1 px-3 flex items-center gap-1">
                        <Video className="size-3" /> Join
                      </Link>
                      <div className="flex gap-1">
                        <button className="btn-outline text-xs py-1 px-2">Reschedule</button>
                        <button className="btn-outline text-xs py-1 px-2 text-red-600 hover:bg-red-50">Cancel</button>
                      </div>
                    </div>
                  )}
                  {s.status === "pending" && (
                    <div className="flex flex-col gap-2">
                      <Link href={s.meetingUrl || "/session-room/demo-pending"} className="btn-outline text-xs py-1 px-3 inline-flex items-center gap-1">
                        <Clock className="size-3" /> Hold link
                      </Link>
                      <div className="flex gap-1">
                        <button className="btn-outline text-xs py-1 px-2">Reschedule</button>
                        <button className="btn-outline text-xs py-1 px-2 text-red-600 hover:bg-red-50">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
          </div>
        )}

        {filtered.length === 0 && viewMode === 'list' && (
          <div className="text-center py-20">
            <Inbox className="size-10 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No sessions match your filters</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
