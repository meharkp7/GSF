"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Video, MessageSquare, Calendar, Search, Star, Clock, ArrowRight, Shield, Zap, Filter } from "lucide-react";

const EXPERTS = [
  { name: "Dr. Anika Patel",      initials: "AP", role: "Partner",               company: "Sequoia Capital India",  domain: "Fundraising & VC",     rating: 4.9, sessions: 48,  available: true,  tags: ["Fundraising", "SaaS", "EdTech"],        bg: "#EF4444" },
  { name: "James Whitfield",      initials: "JW", role: "Co-founder (Exited)",   company: "Razorpay",               domain: "Fintech & Scaling",    rating: 5.0, sessions: 62,  available: true,  tags: ["Product", "Scale", "B2B"],              bg: "#3B82F6" },
  { name: "Sara Mensah",          initials: "SM", role: "Director of Product",   company: "Stripe",                 domain: "Product Strategy",     rating: 4.8, sessions: 35,  available: false, tags: ["APIs", "Growth", "Product"],            bg: "#10B981" },
  { name: "Yuki Tanaka",          initials: "YT", role: "Head of Growth",        company: "Notion",                 domain: "Growth & PLG",         rating: 4.9, sessions: 41,  available: true,  tags: ["PLG", "B2C", "Virality"],               bg: "#F59E0B" },
  { name: "Raj Devani",           initials: "RD", role: "General Counsel",       company: "Y Combinator (S22)",     domain: "Legal & IP",           rating: 4.7, sessions: 29,  available: true,  tags: ["Startup Law", "Equity", "IP"],          bg: "#8B5CF6" },
  { name: "Fatima Al-Hassan",     initials: "FA", role: "CEO & Founder",         company: "MedTech Africa",         domain: "HealthTech & Impact",  rating: 4.9, sessions: 22,  available: false, tags: ["HealthTech", "Impact", "Africa"],        bg: "#06B6D4" },
  { name: "Marco Andreessen",     initials: "MA", role: "Principal",             company: "a16z",                   domain: "DeepTech & AI",        rating: 4.8, sessions: 31,  available: true,  tags: ["AI", "DeepTech", "Seed"],               bg: "#6366F1" },
  { name: "Priya Nakashima",      initials: "PN", role: "Product Lead",          company: "Figma",                  domain: "Design & Product",     rating: 4.9, sessions: 27,  available: true,  tags: ["UX", "Design Systems", "B2B"],          bg: "#EC4899" },
  { name: "David Osei",           initials: "DO", role: "Engineering Manager",   company: "Google",                 domain: "Engineering & Scale",  rating: 4.7, sessions: 19,  available: false, tags: ["Backend", "ML", "Infrastructure"],       bg: "#14B8A6" },
  { name: "Rahul Mehta",          initials: "RM", role: "VP Growth",             company: "Zepto",                  domain: "Growth & Q-Commerce",  rating: 4.8, sessions: 38,  available: true,  tags: ["Quick Commerce", "Hyperlocal", "GTM"],  bg: "#F97316" },
  { name: "Sofia Lindqvist",      initials: "SL", role: "Startup Partner",       company: "Google for Startups",    domain: "Early Stage GTM",      rating: 4.9, sessions: 55,  available: true,  tags: ["GTM", "Community", "Early Stage"],      bg: "#84CC16" },
  { name: "Arjun Kapoor",         initials: "AK", role: "Partner",               company: "Accel India",            domain: "Seed & Series A",      rating: 4.8, sessions: 44,  available: false, tags: ["Seed", "Consumer", "SaaS"],             bg: "#A855F7" },
  { name: "Mei Suzuki",           initials: "MS", role: "Head of Business Dev",  company: "OpenAI",                 domain: "AI Commercialisation", rating: 5.0, sessions: 17,  available: true,  tags: ["AI/ML", "Enterprise", "APIs"],          bg: "#0EA5E9" },
  { name: "Carlos Rodrigues",     initials: "CR", role: "Founder & CTO",         company: "Nubank (acquired)",      domain: "FinTech Engineering",  rating: 4.7, sessions: 23,  available: true,  tags: ["FinTech", "Mobile", "Regulation"],      bg: "#7C3AED" },
  { name: "Nkechi Okonkwo",       initials: "NO", role: "Director",              company: "Airbnb",                 domain: "Operations & Travel",  rating: 4.8, sessions: 30,  available: true,  tags: ["Ops", "Marketplace", "Trust"],          bg: "#F43F5E" },
  { name: "Benjamin Park",        initials: "BP", role: "Staff Engineer",        company: "Meta",                   domain: "Systems & Scale",      rating: 4.6, sessions: 15,  available: false, tags: ["Distributed Systems", "Scale", "Data"],  bg: "#1D4ED8" },
  { name: "Amira Haddad",         initials: "AH", role: "Partner",               company: "Wamda Capital",          domain: "MENA Startups",        rating: 4.9, sessions: 26,  available: true,  tags: ["MENA", "VC", "Social Impact"],          bg: "#D97706" },
  { name: "Rishi Anand",          initials: "RA", role: "Chief Revenue Officer", company: "Freshworks",             domain: "B2B SaaS Revenue",     rating: 4.8, sessions: 49,  available: true,  tags: ["B2B SaaS", "Sales", "Enterprise"],      bg: "#059669" },
  { name: "Ingrid Vollmer",       initials: "IV", role: "COO",                   company: "Delivery Hero",          domain: "Ops & Logistics",      rating: 4.7, sessions: 21,  available: false, tags: ["Logistics", "Hyperlocal", "Scale"],     bg: "#DC2626" },
  { name: "Kevin Zhao",           initials: "KZ", role: "Head of Partnerships",  company: "Shopify",                domain: "E-Commerce & DTC",     rating: 4.9, sessions: 37,  available: true,  tags: ["E-commerce", "DTC", "Partnerships"],    bg: "#16A34A" },
  { name: "Divya Nair",           initials: "DN", role: "Founding Member",       company: "Ola Electric",           domain: "CleanTech & EVs",      rating: 4.8, sessions: 28,  available: true,  tags: ["CleanTech", "Manufacturing", "EV"],     bg: "#0891B2" },
  { name: "Luca De Santi",        initials: "LD", role: "Venture Partner",       company: "EQT Ventures",           domain: "Deep Tech Europe",     rating: 4.7, sessions: 18,  available: true,  tags: ["DeepTech", "Hardware", "EU Market"],    bg: "#9333EA" },
  { name: "Amara Diallo",         initials: "AD", role: "Head of Africa",        company: "IFC (World Bank Group)", domain: "Impact & Development", rating: 5.0, sessions: 13,  available: false, tags: ["Impact", "Africa", "Development"],       bg: "#EA580C" },
  { name: "Takeshi Mori",         initials: "TM", role: "Angel Investor",        company: "ex-SoftBank Vision",    domain: "Asia Pacific VC",      rating: 4.9, sessions: 33,  available: true,  tags: ["VC", "Asia", "Consumer Tech"],          bg: "#7C3AED" },
];

const DOMAINS = ["All domains", "Fundraising & VC", "Product Strategy", "Growth & PLG", "Legal & IP", "HealthTech & Impact", "DeepTech & AI", "Design & Product", "Engineering & Scale", "Fintech & Scaling", "B2B SaaS Revenue", "E-Commerce & DTC", "CleanTech & EVs", "MENA Startups", "Asia Pacific VC"];

const HOW_IT_WORKS = [
  { step: "01", icon: Search,        title: "Find your expert",      desc: "Browse by domain — fundraising, product, growth, legal, and more." },
  { step: "02", icon: Calendar,      title: "Book a slot",           desc: "Pick an available time. Calendar synced, reminders sent automatically." },
  { step: "03", icon: Video,         title: "Join the video call",   desc: "Meet face-to-face in our built-in room — no Zoom account needed." },
  { step: "04", icon: MessageSquare, title: "Continue via chat",     desc: "Follow up, share docs, and get async replies anytime." },
];

export default function ConnectPage() {
  const [search, setSearch]       = useState("");
  const [domain, setDomain]       = useState("All domains");
  const [availOnly, setAvailOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return EXPERTS.filter(e => {
      const matchSearch = !q || e.name.toLowerCase().includes(q) || e.domain.toLowerCase().includes(q)
        || e.company.toLowerCase().includes(q) || e.role.toLowerCase().includes(q)
        || e.tags.some(t => t.toLowerCase().includes(q));
      const matchDomain = domain === "All domains" || e.domain === domain;
      const matchAvail  = !availOnly || e.available;
      return matchSearch && matchDomain && matchAvail;
    });
  }, [search, domain, availOnly]);

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#FDFAF7]">

        {/* Hero */}
        <section className="relative section-padding overflow-hidden bg-soft-pattern">
          <div className="absolute inset-0 bg-dot-grid opacity-25" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-[#AACDDC]/20 blur-[80px] pointer-events-none" />
          <div className="section-container relative z-10 text-center">
            <span className="badge badge-blue mb-6">
              <Video className="size-3.5" />
              Live Video + Chat — Built for founders
            </span>
            <h1 className="text-5xl sm:text-6xl text-[#1A2332] tracking-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Talk to experts who&apos;ve{" "}
              <em className="not-italic text-gradient-primary">actually built it</em>
            </h1>
            <p className="text-xl text-[#4A5668] dark:text-slate-300 max-w-2xl mx-auto mb-8">
              Book 1-on-1 video calls with domain-expert advisors. Continue via direct chat. No middlemen, no gatekeeping.
            </p>
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-[#D2C4B4] dark:border-slate-700 shadow-soft-sm mb-12">
              <Shield className="size-5 text-[#81A6C6]" />
              <span className="text-sm text-[#4A5668] dark:text-slate-300">
                <span className="text-[#1A2332] dark:text-slate-100 font-semibold">Basic plan free for 30 days</span> — full access. Then from ₹499/month.
              </span>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="section-container pb-20">
          <h2 className="text-2xl font-semibold text-[#1A2332] dark:text-slate-100 mb-8 text-center">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="card p-6 relative bg-white dark:bg-slate-800">
                <div className="text-4xl font-bold text-[#D2C4B4] dark:text-slate-700 absolute top-4 right-4 select-none" style={{ fontFamily: "'Playfair Display', serif" }}>{step}</div>
                <div className="size-10 rounded-xl bg-[#EEF4F9] dark:bg-slate-700 border border-[#AACDDC] dark:border-slate-600 flex items-center justify-center mb-4">
                  <Icon className="size-5 text-[#81A6C6] dark:text-blue-300" />
                </div>
                <h3 className="font-semibold text-[#1A2332] dark:text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-[#4A5668] dark:text-slate-300 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Expert listing */}
        <section className="bg-slate-950 border-y border-slate-800 py-16">
          <div className="section-container">
            {/* Search + filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  id="expert-search"
                  type="text"
                  placeholder="Search by name, company, or expertise..."
                  className="input pl-10 bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select
                id="domain-filter"
                className="input sm:w-56 bg-slate-900 border-slate-700 text-slate-100"
                value={domain}
                onChange={e => setDomain(e.target.value)}
              >
                {DOMAINS.map(d => <option key={d}>{d}</option>)}
              </select>
              <button
                onClick={() => setAvailOnly(v => !v)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all whitespace-nowrap ${availOnly ? "bg-emerald-600 text-white border-emerald-600" : "bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500"}`}
              >
                <Zap className="size-3.5" />
                Available only
              </button>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-300">
                Showing <strong className="text-slate-100">{filtered.length}</strong> of <strong className="text-slate-100">{EXPERTS.length}</strong> experts
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Filter className="size-3.5" />
                {domain !== "All domains" || search || availOnly ? "Filtered" : "All experts"}
              </div>
            </div>

            {/* Expert grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((expert) => (
                <div key={expert.name} className="card p-6 card-hover flex flex-col gap-4 bg-slate-900 border-slate-800">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${expert.bg}, ${expert.bg}bb)` }}>
                        {expert.initials}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-100 text-sm">{expert.name}</h3>
                        <p className="text-xs text-slate-300">{expert.role}</p>
                        <p className="text-xs font-semibold text-blue-300 mt-0.5">{expert.company}</p>
                        <span className="badge badge-blue mt-1 text-[10px]">{expert.domain}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${expert.available ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : "bg-slate-800 text-slate-400 border border-slate-700"}`}>
                      {expert.available ? "● Available" : "Busy"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Star className="size-3 text-amber-400 fill-amber-400" />{expert.rating}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3" />{expert.sessions} sessions</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {expert.tags.map((tag) => (
                      <span key={tag} className="text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">{tag}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                    <Link href="/sign-up" className="flex-1 btn-primary py-2 text-sm justify-center">
                      <Video className="size-3.5" /> Book Call
                    </Link>
                    <Link href="/sign-up" className="btn-outline py-2 px-3" title="Chat">
                      <MessageSquare className="size-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <Search className="size-12 text-[#D2C4B4] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#1A2332] mb-2">No experts found</h3>
                <p className="text-sm text-[#8A95A3]">Try adjusting your search or filters.</p>
                <button onClick={() => { setSearch(""); setDomain("All domains"); setAvailOnly(false); }}
                  className="mt-4 btn-outline text-sm py-2 px-4">Clear filters</button>
              </div>
            )}
          </div>
        </section>

        {/* Pricing */}
        <section className="section-container py-20 text-center">
          <h2 className="text-3xl text-[#1A2332] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Simple, transparent pricing
          </h2>
          <p className="text-[#4A5668] mb-12 max-w-lg mx-auto">
            Basic plan free for 30 days. Upgrade to unlock senior experts.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              {
                name: "Basic", price: "₹499", period: "/month",
                credits: "600 credits / month", autoPayNote: "Auto-pay enabled · Free first 30 days",
                experienceRange: "0–10 yrs experience experts",
                features: ["600 credits", "Expert access: 0–10 yrs exp", "Venture marketplace", "Community access"],
                highlight: false, freeBadge: true,
              },
              {
                name: "Standard", price: "₹999", period: "/month",
                credits: "1,500 credits / month", autoPayNote: "Auto-pay enabled",
                experienceRange: "10–15 yrs experience experts",
                features: ["1,500 credits", "Expert access: 10–15 yrs exp", "Priority booking", "All Basic features"],
                highlight: true, freeBadge: false,
              },
              {
                name: "Premium", price: "₹1,499", period: "/month",
                credits: "2,000 credits / month", autoPayNote: "Auto-pay enabled",
                experienceRange: "15+ yrs · GSF exclusive experts",
                features: ["2,000 credits", "Exclusive GSF experts: 15+ yrs", "Investor intros", "All Standard features"],
                highlight: false, freeBadge: false,
              },
            ].map((plan) => (
              <div key={plan.name} className={`card p-6 flex flex-col ${plan.highlight ? "border-[#81A6C6] shadow-[0_4px_24px_rgba(129,166,198,0.18)]" : ""}`}>
                {plan.freeBadge && <span className="badge badge-warm text-xs mb-3 w-fit">Free first 30 days</span>}
                {plan.highlight && <span className="badge badge-blue text-xs mb-3 w-fit">Most Popular</span>}
                <div className="font-bold text-lg text-[#1A2332] mb-1">{plan.name}</div>
                <div className="mb-1">
                  <span className="text-2xl font-bold text-[#1A2332]" style={{ fontFamily: "'Playfair Display', serif" }}>{plan.price}</span>
                  <span className="text-xs text-[#8A95A3] ml-1">{plan.period}</span>
                </div>
                {plan.credits && <div className="text-xs font-medium text-[#81A6C6] mb-1">{plan.credits}</div>}
                {plan.autoPayNote && <div className="text-[10px] text-[#8A95A3] mb-3">{plan.autoPayNote}</div>}
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#4A5668] bg-[#F3E3D0] border border-[#D2C4B4] rounded-lg px-2 py-1 mb-4 w-fit">
                  {plan.experienceRange}
                </div>
                <ul className="space-y-2 flex-1 mb-6 text-left">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[#4A5668]">
                      <span className="size-1.5 rounded-full bg-[#81A6C6] shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up" className={plan.highlight ? "btn-primary justify-center text-sm" : "btn-outline justify-center text-sm"}>
                  <ArrowRight className="size-3.5" />
                  {plan.freeBadge ? "Start free — 30 days" : "Choose plan"}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#8A95A3] mt-6">
            Expert experience filters are applied automatically based on your plan. Upgrade anytime to unlock senior experts.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
