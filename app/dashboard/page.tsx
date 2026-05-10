"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2, TrendingUp, Clock, Coins, ArrowRight,
  Calendar, Lightbulb, ChevronRight, Zap, Target, Users,
  BarChart2, Star, Plus, Video, Sparkles,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useUser } from "@clerk/nextjs";
import { useCredits } from "@/lib/hooks/useCredits";
import { useVenture } from "@/lib/hooks/useVenture";
import { useSessions } from "@/lib/hooks/useSessions";

// ===== VENTURE STAGES =====
const STAGES = [
  { id: "ideation",  label: "Ideation",  color: "#8B5CF6", desc: "Identify problem & opportunity" },
  { id: "screening", label: "Screening", color: "#3B82F6", desc: "Validate assumptions" },
  { id: "research",  label: "Research",  color: "#06B6D4", desc: "Customer discovery" },
  { id: "mvp",       label: "MVP",       color: "#10B981", desc: "Build & test prototype" },
  { id: "funding",   label: "Funding",   color: "#F59E0B", desc: "Raise capital" },
  { id: "launch",    label: "Launch",    color: "#EF4444", desc: "Go to market" },
  { id: "pmf",       label: "PMF",       color: "#5B6CFF", desc: "Product-market fit" },
];
const CURRENT_STAGE = 0; // fallback — overridden by live venture data below (0 = Ideation)

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

function StageTimeline({ currentStage }: { currentStage: number }) {
  const [animatedStage, setAnimatedStage] = useState(-1);

  useEffect(() => {
    STAGES.forEach((_, i) => {
      setTimeout(() => setAnimatedStage(i), i * 120);
    });
  }, []);

  return (
    <div>
      {/* Horizontal stage track */}
      <div className="relative flex items-center gap-0 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {STAGES.map((stage, i) => {
          const isPast    = i < currentStage;
          const isCurrent = i === currentStage;
          const isFuture  = i > currentStage;

          return (
            <div key={stage.id} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={animatedStage >= i ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-1.5 min-w-[72px]"
              >
                <div
                  className={`stage-node ${isPast ? "stage-node-complete" : isCurrent ? "stage-node-active" : ""}`}
                  style={!isPast && !isCurrent ? { borderColor: "var(--border-default)" } : {}}
                >
                  {isPast ? (
                    <CheckCircle2 className="size-4 text-white" />
                  ) : (
                    <span className="text-[10px] font-bold">{i + 1}</span>
                  )}
                </div>
                <div className="text-center">
                  <p
                    className="text-[11px] font-semibold leading-tight"
                    style={{ color: isCurrent ? stage.color : isFuture ? "var(--text-muted)" : "var(--text-secondary)" }}
                  >
                    {stage.label}
                  </p>
                </div>
              </motion.div>

              {/* Connector line */}
              {i < STAGES.length - 1 && (
                <motion.div
                  className="h-[2px] flex-1 min-w-[20px]"
                  initial={{ scaleX: 0 }}
                  animate={animatedStage >= i + 1 ? { scaleX: 1 } : {}}
                  style={{
                    backgroundColor: i < currentStage ? "#10B981" : "var(--border-default)",
                    transformOrigin: "left",
                  }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current stage detail card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="p-4 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${STAGES[currentStage].color}15, ${STAGES[currentStage].color}08)`,
          border: `1px solid ${STAGES[currentStage].color}30`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="size-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${STAGES[currentStage].color}20` }}
          >
            <Target className="size-5" style={{ color: STAGES[currentStage].color }} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: STAGES[currentStage].color }}>
              Current Stage — {STAGES[currentStage].label}
            </p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {STAGES[currentStage].desc}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-bold" style={{ color: STAGES[currentStage].color }}>
              {Math.round((currentStage / (STAGES.length - 1)) * 100)}%
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>complete</p>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="mt-4 progress-bar">
          <motion.div
            className={`progress-fill progress-${STAGES[currentStage].id}`}
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStage / (STAGES.length - 1)) * 100}%` }}
            transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}



function CreditWallet({ credits }: { credits: number }) {
  const max = 600;
  const pct = Math.min(100, (credits / max) * 100);

  // Conic gradient animation
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setDisplayed(credits), 300);
    return () => clearTimeout(timer);
  }, [credits]);

  return (
    <div className="p-5 rounded-2xl relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(91,108,255,0.08), rgba(79,209,197,0.06))", border: "1px solid var(--border-default)" }}>
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] pointer-events-none" style={{ background: "rgba(91,108,255,0.1)" }} />

      <div className="flex items-center gap-4">
        {/* Spinning credit orb */}
        <div className="relative flex-shrink-0">
          <div className="credit-orb" style={{ width: 64, height: 64 }}>
            <div className="credit-orb-inner" style={{ width: 54, height: 54 }}>
              <Coins className="size-5" style={{ color: "var(--accent-indigo)" }} />
            </div>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
            Credits Balance
          </p>
          <motion.p
            className="text-3xl font-extrabold"
            style={{ color: "var(--accent-indigo)", fontFamily: "'Playfair Display', serif" }}
            key={displayed}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {displayed.toLocaleString()}
          </motion.p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Basic Plan · Free for 22 more days
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
          <span>Used: {max - credits}</span>
          <span>Limit: {max}</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: "0%" }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      <Link href="/dashboard/credits" className="mt-3 text-xs font-medium flex items-center gap-1" style={{ color: "var(--accent-indigo)" }}>
        View credit history <ChevronRight className="size-3" />
      </Link>
    </div>
  );
}

function CommunityFeedWidget() {
  const [posts, setPosts] = useState<{ id: string; title: string; author: string; upvotes: number; tag: string }[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("gsf_community_posts");
      if (raw) {
        const parsed = JSON.parse(raw);
        setPosts(parsed.slice(0, 3).map((p: { id: string; title: string; author: string; upvotes: number; tag: string }) => ({
          id: p.id, title: p.title, author: p.author, upvotes: p.upvotes, tag: p.tag,
        })));
      } else {
        // fallback seeds
        setPosts([
          { id: "p2", title: "What I look for in a GSF student pitch", author: "Dr. Anika Patel", upvotes: 412, tag: "Expert View" },
          { id: "p8", title: "How we evaluate pre-seed rounds", author: "Fatima Ali", upvotes: 441, tag: "Investor Lens" },
          { id: "p1", title: "From a WhatsApp group to ₹15L raise", author: "Priya Sharma", upvotes: 284, tag: "Founder Story" },
        ]);
      }
    } catch { /* ignore */ }
  }, []);

  if (posts.length === 0) return (
    <p className="text-xs text-center py-4" style={{ color: "var(--text-muted)" }}>No posts yet. Be the first!</p>
  );

  return (
    <div className="space-y-2.5">
      {posts.map(p => (
        <Link key={p.id} href={`/community#${p.id}`}
          className="block p-3 rounded-xl transition-all hover:scale-[1.01]"
          style={{ backgroundColor: "var(--bg-surface-2)", border: "1px solid var(--border-default)" }}>
          <p className="text-xs font-semibold line-clamp-2 mb-1.5" style={{ color: "var(--text-primary)" }}>{p.title}</p>
          <div className="flex items-center justify-between">
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{p.author}</span>
            <span className="text-[10px] font-medium" style={{ color: "var(--accent-indigo)" }}>▲ {p.upvotes}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function FounderDashboardPage() {
  const { user: clerkUser } = useUser();
  const firstName = clerkUser?.firstName ?? "Founder";

  const { balance: credits }              = useCredits();
  const { venture }                       = useVenture();
  const { completed: doneSessions, upcoming: upcomingSessions } = useSessions();

  // Map venture stage string to STAGES index
  const liveStageIndex = venture?.stage
    ? STAGES.findIndex(s => s.label.toLowerCase() === venture.stage!.toLowerCase())
    : -1;
  const activeStage = liveStageIndex >= 0 ? liveStageIndex : CURRENT_STAGE;

  const sessionStats = {
    booked:    doneSessions.length + upcomingSessions.length,
    completed: doneSessions.length,
    pending:   upcomingSessions.length,
  };

  return (
    <DashboardShell role="founder">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Welcome header */}
        <motion.div {...fadeUp(0)} className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
              Good evening, {firstName}
              <Sparkles className="size-5 text-amber-400" />
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              You&apos;re in the <strong>{venture?.stage ?? "Ideation"}</strong> stage. Keep building!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-blue">
              <span className="size-1.5 rounded-full bg-blue-400" />
              Basic Plan — 22 days free
            </span>
          </div>
        </motion.div>

        {/* Top stat cards */}
        <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Stage",         value: venture?.stage ?? "Ideation", icon: Target,   color: "#06B6D4", bg: "rgba(6,182,212,0.15)" },
            { label: "Credits Left",  value: `${credits}`,                  icon: Coins,   color: "#5B6CFF", bg: "rgba(91,108,255,0.15)" },
            { label: "Sessions Done", value: `${sessionStats.completed}`,   icon: Calendar,color: "#10B981", bg: "rgba(16,185,129,0.15)" },
            { label: "Upcoming",      value: `${sessionStats.pending}`,     icon: BarChart2,color:"#F59E0B", bg: "rgba(245,158,11,0.15)" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="stat-card hover-scale">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                  <Icon className="size-5" style={{ color }} />
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* LEFT — Stage tracker + Idea card */}
          <div className="xl:col-span-2 space-y-6">

            {/* Venture Stage Tracker */}
            <motion.div {...fadeUp(0.1)} className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                    Venture Journey
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    7-stage founder roadmap
                  </p>
                </div>
                <Link href="/dashboard/progress" className="badge badge-blue text-xs">
                  Full details <ChevronRight className="size-3" />
                </Link>
              </div>
              <StageTimeline currentStage={activeStage} />
            </motion.div>

            {/* Idea Summary Card */}
            <motion.div {...fadeUp(0.15)} className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                  My Venture
                </h2>
                <Link href="/dashboard/venture" className="btn-ghost text-xs py-1 px-3 flex items-center gap-1">
                  Edit <ChevronRight className="size-3" />
                </Link>
              </div>

              {/* Live venture data — empty state if not set up yet */}
              {!venture ? (
                <div className="text-center py-6">
                  <Lightbulb className="size-8 mx-auto mb-2" style={{ color: "var(--text-muted)" }} />
                  <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>No venture set up yet</p>
                  <Link href="/dashboard/venture" className="btn-primary text-xs py-1.5 px-4 mt-3 inline-flex items-center gap-1">
                    <Plus className="size-3" /> Set up my venture
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Idea identity */}
                  <div className="p-4 rounded-2xl" style={{ backgroundColor: "var(--bg-surface-2)", border: "1px solid var(--border-default)" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(91,108,255,0.2), rgba(79,209,197,0.2))" }}>
                        <Lightbulb className="size-5" style={{ color: "var(--accent-indigo)" }} />
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{venture.name || "My Venture"}</p>
                        <span className="badge badge-blue text-[10px]">{venture.stage}</span>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {venture.tagline || venture.description || "—"}
                    </p>
                  </div>

                  {/* Financial terms */}
                  <div className="grid grid-cols-2 gap-3">
                    {(() => {
                      const tm = (venture as any)?.tractionMetrics;
                      const hasStructured = tm && typeof tm === "object" && !Array.isArray(tm);

                      if (hasStructured) {
                        const usersNow = Number((tm as any).users) || 0;
                        const usersPrev = Number((tm as any).usersPrevious) || 0;
                        const mrrNow = Number((tm as any).mrr) || 0;
                        const mrrPrev = Number((tm as any).mrrPrevious) || 0;
                        const pilots = Number((tm as any).pilots) || 0;
                        const growthRate = Number((tm as any).growthRate) || 0;

                        const usersDelta = usersNow - usersPrev;
                        const mrrDelta = mrrNow - mrrPrev;

                        return [
                          {
                            label: "Users",
                            value: usersNow.toLocaleString(),
                            icon: Users,
                            sub: usersDelta === 0 ? "" : `${usersDelta >= 0 ? "+" : ""}${usersDelta.toLocaleString()} vs previous`,
                            subColor: usersDelta >= 0 ? "#10B981" : "#EF4444",
                          },
                          {
                            label: "MRR (USD)",
                            value: `$${mrrNow.toLocaleString()}`,
                            icon: Coins,
                            sub: mrrDelta === 0 ? "" : `${mrrDelta >= 0 ? "+" : ""}${mrrDelta.toLocaleString()} vs previous`,
                            subColor: mrrDelta >= 0 ? "#10B981" : "#EF4444",
                          },
                          {
                            label: "Active Pilots",
                            value: pilots.toLocaleString(),
                            icon: Zap,
                            sub: "Pilot partnerships running",
                            subColor: "var(--text-muted)",
                          },
                          {
                            label: "Growth Rate",
                            value: `${growthRate.toFixed(1)}%`,
                            icon: TrendingUp,
                            sub: "Month-over-month",
                            subColor: "var(--text-muted)",
                          },
                        ].map(({ label, value, icon: Icon, sub, subColor }) => (
                          <div
                            key={label}
                            className="p-3 rounded-xl text-center"
                            style={{ backgroundColor: "var(--bg-surface-2)", border: "1px solid var(--border-default)" }}
                          >
                            <Icon className="size-4 mx-auto mb-1" style={{ color: "var(--accent-indigo)" }} />
                            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
                            <p className="text-[10px]" style={{ color: subColor }}>{sub || "—"}</p>
                          </div>
                        ));
                      }

                      return [
                        { label: "Equity Offered", value: venture.equity   ? `${venture.equity}%`  : "—", icon: TrendingUp },
                        { label: "Funding Goal",   value: venture.fundingGoal ? `$${Number(venture.fundingGoal).toLocaleString()}` : "—", icon: Coins },
                        { label: "Traction",       value: venture.traction || "—", icon: Zap },
                        { label: "Team Size",      value: venture.teamSize  ? `${venture.teamSize} founder${venture.teamSize !== 1 ? "s" : ""}` : "—", icon: Users },
                      ].map(({ label, value, icon: Icon }) => (
                        <div
                          key={label}
                          className="p-3 rounded-xl text-center"
                          style={{ backgroundColor: "var(--bg-surface-2)", border: "1px solid var(--border-default)" }}
                        >
                          <Icon className="size-4 mx-auto mb-1" style={{ color: "var(--accent-indigo)" }} />
                          <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
                          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{label}</p>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Expert Session History */}
            <motion.div {...fadeUp(0.2)} className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Expert Sessions</h2>
                  <div className="flex items-center gap-3 mt-1">
                    {[
                      { label: "Booked",    count: sessionStats.booked,    color: "#5B6CFF" },
                      { label: "Done",      count: sessionStats.completed,  color: "#10B981" },
                      { label: "Pending",   count: sessionStats.pending,    color: "#F59E0B" },
                    ].map(({ label, count, color }) => (
                      <span key={label} className="flex items-center gap-1 text-xs">
                        <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
                        <span style={{ color: "var(--text-muted)" }}>{count} {label}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <Link href="/dashboard/experts" className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1">
                  <Plus className="size-3" /> Book
                </Link>
              </div>

              <div className="space-y-3">
                {upcomingSessions.length === 0 && doneSessions.length === 0 ? (
                  <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>
                    No sessions yet.{" "}
                    <Link href="/dashboard/experts" style={{ color: "var(--accent-indigo)" }}>Book your first expert →</Link>
                  </p>
                ) : [...doneSessions, ...upcomingSessions].slice(0, 4).map((s) => {
                  const initials = (s.expertName ?? "??").split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
                  const dateStr  = s.scheduledAt ? new Date(s.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
                  return (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover-scale cursor-pointer"
                      style={{ backgroundColor: "var(--bg-surface-2)", border: "1px solid var(--border-default)" }}
                    >
                      <div
                        className="size-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #5B6CFF, #4A58E8)" }}
                      >
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{s.expertName || "Expert"}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.ventureName} · {dateStr} · {s.duration}min</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-medium" style={{ color: "var(--accent-indigo)" }}>-{s.creditsCost} cr</span>
                        <span className={`badge text-[10px] ${s.status === "completed" ? "badge-live" : s.status === "confirmed" ? "badge-blue" : "badge-warn"}`}>
                          {s.status}
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
            {/* Credits Wallet */}
            <motion.div {...fadeUp(0.1)}>
              <CreditWallet credits={credits} />
            </motion.div>

            {/* Quick actions */}
            <motion.div {...fadeUp(0.15)} className="card p-5">
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: "Book an expert",    icon: Video,      href: "/connect" },
                  { label: "Update idea",       icon: Lightbulb,  href: "/dashboard/venture" },
                  { label: "Browse ventures",   icon: TrendingUp, href: "/ventures" },
                  { label: "Join community",    icon: Users,      href: "/community" },
                ].map(({ label, icon: Icon, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 p-2.5 rounded-xl text-sm transition-all hover-scale"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <div className="size-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--bg-surface-2)" }}>
                      <Icon className="size-3.5" style={{ color: "var(--accent-indigo)" }} />
                    </div>
                    <span className="flex-1">{label}</span>
                    <ChevronRight className="size-3.5" style={{ color: "var(--text-muted)" }} />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Upcoming session */}
            <motion.div {...fadeUp(0.2)} className="p-5 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(91,108,255,0.08), rgba(79,209,197,0.05))", border: "1px solid var(--border-default)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="size-4" style={{ color: "var(--accent-indigo)" }} />
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Next Session</p>
              </div>
              <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>1-on-1 with Vikram Nair</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Apr 12 · 3:00 PM IST</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 p-2 rounded-lg text-center cursor-pointer hover-scale" style={{ backgroundColor: "rgba(91,108,255,0.15)", color: "var(--accent-indigo)" }}>
                  <p className="text-xs font-semibold">Join Call</p>
                </div>
                <div className="flex-1 p-2 rounded-lg text-center cursor-pointer hover-scale" style={{ backgroundColor: "var(--bg-surface-2)", color: "var(--text-secondary)" }}>
                  <p className="text-xs font-semibold">Reschedule</p>
                </div>
              </div>
            </motion.div>

            {/* Community Feed */}
            <motion.div {...fadeUp(0.23)} className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="size-4" style={{ color: "var(--accent-indigo)" }} />
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Community Feed</h3>
                </div>
                <Link href="/community" className="text-xs font-medium" style={{ color: "var(--accent-indigo)" }}>
                  See all →
                </Link>
              </div>
              <CommunityFeedWidget />
            </motion.div>

            {/* Top expert recommendation */}

            <motion.div {...fadeUp(0.25)} className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Star className="size-4 text-yellow-400 fill-yellow-400" />
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Recommended Expert</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #8B5CF6, #A78BFA)" }}>
                  SP
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Sanya Puri</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>EdTech · YC S22</p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className="size-2.5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-[10px] ml-1" style={{ color: "var(--text-muted)" }}>5.0 (14)</span>
                  </div>
                </div>
              </div>
              <Link href="/connect" className="btn-primary w-full justify-center text-xs py-2 mt-3">
                Book Session — 100 credits <ArrowRight className="size-3" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
