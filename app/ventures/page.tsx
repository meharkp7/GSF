"use client";

import React from "react";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Lightbulb, TrendingUp, MessageSquare, Shield, Percent, Eye, Heart, Search, ArrowRight, SlidersHorizontal, BarChart2, Rocket, DollarSign, Building2, BookOpen } from "lucide-react";

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

const VENTURES = [
  { id: "edloop", name: "EduLoop", tagline: "AI-powered personalized learning paths for college students", founder: "Priya Sharma", initials: "PS", avatarColor: AVATAR_COLORS[0], fundingStage: "Pre-seed", ideaStage: "MVP", sector: "EdTech", seeking: "₹15L", equity: "8%", traction: "200 beta users, 3 college partners", views: 342, interested: 12, daysLeft: 18, description: "EduLoop uses AI to generate personalized study paths based on a student's learning style, pace, and goals. Built on LLM-based curriculum adaptation with real user retention data.", tags: ["EdTech", "AI", "B2C"] },
  { id: "supplify", name: "Supplify", tagline: "One-click supply chain management for D2C brands under ₹5Cr revenue", founder: "Marcus Chen", initials: "MC", avatarColor: AVATAR_COLORS[1], fundingStage: "Seed", ideaStage: "Product-Market Fit", sector: "B2B SaaS", seeking: "₹50L", equity: "12%", traction: "₹2L MRR, 28 paying customers", views: 891, interested: 34, daysLeft: 7, description: "Supplify automates procurement, inventory tracking, and vendor management for small D2C brands. Integration with all major platforms (Shopify, WooCommerce, Amazon).", tags: ["B2B SaaS", "Supply Chain", "D2C"] },
  { id: "healthbridge", name: "HealthBridge", tagline: "Telemedicine for tier-2 India with vernacular language support", founder: "Aisha Okafor", initials: "AO", avatarColor: AVATAR_COLORS[2], fundingStage: "Pre-seed", ideaStage: "MVP", sector: "HealthTech", seeking: "₹25L", equity: "10%", traction: "450 consultations in pilot phase", views: 567, interested: 21, daysLeft: 22, description: "HealthBridge connects patients in rural India to qualified doctors via video, with support in 8 regional languages. 4.8-star rating from 450 pilot consultations.", tags: ["HealthTech", "Rural India", "Telemedicine"] },
  { id: "farmiq", name: "FarmIQ", tagline: "IoT crop monitoring that predicts yield loss before it happens", founder: "Rohan Verma", initials: "RV", avatarColor: AVATAR_COLORS[3], fundingStage: "Pre-seed", ideaStage: "Ideation", sector: "AgriTech", seeking: "₹8L", equity: "15%", traction: "2 pilot farms, concept validated", views: 210, interested: 8, daysLeft: 30, description: "FarmIQ uses affordable IoT sensors + satellite data to give small farmers real-time crop health monitoring and AI-powered yield predictions.", tags: ["AgriTech", "IoT", "AI"] },
  { id: "cargolink", name: "CargoLink", tagline: "Marketplace connecting truck owners to last-mile delivery companies", founder: "Aditi Nair", initials: "AN", avatarColor: AVATAR_COLORS[4], fundingStage: "Seed", ideaStage: "Product-Market Fit", sector: "Logistics", seeking: "₹1Cr", equity: "15%", traction: "₹8L GMV in 3 months, 45 trucks", views: 1203, interested: 47, daysLeft: 5, description: "CargoLink is the Uber for trucks — connecting surplus logistics capacity to D2C and e-comm companies at 30% lower last-mile cost.", tags: ["Logistics", "Marketplace", "B2B"] },
  { id: "finflow", name: "FinFlow", tagline: "Automated GST filing for India's 50M+ freelancers", founder: "Kunal Desai", initials: "KD", avatarColor: AVATAR_COLORS[5], fundingStage: "Pre-seed", ideaStage: "Market Research", sector: "FinTech", seeking: "₹20L", equity: "10%", traction: "800 waitlist signups, 3 CA partnerships", views: 445, interested: 19, daysLeft: 14, description: "FinFlow makes GST filing dead simple for freelancers — auto-import transactions, one-click filing, proactive reminders. Aimed at the 50M+ gig workers in India.", tags: ["FinTech", "GST", "Freelancers"] },
  { id: "moodlens", name: "MoodLens", tagline: "Mental health check-ins for corporate teams through 60-second voice notes", founder: "Zara Khan", initials: "ZK", avatarColor: AVATAR_COLORS[6], fundingStage: "Pre-seed", ideaStage: "Idea Screening", sector: "HRTech", seeking: "₹12L", equity: "9%", traction: "2 pilot companies, 45 users", views: 178, interested: 6, daysLeft: 25, description: "MoodLens uses AI to analyze 60-second daily voice notes from employees and gives HR teams anonymized mental health trends — without invasive surveys.", tags: ["HRTech", "Mental Health", "AI", "B2B"] },
  { id: "studyswap", name: "StudySwap", tagline: "Peer-to-peer tutoring marketplace for college students across India", founder: "Dev Kapoor", initials: "DK", avatarColor: AVATAR_COLORS[7], fundingStage: "Seed", ideaStage: "Investment & Funding", sector: "EdTech", seeking: "₹30L", equity: "11%", traction: "1,200 users, ₹1.5L in tutor payouts", views: 634, interested: 28, daysLeft: 10, description: "StudySwap lets college students list themselves as tutors and connect with peers who need help. Think Urban Company for private tutoring, built for Gen Z.", tags: ["EdTech", "Marketplace", "B2C"] },
  { id: "packright", name: "PackRight", tagline: "Sustainable packaging-as-a-service for small e-commerce sellers", founder: "Nora Mensah", initials: "NM", avatarColor: AVATAR_COLORS[8], fundingStage: "Pre-seed", ideaStage: "Company Launch", sector: "CleanTech", seeking: "₹18L", equity: "8%", traction: "6 paying customers, 3T CO₂ saved/month", views: 289, interested: 11, daysLeft: 19, description: "PackRight provides eco-friendly packaging on a subscription model for D2C brands shipping under 500 orders/month. Fully compostable, branded, delivered monthly.", tags: ["CleanTech", "E-commerce", "Sustainability"] },
  { id: "legalbot", name: "LegalBot India", tagline: "AI legal assistant that drafts startup contracts in plain English", founder: "Arjun Rao", initials: "AR", avatarColor: AVATAR_COLORS[9], fundingStage: "Seed", ideaStage: "Product-Market Fit", sector: "LegalTech", seeking: "₹45L", equity: "13%", traction: "₹3L MRR, 120 startup clients", views: 756, interested: 31, daysLeft: 8, description: "LegalBot drafts co-founder agreements, NDA, MoUs, and equity term sheets in under 5 minutes using plain English prompts — trained on Indian startup law.", tags: ["LegalTech", "AI", "B2B SaaS"] },
  { id: "reelraise", name: "ReelRaise", tagline: "Short-form video platform for non-profit fundraising campaigns", founder: "Fatima Siddiqui", initials: "FS", avatarColor: AVATAR_COLORS[0], fundingStage: "Pre-seed", ideaStage: "MVP", sector: "SocialImpact", seeking: "₹10L", equity: "7%", traction: "12 NGOs onboarded, ₹4.5L raised", views: 312, interested: 14, daysLeft: 21, description: "ReelRaise lets NGOs create 90-second video campaigns and share them virally. Donors can give in one tap. Integrated with all UPI payment rails.", tags: ["Social Impact", "Video", "NGO"] },
  { id: "localloop", name: "LocalLoop", tagline: "Hyperlocal delivery for kiranas — 10-minute grocery in tier-2 cities", founder: "Chirag Patel", initials: "CP", avatarColor: AVATAR_COLORS[2], fundingStage: "Seed", ideaStage: "Investment & Funding", sector: "Quick Commerce", seeking: "₹80L", equity: "14%", traction: "₹12L GMV/month, 3 cities live", views: 1089, interested: 43, daysLeft: 3, description: "LocalLoop partners with existing kirana stores to enable 10-minute delivery in tier-2 cities — no dark stores, just tech + existing infrastructure.", tags: ["Quick Commerce", "Tier-2", "Logistics"] },
];

const SECTORS = ["All sectors", "EdTech", "B2B SaaS", "HealthTech", "AgriTech", "Logistics", "FinTech", "HRTech", "CleanTech", "LegalTech", "SocialImpact", "Quick Commerce"];
const FUNDING_STAGES = ["All", "Pre-seed", "Seed"];

export default function VenturesPage() {
  const [search, setSearch] = useState("");
  const [ideaStageFilter, setIdeaStageFilter] = useState("All stages");
  const [sectorFilter, setSectorFilter] = useState("All sectors");
  const [fundingFilter, setFundingFilter] = useState("All");

  const filtered = VENTURES.filter((v) => {
    const matchSearch = search === "" ||
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.founder.toLowerCase().includes(search.toLowerCase()) ||
      v.tagline.toLowerCase().includes(search.toLowerCase()) ||
      v.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchIdea = ideaStageFilter === "All stages" || v.ideaStage === ideaStageFilter;
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
              <div className="text-center py-20">
                <Search className="size-10 text-[#8A95A3] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#1A2332] dark:text-slate-100 mb-2">No ventures found</h3>
                <p className="text-sm text-[#8A95A3]">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {filtered.map((v) => {
                  const stageStyle = STAGE_STYLES[v.ideaStage] || STAGE_STYLES["Ideation"];
                  return (
                    <div key={v.id} className="card card-hover p-6 flex flex-col gap-4 bg-white dark:bg-slate-800">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="size-12 rounded-full border-2 border-[#D2C4B4] flex items-center justify-center text-sm font-bold shrink-0"
                            style={{ background: v.avatarColor.bg, color: v.avatarColor.text }}>
                            {v.initials}
                          </div>
                          <div>
                            <h2 className="font-bold text-[#1A2332] dark:text-slate-100 text-base">{v.name}</h2>
                            <p className="text-xs text-[#8A95A3] dark:text-slate-400">by {v.founder}</p>
                            <span className={`badge mt-1 text-[10px] ${v.fundingStage === "Seed" ? "badge-blue" : "badge-warm"}`}>{v.fundingStage}</span>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full shrink-0 font-medium ${v.daysLeft <= 7 ? 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-300 border border-red-100 dark:border-red-500/20' : 'text-[#8A95A3] dark:text-slate-400 bg-[#F3E3D0] dark:bg-slate-700 border border-[#D2C4B4] dark:border-slate-600'}`}>
                          {v.daysLeft}d left
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
                          <stageStyle.icon className="size-3" /> {v.ideaStage}
                        </span>
                      </div>

                      {/* Equity metrics */}
                      <div className="grid grid-cols-3 gap-2.5">
                        {[{ label: "Seeking", value: v.seeking }, { label: "Equity", value: v.equity }, { label: "Traction", value: v.traction }].map(({ label, value }) => (
                          <div key={label} className="bg-[#F7F2EC] dark:bg-slate-900 border border-[#D2C4B4] dark:border-slate-700 rounded-xl p-3">
                            <div className="text-[10px] text-[#8A95A3] dark:text-slate-400 uppercase tracking-wider mb-1">{label}</div>
                            <div className="text-sm font-semibold text-[#1A2332] dark:text-slate-100 truncate" title={value}>{value}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {v.tags.map((tag) => (
                          <span key={tag} className="text-xs text-[#4A5668] dark:text-slate-300 bg-[#F3E3D0] dark:bg-slate-700 border border-[#D2C4B4] dark:border-slate-600 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#D2C4B4] dark:border-slate-700">
                        <div className="flex items-center gap-4 text-xs text-[#8A95A3] dark:text-slate-400">
                          <span className="flex items-center gap-1.5"><Eye className="size-3.5" />{v.views}</span>
                          <span className="flex items-center gap-1.5"><Heart className="size-3.5 text-red-400" />{v.interested} interested</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href="/sign-up" className="btn-outline py-1.5 px-3 text-xs"><MessageSquare className="size-3.5" /> Chat</Link>
                          <Link href="/sign-up" className="btn-primary py-1.5 px-4 text-xs"><TrendingUp className="size-3.5" /> Fund This</Link>
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
