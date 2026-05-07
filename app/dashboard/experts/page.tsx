"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Search, Star, Video, ChevronDown, Clock, Award } from "lucide-react";
import SearchFilter from "@/components/ui/SearchFilter";
import EmptyState from "@/components/ui/EmptyState";
import { useFilteredDataWithFilters } from "@/hooks/useFilteredData";

const EXPERTS = [
  { id: 1, name: "Meera Patel",     avatar: "MP", domain: "HealthTech", role: "ex-YC Founder, S21",       exp: "5+ yrs",  rate: 100, rating: 4.9, reviews: 38, tags: ["MVP", "Fundraising", "GTM"],          available: true,  bg: "#EF4444" },
  { id: 2, name: "Vikram Nair",     avatar: "VN", domain: "FinTech",    role: "VC Partner @ Sequoia",      exp: "5+ yrs",  rate: 100, rating: 4.8, reviews: 52, tags: ["Finance", "Pitch", "Term Sheets"],    available: true,  bg: "#3B82F6" },
  { id: 3, name: "Sanya Puri",      avatar: "SP", domain: "EdTech",     role: "ex-YC S22, 3x Founder",     exp: "5+ yrs",  rate: 100, rating: 5.0, reviews: 14, tags: ["EdTech", "B2B SaaS", "PMF"],          available: true,  bg: "#8B5CF6" },
  { id: 4, name: "Sara Mitchell",   avatar: "SM", domain: "Product",    role: "Product Lead @ Stripe",      exp: "2-5 yrs", rate: 200, rating: 4.7, reviews: 29, tags: ["Design", "Roadmap", "User Research"], available: false, bg: "#10B981" },
  { id: 5, name: "James Wong",      avatar: "JW", domain: "Growth",     role: "Growth @ Notion",            exp: "2-5 yrs", rate: 200, rating: 4.9, reviews: 41, tags: ["SEO", "Paid Ads", "Viral Loops"],     available: true,  bg: "#F59E0B" },
  { id: 6, name: "Fatima Abubakar", avatar: "FA", domain: "Legal",      role: "Startup Lawyer, YC Alum",    exp: "5+ yrs",  rate: 350, rating: 4.8, reviews: 23, tags: ["Equity", "IP", "SAFE Notes"],         available: true,  bg: "#06B6D4" },
];

const DOMAINS   = ["All", "HealthTech", "FinTech", "EdTech", "Product", "Growth", "Legal"];
const EXP_TIERS = ["All", "0-2 yrs", "2-5 yrs", "5+ yrs"];

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function ExpertsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [domain,  setDomain]  = useState("All");
  const [expTier, setExpTier] = useState("All");
  const [booking, setBooking] = useState<number | null>(null);
  const [booked,  setBooked]  = useState<number[]>([]);

  const filteredExperts = useFilteredDataWithFilters(
    EXPERTS,
    searchQuery,
    {
      domain: (expert) => domain === "All" || expert.domain === domain,
      expTier: (expert) => expTier === "All" || expert.exp === expTier,
    },
    [
      (expert, query) => expert.name.toLowerCase().includes(query),
      (expert, query) => expert.domain.toLowerCase().includes(query),
      (expert, query) => expert.tags.some(tag => tag.toLowerCase().includes(query)),
    ]
  );

  function handleBook(id: number) {
    setBooking(id);
    setTimeout(() => { setBooked(prev => [...prev, id]); setBooking(null); }, 1200);
  }

  return (
    <DashboardShell role="founder">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <motion.div {...fadeUp(0)}>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
            Find an Expert
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Book 1-on-1 sessions with world-class founders, VCs, and operators. Credits deducted on booking.
          </p>
        </motion.div>

        {/* Search + filters */}
        <motion.div {...fadeUp(0.05)}>
          <SearchFilter
            placeholder="Search by name, domain, or topic..."
            onSearchChange={setSearchQuery}
            filters={{
              domain: {
                options: DOMAINS.map(d => ({ value: d, label: d })),
                value: domain,
                onChange: setDomain,
                label: "Domain",
              },
              expTier: {
                options: EXP_TIERS.map(t => ({ value: t, label: t })),
                value: expTier,
                onChange: setExpTier,
                label: "Experience",
              },
            }}
          />
        </motion.div>

        {/* Results count */}
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Showing <strong style={{ color: "var(--text-primary)" }}>{filteredExperts.length}</strong> experts
        </p>

        {/* Expert grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredExperts.length > 0 ? (
            filteredExperts.map((expert, i) => {
            const isBooked  = booked.includes(expert.id);
            const isBooking = booking === expert.id;

            return (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="card p-5 flex flex-col"
              >
                {/* Avatar + name */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="size-12 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${expert.bg}, ${expert.bg}99)` }}
                  >
                    {expert.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{expert.name}</p>
                      {!expert.available && (
                        <span className="badge badge-warn text-[10px] flex-shrink-0">Busy</span>
                      )}
                    </div>
                    <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>{expert.role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="size-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                      <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{expert.rating}</span>
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>({expert.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {expert.tags.map(tag => (
                    <span key={tag} className="badge badge-blue text-[10px]">{tag}</span>
                  ))}
                </div>

                {/* Domain + experience */}
                <div className="flex items-center gap-4 mb-4 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span className="flex items-center gap-1 min-w-0">
                    <Award className="size-3 flex-shrink-0" />
                    <span className="truncate">{expert.domain}</span>
                  </span>
                  <span className="flex items-center gap-1 flex-shrink-0">
                    <Clock className="size-3" />{expert.exp} exp
                  </span>
                </div>

                {/* Footer — price always left, button always right, never overflow */}
                <div className="mt-auto pt-3 border-t" style={{ borderTopColor: "var(--border-soft)" }}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold shrink-0" style={{ color: "var(--accent-indigo)" }}>
                      {expert.rate} cr
                      <span className="text-[10px] font-normal ml-1" style={{ color: "var(--text-muted)" }}>/ session</span>
                    </p>
                    {isBooked ? (
                      <span className="text-xs text-emerald-500 font-semibold flex-shrink-0">✓ Booked!</span>
                    ) : (
                      <button
                        onClick={() => expert.available && handleBook(expert.id)}
                        disabled={!expert.available || isBooking}
                        className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 flex-shrink-0 whitespace-nowrap"
                        style={!expert.available ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                      >
                        {isBooking
                          ? <span className="size-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          : <Video className="size-3" />}
                        {isBooking ? "Booking…" : "Book"}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
          ) : (
            <div className="col-span-full">
              <EmptyState
                icon="🔍"
                title="No experts found"
                description="Try adjusting your search or filters to find experts."
              />
            </div>
          )}
        </div>

      </div>
    </DashboardShell>
  );
}
