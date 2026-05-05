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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-[#0E1420] to-[#111827]">

      <div className="section-container relative z-10 pt-28 pb-16">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl">

          <motion.div variants={item} className="mb-8">
            <span className="badge badge-blue text-xs">
              <span className="size-1.5 rounded-full bg-[#81A6C6]" />
              Basic plan free for first 30 days · No credit card required
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-5xl sm:text-6xl lg:text-7xl text-[#1A2332] dark:text-slate-100 leading-[1.1] mb-6 text-balance"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}
          >
            Where Students Meet{" "}
            <em className="not-italic text-gradient-primary">Venture Creators.</em>
          </motion.h1>

          <motion.p variants={item} className="text-lg sm:text-xl text-[#4A5668] dark:text-slate-300 leading-relaxed max-w-xl mb-10">
            Video call world-class experts, pitch your startup to investors, and build
            with a community that takes action — not just talks about it.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center gap-3 mb-14">
            <Link href="/sign-up" className="btn-primary text-base px-7 py-3.5">
              Get Started Free <ArrowRight className="size-4" />
            </Link>
            <Link href="/ventures" className="btn-outline text-base px-7 py-3.5">
              <Lightbulb className="size-4" /> Explore Ventures
            </Link>
          </motion.div>

          {/* Journey stage selector */}
          <motion.div variants={item}>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#8A95A3] dark:text-slate-400 mb-4">
              Where are you in your founder journey?
            </p>
            <div className="flex flex-wrap gap-2">
              {JOURNEY_STAGES.map((stage) => {
                const Icon = stage.icon;
                return (
                  <button
                    key={stage.label}
                    className="group flex items-center gap-2 px-3 py-2 rounded-xl border border-[#D2C4B4] dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#81A6C6] dark:hover:border-blue-400 hover:bg-[#EEF4F9] dark:hover:bg-slate-700 transition-all duration-150 cursor-pointer shadow-soft-sm dark:shadow-md"
                  >
                    <Icon className="size-3.5 text-[#81A6C6] dark:text-blue-400 group-hover:text-[#3D74A0] dark:group-hover:text-blue-300" />
                    <span className="text-xs font-semibold text-[#1A2332] dark:text-slate-100 group-hover:text-[#3D74A0] dark:group-hover:text-blue-300\">
                      {stage.shortLabel}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-[#8A95A3] dark:text-slate-400 mt-3">
              Select your stage — we personalise your GSF experience.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={item}
            className="flex items-center gap-8 pt-10 border-t border-[#D2C4B4] dark:border-slate-700 mt-12 flex-wrap"
          >
            {[
              { value: "500+", label: "Student founders" },
              { value: "40+", label: "Expert advisors" },
              { value: "₹0", label: "For first 30 days" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold text-[#1A2332] dark:text-slate-100" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {value}
                </div>
                <div className="text-xs text-[#8A95A3] dark:text-slate-400 mt-0.5 uppercase tracking-wide font-medium">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
