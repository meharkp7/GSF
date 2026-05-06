"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useUser } from "@clerk/nextjs";
import { clerkUserToAuthUser } from "@/lib/auth";
import { Coins, TrendingUp, ArrowDownRight, ArrowUpRight, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";

const TRANSACTIONS = [
  { id: 1, type: "debit",  amount: 100, reason: "Session booked: Meera Patel",   date: "Apr 8, 2026",  balance: 500 },
  { id: 2, type: "credit", amount: 100, reason: "Plan started: Basic (30-day free)", date: "Apr 1, 2026",  balance: 600 },
  { id: 3, type: "credit", amount: 600, reason: "Basic plan credits granted",    date: "Apr 1, 2026",  balance: 600 },
];

const PLANS = [
  { name: "Basic",    price: "₹499",   credits: 600,  period: "/month", current: true,  color: "#3B82F6", exp: "0–10 yrs",              badge: "Free 30 days", features: ["600 credits/month", "Expert access (0–10 yrs exp)", "Venture marketplace", "Community", "Free for first 30 days"] },
  { name: "Standard", price: "₹999",   credits: 1500, period: "/month", current: false, color: "#10B981", exp: "10–15 yrs",            badge: null,           features: ["1,500 credits/month", "Expert access (10–15 yrs exp)", "Priority booking", "All Basic features"] },
  { name: "Premium",  price: "₹1,499", credits: 2000, period: "/month", current: false, color: "#F59E0B", exp: "15+ yrs · GSF exclusive", badge: "Top Tier",     features: ["2,000 credits/month", "Exclusive GSF experts (15+ yrs)", "Investor intros", "Dedicated advisor", "All Standard features"] },
];

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: d, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function CreditsPage() {
  const { user: clerkUser } = useUser();
  const user = clerkUser ? clerkUserToAuthUser(clerkUser) : null;
  const credits = user?.credits ?? 600;

  const pct = Math.min(100, (credits / 600) * 100);

  return (
    <DashboardShell role="founder">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div {...fadeUp(0)}>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
            Credits & Billing
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Monitor your credit balance and manage your subscription plan.
          </p>
        </motion.div>

        {/* Balance card */}
        <motion.div {...fadeUp(0.05)}
          className="p-8 rounded-3xl relative overflow-hidden"
          style={{ backgroundColor: "var(--bg-surface)", border: "1px solid rgba(91,108,255,0.35)" }}
        >
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Current Balance</p>
              <div className="flex items-end gap-2">
                <span className="text-6xl font-extrabold" style={{ color: "var(--text-primary)", fontFamily: "'Playfair Display', serif" }}>
                  {credits}
                </span>
                <span className="mb-2" style={{ color: "var(--text-muted)" }}>credits</span>
              </div>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Basic Plan · Free trial · Resets in 22 days</p>
            </div>

            <div className="sm:ml-auto w-full sm:w-64">
              <div className="flex justify-between text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                <span>Used: {600 - credits}</span>
                <span>Limit: 600</span>
              </div>
              <div className="h-2 rounded-full" style={{ backgroundColor: "var(--bg-surface-2)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(to right, #5B6CFF, #4FD1C5)" }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                100 credits = 1 expert session (Basic tier)
              </p>
            </div>
          </div>
        </motion.div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transaction log */}
          <motion.div {...fadeUp(0.1)} className="lg:col-span-2 card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Coins className="size-4" style={{ color: "var(--accent-indigo)" }} />
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Transaction History</h2>
            </div>
            <div className="space-y-3">
              {TRANSACTIONS.map(tx => (
                <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: "var(--bg-surface-2)", border: "1px solid var(--border-soft)" }}>
                  <div className={`size-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    tx.type === "credit" ? "bg-emerald-100" : "bg-red-50"
                  }`}>
                    {tx.type === "credit"
                      ? <ArrowUpRight className="size-4 text-emerald-500" />
                      : <ArrowDownRight className="size-4 text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{tx.reason}</p>
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{tx.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold ${tx.type === "credit" ? "text-emerald-500" : "text-red-400"}`}>
                      {tx.type === "credit" ? "+" : "-"}{tx.amount}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Bal: {tx.balance}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick stats */}
          <motion.div {...fadeUp(0.15)} className="space-y-4">
            {[
              { label: "Sessions booked",  value: "1",    icon: TrendingUp, color: "#5B6CFF" },
              { label: "Credits spent",    value: "100",  icon: ArrowDownRight, color: "#EF4444" },
              { label: "Credits remaining",value: `${credits}`, icon: Coins, color: "#10B981" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card p-4 flex items-center gap-3">
                <div className="size-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
                  <Icon className="size-4" style={{ color }} />
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 30-day trial notice */}
        <motion.div {...fadeUp(0.18)} className="flex items-start gap-3 p-4 rounded-2xl"
          style={{ backgroundColor: "rgba(91,108,255,0.06)", border: "1px solid rgba(91,108,255,0.15)" }}>
          <Zap className="size-4 mt-0.5 flex-shrink-0" style={{ color: "var(--accent-indigo)" }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Your Basic plan is free for 30 days</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              After 30 days, your account automatically converts to the <strong>Basic plan (₹499/month)</strong>. Cancel anytime before then — no questions asked.
            </p>
          </div>
        </motion.div>

        {/* Plans */}
        <motion.div {...fadeUp(0.22)} className="card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="size-4" style={{ color: "var(--accent-indigo)" }} />
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Choose a Plan</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLANS.map(plan => (
              <div key={plan.name} className={`p-5 rounded-2xl flex flex-col ${plan.current ? "border-2" : "border"} relative`}
                style={{
                  borderColor: plan.current ? plan.color : "var(--border-default)",
                  backgroundColor: plan.current ? `${plan.color}08` : "var(--bg-surface-2)",
                }}>
                {plan.badge && (
                  <span className="absolute -top-2.5 left-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: plan.color }}>
                    {plan.badge}
                  </span>
                )}
                {plan.current && (
                  <span className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: plan.color }}>
                    Current plan
                  </span>
                )}
                <p className="font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>{plan.name}</p>
                <div className="flex items-end gap-1 mb-1">
                  <p className="text-2xl font-extrabold" style={{ color: plan.color, fontFamily: "'Playfair Display', serif" }}>{plan.price}</p>
                  <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{plan.period}</p>
                </div>
                {/* Experience badge */}
                <span className="inline-flex w-fit text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-lg mb-4"
                  style={{ backgroundColor: `${plan.color}15`, color: plan.color, border: `1px solid ${plan.color}30` }}>
                  {plan.exp} experts
                </span>
                {/* Features */}
                <ul className="space-y-1.5 flex-1 mb-4">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                      <span className="size-3.5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${plan.color}20`, color: plan.color }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {!plan.current ? (
                  <button className="btn-primary text-xs py-2 justify-center" style={{ background: `linear-gradient(135deg, ${plan.color}, ${plan.color}CC)` }}>
                    Upgrade to {plan.name}
                  </button>
                ) : (
                  <button className="btn-outline text-xs py-2 justify-center" style={{ borderColor: plan.color, color: plan.color }}>
                    Current Plan ✓
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-center mt-4" style={{ color: "var(--text-muted)" }}>
            Expert experience filters are applied automatically based on your plan. Upgrade anytime to unlock senior experts.
          </p>
        </motion.div>
      </div>
    </DashboardShell>
  );
}
