"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PARTICLE_COUNT = 20;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const COLORS = ["#5B6CFF", "#4FD1C5", "#8499FF", "#A78BFA", "#60A5FA"];

export function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"logo" | "tagline" | "shrink" | "done">("logo");
  const [particles, setParticles] = useState<Particle[]>([]);
  const hasRun = useRef(false);

  useEffect(() => {
    // Generate particles
    setParticles(
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: randomBetween(10, 90),
        y: randomBetween(10, 90),
        size: randomBetween(3, 8),
        duration: randomBetween(2, 4),
        delay: randomBetween(0, 2),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }))
    );

    // Animation sequence
    const t1 = setTimeout(() => setPhase("tagline"), 700);
    const t2 = setTimeout(() => setPhase("shrink"), 1400);
    const t3 = setTimeout(() => {
      onComplete();
      setPhase("done");
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Floating particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                filter: "blur(1px)",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0],
                y: [0, -40, -80],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                repeatDelay: randomBetween(0.5, 2),
                ease: "easeOut",
              }}
            />
          ))}

          {/* Main logo block */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo ring animation */}
            <motion.div
              className="relative flex items-center justify-center mb-8"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: phase === "shrink" ? 0 : 1,
                scale: phase === "shrink" ? 0.3 : [0.5, 1.08, 1],
              }}
              transition={{
                duration: phase === "shrink" ? 0.4 : 0.7,
                ease: phase === "shrink" ? "easeIn" : [0.22, 1, 0.36, 1],
              }}
            >
              {/* Outer spinning ring */}
              <motion.div
                className="absolute rounded-full border border-[rgba(91,108,255,0.4)]"
                style={{ width: 140, height: 140 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
              />
              {/* Middle ring */}
              <motion.div
                className="absolute rounded-full border border-[rgba(79,209,197,0.3)]"
                style={{ width: 110, height: 110 }}
                animate={{ rotate: -360 }}
                transition={{ duration: 12, ease: "linear", repeat: Infinity }}
              />
              {/* Glow orb */}
              <motion.div
                className="absolute rounded-full"
                style={{ width: 90, height: 90, background: "rgba(91,108,255,0.14)" }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Logo text */}
              <motion.div
                className="relative z-10 flex items-center justify-center"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1A2235, #0F1420)",
                  border: "2px solid rgba(91,108,255,0.6)",
                  boxShadow: "0 0 40px rgba(91,108,255,0.5), inset 0 0 20px rgba(91,108,255,0.1)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(91,108,255,0.4)",
                    "0 0 50px rgba(91,108,255,0.8), 0 0 80px rgba(79,209,197,0.3)",
                    "0 0 20px rgba(91,108,255,0.4)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <span
                  className="text-2xl font-extrabold tracking-tight"
                  style={{
                    background: "linear-gradient(135deg, #ffffff, #8499FF, #4FD1C5)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  GSF
                </span>
              </motion.div>
            </motion.div>

            {/* Tagline */}
            <AnimatePresence>
              {(phase === "tagline" || phase === "shrink") && (
                <motion.div
                  key="tagline"
                  initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center"
                >
                  <p
                    className="text-xl font-light tracking-[0.15em] uppercase"
                    style={{ color: "rgba(229,231,235,0.9)" }}
                  >
                    A Society for Founders
                  </p>
                  <p
                    className="text-sm font-medium tracking-[0.25em] uppercase mt-1"
                    style={{ color: "rgba(91,108,255,0.8)" }}
                  >
                    — Not Talkers.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Skip hint */}
          <motion.button
            className="absolute bottom-8 right-8 text-xs tracking-widest uppercase cursor-pointer"
            style={{ color: "rgba(107,114,128,0.7)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={onComplete}
          >
            Skip →
          </motion.button>

          {/* Bottom progress line */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px]"
            style={{ background: "linear-gradient(to right, #5B6CFF, #4FD1C5)" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Wrapper that handles session-based skip logic
export function IntroAnimationWrapper({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Only show intro if hasn't been shown this session
    const seen = sessionStorage.getItem("gsf_intro_seen");
    if (!seen) {
      setShowIntro(true);
    } else {
      setReady(true);
    }
  }, []);

  function handleComplete() {
    sessionStorage.setItem("gsf_intro_seen", "1");
    setShowIntro(false);
    setReady(true);
  }

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleComplete} />}
      <AnimatePresence>
        {ready && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
