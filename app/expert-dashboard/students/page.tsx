"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Search, Star, ChevronRight, TrendingUp, Lightbulb, MessageSquare } from "lucide-react";
import SearchFilter from "@/components/ui/SearchFilter";
import EmptyState from "@/components/ui/EmptyState";
import { useFilteredData } from "@/hooks/useFilteredData";

const STUDENTS = [
  { id: 1, name: "Arjun Sharma",  avatar: "AS", venture: "EduLoop",      sector: "EdTech",    stage: "Research", stageColor: "#06B6D4", sessions: 3, rating: 5.0, lastSeen: "Apr 8", status: "active" },
  { id: 2, name: "Priya Mehta",   avatar: "PM", venture: "Supplify",     sector: "FinTech",   stage: "MVP",      stageColor: "#10B981", sessions: 5, rating: 4.8, lastSeen: "Apr 6", status: "active" },
  { id: 3, name: "Rahul Kumar",   avatar: "RK", venture: "HealthBridge", sector: "HealthTech",stage: "Funding",  stageColor: "#F59E0B", sessions: 8, rating: 4.9, lastSeen: "Apr 2", status: "active" },
  { id: 4, name: "Sneha Rao",     avatar: "SR", venture: "FitMind",      sector: "Consumer",  stage: "Ideation", stageColor: "#8B5CF6", sessions: 1, rating: null,lastSeen: "Apr 5", status: "pending" },
];

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: d, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function ExpertStudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = useFilteredData(
    STUDENTS,
    searchQuery,
    [
      (student, query) => student.name.toLowerCase().includes(query),
      (student, query) => student.venture.toLowerCase().includes(query),
      (student, query) => student.sector.toLowerCase().includes(query),
    ]
  );

  return (
    <DashboardShell role="expert">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div {...fadeUp(0)}>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
            My Founders
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Students you&apos;re actively mentoring and their venture progress.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div {...fadeUp(0.05)} className="grid grid-cols-3 gap-4">
          {[
            { label: "Active founders",  value: STUDENTS.filter(s => s.status === "active").length,  color: "#10B981" },
            { label: "Pending",          value: STUDENTS.filter(s => s.status === "pending").length,  color: "#F59E0B" },
            { label: "Total sessions",   value: STUDENTS.reduce((a, s) => a + s.sessions, 0),         color: "#5B6CFF" },
          ].map(({ label, value, color }) => (
            <div key={label} className="stat-card text-center">
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div {...fadeUp(0.08)}>
          <SearchFilter
            placeholder="Search founders or ventures..."
            onSearchChange={setSearchQuery}
          />
        </motion.div>

        {/* Student cards */}
        <div className="space-y-4">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }} className="card p-5 hover-scale">

              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #5B6CFF, #4FD1C5)" }}>
                  {s.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{s.name}</p>
                    {s.status === "pending" && <span className="badge badge-warn text-[10px]">Pending</span>}
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {s.venture} · {s.sector}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="badge text-[10px]"
                      style={{ backgroundColor: `${s.stageColor}15`, color: s.stageColor, border: `1px solid ${s.stageColor}30` }}>
                      {s.stage}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{s.sessions} sessions</span>
                    {s.rating && (
                      <span className="flex items-center gap-0.5 text-[10px]">
                        <Star className="size-2.5 fill-yellow-400 text-yellow-400" />{s.rating}
                      </span>
                    )}
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Last seen {s.lastSeen}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1">
                    <MessageSquare className="size-3" /> Message
                  </button>
                  <button className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1" style={{ color: "var(--accent-indigo)" }}>
                    <Lightbulb className="size-3" /> View Venture <ChevronRight className="size-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
          ) : (
            <EmptyState
              icon="👥"
              title="No students found"
              description="Try adjusting your search to find students."
            />
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
