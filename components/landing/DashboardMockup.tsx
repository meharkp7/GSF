"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, MessageSquare, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";

export function DashboardMockup() {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      {/* Main card */}
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-border dark:border-slate-700 shadow-soft-xl dark:shadow-lg overflow-hidden">
        {/* Top bar */}
        <div className="bg-canvas px-4 py-3 border-b border-border flex items-center gap-2">
          <div className="flex gap-1.5">
            {["bg-red-400", "bg-amber-400", "bg-emerald-400"].map((c, i) => (
              <div key={i} className={`size-2.5 rounded-full ${c}`} />
            ))}
          </div>
          <div className="flex-1 mx-3 h-5 bg-gray-100 rounded-md" />
          <div className="size-6 rounded-md bg-primary-100 flex items-center justify-center">
            <span className="text-primary-600 font-bold text-xs">G</span>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="flex">
          {/* Sidebar */}
          <div className="w-40 bg-canvas border-r border-border p-3 space-y-1 hidden sm:block">
            {[
              { icon: "▪", label: "Dashboard", active: true },
              { icon: "▪", label: "My Journey" },
              { icon: "▪", label: "My Idea" },
              { icon: "▪", label: "Cohort" },
              { icon: "▪", label: "Experts" },
            ].map(({ icon, label, active }) => (
              <div
                key={label}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs ${
                  active
                    ? "bg-primary-50 text-primary-600 font-medium"
                    : "text-text-muted"
                }`}
              >
                <span className="text-[8px]">{icon}</span>
                {label}
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="flex-1 p-4 space-y-4">
            {/* Welcome */}
            <div>
              <p className="text-xs text-text-muted">Good morning</p>
              <p className="text-sm font-semibold text-text-primary">
                Arjun Sharma 👋
              </p>
            </div>

            {/* Progress */}
            <div className="bg-canvas rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-primary">
                  Cohort Progress
                </span>
                <Badge variant="primary" size="sm">Explorer</Badge>
              </div>
              <Progress value={67} size="sm" />
              <p className="text-xs text-text-muted">Module 4 of 6 complete</p>
            </div>

            {/* Activity cards */}
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  icon: <CheckCircle2 className="size-3 text-emerald-500" />,
                  label: "Tasks done",
                  value: "12",
                },
                {
                  icon: <TrendingUp className="size-3 text-primary-500" />,
                  label: "Idea score",
                  value: "78%",
                },
              ].map(({ icon, label, value }) => (
                <div
                  key={label}
                  className="bg-white border border-border rounded-xl p-3"
                >
                  <div className="flex items-center gap-1 mb-1">
                    {icon}
                    <span className="text-xs text-text-muted">{label}</span>
                  </div>
                  <span className="text-lg font-semibold text-text-primary">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Session card */}
            <div className="bg-primary-50 rounded-xl p-3 flex items-start gap-2">
              <div className="size-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 text-xs font-semibold">M</span>
              </div>
              <div>
                <p className="text-xs font-medium text-primary-700">
                  Session with Meera Patel
                </p>
                <p className="text-xs text-primary-500 mt-0.5">Today, 3:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute -bottom-4 -right-4 bg-white border border-border shadow-soft-md rounded-xl px-3.5 py-2.5 flex items-center gap-2.5"
      >
        <div className="size-8 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="size-4 text-emerald-500" />
        </div>
        <div>
          <p className="text-xs font-semibold text-text-primary">
            Idea Validated!
          </p>
          <p className="text-xs text-text-muted">Mentor approved your pitch</p>
        </div>
      </motion.div>

      {/* Floating cohort badge */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="absolute -top-4 -left-4 bg-white border border-border shadow-soft-md rounded-xl px-3 py-2 flex items-center gap-2"
      >
        <div className="size-7 rounded-full bg-primary-100 flex items-center justify-center">
          <MessageSquare className="size-3.5 text-primary-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-text-primary">12 peers online</p>
          <div className="flex -space-x-1 mt-0.5">
            {["bg-primary-400", "bg-secondary-400", "bg-amber-400", "bg-rose-400"].map(
              (c, i) => (
                <div
                  key={i}
                  className={`size-4 rounded-full ${c} border border-white`}
                />
              )
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
