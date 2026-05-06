"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useClerk } from "@clerk/nextjs";
import { Rocket, Star, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Image from "next/image";

type Role = "founder" | "expert";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { session } = useClerk();
  const [role, setRole] = useState<Role>("founder");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  // If user already has a role set, skip onboarding and redirect
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    const existingRole = user.publicMetadata?.role as Role | undefined;
    if (existingRole === "founder" || existingRole === "expert") {
      // Already onboarded — go to correct dashboard
      router.replace(existingRole === "expert" ? "/expert-dashboard" : "/dashboard");
    }
  }, [isLoaded, user, router]);

  async function handleContinue() {
    if (!user) return;
    setSaving(true);
    try {
      // Save metadata via API route (Clerk publicMetadata requires server-side update)
      const res = await fetch("/api/onboarding-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (res.status === 409) {
        // Already onboarded — the server returned the existing role.
        // Redirect to the correct dashboard without re-writing metadata.
        const data = await res.json();
        const existingRole = data.role as Role | undefined;
        router.replace(existingRole === "expert" ? "/expert-dashboard" : "/dashboard");
        return;
      }

      if (!res.ok) {
        console.error("Onboarding failed", await res.text());
        setSaving(false);
        return;
      }

      // Force a reload of the user object so Navbar picks up the new metadata
      await user.reload();
      // Also reload the session token
      await session?.touch();

      setDone(true);
      setTimeout(() => {
        router.push(role === "expert" ? "/expert-dashboard" : "/dashboard");
      }, 1200);
    } catch {
      setSaving(false);
    }
  }

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-base)" }}>
        <div className="size-8 rounded-full border-2 border-t-[var(--accent-indigo)] animate-spin" style={{ borderColor: "var(--border-soft)", borderTopColor: "var(--accent-indigo)" }} />
      </div>
    );
  }

  const firstName = user.firstName ?? "there";

  return (
    <main className="min-h-screen flex items-center justify-center pt-6 pb-12 px-4" style={{ background: "linear-gradient(to bottom, var(--bg-base), var(--bg-canvas))" }}>

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 text-center"
          >
            <CheckCircle2 className="size-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
              You&#39;re all set!
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Taking you to your dashboard…</p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 w-full max-w-md"
          >
            {/* Logo + greeting */}
            <div className="flex flex-col items-center mb-8">
              <div className="size-14 rounded-2xl overflow-hidden border-2 mb-4" style={{ borderColor: "rgba(91,108,255,0.35)" }}>
                <Image src="/gsf-logo.jpeg" alt="GSF" width={56} height={56} className="object-cover w-full h-full" />
              </div>
              <h1 className="text-2xl font-bold flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
                Welcome, {firstName} <Sparkles className="size-5 text-amber-400" />
              </h1>
              <p className="text-sm mt-1 text-center" style={{ color: "var(--text-muted)" }}>
                One last step — tell us how you&#39;re joining GSF
              </p>
            </div>

            <div className="card p-8 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>I am joining as a</p>

              {/* Role cards */}
              {([
                {
                  value: "founder" as Role,
                  icon: Rocket,
                  title: "Founder / Student",
                  desc: "I want to validate my idea, connect with experts, and build my startup",
                  color: "var(--accent-indigo)",
                  bg: "rgba(91,108,255,0.06)",
                },
                {
                  value: "expert" as Role,
                  icon: Star,
                  title: "Expert / Mentor",
                  desc: "I want to mentor founders, earn credits, and contribute my experience",
                  color: "#F59E0B",
                  bg: "rgba(245,158,11,0.06)",
                },
              ] as { value: Role; icon: typeof Rocket; title: string; desc: string; color: string; bg: string }[]).map(opt => {
                const isSelected = role === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setRole(opt.value)}
                    className="w-full p-5 rounded-2xl border-2 text-left transition-all hover:scale-[1.01]"
                    style={{
                      borderColor: isSelected ? opt.color : "var(--border-default)",
                      backgroundColor: isSelected ? opt.bg : "var(--bg-surface-2)",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="size-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isSelected ? opt.bg : "var(--bg-surface)", border: `1px solid ${isSelected ? opt.color : "var(--border-soft)"}` }}>
                        <opt.icon className="size-5" style={{ color: opt.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-0.5" style={{ color: "var(--text-primary)" }}>{opt.title}</p>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{opt.desc}</p>
                      </div>
                      {isSelected && <CheckCircle2 className="size-5 ml-auto flex-shrink-0 mt-0.5" style={{ color: opt.color }} />}
                    </div>
                  </button>
                );
              })}

              <button
                onClick={handleContinue}
                disabled={saving}
                className="btn-primary w-full justify-center py-3 mt-2"
              >
                {saving
                  ? <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  : <><ArrowRight className="size-4" /> Go to Dashboard</>
                }
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
