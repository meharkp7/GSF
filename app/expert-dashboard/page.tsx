"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Calendar, Coins, Users, TrendingUp, Star, ChevronRight,
  CheckCircle2, Clock, Zap, ArrowUpRight, Award, BarChart2,
  MessageSquare, Briefcase, Sparkles,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useUser } from "@clerk/nextjs";
import { useCredits } from "@/lib/hooks/useCredits";
import { useSessions } from "@/lib/hooks/useSessions";

// ===== MOCK DATA =====
const VENTURES_SUPPORTED = [
  {
    name: "EduLoop",
    founder: "Arjun S.",
    stage: "Research",
    contribution: "Ideation Mentor",
    contributionColor: "#8B5CF6",
    avatar: "EL",
    avatarBg: "#8B5CF6",
    sessions: 3,
    equity: "2.5%",
  },
  {
    name: "Supplify",
    founder: "Priya M.",
    stage: "MVP",
    contribution: "MVP Reviewer",
    contributionColor: "#10B981",
    avatar: "SU",
    avatarBg: "#10B981",
    sessions: 5,
    equity: "1%",
  },
  {
    name: "HealthBridge",
    founder: "Rahul K.",
    stage: "Funding",
    contribution: "Funding Advisor",
    contributionColor: "#F59E0B",
    avatar: "HB",
    avatarBg: "#F59E0B",
    sessions: 8,
    equity: "0.5%",
  },
];

const RECENT_SESSIONS = [
  { founder: "Arjun Sharma",  venture: "EduLoop",      date: "Apr 8",  duration: 45, status: "completed", earned: 80, avatar: "AS" },
  { founder: "Priya Mehta",   venture: "Supplify",     date: "Apr 6",  duration: 60, status: "completed", earned: 100, avatar: "PM" },
  { founder: "Rahul Kumar",   venture: "HealthBridge", date: "Apr 12", duration: 30, status: "upcoming",  earned: 0,  avatar: "RK" },
  { founder: "Sneha Rao",     venture: "FitMind",      date: "Apr 15", duration: 45, status: "pending",   earned: 0,  avatar: "SR" },
];

const STAGE_LABELS: Record<string, { label: string; color: string }> = {
  "Ideation Mentor":  { label: "Ideation Mentor",  color: "#8B5CF6" },
  "MVP Reviewer":     { label: "MVP Reviewer",     color: "#10B981" },
  "Funding Advisor":  { label: "Funding Advisor",  color: "#F59E0B" },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

function EarningsMeter({ earned }: { earned: number }) {
  const max = 500;
  const pct = Math.min(100, (earned / max) * 100);

  return (
    <div
      className="p-5 rounded-2xl relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, rgba(79,209,197,0.1), rgba(91,108,255,0.08))", border: "1px solid rgba(79,209,197,0.25)" }}
    >
      <div className="absolute top-0 right-0 w-28 h-28 rounded-full blur-[60px] pointer-events-none" style={{ background: "rgba(79,209,197,0.2)" }} />

      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border-default)" strokeWidth="4" />
            <motion.circle
              cx="32" cy="32" r="26"
              fill="none"
              stroke="url(#tealGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 26}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - pct / 100) }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
            />
            <defs>
              <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4FD1C5" />
                <stop offset="100%" stopColor="#5B6CFF" />
              </linearGradient>
            </defs>
            <text x="32" y="37" textAnchor="middle" fill="var(--accent-teal)" fontSize="12" fontWeight="700">
              {Math.round(pct)}%
            </text>
          </svg>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--text-muted)" }}>
            Credits Earned
          </p>
          <motion.p
            className="text-3xl font-extrabold"
            style={{ color: "#4FD1C5", fontFamily: "'Playfair Display', serif" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {earned}
          </motion.p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            of {max} monthly target
          </p>
        </div>
      </div>

      <div className="mt-4 progress-bar">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(to right, #4FD1C5, #5B6CFF)" }}
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        />
      </div>

      <Link href="/expert-dashboard/credits" className="mt-3 text-xs font-medium flex items-center gap-1" style={{ color: "#4FD1C5" }}>
        Earnings history <ChevronRight className="size-3" />
      </Link>
    </div>
  );
}

export default function ExpertDashboardPage() {
  const { user: clerkUser } = useUser();
  const firstName = clerkUser?.firstName ?? "Expert";

  const { balance: earned }                                       = useCredits();
  const { sessions, completed: doneSessions, upcoming, next }     = useSessions();
  const totalSessions = sessions.length;

  return (
    <DashboardShell role="expert">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Welcome */}
        <motion.div {...fadeUp(0)} className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
              Welcome back, {firstName}
              <Sparkles className="size-5 text-amber-400" />
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              You&apos;ve impacted <strong>3 ventures</strong> this month. Keep mentoring!
            </p>
          </div>
          <span className="badge badge-teal">
            <Award className="size-3" />
            Verified Expert
          </span>
        </motion.div>

        {/* Top stat cards */}
        <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Credits Earned",   value: earned,        icon: Coins,      color: "#4FD1C5", bg: "rgba(79,209,197,0.1)",  suffix: "" },
            { label: "Total Sessions",   value: totalSessions, icon: Calendar,   color: "#5B6CFF", bg: "rgba(91,108,255,0.1)", suffix: "" },
            { label: "Ventures Helped",  value: 3,             icon: Briefcase,  color: "#8B5CF6", bg: "rgba(139,92,246,0.1)", suffix: "" },
            { label: "Avg Rating",       value: "4.9",         icon: Star,       color: "#F59E0B", bg: "rgba(245,158,11,0.1)", suffix: "★" },
          ].map(({ label, value, icon: Icon, color, bg, suffix }) => (
            <div key={label} className="stat-card hover-scale">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                  <Icon className="size-5" style={{ color }} />
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                    {value}{suffix}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="xl:col-span-2 space-y-6">

            {/* Ventures Supported */}
            <motion.div {...fadeUp(0.1)} className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Ventures Supported</h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Active engagements & stage contributions
                  </p>
                </div>
                <Link href="/expert-dashboard/investments" className="badge badge-blue text-xs">
                  View all <ChevronRight className="size-3" />
                </Link>
              </div>

              <div className="space-y-4">
                {VENTURES_SUPPORTED.map((v, i) => (
                  <motion.div
                    key={v.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                    className="flex items-center gap-4 p-4 rounded-2xl hover-scale cursor-pointer"
                    style={{ backgroundColor: "var(--bg-surface-2)", border: "1px solid var(--border-soft)" }}
                  >
                    {/* Avatar */}
                    <div
                      className="size-11 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: v.avatarBg }}
                    >
                      {v.avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{v.name}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: `${v.contributionColor}18`, color: v.contributionColor, border: `1px solid ${v.contributionColor}30` }}>
                          {v.contribution}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {v.founder} · Stage: {v.stage} · {v.sessions} sessions
                      </p>
                    </div>

                    {/* Equity tag */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold" style={{ color: v.contributionColor }}>{v.equity}</p>
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>equity</p>
                    </div>

                    <ArrowUpRight className="size-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Session History */}
            <motion.div {...fadeUp(0.15)} className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Recent Sessions</h2>
                <Link href="/expert-dashboard/sessions" className="btn-ghost text-xs py-1 px-3">
                  All sessions
                </Link>
              </div>

              <div className="space-y-3">
                {RECENT_SESSIONS.map((session: any) => {
                  const { founder, venture, date, duration, status, earned: e, avatar, feedbackRating, feedbackNotes } = session;
                  return (
                  <div
                    key={founder}
                    className="flex items-center gap-3 p-3 rounded-xl hover-scale"
                    style={{ backgroundColor: "var(--bg-surface-2)", border: "1px solid var(--border-soft)" }}
                  >
                    <div
                      className="size-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #5B6CFF, #4FD1C5)" }}
                    >
                      {avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{founder}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{venture} · {date} · {duration}min</p>
                      {feedbackRating ? (
                        <p className="text-[10px] mt-1 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                          {feedbackRating}/5 stars{feedbackNotes ? ` · ${feedbackNotes}` : ""}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {status === "completed" && (
                        <span className="text-xs font-medium text-emerald-500">+{e} cr</span>
                      )}
                      <span
                        className={`badge text-[10px] ${
                          status === "completed" ? "badge-live"
                          : status === "upcoming" ? "badge-blue"
                          : "badge-warn"
                        }`}
                      >
                        {status === "completed" ? <CheckCircle2 className="size-2.5" /> : <Clock className="size-2.5" />}
                        {status}
                      </span>
                    </div>
                  </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* RIGHT column */}
          <div className="space-y-6">
            {/* Earnings meter */}
            <motion.div {...fadeUp(0.1)}>
              <EarningsMeter earned={earned} />
            </motion.div>

            {/* Performance stats */}
            <motion.div {...fadeUp(0.15)} className="card p-5">
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Performance</h3>
              <div className="space-y-4">
                {[
                  { label: "Session completion",  value: 94, color: "#10B981" },
                  { label: "Founder satisfaction", value: 98, color: "#5B6CFF" },
                  { label: "Response rate",        value: 87, color: "#F59E0B" },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                      <span className="font-semibold" style={{ color }}>{value}%</span>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming session */}
            <motion.div {...fadeUp(0.2)} className="p-5 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(91,108,255,0.1), rgba(79,209,197,0.08))", border: "1px solid rgba(91,108,255,0.2)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="size-4" style={{ color: "var(--accent-indigo)" }} />
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Next Session</p>
              </div>
              <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>with Rahul Kumar — HealthBridge</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Apr 12 · 4:00 PM IST · 30 min</p>
              <div className="mt-3 p-2 rounded-lg text-center cursor-pointer hover-scale" style={{ backgroundColor: "rgba(91,108,255,0.15)", color: "var(--accent-indigo)" }}>
                <p className="text-xs font-semibold">Start Session →</p>
              </div>
            </motion.div>

            {/* Quick stats */}
            <motion.div {...fadeUp(0.25)} className="card p-5">
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Impact Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Founders Helped",  value: "12",    icon: Users,       color: "#5B6CFF" },
                  { label: "Hours Mentored",   value: "24h",   icon: Clock,       color: "#4FD1C5" },
                  { label: "Avg Session",      value: "52min", icon: BarChart2,   color: "#F59E0B" },
                  { label: "Repeat Bookings",  value: "67%",   icon: Zap,         color: "#10B981" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div
                    key={label}
                    className="p-3 rounded-xl text-center"
                    style={{ backgroundColor: "var(--bg-surface-2)", border: "1px solid var(--border-soft)" }}
                  >
                    <Icon className="size-4 mx-auto mb-1" style={{ color }} />
                    <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Invite CTA */}
            <motion.div {...fadeUp(0.3)} className="p-5 rounded-2xl text-center" style={{ background: "linear-gradient(135deg, #5B6CFF, #4FD1C5)" }}>
              <MessageSquare className="size-6 mx-auto mb-2 text-white" />
              <p className="text-white text-sm font-semibold mb-1">Grow your network</p>
              <p className="text-white/70 text-xs mb-3">Refer a founder, earn 50 bonus credits</p>
              <button className="btn-dark text-xs py-1.5 px-4 w-full justify-center" style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>
                Share referral link
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
