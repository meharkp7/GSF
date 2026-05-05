"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Star, MessageSquare, Video, Search, Briefcase, Mail, Filter, X } from "lucide-react";

const ALL_EXPERTS = [
  { name: "Dr. Anika Patel",    initials: "AP", role: "Partner",               company: "Sequoia Capital India",  domain: "Venture Capital",         tags: ["Fundraising", "SaaS", "EdTech"],          bio: "10+ years investing in early-stage startups. Led investments in 40+ companies including 3 unicorns.", sessions: 48,  rating: 4.9, available: true,  avatarBg: "#EF4444", experience: "10+ years", linkedin: "linkedin.com/in/anika-patel",    website: "anika.vc",           email: "anika@gsf.com" },
  { name: "James Whitfield",    initials: "JW", role: "Co-founder (Exited)",   company: "Razorpay",               domain: "Fintech & Scaling",        tags: ["Product", "Scale", "B2B"],                bio: "Built Razorpay from 0 to $1B valuation. Now advising the next generation of fintech founders.",      sessions: 62,  rating: 5.0, available: true,  avatarBg: "#3B82F6", experience: "15+ years", linkedin: "linkedin.com/in/jwhitfield",     website: "jameswhitfield.com", email: "james@gsf.com" },
  { name: "Sara Mensah",        initials: "SM", role: "Director of Product",   company: "Stripe",                 domain: "Product Strategy",         tags: ["Product Strategy", "APIs", "Growth"],     bio: "Scaled Stripe's developer platform to 10M+ developers. Ex-Google, ex-Airbnb.",                       sessions: 35,  rating: 4.8, available: false, avatarBg: "#10B981", experience: "10+ years", linkedin: "linkedin.com/in/sara-mensah",    website: "",                   email: "sara@gsf.com" },
  { name: "Yuki Tanaka",        initials: "YT", role: "Head of Growth",        company: "Notion",                 domain: "Growth & PLG",             tags: ["PLG", "B2C", "Virality"],                 bio: "Pioneered product-led growth at Notion. Grew Notion from 1M to 30M users in 18 months.",             sessions: 41,  rating: 4.9, available: true,  avatarBg: "#F59E0B", experience: "5–10 years",linkedin: "linkedin.com/in/yukitanaka",     website: "yukitanaka.io",      email: "yuki@gsf.com" },
  { name: "Raj Devani",         initials: "RD", role: "General Counsel",       company: "Y Combinator (S22)",     domain: "Legal & IP",               tags: ["Startup Law", "IP", "Fundraising Docs"],  bio: "Specialized in startup formation, equity structuring, and IP for early-stage companies.",              sessions: 29,  rating: 4.7, available: true,  avatarBg: "#8B5CF6", experience: "5–10 years",linkedin: "linkedin.com/in/rajdevani",      website: "rajdevani.law",      email: "raj@gsf.com" },
  { name: "Fatima Al-Hassan",   initials: "FA", role: "CEO & Founder",         company: "MedTech Africa",         domain: "HealthTech & Impact",      tags: ["HealthTech", "Impact", "Africa"],          bio: "Building healthcare infrastructure for underserved markets. WHO Young Innovator 2023.",               sessions: 22,  rating: 4.9, available: false, avatarBg: "#06B6D4", experience: "5–10 years",linkedin: "linkedin.com/in/fatima-al-hassan",website: "medtechafrica.org", email: "fatima@gsf.com" },
  { name: "Priya Nakashima",    initials: "PN", role: "Product Lead",          company: "Figma",                  domain: "Design & Product",         tags: ["UX", "Design Systems", "B2B SaaS"],       bio: "Led design systems at Figma. Previously Design Lead at InVision and Canva.",                          sessions: 27,  rating: 4.9, available: true,  avatarBg: "#EC4899", experience: "5–10 years",linkedin: "linkedin.com/in/priyanakashima", website: "",                   email: "priya@gsf.com" },
  { name: "Rahul Mehta",        initials: "RM", role: "VP Growth",             company: "Zepto",                  domain: "Growth & Q-Commerce",      tags: ["Quick Commerce", "Hyperlocal", "GTM"],    bio: "Scaled Zepto's northern India user base 10x in 8 months. Expert in hyperlocal demand loops.",         sessions: 38,  rating: 4.8, available: true,  avatarBg: "#F97316", experience: "5–10 years",linkedin: "linkedin.com/in/rahulmehta",    website: "",                   email: "rahul@gsf.com" },
  { name: "Mei Suzuki",         initials: "MS", role: "Head of Business Dev",  company: "OpenAI",                 domain: "AI & Enterprise",          tags: ["AI/ML", "Enterprise Sales", "APIs"],      bio: "Developing OpenAI's enterprise partnerships globally. Ex-Google Cloud and AWS.",                       sessions: 17,  rating: 5.0, available: true,  avatarBg: "#0EA5E9", experience: "10+ years", linkedin: "linkedin.com/in/meisuzuki",      website: "",                   email: "mei@gsf.com" },
  { name: "Rishi Anand",        initials: "RA", role: "Chief Revenue Officer", company: "Freshworks",             domain: "B2B SaaS Revenue",         tags: ["B2B SaaS", "Sales", "Enterprise"],        bio: "Scaled Freshworks ARR from $50M to $300M. Expert in building land-and-expand revenue models.",         sessions: 49,  rating: 4.8, available: true,  avatarBg: "#059669", experience: "15+ years", linkedin: "linkedin.com/in/rishianand",    website: "",                   email: "rishi@gsf.com" },
  { name: "Sofia Lindqvist",    initials: "SL", role: "Startup Partner",       company: "Google for Startups",    domain: "Early Stage GTM",          tags: ["GTM", "Community Building", "B2C"],       bio: "Supported 200+ startups through Google's acceleration programs. Former startup founder.",               sessions: 55,  rating: 4.9, available: true,  avatarBg: "#84CC16", experience: "10+ years", linkedin: "linkedin.com/in/soflindqvist",  website: "",                   email: "sofia@gsf.com" },
  { name: "Arjun Kapoor",       initials: "AK", role: "Partner",               company: "Accel India",            domain: "Seed & Series A Investing", tags: ["Seed", "Consumer", "SaaS", "VC"],        bio: "Early investor in Swiggy, Myntra, and Cure.fit. Focused on consumer and SaaS in India.",               sessions: 44,  rating: 4.8, available: false, avatarBg: "#A855F7", experience: "10+ years", linkedin: "linkedin.com/in/arjunkapoor",   website: "",                   email: "arjun@gsf.com" },
  { name: "Carlos Rodrigues",   initials: "CR", role: "Founder & CTO",         company: "Nubank (acquired)",      domain: "FinTech Engineering",      tags: ["FinTech", "Mobile", "Regulation"],        bio: "Co-founded Nubank Brazil engineering team. Built digital banking infrastructure from scratch.",         sessions: 23,  rating: 4.7, available: true,  avatarBg: "#7C3AED", experience: "10+ years", linkedin: "linkedin.com/in/carlosrodrigues",website: "",                  email: "carlos@gsf.com" },
  { name: "Nkechi Okonkwo",     initials: "NO", role: "Director of Operations",company: "Airbnb",                 domain: "Marketplace & Ops",        tags: ["Marketplace", "Ops", "Trust & Safety"],   bio: "Scaled Airbnb's APAC operations. Expert in marketplace trust, host acquisition, and retention.",       sessions: 30,  rating: 4.8, available: true,  avatarBg: "#F43F5E", experience: "10+ years", linkedin: "linkedin.com/in/nkechiokonkwo", website: "",                   email: "nkechi@gsf.com" },
  { name: "Kevin Zhao",         initials: "KZ", role: "Head of Partnerships",  company: "Shopify",                domain: "E-Commerce & DTC",         tags: ["E-commerce", "DTC", "Partnerships"],      bio: "Built Shopify's merchant ecosystem from 10K to 1M+ merchants. Expert in DTC growth.",                  sessions: 37,  rating: 4.9, available: true,  avatarBg: "#16A34A", experience: "5–10 years",linkedin: "linkedin.com/in/kevinzhao",     website: "",                   email: "kevin@gsf.com" },
  { name: "Divya Nair",         initials: "DN", role: "Founding Member",       company: "Ola Electric",           domain: "CleanTech & EVs",          tags: ["CleanTech", "Manufacturing", "EV"],       bio: "Founding team at Ola Electric. Led product development of India's first mass-market electric scooter.", sessions: 28,  rating: 4.8, available: true,  avatarBg: "#0891B2", experience: "5–10 years",linkedin: "linkedin.com/in/divyanair",     website: "",                   email: "divya@gsf.com" },
  { name: "Amira Haddad",       initials: "AH", role: "Partner",               company: "Wamda Capital",          domain: "MENA Startups & Impact",   tags: ["MENA", "VC", "Social Impact"],            bio: "Backing early-stage startups across UAE, KSA, and Egypt. Focus on fintech and edtech.",                sessions: 26,  rating: 4.9, available: true,  avatarBg: "#D97706", experience: "10+ years", linkedin: "linkedin.com/in/amirahaddad",   website: "",                   email: "amira@gsf.com" },
  { name: "Luca De Santi",      initials: "LD", role: "Venture Partner",       company: "EQT Ventures",           domain: "Deep Tech (Europe)",       tags: ["DeepTech", "Hardware", "EU Market"],      bio: "Backing frontier tech companies across Europe. Previously led R&D at Siemens Digital Industries.",      sessions: 18,  rating: 4.7, available: true,  avatarBg: "#9333EA", experience: "10+ years", linkedin: "linkedin.com/in/lucadesanti",   website: "",                   email: "luca@gsf.com" },
  { name: "Takeshi Mori",       initials: "TM", role: "Angel Investor",        company: "ex-SoftBank Vision Fund",domain: "Asia Pacific VC",          tags: ["VC", "Asia", "Consumer Tech"],            bio: "Former SoftBank Vision Fund principal. Angel investor in 40+ companies across Japan, Korea, India.",   sessions: 33,  rating: 4.9, available: true,  avatarBg: "#6D28D9", experience: "15+ years", linkedin: "linkedin.com/in/takeshimori",   website: "",                   email: "takeshi@gsf.com" },
  { name: "Benjamin Park",      initials: "BP", role: "Staff Engineer",        company: "Meta",                   domain: "Engineering & Scale",      tags: ["Distributed Systems", "ML Infra", "Data"],bio: "Built core infrastructure powering Meta's AI recommendation systems at billion-user scale.",            sessions: 15,  rating: 4.6, available: false, avatarBg: "#1D4ED8", experience: "10+ years", linkedin: "linkedin.com/in/benjaminpark",  website: "",                   email: "ben@gsf.com" },
];

const DOMAINS = ["All", ...Array.from(new Set(ALL_EXPERTS.map(e => e.domain)))].sort();

export default function ExpertsPage() {
  const [search, setSearch]   = useState("");
  const [domain, setDomain]   = useState("All");
  const [availOnly, setAvailOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_EXPERTS.filter(e => {
      const matchQ = !q || e.name.toLowerCase().includes(q) || e.domain.toLowerCase().includes(q)
        || e.company.toLowerCase().includes(q) || e.bio.toLowerCase().includes(q)
        || e.tags.some(t => t.toLowerCase().includes(q));
      const matchD = domain === "All" || e.domain === domain;
      const matchA = !availOnly || e.available;
      return matchQ && matchD && matchA;
    });
  }, [search, domain, availOnly]);

  const clearFilters = () => { setSearch(""); setDomain("All"); setAvailOnly(false); };

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#FDFAF7] dark:bg-slate-950">
        {/* Hero */}
        <section className="relative section-padding bg-soft-pattern dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid opacity-25" />
          <div className="section-container relative z-10 text-center">
            <span className="badge badge-blue mb-6"><Star className="size-3.5" /> {ALL_EXPERTS.length}+ world-class experts</span>
              <h1 className="text-5xl sm:text-6xl text-[#1A2332] dark:text-slate-100 tracking-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Learn from founders{" "}
              <em className="not-italic text-gradient-primary">who&apos;ve done it</em>
            </h1>
            <p className="text-xl text-[#4A5668] max-w-2xl mx-auto mb-8">
              Book video calls and chat directly with operators, investors, and domain experts. Available directly to every GSF member.
            </p>

            {/* Search bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#8A95A3] dark:text-slate-400" />
                <input
                  id="expert-search"
                  type="text"
                  placeholder="Search by name, company, or expertise..."
                  className="input pl-10 w-full bg-white dark:bg-slate-900 border-[#D2C4B4] dark:border-slate-700"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A95A3] hover:text-[#1A2332] dark:hover:text-slate-100">
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
              <select className="input sm:w-52 w-full bg-white dark:bg-slate-900 border-[#D2C4B4] dark:border-slate-700" value={domain} onChange={e => setDomain(e.target.value)}>
                {DOMAINS.map(d => <option key={d}>{d}</option>)}
              </select>
              <Link href="/sign-up" className="btn-primary whitespace-nowrap w-full sm:w-auto justify-center">Join to Book</Link>
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={() => setAvailOnly(v => !v)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-all ${availOnly ? "bg-green-600 text-white border-green-600" : "bg-white dark:bg-slate-900 text-[#4A5668] dark:text-slate-300 border-[#D2C4B4] dark:border-slate-700"}`}
              >
                ● Available now only
              </button>
              {(search || domain !== "All" || availOnly) && (
                <button onClick={clearFilters} className="text-xs text-[#8A95A3] hover:text-[#1A2332] dark:hover:text-slate-100 flex items-center gap-1">
                  <X className="size-3" /> Clear filters
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Results bar */}
        <div className="section-container py-4 flex items-center justify-between">
          <p className="text-sm text-[#4A5668] dark:text-slate-300">
            Showing <strong className="text-[#1A2332] dark:text-slate-100">{filtered.length}</strong> of <strong className="text-[#1A2332] dark:text-slate-100">{ALL_EXPERTS.length}</strong> experts
            {domain !== "All" && <> in <strong className="text-[#3D74A0] dark:text-blue-300">{domain}</strong></>}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-[#8A95A3] dark:text-slate-400"><Filter className="size-3.5" /> {filtered.length} results</div>
        </div>

        {/* Expert grid */}
        <section className="section-container pb-24 pt-2">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((expert) => (
                <div key={expert.name} className="card p-6 card-hover flex flex-col gap-4 bg-white dark:bg-slate-800">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className="size-14 rounded-2xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${expert.avatarBg}, ${expert.avatarBg}99)` }}>
                      {expert.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-sm font-semibold text-[#1A2332] dark:text-slate-100 leading-tight">{expert.name}</h2>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${expert.available ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/20" : "bg-[#F3E3D0] text-[#8A95A3] dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600"}`}>
                          {expert.available ? "● Available" : "Away"}
                        </span>
                      </div>
                      <p className="text-xs text-[#4A5668] dark:text-slate-300 truncate mt-0.5">{expert.role}</p>
                      <p className="text-xs font-semibold text-[#3D74A0] dark:text-blue-300 truncate">{expert.company}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="badge badge-blue text-[10px]">{expert.domain}</span>
                        <span className="text-[10px] text-[#8A95A3] dark:text-slate-400">{expert.experience} exp</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[#4A5668] dark:text-slate-300 leading-relaxed line-clamp-2">{expert.bio}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {expert.tags.map((tag) => (
                      <span key={tag} className="text-xs text-[#4A5668] dark:text-slate-300 bg-[#F3E3D0] dark:bg-slate-700 border border-[#D2C4B4] dark:border-slate-600 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>

                  {/* Rating + sessions */}
                  <div className="flex items-center gap-3 text-xs text-[#8A95A3] dark:text-slate-400">
                    <span className="flex items-center gap-1"><Star className="size-3 text-amber-400 fill-amber-400" />{expert.rating}</span>
                    <span>{expert.sessions} sessions</span>
                  </div>

                  {/* Footer: Book button full-width on its own row, social links below */}
                  <div className="pt-2 border-t border-[#D2C4B4] dark:border-slate-700 space-y-2">
                    <Link
                      href="/login"
                      className="btn-primary w-full justify-center text-xs py-2 flex items-center gap-1.5"
                    >
                      <Video className="size-3.5" /> Book a Session
                    </Link>
                    <div className="flex items-center gap-1">
                      <a href={`https://${expert.linkedin}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[#4A5668] dark:text-slate-300 hover:text-[#0077B5] transition-colors px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 flex-1 justify-center">
                        <svg className="size-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        LinkedIn
                      </a>
                      <a href={`mailto:${expert.email}`}
                        className="flex items-center gap-1.5 text-xs text-[#4A5668] dark:text-slate-300 hover:text-[#3D74A0] transition-colors px-2 py-1 rounded-lg hover:bg-[#EEF4F9] dark:hover:bg-slate-700 flex-1 justify-center">
                        <Mail className="size-3.5 flex-shrink-0" />
                        Email
                      </a>
                      <Link href="/login"
                        className="flex items-center gap-1.5 text-xs text-[#4A5668] dark:text-slate-300 hover:text-[#3D74A0] transition-colors px-2 py-1 rounded-lg hover:bg-[#EEF4F9] dark:hover:bg-slate-700 flex-1 justify-center">
                        <MessageSquare className="size-3.5 flex-shrink-0" />
                        Chat
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
              <div className="text-center py-24">
              <Search className="size-14 text-[#D2C4B4] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1A2332] dark:text-slate-100 mb-2">No experts found</h3>
              <p className="text-sm text-[#8A95A3] dark:text-slate-400 mb-5">Try a different search term or domain filter.</p>
              <button onClick={clearFilters} className="btn-outline text-sm py-2 px-5">Clear filters</button>
            </div>
          )}
        </section>

        {/* Become expert CTA */}
        <section className="bg-[#F7F2EC] dark:bg-slate-950 border-t border-[#D2C4B4] dark:border-slate-800 py-20">
          <div className="section-container text-center max-w-2xl mx-auto">
            <div className="size-14 rounded-2xl bg-[#EEF4F9] dark:bg-slate-800 border border-[#AACDDC] dark:border-slate-700 flex items-center justify-center mx-auto mb-6">
              <Briefcase className="size-7 text-[#81A6C6] dark:text-blue-300" />
            </div>
            <h2 className="text-3xl text-[#1A2332] dark:text-slate-100 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Are you an expert?</h2>
            <p className="text-[#4A5668] dark:text-slate-300 max-w-xl mx-auto mb-8">
              Join the GSF expert network and give back to the next generation of founders. We match you with students who need your exact expertise.
            </p>
            <Link href="/sign-up" className="btn-primary px-8 py-3">Apply as an expert</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
