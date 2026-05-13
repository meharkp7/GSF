"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lightbulb, Search, BarChart2, Rocket, DollarSign, Building2, TrendingUp } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

const JOURNEY_STAGES = [
  { icon: Lightbulb, label: "Ideation", shortLabel: "Ideation" },
  { icon: Search, label: "Idea Screening", shortLabel: "Screening" },
  { icon: BarChart2, label: "Market Research", shortLabel: "Research" },
  { icon: Rocket, label: "MVP", shortLabel: "MVP" },
  { icon: DollarSign, label: "Investment & Funding", shortLabel: "Funding" },
  { icon: Building2, label: "Company Launch", shortLabel: "Launch" },
  { icon: TrendingUp, label: "Product-Market Fit", shortLabel: "PMF" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background transition-colors duration-300">
      {/* Dynamic background effect */}
      <div className="absolute inset-0 opacity-20 dark:opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--accent-indigo)] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--accent-teal)] blur-[120px]" />
      </div>

      <div className="section-container relative z-10 pt-28 pb-16">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl">

          <motion.div variants={item} className="mb-8">
            <span className="badge badge-blue text-xs">
              <span className="size-1.5 rounded-full bg-[var(--accent-indigo)]" />
              Basic plan free for first 30 days · No credit card required
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-5xl sm:text-6xl lg:text-7xl text-text-primary leading-[1.1] mb-6 text-balance"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}
          >
            Where Students Meet{" "}
            <em className="not-italic text-gradient-primary">Venture Creators.</em>
          </motion.h1>

          <motion.p variants={item} className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-xl mb-10">
            Video call world-class experts, pitch your startup to investors, and build
            with a community that takes action — not just talks about it.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center gap-3 mb-12 sm:mb-14 w-full sm:w-auto">
            <Link href="/sign-up" className="btn-primary text-base px-7 py-3.5 w-full sm:w-auto justify-center">
              Get Started Free <ArrowRight className="size-4" />
            </Link>
            <Link href="/ventures" className="btn-outline text-base px-7 py-3.5 w-full sm:w-auto justify-center">
              <Lightbulb className="size-4" /> Explore Ventures
            </Link>
          </motion.div>

          {/* Journey stage selector */}
          <motion.div variants={item}>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
              Where are you in your founder journey?
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {JOURNEY_STAGES.map((stage) => {
                const Icon = stage.icon;
                return (
                  <button
                    key={stage.label}
                    className="group flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-surface hover:border-[var(--accent-indigo)] hover:bg-surface-2 transition-all duration-150 cursor-pointer shadow-soft-sm"
                  >
                    <Icon className="size-3.5 text-[var(--accent-indigo)] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-text-primary group-hover:text-[var(--accent-indigo)] transition-colors">
                      {stage.shortLabel}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-text-muted mt-3">
              Select your stage — we personalise your GSF experience.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={item}
            className="flex items-center gap-8 pt-10 border-t border-border mt-12 flex-wrap"
          >
            {[
              { value: "500+", label: "Student founders" },
              { value: "40+", label: "Expert advisors" },
              { value: "₹0", label: "For first 30 days" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold text-text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {value}
                </div>
                <div className="text-xs text-text-muted mt-0.5 uppercase tracking-wide font-medium">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
