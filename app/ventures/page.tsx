"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Lightbulb, TrendingUp, MessageSquare, Shield, Percent, Eye, Heart, Search, ArrowRight, SlidersHorizontal, BarChart2, Rocket, DollarSign, Building2, BookOpen, Loader2 } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

const AVATAR_COLORS = [
  { bg: "#DBEAFE", text: "#1E40AF" },
  { bg: "#FCE7F3", text: "#9D174D" },
  { bg: "#D1FAE5", text: "#065F46" },
  { bg: "#FEF3C7", text: "#92400E" },
  { bg: "#EDE9FE", text: "#5B21B6" },
  { bg: "#FFE4E6", text: "#9F1239" },
  { bg: "#CFFAFE", text: "#155E75" },
  { bg: "#FEE2E2", text: "#991B1B" },
  { bg: "#F0FDF4", text: "#14532D" },
  { bg: "#FEF9C3", text: "#713F12" },
];

const IDEA_STAGES = [
  "Ideation",
  "Idea Screening",
  "Market Research",
  "MVP",
  "Investment & Funding",
  "Company Launch",
  "Product-Market Fit",
];

const STAGE_STYLES: Record<string, { bg: string; text: string; border: string; icon: React.ElementType }> = {
  "Ideation":           { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D", icon: Lightbulb },
  "Idea Screening":     { bg: "#EDE9FE", text: "#5B21B6", border: "#C4B5FD", icon: Search },
  "Market Research":    { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD", icon: BarChart2 },
  "MVP":                { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7", icon: Rocket },
  "Investment & Funding":{ bg: "#FEF9C3", text: "#713F12", border: "#FDE68A", icon: DollarSign },
  "Company Launch":     { bg: "#EEF4F9", text: "#1E3A5F", border: "#AACDDC", icon: Building2 },
  "Product-Market Fit": { bg: "#F0FDF4", text: "#14532D", border: "#86EFAC", icon: TrendingUp },
};

const SECTORS = ["All sectors", "EdTech", "B2B SaaS", "HealthTech", "AgriTech", "Logistics", "FinTech", "HRTech", "CleanTech", "LegalTech", "SocialImpact", "Quick Commerce"];
const FUNDING_STAGES = ["All", "Pre-seed", "Seed"];

export default function VenturesPage() {
  const [search, setSearch] = useState("");
  const [ideaStageFilter, setIdeaStageFilter] = useState("All stages");
  const [sectorFilter, setSectorFilter] = useState("All sectors");
  const [fundingFilter, setFundingFilter] = useState("All");
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ventures, setVentures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fundingActionStatus, setFundingActionStatus] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});

  useEffect(() => {
    async function fetchVentures() {
      try {
        const res = await fetch('/api/ventures/public');
        if (res.ok) {
          const data = await res.json();
          setVentures(data);
        } else {
          console.error("Failed to load ventures.");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchVentures();
  }, []);

  const handleFundThis = async (ventureId: string) => {
    setFundingActionStatus(prev => ({ ...prev, [ventureId]: 'loading' }));
    try {
      const res = await fetch('/api/ventures/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ventureId, message: "Interested in discussing a potential investment." })
      });
      if (res.ok) {
        setFundingActionStatus(prev => ({ ...prev, [ventureId]: 'success' }));
        // optimistic update
        setVentures(prev => prev.map(v => v.id === ventureId ? { ...v, interested: (v.interested || 0) + 1 } : v));
        alert("Success! Your interest has been sent to the founder.");
      } else {
        if (res.status === 401) {
          alert("Please sign in to fund a venture.");
        } else {
          alert("Something went wrong. Please try again.");
        }
        setFundingActionStatus(prev => ({ ...prev, [ventureId]: 'error' }));
      }
    } catch (err) {
      console.error(err);
      setFundingActionStatus(prev => ({ ...prev, [ventureId]: 'error' }));
    }
  };

  const filtered = ventures.filter((v) => {
    const safeName = v.name || "";
    const safeFounder = v.founderName || "";
    const safeTagline = v.tagline || "";
    const safeTags = Array.isArray(v.tags) ? v.tags : [];
    
    const matchSearch = search === "" ||
      safeName.toLowerCase().includes(search.toLowerCase()) ||
      safeFounder.toLowerCase().includes(search.toLowerCase()) ||
      safeTagline.toLowerCase().includes(search.toLowerCase()) ||
      safeTags.some((t: string) => t.toLowerCase().includes(search.toLowerCase()));
      
    // Note: Drizzle stage maps to ideaStage in UI
    const matchIdea = ideaStageFilter === "All stages" || v.stage === ideaStageFilter;
    const matchSector = sectorFilter === "All sectors" || v.sector === sectorFilter;
    const matchFunding = fundingFilter === "All" || v.fundingStage === fundingFilter;
    
    return matchSearch && matchIdea && matchSector && matchFunding;
  });

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#FDFAF7] dark:bg-slate-950">

        {/* Hero */}
        <section className="relative section-padding overflow-hidden bg-soft-pattern">
          <div className="absolute inset-0 bg-dot-grid opacity-25" />
          <div className="section-container relative z-10">
            <div className="max-w-3xl">
              <span className="badge badge-warm mb-6">
                <Lightbulb className="size-3.5" /> Student Venture Marketplace
              </span>
              <h1 className="text-5xl sm:text-6xl text-[#1A2332] dark:text-slate-100 tracking-tight mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Fund the next big idea.{" "}
                <em className="not-italic text-gradient-primary">Before it's big.</em>
              </h1>
              <p className="text-xl text-[#4A5668] leading-relaxed mb-8 max-w-2xl">
                Students list startup ideas at any stage — from Ideation to Product-Market Fit.
                Venture creators fund them directly. GSF earns a transparent{" "}
                <strong className="text-[#1A2332] dark:text-slate-100">1–2% platform fee</strong> on closed deals.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-[#D2C4B4] shadow-soft-sm">
                  <Percent className="size-5 text-[#81A6C6]" />
                  <div>
                    <div className="text-xs text-[#8A95A3] uppercase tracking-wider">Platform Fee</div>
                    <div className="text-[#1A2332] dark:text-slate-100 font-semibold text-sm">1–2% on equity deals</div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-[#D2C4B4] shadow-soft-sm">
                  <Shield className="size-5 text-[#81A6C6]" />
                  <div>
                    <div className="text-xs text-[#8A95A3] uppercase tracking-wider">Deal Protection</div>
                    <div className="text-[#1A2332] dark:text-slate-100 font-semibold text-sm">Escrow on all trades</div>
                  </div>
                </div>
                <Link href="/ventures/list" className="btn-primary">
                  <Lightbulb className="size-4" /> List Your Venture
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stage legend */}
        <section className="border-y border-[#D2C4B4] dark:border-slate-700 bg-white dark:bg-slate-900 py-4">
          <div className="section-container">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-[#8A95A3] dark:text-slate-400 uppercase tracking-wider mr-2">Idea Stages:</span>
              {IDEA_STAGES.map((stage) => {
                const s = STAGE_STYLES[stage];
                return (
                  <button
                    key={stage}
                    onClick={() => setIdeaStageFilter(ideaStageFilter === stage ? "All stages" : stage)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer hover:opacity-80"
                    style={{
                      background: ideaStageFilter === stage ? s.text : s.bg,
                      color: ideaStageFilter === stage ? "#fff" : s.text,
                      borderColor: s.border,
                    }}
                  >
                    <s.icon className="size-3" /> {stage}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Filters + Grid */}
        <section className="bg-[#F7F2EC] dark:bg-slate-950 py-12">
          <div className="section-container">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#8A95A3] dark:text-slate-400" />
                <input
                  id="venture-search"
                  type="text"
                  placeholder="Search by name, founder, or sector..."
                  className="input pl-10 bg-white dark:bg-slate-900 border-[#D2C4B4] dark:border-slate-700"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select id="funding-filter" className="input sm:w-36 bg-white dark:bg-slate-900 border-[#D2C4B4] dark:border-slate-700" value={fundingFilter} onChange={(e) => setFundingFilter(e.target.value)}>
                {FUNDING_STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <select id="sector-filter" className="input sm:w-44 bg-white dark:bg-slate-900 border-[#D2C4B4] dark:border-slate-700" value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}>
                {SECTORS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Result count */}
            <p className="text-xs text-[#8A95A3] mb-4 flex items-center gap-2">
              <SlidersHorizontal className="size-3.5" />
              Showing <span className="font-semibold text-[#1A2332] dark:text-slate-100">{filtered.length}</span> ventures
              {(ideaStageFilter !== "All stages" || sectorFilter !== "All sectors" || fundingFilter !== "All" || search) && (
                <button onClick={() => { setSearch(""); setIdeaStageFilter("All stages"); setSectorFilter("All sectors"); setFundingFilter("All"); }}
                  className="text-[#81A6C6] hover:underline">Clear filters</button>
              )}
            </p>

            {filtered.length === 0 ? (
              <EmptyState
                icon="🚀"
                title="No ventures found"
                description="Try adjusting your filters or search term. Or be the first to list your startup idea and attract investors from the GSF network."
                primaryAction={{ label: "List Your Venture", href: "/sign-up" }}
                secondaryAction={{ label: "Clear Filters", href: "/ventures" }}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {filtered.map((v) => {
                  const stageStyle = STAGE_STYLES[v.stage] || STAGE_STYLES["Ideation"];
                  const avatarColor = v.avatarColor || AVATAR_COLORS[0];
                  return (
                    <div key={v.id} className="card card-hover p-6 flex flex-col gap-4 bg-white dark:bg-slate-800">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="size-12 rounded-full border-2 border-[#D2C4B4] flex items-center justify-center text-sm font-bold shrink-0"
                            style={{ background: avatarColor.bg, color: avatarColor.text }}>
                            {v.initials || "FN"}
                          </div>
                          <div>
                            <h2 className="font-bold text-[#1A2332] dark:text-slate-100 text-base">{v.name}</h2>
                            <p className="text-xs text-[#8A95A3] dark:text-slate-400">by {v.founderName || "Unknown Founder"}</p>
                            <span className={`badge mt-1 text-[10px] ${v.fundingStage === "Seed" ? "badge-blue" : "badge-warm"}`}>{v.fundingStage || "Pre-seed"}</span>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full shrink-0 font-medium ${v.daysLeft <= 7 ? 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-300 border border-red-100 dark:border-red-500/20' : 'text-[#8A95A3] dark:text-slate-400 bg-[#F3E3D0] dark:bg-slate-700 border border-[#D2C4B4] dark:border-slate-600'}`}>
                          {v.daysLeft || 0}d left
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-[#1A2332] dark:text-slate-100 leading-snug">{v.tagline}</p>
                      <p className="text-sm text-[#4A5668] leading-relaxed">{v.description}</p>

                      {/* Idea Stage — above equity */}
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A95A3]">Idea Stage</span>
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                          style={{ background: stageStyle.bg, color: stageStyle.text, borderColor: stageStyle.border }}
                        >
                          {stageStyle.icon && <stageStyle.icon className="size-3" />} {v.stage || "Ideation"}
                        </span>
                      </div>

                      {/* Equity metrics */}
                      <div className="grid grid-cols-3 gap-2.5">
                        {[{ label: "Seeking", value: v.fundingGoal || "N/A" }, { label: "Equity", value: v.equity || "N/A" }, { label: "Traction", value: v.traction || "N/A" }].map(({ label, value }) => (
                          <div key={label} className="bg-[#F7F2EC] dark:bg-slate-900 border border-[#D2C4B4] dark:border-slate-700 rounded-xl p-3">
                            <div className="text-[10px] text-[#8A95A3] dark:text-slate-400 uppercase tracking-wider mb-1">{label}</div>
                            <div className="text-sm font-semibold text-[#1A2332] dark:text-slate-100 truncate" title={value}>{value}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {Array.isArray(v.tags) && v.tags.map((tag: string) => (
                          <span key={tag} className="text-xs text-[#4A5668] dark:text-slate-300 bg-[#F3E3D0] dark:bg-slate-700 border border-[#D2C4B4] dark:border-slate-600 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#D2C4B4] dark:border-slate-700">
                        <div className="flex items-center gap-4 text-xs text-[#8A95A3] dark:text-slate-400">
                          <span className="flex items-center gap-1.5"><Eye className="size-3.5" />{v.views || 0}</span>
                          <span className="flex items-center gap-1.5"><Heart className="size-3.5 text-red-400" />{v.interested || 0} interested</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`mailto:founder@gsf.com?subject=Interested in ${v.name}`} className="btn-outline py-1.5 px-3 text-xs"><MessageSquare className="size-3.5" /> Chat</Link>
                          <button 
                            onClick={() => handleFundThis(v.id)} 
                            disabled={fundingActionStatus[v.id] === 'loading' || fundingActionStatus[v.id] === 'success'}
                            className="btn-primary py-1.5 px-4 text-xs disabled:opacity-50 disabled:cursor-not-allowed">
                            {fundingActionStatus[v.id] === 'loading' ? <Loader2 className="size-3.5 animate-spin" /> : <TrendingUp className="size-3.5" />} 
                            {fundingActionStatus[v.id] === 'success' ? 'Funded' : 'Fund This'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="section-container py-20 text-center">
          <div className="max-w-2xl mx-auto card p-10 bg-[#F3E3D0] border-[#D2C4B4]">
            <div className="size-14 rounded-2xl bg-white border border-[#D2C4B4] flex items-center justify-center mx-auto mb-6 shadow-soft-sm">
              <Lightbulb className="size-7 text-[#81A6C6]" />
            </div>
            <h2 className="text-3xl text-[#1A2332] dark:text-slate-100 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Have a startup idea?
            </h2>
            <p className="text-[#4A5668] mb-8">
              List your venture on GSF at any stage — from just an idea to a growing company. GSF only earns when you do.
            </p>
            <Link href="/sign-up" className="btn-primary mx-auto text-base px-8 py-3.5">
              <Lightbulb className="size-5" /> List Your Startup Idea
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
