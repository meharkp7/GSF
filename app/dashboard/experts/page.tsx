"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Search, Star, Video, ChevronDown, Clock, Award, Loader2 } from "lucide-react";
import SearchFilter from "@/components/ui/SearchFilter";
import EmptyState from "@/components/ui/EmptyState";
import { useFilteredDataWithFilters } from "@/hooks/useFilteredData";
import BookingModal from "@/components/experts/BookingModal";
import { toast } from "sonner";

const DOMAINS   = ["All", "HealthTech", "FinTech", "EdTech", "Product", "Growth", "Legal"];
const EXP_TIERS = ["All", "0-2 yrs", "2-5 yrs", "5+ yrs"];

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function ExpertsPage() {
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [domain,  setDomain]  = useState("All");
  const [expTier, setExpTier] = useState("All");
  const [selectedExpert, setSelectedExpert] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookedIds, setBookedIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadExperts() {
      try {
        const res = await fetch("/api/experts");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setExperts(data);
      } catch (error) {
        toast.error("Could not load experts");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadExperts();
  }, []);

  const filteredExperts = useFilteredDataWithFilters(
    experts,
    searchQuery,
    {
      domain: (expert) => domain === "All" || (expert.specializations || []).includes(domain),
      expTier: (expert) => expTier === "All" || expert.experience === expTier,
    },
    [
      (expert, query) => expert.name.toLowerCase().includes(query),
      (expert, query) => (expert.title || "").toLowerCase().includes(query),
      (expert, query) => (expert.tags || []).some((tag: string) => tag.toLowerCase().includes(query)),
    ]
  );

  function openBooking(expert: any) {
    setSelectedExpert(expert);
    setIsModalOpen(true);
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
            placeholder="Search by name, title, or topic..."
            onSearchChange={setSearchQuery}
            filters={{
              domain: {
                options: DOMAINS.map(d => ({ value: d, label: d })),
                value: domain,
                onChange: setDomain,
                label: "Specialization",
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
        {!loading && (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Showing <strong style={{ color: "var(--text-primary)" }}>{filteredExperts.length}</strong> experts
          </p>
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card p-5 h-64 animate-pulse bg-[var(--bg-surface-2)]" />
            ))}
          </div>
        )}

        {/* Expert grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredExperts.length > 0 ? (
              filteredExperts.map((expert, i) => {
              const isBooked = bookedIds.includes(expert.clerkId);

              return (
                <motion.div
                  key={expert.clerkId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="card p-5 flex flex-col"
                >
                  {/* Avatar + name */}
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="size-12 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, var(--accent-indigo), var(--accent-teal))` }}
                    >
                      {expert.avatarUrl ? (
                        <img src={expert.avatarUrl} alt={expert.name} className="size-full rounded-xl object-cover" />
                      ) : (
                        expert.name.split(" ").map((n: string) => n[0]).join("")
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{expert.name}</p>
                        {expert.isVerified && (
                          <span className="badge badge-teal text-[10px] flex-shrink-0">Verified</span>
                        )}
                      </div>
                      <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>{expert.title || expert.company}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="size-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                        <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{expert.rating || "5.0"}</span>
                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>(30+ reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(expert.tags || []).slice(0, 3).map((tag: string) => (
                      <span key={tag} className="badge badge-blue text-[10px]">{tag}</span>
                    ))}
                  </div>

                  {/* Domain + experience */}
                  <div className="flex items-center gap-4 mb-4 text-xs" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1 min-w-0">
                      <Award className="size-3 flex-shrink-0" />
                      <span className="truncate">{(expert.specializations || [])[0] || "Mentor"}</span>
                    </span>
                    <span className="flex items-center gap-1 flex-shrink-0">
                      <Clock className="size-3" />{expert.experience || "5+ yrs"}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-3 border-t" style={{ borderTopColor: "var(--border-soft)" }}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold shrink-0" style={{ color: "var(--accent-indigo)" }}>
                        {expert.sessionRate} cr
                        <span className="text-[10px] font-normal ml-1" style={{ color: "var(--text-muted)" }}>/ session</span>
                      </p>
                      {isBooked ? (
                        <span className="text-xs text-emerald-500 font-semibold flex-shrink-0">✓ Booked!</span>
                      ) : (
                        <button
                          onClick={() => openBooking(expert)}
                          className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 flex-shrink-0 whitespace-nowrap"
                        >
                          <Video className="size-3" /> Book
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
        )}

      </div>

      <BookingModal
        expert={selectedExpert}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(sessionId) => {
          if (selectedExpert) {
            setBookedIds(prev => [...prev, selectedExpert.clerkId]);
          }
        }}
      />
    </DashboardShell>
  );
}
