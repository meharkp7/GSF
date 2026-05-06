"use client";

import { motion } from "framer-motion";
import { MessageSquare, Lightbulb, Users, Eye, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";

export function CommunityPreviewSection() {
  return (
    <section className="section-padding bg-canvas">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">
            Community
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-semibold text-text-primary leading-tight tracking-tight">
            Build with people, not alone.
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            A focused, high-signal community of students building their founder story together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cohort progress preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0, duration: 0.5 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-border dark:border-slate-700 shadow-card dark:shadow-lg p-6 space-y-5"
          >
            <div className="flex items-center gap-2">
              <Users className="size-5 text-primary-500" />
              <h3 className="text-sm font-semibold text-text-primary">Cohort Progress</h3>
            </div>
            <div className="space-y-4">
              {[
                { name: "Arjun S.", progress: 85, module: "Module 5" },
                { name: "Priya M.", progress: 72, module: "Module 4" },
                { name: "Rishi K.", progress: 67, module: "Module 4" },
                { name: "Anika V.", progress: 54, module: "Module 3" },
              ].map(({ name, progress, module }) => (
                <div key={name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-primary-100 text-primary-600 text-xs font-semibold flex items-center justify-center">
                        {name[0]}
                      </div>
                      <span className="text-xs font-medium text-text-primary">{name}</span>
                    </div>
                    <span className="text-xs text-text-muted">{module}</span>
                  </div>
                  <Progress value={progress} size="sm" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Peer discussion preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="size-5 text-secondary-500" />
              <h3 className="text-sm font-semibold text-text-primary">Peer Discussions</h3>
              <Badge variant="secondary" size="sm">Live</Badge>
            </div>
            <div className="space-y-3">
              {[
                {
                  avatar: "A",
                  color: "bg-primary-100 text-primary-600",
                  name: "Arjun S.",
                  time: "2m ago",
                  message: "Did anyone else struggle with identifying non-customers? My interview today was eye-opening.",
                  icon: Eye,
                },
                {
                  avatar: "P",
                  color: "bg-secondary-100 text-secondary-600",
                  name: "Priya M.",
                  time: "5m ago",
                  message: "Yes! I found that talking to people who rejected the idea gave me 10x better insights than buyers.",
                  icon: null,
                },
                {
                  avatar: "R",
                  color: "bg-amber-100 text-amber-600",
                  name: "Rishi K.",
                  time: "8m ago",
                  message: "Sharing my customer persona template — feel free to copy. Validation doc linked below.",
                  icon: Link2,
                },
              ].map(({ avatar, color, name, time, message, icon: MsgIcon }) => (
                <div key={name} className="flex gap-2.5">
                  <div className={`size-7 rounded-full ${color} flex items-center justify-center text-xs font-semibold flex-shrink-0`}>
                    {avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-text-primary">{name}</span>
                      <span className="text-xs text-text-muted">{time}</span>
                      {MsgIcon && <MsgIcon className="size-3 text-text-muted ml-auto" />}
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed mt-0.5">{message}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Idea validation preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="size-5 text-amber-500" />
              <h3 className="text-sm font-semibold text-text-primary">Idea Validation</h3>
            </div>
            <div className="bg-canvas rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-primary">EdTech for Working Professionals</span>
                <Badge variant="warning" size="sm" dot>Validating</Badge>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Problem clarity", value: 90 },
                  { label: "Customer persona", value: 70 },
                  { label: "Validation done", value: 45 },
                ].map(({ label, value }) => (
                  <Progress key={label} label={label} value={value} size="sm" showValue />
                ))}
              </div>
            </div>
            <div className="bg-primary-50 rounded-xl p-3">
              <p className="text-xs font-medium text-primary-700 mb-1">Mentor Feedback</p>
              <p className="text-xs text-primary-600 leading-relaxed">
                &quot;Strong problem statement. Focus next on validating willingness to pay — your persona needs more specificity.&quot;
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {["12 interviews", "3 mentors", "78% score"].map((v) => (
                <div key={v} className="text-xs text-text-muted bg-canvas rounded-lg py-2">{v}</div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
