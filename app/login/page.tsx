"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Eye, EyeOff, CheckCircle2, Rocket, Star } from "lucide-react";
import { useSignIn } from "@clerk/nextjs/legacy";

/* Google icon */
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

type Tab = "founder" | "expert";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isLoaded } = useSignIn();

  const [tab, setTab]           = useState<Tab>("founder");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode]           = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        // Redirect to onboarding which will check role and route accordingly
        router.push("/onboarding");
      } else if (result.status === "needs_first_factor") {
        // Email link / OTP verification needed
        setVerifying(true);
      } else {
        setError("Sign in could not complete. Please try again.");
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(clerkError?.errors?.[0]?.message ?? "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });
      if (result.status === "complete") {
        router.push("/onboarding");
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(clerkError?.errors?.[0]?.message ?? "Invalid code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    if (!isLoaded) return;
    setGoogleLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/onboarding",
      });
    } catch {
      setGoogleLoading(false);
      setError("Google sign-in failed. Please try email instead.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center pt-6 pb-12 px-4"
      style={{ background: "linear-gradient(to bottom, var(--bg-base), var(--bg-canvas))" }}>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="size-14 rounded-2xl overflow-hidden border-2 mb-4" style={{ borderColor: "rgba(91,108,255,0.4)" }}>
            <Image src="/gsf-logo.jpeg" alt="GSF" width={56} height={56} className="object-cover w-full h-full" />
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
            Welcome back
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Sign in to your GSF account</p>
        </div>

        <div className="card p-8">
          {/* Role tabs */}
          <div className="flex p-1 rounded-xl mb-6" style={{ backgroundColor: "var(--bg-surface-2)", border: "1px solid var(--border-soft)" }}>
            {(["founder", "expert"] as Tab[]).map(t => (
              <button key={t} onClick={() => { setTab(t); setError(""); }}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize"
                style={tab === t
                  ? { backgroundColor: "var(--accent-indigo)", color: "white", boxShadow: "0 2px 8px rgba(91,108,255,0.35)" }
                  : { color: "var(--text-muted)" }}>
                <span className="flex items-center justify-center gap-1.5">
                  {t === "founder" ? <Rocket className="size-3.5" /> : <Star className="size-3.5" />}
                  {t === "founder" ? "Founder" : "Expert"}
                </span>
              </button>
            ))}
          </div>

          {verifying ? (
            /* Email code verification step */
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <p className="text-sm text-center" style={{ color: "var(--text-secondary)" }}>
                A verification code was sent to <strong>{email}</strong>
              </p>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Verification Code</label>
                <input
                  type="text"
                  className="input text-center text-lg tracking-widest"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              {error && (
                <p className="text-xs text-red-500 p-2 rounded-lg" style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>{error}</p>
              )}
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
                {loading ? <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <><CheckCircle2 className="size-4" /> Verify & Sign In</>}
              </button>
            </form>
          ) : (
            <>
              {/* Google Sign In */}
              <AnimatePresence>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border font-medium text-sm transition-all hover:shadow-md mb-4"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-default)",
                    color: "var(--text-primary)"
                  }}
                >
                  {googleLoading
                    ? <span className="size-4 rounded-full border-2 border-gray-300 border-t-[#4285F4] animate-spin" />
                    : <GoogleIcon />
                  }
                  Continue with Google
                </motion.button>
              </AnimatePresence>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderTopColor: "var(--border-soft)" }} />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 text-xs" style={{ backgroundColor: "var(--bg-card)", color: "var(--text-muted)" }}>or sign in with email</span>
                </div>
              </div>

              {/* Email form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Email</label>
                  <input type="email" className="input" value={email}
                    placeholder={tab === "founder" ? "you@email.com" : "expert@email.com"}
                    onChange={e => { setEmail(e.target.value); setError(""); }} required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Password</label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} className="input pr-10" value={password} placeholder="••••••••"
                      onChange={e => { setPassword(e.target.value); setError(""); }} required />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                      {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-500 p-2 rounded-lg"
                    style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    {error}
                  </motion.p>
                )}

                <button type="submit" disabled={loading || !isLoaded}
                  className="btn-primary w-full justify-center py-2.5 relative">
                  {loading
                    ? <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    : <><ArrowRight className="size-4" /> Sign in</>
                  }
                </button>
              </form>

              <p className="text-center text-xs mt-5" style={{ color: "var(--text-muted)" }}>
                No account?{" "}
                <Link href="/sign-up" className="font-medium" style={{ color: "var(--accent-indigo)" }}>
                  Create one free
                </Link>
              </p>
            </>
          )}
        </div>

        {/* Trial banner */}
        <div className="mt-4 flex items-center gap-2 justify-center text-xs" style={{ color: "var(--text-muted)" }}>
          <Rocket className="size-3" />
          <span>Basic plan free for 30 days · No credit card required</span>
        </div>
      </div>
    </main>
  );
}
