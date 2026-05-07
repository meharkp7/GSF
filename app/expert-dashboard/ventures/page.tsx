"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Search, Filter, ChevronDown, TrendingUp, Users, Coins, ArrowRight, Lightbulb, Bookmark, BookmarkCheck, CheckCircle2 } from "lucide-react";
import SearchFilter from "@/components/ui/SearchFilter";
import EmptyState from "@/components/ui/EmptyState";
import { useFilteredDataWithFilters } from "@/hooks/useFilteredData";

const STAGES = ["All", "Ideation", "Screening", "Research", "MVP", "Funding", "Launch"];
const SECTORS = ["All", "EdTech", "FinTech", "HealthTech", "AgriTech", "SaaS", "Consumer", "ClimaTech", "DeepTech"];
const STAGE_COLORS: Record<string, string> = {
  Ideation: "#8B5CF6", Screening: "#3B82F6", Research: "#06B6D4",
  MVP: "#10B981", Funding: "#F59E0B", Launch: "#EF4444",
};

const VENTURES = [
  // EdTech
  { id: 1,  name: "EduLoop",    founder: "Arjun Sharma",    sector: "EdTech",    stage: "Research",  equity: "8%",  goal: "$50K",  traction: "200 sign-ups · 3 college pilots",        team: 3, avatar: "EL", avatarBg: "#8B5CF6", pitch: "AI-powered peer learning platform for university students with structured cohort journeys.",           lookingFor: ["EdTech expert", "B2B SaaS mentor", "Growth advisor"] },
  { id: 2,  name: "SkillBridge",founder: "Neha Joshi",      sector: "EdTech",    stage: "MVP",       equity: "10%", goal: "$80K",  traction: "Beta live · 120 active learners",          team: 2, avatar: "SB", avatarBg: "#6366F1", pitch: "Bridging the skills gap between college curriculum and real-world jobs via micro-credential paths.",      lookingFor: ["Curriculum designer", "EdTech sales", "Fundraising"] },
  { id: 3,  name: "GradeAI",    founder: "Rahul Bose",      sector: "EdTech",    stage: "Ideation",  equity: "12%", goal: "$30K",  traction: "Problem validated · 80 teacher interviews",team: 2, avatar: "GA", avatarBg: "#A78BFA", pitch: "AI grading and personalised feedback tool for K-12 teachers that cuts grading time by 70%.",              lookingFor: ["K-12 education expert", "AI product mentor", "Impact investor"] },
  // FinTech
  { id: 4,  name: "Supplify",   founder: "Priya Mehta",     sector: "FinTech",   stage: "MVP",       equity: "10%", goal: "$100K", traction: "Beta live · 50 businesses onboard",        team: 2, avatar: "SU", avatarBg: "#10B981", pitch: "Real-time supply chain financing for SMEs in emerging markets using invoice discounting.",               lookingFor: ["FinTech expert", "Fundraising advisor", "Legal counsel"] },
  { id: 5,  name: "CreditFlow", founder: "Aman Shah",       sector: "FinTech",   stage: "Funding",   equity: "7%",  goal: "$250K", traction: "₹2L MRR · 400 active merchants",           team: 4, avatar: "CF", avatarBg: "#0D9488", pitch: "Embedded BNPL for B2B wholesale purchasers in the FMCG supply chain.",                                    lookingFor: ["RBI regulatory expert", "Credit risk advisor", "CFO mentor"] },
  { id: 6,  name: "PocketVault",founder: "Ishaan Kapoor",   sector: "FinTech",   stage: "Research",  equity: "9%",  goal: "$60K",  traction: "100 college students interviewed",          team: 2, avatar: "PV", avatarBg: "#14B8A6", pitch: "Gen-Z micro-savings app with gamified financial literacy for first-time earners.",                         lookingFor: ["Consumer FinTech expert", "UX advisor", "Monetisation mentor"] },
  // HealthTech
  { id: 7,  name: "HealthBridge",founder: "Rahul Kumar",    sector: "HealthTech",stage: "Funding",   equity: "6%",  goal: "$200K", traction: "500 patients · 3 hospital tie-ups",        team: 4, avatar: "HB", avatarBg: "#EF4444", pitch: "Bridging rural healthcare access gaps via AI-assisted telemedicine diagnostics.",                          lookingFor: ["HealthTech expert", "Regulatory advisor", "Impact investor"] },
  { id: 8,  name: "MedRecord",  founder: "Shreya Nair",     sector: "HealthTech",stage: "MVP",       equity: "11%", goal: "$90K",  traction: "5 clinics · 800 digitised records/week",   team: 3, avatar: "MR", avatarBg: "#F87171", pitch: "Universal EHR platform for independent clinics in Tier-2 and Tier-3 cities.",                              lookingFor: ["Healthcare operations", "HL7 FHIR expert", "B2B sales mentor"] },
  { id: 9,  name: "TherapEase", founder: "Aishwarya B.",    sector: "HealthTech",stage: "Screening", equity: "14%", goal: "$40K",  traction: "30 beta therapists · 200 patient sessions",team: 2, avatar: "TE", avatarBg: "#FB923C", pitch: "Digital mental health platform matching patients with verified therapists and async support.",               lookingFor: ["Mental health domain expert", "Crisis advisor", "Insurance partner"] },
  // AgriTech
  { id: 10, name: "AgriChain",  founder: "Moses A.",        sector: "AgriTech",  stage: "Research",  equity: "9%",  goal: "$60K",  traction: "150 farmers interviewed",                  team: 2, avatar: "AC", avatarBg: "#84CC16", pitch: "Blockchain-based farm-to-consumer supply chain for smallholder farmers in West Africa.",                  lookingFor: ["AgriTech expert", "Blockchain developer", "Africa market specialist"] },
  { id: 11, name: "FarmIQ",     founder: "Rohan Verma",     sector: "AgriTech",  stage: "Ideation",  equity: "13%", goal: "$35K",  traction: "20 IoT pilot sensors deployed",            team: 3, avatar: "FQ", avatarBg: "#65A30D", pitch: "IoT + AI solution giving farmers real-time soil, weather, and yield predictions via SMS.",                 lookingFor: ["IoT hardware expert", "Agricultural scientist", "Rural distribution"] },
  { id: 12, name: "HarvestPay", founder: "Kavitha R.",      sector: "AgriTech",  stage: "MVP",       equity: "10%", goal: "$70K",  traction: "200 farmers · ₹80K credit disbursed",      team: 2, avatar: "HP", avatarBg: "#4D7C0F", pitch: "Last-mile credit and insurance bundled with farm input purchases.",                                          lookingFor: ["Rural FinTech mentor", "NBFC compliance advisor", "AgriTech investor"] },
  // SaaS
  { id: 13, name: "TaskForge",  founder: "Siddharth M.",    sector: "SaaS",      stage: "Launch",    equity: "5%",  goal: "$300K", traction: "$15K MRR · 80 paying teams",               team: 5, avatar: "TF", avatarBg: "#5B6CFF", pitch: "Project intelligence platform for remote engineering teams with automated standups and risk alerts.",        lookingFor: ["B2B SaaS sales expert", "PLG advisor", "Series A VC"] },
  { id: 14, name: "InvoiceBee", founder: "Anjali S.",       sector: "SaaS",      stage: "MVP",       equity: "8%",  goal: "$120K", traction: "60 SME customers · NPS 71",                team: 3, avatar: "IB", avatarBg: "#4338CA", pitch: "Automated invoicing and collections SaaS for Indian SMEs with built-in payment reconciliation.",              lookingFor: ["CFO mentor", "B2B SaaS growth", "Accounting domain expert"] },
  { id: 15, name: "AuditAI",    founder: "Deepak T.",       sector: "SaaS",      stage: "Screening", equity: "12%", goal: "$50K",  traction: "3 CA firms in pilot",                      team: 2, avatar: "AA", avatarBg: "#3730A3", pitch: "AI-powered audit prep tool for chartered accountants reducing manual document work by 60%.",                 lookingFor: ["CA domain advisor", "Legal compliance mentor", "Enterprise SaaS GTM"] },
  // Consumer
  { id: 16, name: "FoodSense",  founder: "Anika Roy",       sector: "Consumer",  stage: "Ideation",  equity: "12%", goal: "$30K",  traction: "50 user interviews · problem validated",   team: 2, avatar: "FS", avatarBg: "#F59E0B", pitch: "Reducing household food waste through AI-powered smart pantry management for urban families.",               lookingFor: ["Consumer app mentor", "Behavioural economist", "GTM advisor"] },
  { id: 17, name: "StyleLoop",  founder: "Riya Das",        sector: "Consumer",  stage: "MVP",       equity: "10%", goal: "$75K",  traction: "500 beta users · 30% D7 retention",        team: 3, avatar: "SL", avatarBg: "#D97706", pitch: "Personalised fashion rental subscription for college students to access premium brands affordably.",          lookingFor: ["D2C mentor", "Supply chain advisor", "Consumer brand builder"] },
  { id: 18, name: "WellNest",   founder: "Pooja Iyer",      sector: "Consumer",  stage: "Research",  equity: "11%", goal: "$45K",  traction: "80 households surveyed · 3 wellness coaches",team: 2, avatar: "WN", avatarBg: "#B45309", pitch: "Holistic home wellness subscription bundling curated products and personalised coaching sessions.",            lookingFor: ["D2C expert", "Content-led growth advisor", "Health & wellness investor"] },
  // ClimaTech
  { id: 19, name: "ClimaTech Solutions",founder: "Dev S.",  sector: "ClimaTech", stage: "Screening", equity: "15%", goal: "$80K",  traction: "2 pilots in conversation",                 team: 3, avatar: "CT", avatarBg: "#06B6D4", pitch: "Carbon credit marketplace for SMEs to offset operational emissions with verified micro-offsets.",              lookingFor: ["ClimaTech expert", "Carbon market specialist", "Policy advisor"] },
  { id: 20, name: "SolarStack", founder: "Aditi Panse",     sector: "ClimaTech", stage: "MVP",       equity: "9%",  goal: "$150K", traction: "12 rooftop installations · ₹1.2L/month",   team: 4, avatar: "SS", avatarBg: "#0891B2", pitch: "Financed rooftop solar for commercial buildings with a pay-as-you-save ESCO model.",                         lookingFor: ["Solar energy expert", "Infrastructure finance advisor", "CleanTech investor"] },
  { id: 21, name: "GreenMile",  founder: "Tarun Bose",      sector: "ClimaTech", stage: "Ideation",  equity: "13%", goal: "$40K",  traction: "Concept validated · 40 fleet operators surveyed",team: 2,avatar: "GM",avatarBg: "#0E7490", pitch: "Fleet electrification SaaS for logistics companies — route optimisation + EV charging management.",        lookingFor: ["EV expert", "Fleet logistics advisor", "ClimaTech VC"] },
  // DeepTech
  { id: 22, name: "NeuraMed",   founder: "Dr. Sunil R.",    sector: "DeepTech",  stage: "Research",  equity: "8%",  goal: "$300K", traction: "IR clearance received · 2 hospital MoUs",  team: 5, avatar: "NM", avatarBg: "#7C3AED", pitch: "Non-invasive neural signal decoder for early-stage Parkinson's and ALS diagnosis.",                         lookingFor: ["Medical device regulation", "Neurologist advisor", "DeepTech VC"] },
  { id: 23, name: "QuantumSeal",founder: "Tarun Bhat",      sector: "DeepTech",  stage: "Screening", equity: "10%", goal: "$200K", traction: "2 cybersecurity firms in POC",             team: 3, avatar: "QS", avatarBg: "#6D28D9", pitch: "Post-quantum encryption SDK for enterprise APIs, quantum-resistant by design.",                               lookingFor: ["Cryptography expert", "B2B enterprise sales", "Cybersecurity investor"] },
  { id: 24, name: "AeroSense",  founder: "Vikram Pillai",   sector: "DeepTech",  stage: "MVP",       equity: "7%",  goal: "$400K", traction: "FAA preliminary approval · 3 client LOIs", team: 6, avatar: "AS", avatarBg: "#5B21B6", pitch: "Autonomous UAV inspection platform for energy infrastructure — pipelines and transmission lines.",            lookingFor: ["Aerospace engineer mentor", "Enterprise hardware GTM", "Series A DeepTech VC"] },
];

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: d, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function ExpertVentureSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stage,    setStage]    = useState("All");
  const [sector,   setSector]   = useState("All");
  const [saved,    setSaved]    = useState<number[]>([]);
  const [interest, setInterest] = useState<number | null>(null);
  const [expressed,setExpressed]= useState<number[]>([]);

  const filteredVentures = useFilteredDataWithFilters(
    VENTURES,
    searchQuery,
    {
      stage: (venture) => stage === "All" || venture.stage === stage,
      sector: (venture) => sector === "All" || venture.sector === sector,
    },
    [
      (venture, query) => venture.name.toLowerCase().includes(query),
      (venture, query) => venture.founder.toLowerCase().includes(query),
      (venture, query) => venture.sector.toLowerCase().includes(query),
      (venture, query) => venture.pitch.toLowerCase().includes(query),
    ]
  );

  function toggleSave(id: number) {
    setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function expressInterest(id: number) {
    setInterest(id);
    setTimeout(() => {
      setExpressed(prev => [...prev, id]);
      setInterest(null);
    }, 1000);
  }

  return (
    <DashboardShell role="expert">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div {...fadeUp(0)}>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
            Browse Ventures
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Discover {VENTURES.length} student startups looking for expert mentorship. Express interest to start advising.
          </p>
        </motion.div>

        {/* Search + filters */}
        <motion.div {...fadeUp(0.05)}>
          <SearchFilter
            placeholder="Search ventures, founders, sectors..."
            onSearchChange={setSearchQuery}
            filters={{
              stage: {
                options: STAGES.map(s => ({ value: s, label: s })),
                value: stage,
                onChange: setStage,
                label: "Stage",
              },
              sector: {
                options: SECTORS.map(s => ({ value: s, label: s })),
                value: sector,
                onChange: setSector,
                label: "Sector",
              },
            }}
          />
        </motion.div>

        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            <strong style={{ color: "var(--text-primary)" }}>{filteredVentures.length}</strong> ventures found
          </p>
          <div className="flex items-center gap-1">
            <Filter className="size-3.5" style={{ color: "var(--text-muted)" }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{saved.length} saved</span>
          </div>
        </div>

        {/* Venture cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredVentures.length > 0 ? (
            filteredVentures.map((v, i) => {
            const stageColor  = STAGE_COLORS[v.stage] ?? "#5B6CFF";
            const isSaved     = saved.includes(v.id);
            const isExpressed = expressed.includes(v.id);
            const isLoading   = interest === v.id;

            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="card p-5 flex flex-col hover-scale"
              >
                {/* Top */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="size-12 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${v.avatarBg}, ${v.avatarBg}99)` }}>
                    {v.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{v.name}</p>
                      <button onClick={() => toggleSave(v.id)} className="p-1 rounded-lg transition-colors flex-shrink-0"
                        style={{ color: isSaved ? "#F59E0B" : "var(--text-muted)" }}>
                        {isSaved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                      </button>
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>by {v.founder}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="badge text-[10px]" style={{ backgroundColor: `${stageColor}15`, color: stageColor, border: `1px solid ${stageColor}30` }}>
                        {v.stage}
                      </span>
                      <span className="badge badge-blue text-[10px]">{v.sector}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>{v.pitch}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Equity", value: v.equity, icon: TrendingUp, color: "#5B6CFF" },
                    { label: "Goal",   value: v.goal,   icon: Coins,      color: "#10B981" },
                    { label: "Team",   value: `${v.team}p`,  icon: Users, color: "#F59E0B" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="p-2 rounded-xl text-center"
                      style={{ backgroundColor: "var(--bg-surface-2)", border: "1px solid var(--border-soft)" }}>
                      <Icon className="size-3.5 mx-auto mb-0.5" style={{ color }} />
                      <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
                      <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>{label}</p>
                    </div>
                  ))}
                </div>

                {/* Looking for */}
                <div className="mb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>Looking for</p>
                  <div className="flex flex-wrap gap-1.5">
                    {v.lookingFor.map(tag => (
                      <span key={tag} className="badge badge-warm text-[10px]">{tag}</span>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] mb-4 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                  <TrendingUp className="size-3" /> {v.traction}
                </p>

                {/* CTA */}
                <div className="mt-auto pt-3 border-t" style={{ borderTopColor: "var(--border-soft)" }}>
                  {isExpressed ? (
                    <div className="w-full text-center py-2 rounded-xl text-sm font-semibold text-emerald-500 flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                      <CheckCircle2 className="size-4" /> Interest expressed — founder notified!
                    </div>
                  ) : (
                    <button
                      onClick={() => expressInterest(v.id)}
                      disabled={isLoading}
                      className="btn-primary w-full justify-center text-sm py-2 flex items-center gap-2"
                    >
                      {isLoading
                        ? <span className="size-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        : <Lightbulb className="size-3.5" />}
                      {isLoading ? "Sending..." : "Express Interest"}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
          ) : (
            <div className="col-span-full">
              <EmptyState
                icon="🚀"
                title="No ventures found"
                description="Try adjusting your search or filters to find ventures."
              />
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
