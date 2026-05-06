"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useVenture } from "@/lib/hooks/useVenture";
import { Lightbulb, Edit3, TrendingUp, Users, DollarSign, Save, Plus, Trash2 } from "lucide-react";
import { venturePayloadSchema, type VentureFieldErrors } from "@/lib/validators/venture";

const STAGES  = ["Ideation", "Screening", "Research", "MVP", "Funding", "Launch", "PMF"];
const SECTORS = ["EdTech", "FinTech", "HealthTech", "AgriTech", "ClimaTech", "SaaS", "Consumer", "DeepTech", "Other"];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

interface FormState {
  name: string; tagline: string; description: string; stage: string;
  sector: string; equity: string; fundingGoal: string; traction: string;
  teamSize: string; pitchDeckUrl: string;
}

export default function MyVenturePage() {
  const { venture, loading, saving, updateVenture, fieldErrors, setFieldErrors } = useVenture();
  const [editing, setEditing] = useState(false);
  const [saved,   setSaved]   = useState(false);

  const [form, setForm] = useState<FormState>({
    name: "", tagline: "", description: "", stage: "Ideation",
    sector: "EdTech", equity: "0", fundingGoal: "0",
    traction: "", teamSize: "1", pitchDeckUrl: "",
  });

  // Sync when venture data loads
  useEffect(() => {
    if (venture) {
      setForm({
        name:        venture.name ?? "",
        tagline:     venture.tagline ?? "",
        description: venture.description ?? "",
        stage:       venture.stage ?? "Ideation",
        sector:      venture.sector ?? "EdTech",
        equity:      venture.equity ?? "0",
        fundingGoal: venture.fundingGoal ?? "0",
        traction:    venture.traction ?? "",
        teamSize:    String(venture.teamSize ?? 1),
        pitchDeckUrl: venture.pitchDeckUrl ?? "",
      });
    }
  }, [venture]);

  async function handleSave() {
    const payload = {
      name:        form.name,
      tagline:     form.tagline,
      description: form.description,
      stage:       form.stage,
      sector:      form.sector,
      equity:      form.equity,
      fundingGoal: form.fundingGoal,
      traction:    form.traction,
      teamSize:    parseInt(form.teamSize) || 1,
      pitchDeckUrl: form.pitchDeckUrl || null,
    };

    const parsed = venturePayloadSchema.safeParse(payload);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors as VentureFieldErrors);
      return;
    }

    setFieldErrors({});
    const ok = await updateVenture(parsed.data);
    if (ok) {
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  function getFieldError(name: keyof VentureFieldErrors) {
    return fieldErrors[name]?.[0];
  }

  function handleFieldChange(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key as keyof VentureFieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  const stageIndex  = STAGES.indexOf(form.stage);
  const stageColors = ["#8B5CF6","#3B82F6","#06B6D4","#10B981","#F59E0B","#EF4444","#5B6CFF"];

  if (loading) {
    return (
      <DashboardShell role="founder">
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 w-48 rounded-xl" style={{ backgroundColor: "var(--bg-surface-2)" }} />
          <div className="card p-6 h-24" />
          <div className="grid grid-cols-2 gap-6">
            <div className="card p-6 h-64" />
            <div className="card p-6 h-64" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="founder">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div {...fadeUp(0)} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
              My Venture
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {venture ? "Manage your startup profile, terms, and traction data." : "Set up your venture to get started."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="text-sm text-emerald-500 font-medium">
                ✓ Saved
              </motion.span>
            )}
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="btn-outline text-sm py-2 px-4">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-5 flex items-center gap-1.5">
                  <Save className="size-3.5" /> {saving ? "Saving…" : "Save Changes"}
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="btn-primary text-sm py-2 px-5 flex items-center gap-1.5">
                <Edit3 className="size-3.5" /> {venture ? "Edit Venture" : "Create Venture"}
              </button>
            )}
          </div>
        </motion.div>

        {/* Stage progress */}
        <motion.div {...fadeUp(0.05)} className="card p-6">
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Current Stage</h2>
          <div className="flex items-center gap-0 overflow-x-auto pb-2 scrollbar-hide">
            {STAGES.map((s, i) => {
              const isPast    = i < stageIndex;
              const isCurrent = i === stageIndex;
              return (
                <div key={s} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5 min-w-[70px]">
                    <button
                      onClick={() => editing && setForm({ ...form, stage: s })}
                      className={`size-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${editing ? "cursor-pointer hover:scale-110" : ""}`}
                      style={{
                        backgroundColor: isPast ? "#10B981" : isCurrent ? stageColors[i] : "var(--bg-surface-2)",
                        borderColor:     isPast ? "#10B981" : isCurrent ? stageColors[i] : "var(--border-default)",
                        color:           isPast || isCurrent ? "white" : "var(--text-muted)",
                        boxShadow:       isCurrent ? `0 0 16px ${stageColors[i]}60` : "none",
                      }}>
                      {isPast ? "✓" : i + 1}
                    </button>
                    <span className="text-[10px] font-medium text-center leading-tight" style={{ color: isCurrent ? stageColors[i] : "var(--text-muted)" }}>
                      {s}
                    </span>
                  </div>
                  {i < STAGES.length - 1 && (
                    <div className="h-[2px] min-w-[16px] flex-1 mx-1 mt-[-12px]"
                      style={{ backgroundColor: isPast ? "#10B981" : "var(--border-default)" }} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Main form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Identity */}
          <motion.div {...fadeUp(0.1)} className="card p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(91,108,255,0.1)" }}>
                <Lightbulb className="size-4" style={{ color: "var(--accent-indigo)" }} />
              </div>
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Venture Identity</h2>
            </div>
            {[
              { label: "Venture Name", key: "name",    type: "text" },
              { label: "Tagline",      key: "tagline", type: "text" },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>{label}</label>
                {editing ? (
                  <input
                    type={type}
                    className="input"
                    value={(form as unknown as Record<string, string>)[key]}
                    onChange={e => handleFieldChange(key as keyof FormState, e.target.value)}
                  />
                ) : (
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {(form as unknown as Record<string, string>)[key] || <span style={{ color: "var(--text-muted)" }}>Not set</span>}
                  </p>
                )}
              </div>
            ))}
            {getFieldError("name") && (
              <p className="text-xs text-red-500">{getFieldError("name")}</p>
            )}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Description</label>
              {editing ? (
                <textarea className="input textarea" value={form.description}
                  onChange={e => handleFieldChange("description", e.target.value)} />
              ) : (
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{form.description || "—"}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Sector</label>
                {editing ? (
                  <select className="input" value={form.sector} onChange={e => handleFieldChange("sector", e.target.value)}>
                    {SECTORS.map(s => <option key={s}>{s}</option>)}
                  </select>
                ) : (
                  <span className="badge badge-blue text-xs">{form.sector}</span>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Team Size</label>
                {editing ? (
                  <input type="number" className="input" value={form.teamSize}
                    onChange={e => handleFieldChange("teamSize", e.target.value)} />
                ) : (
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{form.teamSize} founders</p>
                )}
                {editing && getFieldError("teamSize") && (
                  <p className="text-xs text-red-500 mt-1">{getFieldError("teamSize")}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Deal Terms */}
          <motion.div {...fadeUp(0.15)} className="card p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(245,158,11,0.1)" }}>
                <DollarSign className="size-4 text-amber-500" />
              </div>
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Deal Terms</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Equity Offered (%)</label>
                {editing ? (
                  <input type="number" className="input" value={form.equity}
                    onChange={e => handleFieldChange("equity", e.target.value)} />
                ) : (
                  <p className="text-3xl font-extrabold" style={{ color: "var(--accent-indigo)", fontFamily: "'Playfair Display', serif" }}>
                    {form.equity}%
                  </p>
                )}
                {editing && getFieldError("equity") && (
                  <p className="text-xs text-red-500 mt-1">{getFieldError("equity")}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Funding Goal (USD)</label>
                {editing ? (
                  <input type="number" className="input" value={form.fundingGoal}
                    onChange={e => handleFieldChange("fundingGoal", e.target.value)} />
                ) : (
                  <p className="text-3xl font-extrabold" style={{ color: "#10B981", fontFamily: "'Playfair Display', serif" }}>
                    ${Number(form.fundingGoal).toLocaleString()}
                  </p>
                )}
                {editing && getFieldError("fundingGoal") && (
                  <p className="text-xs text-red-500 mt-1">{getFieldError("fundingGoal")}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Traction / Milestones</label>
              {editing ? (
                <textarea className="input" style={{ minHeight: 80 }} value={form.traction}
                  onChange={e => handleFieldChange("traction", e.target.value)} />
              ) : (
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{form.traction || "—"}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Pitch Deck URL (optional)</label>
              {editing ? (
                <input type="url" className="input" placeholder="https://your-deck.com" value={form.pitchDeckUrl}
                  onChange={e => handleFieldChange("pitchDeckUrl", e.target.value)} />
              ) : (
                <p className="text-sm" style={{ color: form.pitchDeckUrl ? "var(--accent-indigo)" : "var(--text-muted)" }}>
                  {form.pitchDeckUrl || "Not added yet"}
                </p>
              )}
              {editing && getFieldError("pitchDeckUrl") && (
                <p className="text-xs text-red-500 mt-1">{getFieldError("pitchDeckUrl")}</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Traction metrics — static for now, editable in future */}
        <motion.div {...fadeUp(0.2)} className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(16,185,129,0.1)" }}>
                <TrendingUp className="size-4 text-emerald-500" />
              </div>
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Traction Summary</h2>
            </div>
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{form.traction || "Add your traction details above to appear here."}</p>
        </motion.div>

        {/* Team */}
        <motion.div {...fadeUp(0.25)} className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(91,108,255,0.1)" }}>
                <Users className="size-4" style={{ color: "var(--accent-indigo)" }} />
              </div>
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Team</h2>
            </div>
            {editing && (
              <button className="text-xs flex items-center gap-1" style={{ color: "var(--accent-indigo)" }}>
                <Plus className="size-3" /> Add member
              </button>
            )}
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Team size: <strong style={{ color: "var(--text-primary)" }}>{form.teamSize}</strong> co-founder{Number(form.teamSize) !== 1 ? "s" : ""}
          </p>
        </motion.div>
      </div>
    </DashboardShell>
  );
}
