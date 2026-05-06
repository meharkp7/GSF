"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Eye, EyeOff, Rocket, CheckCircle2, Star } from "lucide-react";
import { useSignUp } from "@clerk/nextjs/legacy";

function GoogleIcon() {
  return (
    <svg className="size-4 flex-shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

type Role = "founder" | "expert";

const STEPS = ["Account", "Your Details", "Interests"];
const SECTORS  = ["EdTech", "FinTech", "HealthTech", "AgriTech", "ClimaTech", "SaaS", "Consumer", "DeepTech", "Other"];
const DOMAINS  = ["HealthTech", "FinTech", "EdTech", "Product", "Growth", "Legal", "AgriTech", "ClimaTech", "SaaS", "DeepTech", "Fundraising", "Operations"];

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, isLoaded } = useSignUp();

  const [role, setRole]       = useState<Role>("founder");
  const [step, setStep]       = useState(0);
  const [showPw, setShowPw]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying]   = useState(false);
  const [error, setError]     = useState("");
  const [code, setCode]       = useState("");

  const [f, setF] = useState({
    firstName: "", lastName: "", email: "", password: "",
    university: "", ventureName: "", sector: "", stage: "Ideation",
    company: "", title: "", experience: "",
    specializations: [] as string[],
  });

  function field(key: keyof typeof f, value: string) {
    setF(prev => ({ ...prev, [key]: value }));
  }
  function toggleSpec(d: string) {
    setF(prev => ({
      ...prev,
      specializations: prev.specializations.includes(d)
        ? prev.specializations.filter(x => x !== d)
        : [...prev.specializations, d],
    }));
  }

  const isLast = step === STEPS.length - 1;
  const pct = (step / (STEPS.length - 1)) * 100;

  async function handleGoogleSignUp() {
    if (!isLoaded) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/onboarding",
      });
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(clerkErr?.errors?.[0]?.message ?? "Google sign-up failed.");
    }
  }

  async function createAccount() {
    if (!isLoaded) return;
    setSubmitting(true);
    setError("");
    try {
      await signUp.create({
        firstName: f.firstName,
        lastName: f.lastName,
        emailAddress: f.email,
        password: f.password,
      });
      // Send email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(clerkErr?.errors?.[0]?.message ?? "Could not create account.");
    } finally {
      setSubmitting(false);
    }
  }

  async function verifyEmail() {
    if (!isLoaded) return;
    setSubmitting(true);
    setError("");
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        // Account created — now go to onboarding to set role
        router.push("/onboarding");
      } else {
        setError("Verification could not complete. Please try again.");
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(clerkErr?.errors?.[0]?.message ?? "Invalid code.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleNext() {
    if (step === 0 && !verifying) {
      createAccount();
    } else if (isLast) {
      router.push("/onboarding");
    } else {
      setStep(s => s + 1);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center pt-6 pb-12 px-4" style={{ background: "linear-gradient(to bottom, var(--bg-base), var(--bg-canvas))" }}>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="size-14 rounded-2xl overflow-hidden border-2 mb-4" style={{ borderColor: "rgba(91,108,255,0.35)" }}>
            <Image src="/gsf-logo.jpeg" alt="GSF" width={56} height={56} className="object-cover w-full h-full" />
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>Join GSF</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Free for 30 days · No credit card needed</p>
        </div>

        {/* Step progress */}
        {!verifying && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${i <= step ? "text-white shadow-md" : "border"}`}
                    style={{
                      backgroundColor: i < step ? "#10B981" : i === step ? "var(--accent-indigo)" : "transparent",
                      borderColor: i > step ? "var(--border-default)" : "transparent",
                      color: i > step ? "var(--text-muted)" : "white",
                    }}>
                    {i < step ? <CheckCircle2 className="size-3.5" /> : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="h-px flex-1 mx-1 w-10 transition-all" style={{ backgroundColor: i < step ? "#10B981" : "var(--border-default)" }} />
                  )}
                </div>
              ))}
            </div>
            <div className="progress-bar" style={{ height: "3px" }}>
              <motion.div className="h-full rounded-full"
                style={{ background: "linear-gradient(to right, #5B6CFF, #4FD1C5)", width: `${pct}%` }}
                animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
            </div>
            <p className="text-xs mt-1.5 font-medium" style={{ color: "var(--accent-indigo)" }}>{STEPS[step]}</p>
          </div>
        )}

        <div className="card p-7">
          <AnimatePresence mode="wait">
            {verifying ? (
              /* Email Verification Step */
              <motion.div key="verify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-6">
                  <CheckCircle2 className="size-10 text-emerald-500 mx-auto mb-3" />
                  <h2 className="font-semibold text-base mb-1" style={{ color: "var(--text-primary)" }}>Check your email</h2>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    We sent a 6-digit code to <strong>{f.email}</strong>
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Verification Code</label>
                  <input
                    type="text"
                    className="input text-center text-2xl tracking-[0.4em] font-bold"
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
                {error && <p className="text-xs text-red-500 mt-2 p-2 rounded-lg" style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>{error}</p>}
                <button onClick={verifyEmail} disabled={submitting || code.length < 6} className="btn-primary w-full justify-center py-2.5 mt-4">
                  {submitting ? <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <><CheckCircle2 className="size-4" /> Verify Email</>}
                </button>
              </motion.div>
            ) : (
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

                {/* STEP 0: Account */}
                {step === 0 && (
                  <div className="space-y-4">
                    {/* Role picker */}
                    <div>
                      <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>I am joining as a</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(["founder", "expert"] as Role[]).map(r => (
                          <button key={r} onClick={() => setRole(r)}
                            className="flex flex-col items-center p-3 rounded-xl border transition-all"
                            style={role === r
                              ? { border: "2px solid var(--accent-indigo)", backgroundColor: "rgba(91,108,255,0.08)" }
                              : { border: "1px solid var(--border-default)", backgroundColor: "var(--bg-surface-2)" }}>
                            {r === "founder" ? <Rocket className="size-5 mb-1 text-[var(--accent-indigo)]" /> : <Star className="size-5 mb-1 text-amber-400" />}
                            <span className="text-xs font-semibold capitalize" style={{ color: "var(--text-primary)" }}>{r}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Google */}
                    <button onClick={handleGoogleSignUp}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all hover:shadow-md"
                      style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                      <GoogleIcon /> Continue with Google
                    </button>

                    <div className="relative my-1">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderTopColor: "var(--border-soft)" }} /></div>
                      <div className="relative flex justify-center"><span className="px-3 text-xs" style={{ backgroundColor: "var(--bg-card)", color: "var(--text-muted)" }}>or with email</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>First name</label>
                        <input className="input" value={f.firstName} onChange={e => field("firstName", e.target.value)} placeholder="Arjun" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Last name</label>
                        <input className="input" value={f.lastName} onChange={e => field("lastName", e.target.value)} placeholder="Sharma" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Email</label>
                      <input type="email" className="input" value={f.email} onChange={e => field("email", e.target.value)} placeholder={role === "founder" ? "you@university.edu" : "expert@company.com"} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Password</label>
                      <div className="relative">
                        <input type={showPw ? "text" : "password"} className="input pr-10" value={f.password} onChange={e => field("password", e.target.value)} placeholder="Min. 8 characters" />
                        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                          {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 1: Your Details */}
                {step === 1 && (
                  <div className="space-y-4">
                    {role === "founder" ? (
                      <>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>University / Institution</label>
                          <input className="input" value={f.university} onChange={e => field("university", e.target.value)} placeholder="IIT Delhi" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Startup / Venture name (optional)</label>
                          <input className="input" value={f.ventureName} onChange={e => field("ventureName", e.target.value)} placeholder="My Startup" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Sector</label>
                          <select className="input" value={f.sector} onChange={e => field("sector", e.target.value)}>
                            <option value="">Select sector…</option>
                            {SECTORS.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Current Title</label>
                          <input className="input" value={f.title} onChange={e => field("title", e.target.value)} placeholder="VC Partner / ex-Founder" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Company</label>
                          <input className="input" value={f.company} onChange={e => field("company", e.target.value)} placeholder="Sequoia Capital" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Years of experience</label>
                          <div className="grid grid-cols-2 gap-2">
                            {["0–5 years", "5–10 years", "10–15 years", "15+ years"].map(e => (
                              <button key={e} onClick={() => field("experience", e)}
                                className="py-2 px-3 rounded-xl text-xs font-medium border transition-all"
                                style={f.experience === e
                                  ? { backgroundColor: "rgba(91,108,255,0.12)", borderColor: "var(--accent-indigo)", color: "var(--accent-indigo)" }
                                  : { backgroundColor: "var(--bg-surface-2)", borderColor: "var(--border-default)", color: "var(--text-muted)" }}>
                                {e}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* STEP 2: Interests */}
                {step === 2 && (
                  <div className="space-y-4">
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {role === "founder" ? "What kind of help are you looking for?" : "Select your specializations"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {DOMAINS.map(d => (
                        <button key={d} onClick={() => toggleSpec(d)}
                          className="badge text-xs transition-all"
                          style={f.specializations.includes(d)
                            ? { backgroundColor: "rgba(91,108,255,0.15)", color: "var(--accent-indigo)", border: "1px solid rgba(91,108,255,0.4)" }
                            : { backgroundColor: "var(--bg-surface-2)", color: "var(--text-muted)", border: "1px solid var(--border-default)" }}>
                          {d}
                        </button>
                      ))}
                    </div>
                    <div className="p-4 rounded-2xl" style={{ backgroundColor: "rgba(91,108,255,0.06)", border: "1px solid rgba(91,108,255,0.15)" }}>
                      <p className="text-xs font-semibold mb-1 flex items-center gap-1.5" style={{ color: "var(--accent-indigo)" }}>
                        <CheckCircle2 className="size-3.5" /> Basic plan free for 30 days
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>600 credits included. No credit card required to start.</p>
                    </div>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

          {!verifying && (
            <>
              {error && (
                <p className="text-xs text-red-500 mt-3 p-2 rounded-lg" style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>{error}</p>
              )}
              <div className="flex gap-3 mt-6">
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)} className="btn-outline flex-1 py-2.5 justify-center">
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={submitting || !isLoaded}
                  className="btn-primary flex-1 py-2.5 justify-center"
                >
                  {submitting
                    ? <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    : isLast
                      ? <><Rocket className="size-3.5" /> Go to Dashboard</>
                      : step === 0
                        ? <><ArrowRight className="size-3.5" /> Create Account</>
                        : <><ArrowRight className="size-3.5" /> Continue</>
                  }
                </button>
              </div>

              {step === 0 && (
                <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>
                  Already have an account?{" "}
                  <Link href="/login" className="font-medium" style={{ color: "var(--accent-indigo)" }}>Sign in</Link>
                </p>
              )}
            </>
          )}
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>
          By signing up you agree to our{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link> and{" "}
          <Link href="/terms" className="underline">Terms</Link>.
        </p>
      </div>
    </main>
  );
}
