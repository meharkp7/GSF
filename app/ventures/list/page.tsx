"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import {
  Lightbulb, Building2, TrendingUp, Users, Globe, Link2, ChevronRight,
  ChevronLeft, CheckCircle2, Rocket, Briefcase, Plus, X, ArrowRight
} from "lucide-react";

const SECTORS = ["EdTech", "FinTech", "HealthTech", "AgriTech", "SaaS", "Consumer", "ClimaTech", "DeepTech", "Other"];
const STAGES  = ["Ideation", "Screening", "Research", "MVP", "Funding", "Launch"];
const EXPERT_TAGS = [
  "EdTech expert", "FinTech expert", "HealthTech expert", "AgriTech expert",
  "Legal & IP advisor", "Fundraising advisor", "Product mentor", "Growth advisor",
  "B2B SaaS mentor", "Impact investor", "Series A VC", "Angel investor",
  "Regulatory advisor", "GTM advisor", "UX advisor", "Technical co-founder",
  "Marketing mentor", "Operations advisor", "HR & culture advisor", "CFO mentor",
];

const STEPS = [
  { id: 1, label: "Basic Info",   icon: Briefcase },
  { id: 2, label: "The Idea",     icon: Lightbulb },
  { id: 3, label: "Traction",     icon: TrendingUp },
  { id: 4, label: "Looking For",  icon: Users },
];
const DRAFT_KEY = "gsf_venture_list_draft_v1";

type FormData = {
  name: string; tagline: string; sector: string; stage: string;
  problem: string; solution: string; market: string; usp: string;
  traction: string; teamSize: string; equity: string; fundingGoal: string; website: string;
  lookingFor: string[]; linkedin: string; pitchDeck: string;
};

const EMPTY: FormData = {
  name: "", tagline: "", sector: "", stage: "",
  problem: "", solution: "", market: "", usp: "",
  traction: "", teamSize: "", equity: "", fundingGoal: "", website: "",
  lookingFor: [], linkedin: "", pitchDeck: "",
};

export default function ListVenturePage() {
  const router = useRouter();
  const [step,     setStep]     = useState(1);
  const [form,     setForm]     = useState<FormData>(EMPTY);
  const [submitted,setSubmitted]= useState(false);
  const [customTag,setCustomTag]= useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);

  const set = (key: keyof FormData, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const safeUrl = (value: string) => {
    if (!value.trim()) return true;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const validateField = (key: keyof FormData, value: string | string[]) => {
    switch (key) {
      case "name": {
        const v = String(value).trim();
        if (!v) return "Venture name is required.";
        if (v.length < 2) return "Venture name must be at least 2 characters.";
        if (v.length > 80) return "Venture name must be at most 80 characters.";
        return "";
      }
      case "tagline": {
        const v = String(value).trim();
        if (!v) return "Tagline is required.";
        if (v.length < 10) return "Tagline must be at least 10 characters.";
        if (v.length > 120) return "Tagline must be at most 120 characters.";
        return "";
      }
      case "sector":
        return String(value) ? "" : "Sector is required.";
      case "stage":
        return String(value) ? "" : "Stage is required.";
      case "problem": {
        const v = String(value).trim();
        if (!v) return "Problem statement is required.";
        if (v.length < 20) return "Problem statement must be at least 20 characters.";
        if (v.length > 1000) return "Problem statement must be at most 1000 characters.";
        return "";
      }
      case "solution": {
        const v = String(value).trim();
        if (!v) return "Solution is required.";
        if (v.length < 20) return "Solution must be at least 20 characters.";
        if (v.length > 1000) return "Solution must be at most 1000 characters.";
        return "";
      }
      case "market": {
        const v = String(value).trim();
        if (!v) return "Target market is required.";
        if (v.length < 5) return "Target market must be at least 5 characters.";
        if (v.length > 200) return "Target market must be at most 200 characters.";
        return "";
      }
      case "usp":
        return String(value).trim().length > 200 ? "USP must be at most 200 characters." : "";
      case "traction": {
        const v = String(value).trim();
        if (!v) return "Traction details are required.";
        if (v.length < 5) return "Traction details must be at least 5 characters.";
        if (v.length > 400) return "Traction details must be at most 400 characters.";
        return "";
      }
      case "teamSize": {
        const v = String(value).trim();
        if (!v) return "Team size is required.";
        const num = Number(v);
        if (!Number.isInteger(num) || num <= 0) return "Team size must be a whole number greater than 0.";
        if (num > 500) return "Team size seems too high. Enter a value up to 500.";
        return "";
      }
      case "equity": {
        const v = String(value).trim();
        if (!v) return "";
        const num = Number(v);
        if (Number.isNaN(num)) return "Equity must be a valid number.";
        if (num < 0 || num > 100) return "Equity must be between 0 and 100.";
        return "";
      }
      case "fundingGoal": {
        const v = String(value).trim();
        if (!v) return "";
        const num = Number(v);
        if (Number.isNaN(num) || num < 0) return "Funding goal must be a non-negative number.";
        return "";
      }
      case "website":
        return safeUrl(String(value)) ? "" : "Website must be a valid URL (include http:// or https://).";
      case "lookingFor":
        return Array.isArray(value) && value.length > 0 ? "" : "Select at least one support need.";
      case "linkedin":
        return safeUrl(String(value)) ? "" : "LinkedIn URL must be valid (include http:// or https://).";
      case "pitchDeck":
        return safeUrl(String(value)) ? "" : "Pitch deck URL must be valid (include http:// or https://).";
      default:
        return "";
    }
  };

  const stepKeys = useMemo(() => ({
    1: ["name", "tagline", "sector", "stage"] as (keyof FormData)[],
    2: ["problem", "solution", "market", "usp"] as (keyof FormData)[],
    3: ["traction", "teamSize", "equity", "fundingGoal", "website"] as (keyof FormData)[],
    4: ["lookingFor", "linkedin", "pitchDeck"] as (keyof FormData)[],
  }), []);

  const validateStep = (targetStep: number) => {
    const keys = stepKeys[targetStep as 1 | 2 | 3 | 4] ?? [];
    const nextErrors: Partial<Record<keyof FormData, string>> = {};
    for (const key of keys) {
      const err = validateField(key, form[key]);
      if (err) nextErrors[key] = err;
    }
    setErrors(prev => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const validateAll = () => {
    const nextErrors: Partial<Record<keyof FormData, string>> = {};
    (Object.keys(form) as (keyof FormData)[]).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) nextErrors[key] = err;
    });
    setErrors(nextErrors);
    return {
      valid: Object.keys(nextErrors).length === 0,
      firstErrorStep: stepKeys[1].some(k => nextErrors[k]) ? 1
        : stepKeys[2].some(k => nextErrors[k]) ? 2
          : stepKeys[3].some(k => nextErrors[k]) ? 3 : 4,
    };
  };

  const toggleTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(tag)
        ? prev.lookingFor.filter(t => t !== tag)
        : [...prev.lookingFor, tag],
    }));
    setErrors(prev => ({ ...prev, lookingFor: undefined }));
  };

  const addCustomTag = () => {
    const t = customTag.trim();
    if (t && !form.lookingFor.includes(t)) {
      setForm(prev => ({ ...prev, lookingFor: [...prev.lookingFor, t] }));
      setErrors(prev => ({ ...prev, lookingFor: undefined }));
    }
    setCustomTag("");
  };

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { form?: Partial<FormData>; step?: number };
      if (parsed.form) {
        setForm({
          ...EMPTY,
          ...parsed.form,
          lookingFor: Array.isArray(parsed.form.lookingFor) ? parsed.form.lookingFor : [],
        });
        setStep(typeof parsed.step === "number" && parsed.step >= 1 && parsed.step <= STEPS.length ? parsed.step : 1);
        setDraftRestored(true);
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  useEffect(() => {
    if (submitted) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, step }));
  }, [form, step, submitted]);

  const canProceed = () => {
    if (step === 1) return stepKeys[1].every((key) => !validateField(key, form[key]));
    if (step === 2) return stepKeys[2].every((key) => !validateField(key, form[key]));
    if (step === 3) return stepKeys[3].every((key) => !validateField(key, form[key]));
    return stepKeys[4].every((key) => !validateField(key, form[key]));
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    const validation = validateAll();
    if (!validation.valid) {
      setStep(validation.firstErrorStep);
      setSubmitError("Please fix validation errors before submitting.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      description: [form.problem.trim(), form.solution.trim(), form.market.trim(), form.usp.trim()].filter(Boolean).join("\n\n"),
      stage: form.stage,
      sector: form.sector,
      equity: form.equity.trim() || "0",
      fundingGoal: form.fundingGoal.trim() || "0",
      traction: form.traction.trim(),
      teamSize: Number(form.teamSize),
      pitchDeckUrl: form.pitchDeck.trim() || null,
    };

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/venture", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as { error?: string; fieldErrors?: Record<string, string[]> } | null;
      if (!res.ok) {
        const serverErrors: Partial<Record<keyof FormData, string>> = {};
        if (data?.fieldErrors?.name?.[0]) serverErrors.name = data.fieldErrors.name[0];
        if (data?.fieldErrors?.tagline?.[0]) serverErrors.tagline = data.fieldErrors.tagline[0];
        if (data?.fieldErrors?.stage?.[0]) serverErrors.stage = data.fieldErrors.stage[0];
        if (data?.fieldErrors?.sector?.[0]) serverErrors.sector = data.fieldErrors.sector[0];
        if (data?.fieldErrors?.equity?.[0]) serverErrors.equity = data.fieldErrors.equity[0];
        if (data?.fieldErrors?.fundingGoal?.[0]) serverErrors.fundingGoal = data.fieldErrors.fundingGoal[0];
        if (data?.fieldErrors?.traction?.[0]) serverErrors.traction = data.fieldErrors.traction[0];
        if (data?.fieldErrors?.teamSize?.[0]) serverErrors.teamSize = data.fieldErrors.teamSize[0];
        if (data?.fieldErrors?.pitchDeckUrl?.[0]) serverErrors.pitchDeck = data.fieldErrors.pitchDeckUrl[0];

        if (Object.keys(serverErrors).length > 0) setErrors(prev => ({ ...prev, ...serverErrors }));
        throw new Error(data?.error || "Failed to submit venture. Please try again.");
      }

      localStorage.removeItem(DRAFT_KEY);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to submit venture.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="pt-24 min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--bg-base)" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-10 max-w-lg w-full text-center"
          >
            <div className="size-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "linear-gradient(135deg, rgba(91,108,255,0.15), rgba(79,209,197,0.1))", border: "2px solid rgba(91,108,255,0.3)" }}>
              <CheckCircle2 className="size-10" style={{ color: "var(--accent-indigo)" }} />
            </div>
            <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
              Your venture is live!
            </h1>
            <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--text-primary)" }}>{form.name}</strong> has been listed on the GSF Venture Marketplace.
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Experts will review your listing and may reach out to express interest. You&apos;ll receive notifications in your dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => router.push("/ventures")} className="btn-primary flex-1 justify-center text-sm py-2.5">
                <Rocket className="size-4" /> View marketplace
              </button>
              <button onClick={() => router.push("/dashboard")} className="btn-outline flex-1 justify-center text-sm py-2.5">
                Go to dashboard
              </button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen pb-20" style={{ backgroundColor: "var(--bg-base)" }}>
        <div className="section-container max-w-2xl mx-auto py-10">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="badge badge-blue mb-4">
              <Lightbulb className="size-3.5" /> List Your Venture
            </span>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
              Share your startup with{" "}
              <em className="not-italic text-gradient-primary">GSF experts</em>
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Fill in the details below and get matched with mentors, advisors, and investors who specialise in your sector.
            </p>
          </motion.div>
          {draftRestored && (
            <div className="mb-4 rounded-lg border px-4 py-3 text-sm"
              style={{ backgroundColor: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.35)", color: "#047857" }}>
              Draft restored from your previous session.
            </div>
          )}
          {submitError && (
            <div className="mb-4 rounded-lg border px-4 py-3 text-sm"
              style={{ backgroundColor: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.35)", color: "#B91C1C" }}>
              {submitError}
            </div>
          )}

          {/* Step indicator */}
          <div className="flex items-center mb-8">
            {STEPS.map((s, idx) => {
              const done    = step > s.id;
              const active  = step === s.id;
              const Icon    = s.icon;
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className="size-9 rounded-full flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: done ? "#10B981" : active ? "var(--accent-indigo)" : "var(--bg-surface-2)",
                        border: `2px solid ${done ? "#10B981" : active ? "var(--accent-indigo)" : "var(--border-default)"}`,
                        color: done || active ? "white" : "var(--text-muted)",
                      }}
                    >
                      {done ? <CheckCircle2 className="size-4" /> : <Icon className="size-4" />}
                    </div>
                    <span className="text-[10px] mt-1 font-medium hidden sm:block"
                      style={{ color: active ? "var(--accent-indigo)" : "var(--text-muted)" }}>
                      {s.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 rounded transition-all"
                      style={{ backgroundColor: step > s.id ? "#10B981" : "var(--border-default)" }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="card p-8"
            >
              {/* ── Step 1: Basic Info ── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold mb-0.5" style={{ color: "var(--text-primary)" }}>Basic Information</h2>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Tell us the fundamentals of your venture.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Venture Name *</label>
                    <input className="input" placeholder="e.g. EduLoop" value={form.name} onChange={e => set("name", e.target.value)} />
                    {errors.name && <p className="text-[11px] mt-1 text-red-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>One-line Tagline *</label>
                    <input className="input" placeholder="e.g. AI-powered peer learning for university students" value={form.tagline} onChange={e => set("tagline", e.target.value)} />
                    <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>{form.tagline.length}/120 characters</p>
                    {errors.tagline && <p className="text-[11px] mt-1 text-red-600">{errors.tagline}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Sector *</label>
                      <select className="input" value={form.sector} onChange={e => set("sector", e.target.value)}>
                        <option value="">Select sector</option>
                        {SECTORS.map(s => <option key={s}>{s}</option>)}
                      </select>
                      {errors.sector && <p className="text-[11px] mt-1 text-red-600">{errors.sector}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Stage *</label>
                      <select className="input" value={form.stage} onChange={e => set("stage", e.target.value)}>
                        <option value="">Select stage</option>
                        {STAGES.map(s => <option key={s}>{s}</option>)}
                      </select>
                      {errors.stage && <p className="text-[11px] mt-1 text-red-600">{errors.stage}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2: The Idea ── */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold mb-0.5" style={{ color: "var(--text-primary)" }}>Your Idea</h2>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Describe the problem, solution, and market.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Problem Statement *</label>
                    <textarea className="input min-h-[90px] resize-none" placeholder="What specific problem are you solving? Be concrete." value={form.problem} onChange={e => set("problem", e.target.value)} />
                    {errors.problem && <p className="text-[11px] mt-1 text-red-600">{errors.problem}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Your Solution *</label>
                    <textarea className="input min-h-[90px] resize-none" placeholder="How does your product/service solve it? What makes it different?" value={form.solution} onChange={e => set("solution", e.target.value)} />
                    {errors.solution && <p className="text-[11px] mt-1 text-red-600">{errors.solution}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Target Market *</label>
                    <input className="input" placeholder="e.g. University students in Tier-1 Indian cities, aged 18-24" value={form.market} onChange={e => set("market", e.target.value)} />
                    {errors.market && <p className="text-[11px] mt-1 text-red-600">{errors.market}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Unique Advantage (USP)</label>
                    <input className="input" placeholder="What's your unfair advantage or key differentiator?" value={form.usp} onChange={e => set("usp", e.target.value)} />
                    {errors.usp && <p className="text-[11px] mt-1 text-red-600">{errors.usp}</p>}
                  </div>
                </div>
              )}

              {/* ── Step 3: Traction & Resources ── */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold mb-0.5" style={{ color: "var(--text-primary)" }}>Traction & Resources</h2>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Share your current progress and what you&apos;re looking to raise.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Current Traction *</label>
                    <textarea className="input min-h-[80px] resize-none" placeholder="e.g. 200 sign-ups, 3 pilot schools, ₹50K MRR, MVP live..." value={form.traction} onChange={e => set("traction", e.target.value)} />
                    {errors.traction && <p className="text-[11px] mt-1 text-red-600">{errors.traction}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Team Size *</label>
                      <select className="input" value={form.teamSize} onChange={e => set("teamSize", e.target.value)}>
                        <option value="">Select</option>
                        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map(t => <option key={t}>{t}</option>)}
                      </select>
                      {errors.teamSize && <p className="text-[11px] mt-1 text-red-600">{errors.teamSize}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Equity Offered</label>
                      <input type="number" min="0" max="100" step="0.1" className="input" placeholder="e.g. 8" value={form.equity} onChange={e => set("equity", e.target.value)} />
                      {errors.equity && <p className="text-[11px] mt-1 text-red-600">{errors.equity}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Funding Goal</label>
                    <input type="number" min="0" step="1" className="input" placeholder="e.g. 50000" value={form.fundingGoal} onChange={e => set("fundingGoal", e.target.value)} />
                    {errors.fundingGoal && <p className="text-[11px] mt-1 text-red-600">{errors.fundingGoal}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Website (optional)</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: "var(--text-muted)" }} />
                      <input className="input pl-9" placeholder="https://yourventure.com" value={form.website} onChange={e => set("website", e.target.value)} />
                    </div>
                    {errors.website && <p className="text-[11px] mt-1 text-red-600">{errors.website}</p>}
                  </div>
                </div>
              )}

              {/* ── Step 4: Looking For ── */}
              {step === 4 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold mb-0.5" style={{ color: "var(--text-primary)" }}>What Are You Looking For?</h2>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Select the types of expert support you need. Select as many as apply.</p>
                  </div>
                  {errors.lookingFor && <p className="text-[11px] mt-1 text-red-600">{errors.lookingFor}</p>}

                  <div className="flex flex-wrap gap-2">
                    {EXPERT_TAGS.map(tag => (
                      <button key={tag} onClick={() => toggleTag(tag)}
                        className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${form.lookingFor.includes(tag) ? "text-white" : ""}`}
                        style={form.lookingFor.includes(tag)
                          ? { backgroundColor: "var(--accent-indigo)", borderColor: "var(--accent-indigo)", color: "white" }
                          : { backgroundColor: "var(--bg-surface-2)", borderColor: "var(--border-default)", color: "var(--text-secondary)" }
                        }>
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* Custom tag */}
                  <div className="flex gap-2">
                    <input className="input flex-1" placeholder="Add a custom need..." value={customTag} onChange={e => setCustomTag(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addCustomTag()} />
                    <button onClick={addCustomTag} className="btn-outline px-3 py-2">
                      <Plus className="size-4" />
                    </button>
                  </div>

                  {form.lookingFor.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Selected ({form.lookingFor.length}):</p>
                      <div className="flex flex-wrap gap-1.5">
                        {form.lookingFor.map(tag => (
                          <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full text-white"
                            style={{ backgroundColor: "var(--accent-indigo)" }}>
                            {tag}
                            <button onClick={() => toggleTag(tag)}><X className="size-3" /></button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t" style={{ borderTopColor: "var(--border-soft)" }}>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>LinkedIn URL (optional)</label>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: "var(--text-muted)" }} />
                      <input className="input pl-9" placeholder="https://linkedin.com/in/yourprofile" value={form.linkedin} onChange={e => set("linkedin", e.target.value)} />
                    </div>
                    {errors.linkedin && <p className="text-[11px] mt-1 text-red-600">{errors.linkedin}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Pitch Deck URL (optional)</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: "var(--text-muted)" }} />
                      <input className="input pl-9" placeholder="https://drive.google.com/your-deck" value={form.pitchDeck} onChange={e => set("pitchDeck", e.target.value)} />
                    </div>
                    {errors.pitchDeck && <p className="text-[11px] mt-1 text-red-600">{errors.pitchDeck}</p>}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className="btn-outline flex items-center gap-2 text-sm py-2 px-4"
              style={{ opacity: step === 1 ? 0.4 : 1 }}
            >
              <ChevronLeft className="size-4" /> Back
            </button>

            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Step {step} of {STEPS.length}</span>

            {step < STEPS.length ? (
              <button
                onClick={() => {
                  if (validateStep(step)) setStep(s => s + 1);
                }}
                disabled={!canProceed()}
                className="btn-primary flex items-center gap-2 text-sm py-2 px-5"
                style={{ opacity: canProceed() ? 1 : 0.5 }}
              >
                Next <ChevronRight className="size-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="btn-primary flex items-center gap-2 text-sm py-2 px-6"
                style={{ opacity: canProceed() && !isSubmitting ? 1 : 0.5 }}
              >
                <Rocket className="size-4" /> {isSubmitting ? "Submitting..." : "List Venture"} <ArrowRight className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
