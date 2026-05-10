"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const EXPERTS = [
  {
    name: "Meera Patel",
    title: "Co-founder & CEO",
    company: "HealthBridge",
    domain: "HealthTech",
    rating: 4.9,
    sessions: 48,
    bio: "Ex-YC founder building AI diagnostics. Helped 30+ student founders with healthcare validation.",
    avatar: "M",
    color: "bg-rose-100 text-rose-600",
  },
  {
    name: "Vikram Nair",
    title: "Product Lead",
    company: "Razorpay",
    domain: "Fintech",
    rating: 4.8,
    sessions: 62,
    bio: "10 years in product. Expert at breaking down complex fintech ideas into testable hypotheses.",
    avatar: "V",
    color: "bg-primary-100 text-primary-600",
  },
  {
    name: "Sunita Rao",
    title: "Founder",
    company: "EduStack",
    domain: "EdTech",
    rating: 5.0,
    sessions: 35,
    bio: "Built EdTech from 0 to 50k users. Passionate about helping first-time founders avoid costly mistakes.",
    avatar: "S",
    color: "bg-secondary-100 text-secondary-600",
  },
];

export function ExpertNetworkSection() {
  return (
    <section className="section-padding bg-white dark:bg-slate-900">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">
              Expert Network
            </span>
            <h2 className="text-4xl sm:text-5xl font-semibold text-slate-900 dark:text-white leading-tight tracking-tight text-balance">
              Learn from people building real companies.
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              GSF connects students with domain experts who have actually done
              what they&apos;re teaching. Not theory — real patterns from real builders.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="size-4" />} asChild>
                <Link href="/experts">Browse experts</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/mentors/apply">Become a mentor</Link>
              </Button>
            </div>
            <div className="flex gap-6">
              {[
                { value: "40+", label: "Active mentors" },
                { value: "4.8★", label: "Avg. rating" },
                { value: "500+", label: "Sessions done" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-xl font-semibold text-slate-900 dark:text-white">{value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Expert cards */}
          <div className="space-y-4">
            {EXPERTS.map((expert, i) => (
              <motion.div
                key={expert.name}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-border shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
              >
                <div
                  className={`size-12 rounded-xl ${expert.color} flex items-center justify-center text-lg font-bold flex-shrink-0`}
                >
                  {expert.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{expert.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{expert.title} · {expert.company}</p>
                    </div>
                    <Badge variant="gray" size="sm">{expert.domain}</Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">{expert.bio}</p>
                  <div className="flex items-center gap-3 mt-2.5">
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                      <Star className="size-3 fill-current" />
                      <span className="font-medium">{expert.rating}</span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{expert.sessions} sessions</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
