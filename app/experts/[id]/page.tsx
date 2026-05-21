// app/experts/[id]/page.tsx
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { slugToExpert } from "@/lib/data/experts";
import {
  Star,
  MessageSquare,
  Video,
  Mail,
  ArrowLeft,
  Briefcase,
  Globe,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// NEW
export default async function ExpertProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const expert = slugToExpert(id);
  if (!expert) notFound();

  return (
    <>
      <Navbar />

      <main className="pt-24 min-h-screen bg-background">
        {/* Back button */}
        <div className="section-container pt-8 pb-0">
          <Link
            href="/experts"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors group"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Experts
          </Link>
        </div>

        {/* Profile Hero */}
        <section className="section-container py-10">
          <div className="max-w-4xl mx-auto">
            <div className="card p-8 bg-surface border-border flex flex-col sm:flex-row gap-6 items-start">
              {/* Avatar */}
              <div
                className="size-24 rounded-3xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${expert.avatarBg}, ${expert.avatarBg}99)`,
                }}
              >
                {expert.initials}
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1
                      className="text-3xl text-text-primary tracking-tight"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {expert.name}
                    </h1>
                    <p className="text-text-secondary mt-1">
                      {expert.role} &middot;{" "}
                      <span className="font-semibold text-accent-dark dark:text-blue-300">
                        {expert.company}
                      </span>
                    </p>
                  </div>

                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 ${
                      expert.available
                        ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/20"
                        : "bg-surface-2 text-text-muted border border-border"
                    }`}
                  >
                    {expert.available ? (
                      <CheckCircle2 className="size-3.5" />
                    ) : (
                      <XCircle className="size-3.5" />
                    )}
                    {expert.available ? "Available now" : "Away"}
                  </span>
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Star className="size-4 text-amber-400 fill-amber-400" />
                    <strong className="text-text-primary">{expert.rating}</strong> rating
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Video className="size-4" />
                    <strong className="text-text-primary">{expert.sessions}</strong> sessions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4" />
                    {expert.experience} experience
                  </span>
                  <span className="badge badge-blue">{expert.domain}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="section-container pb-24">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Bio + Tags */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Bio */}
              <div className="card p-6 bg-surface border-border">
                <h2
                  className="text-lg text-text-primary mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  About
                </h2>
                <p className="text-text-secondary leading-relaxed">{expert.bio}</p>
              </div>

              {/* Expertise tags */}
              <div className="card p-6 bg-surface border-border">
                <h2
                  className="text-lg text-text-primary mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Areas of Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {expert.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm text-text-secondary bg-surface-2 border border-border px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: CTA + Links */}
            <div className="flex flex-col gap-4">
              {/* Book CTA */}
              <div className="card p-6 bg-surface border-border flex flex-col gap-4">
                <h2
                  className="text-lg text-text-primary"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Book a Session
                </h2>
                <p className="text-sm text-text-secondary">
                  Connect directly with {expert.name.split(" ").slice(-1)[0]} for a
                  1-on-1 video call or chat session.
                </p>

                <Link
                  href="/connect"
                  className="btn-primary w-full justify-center flex items-center gap-2 py-3"
                >
                  <Video className="size-4" />
                  Book a Session
                </Link>

                <a
                  href={`mailto:${expert.email}`}
                  className="btn-secondary w-full justify-center flex items-center gap-2 py-2.5 text-sm"
                >
                  <Mail className="size-4" />
                  Send Email
                </a>

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors py-2"
                >
                  <MessageSquare className="size-4" />
                  Start a Chat
                </Link>
              </div>

              {/* Social links */}
              <div className="card p-6 bg-surface border-border flex flex-col gap-3">
                <h2
                  className="text-sm font-semibold text-text-primary"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Connect
                </h2>

                {expert.linkedin && (
                  <a
                    href={`https://${expert.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-[#0077B5] transition-colors"
                  >
                    <svg className="size-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn Profile
                  </a>
                )}

                {expert.website && (
                  <a
                    href={`https://${expert.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <Globe className="size-4 flex-shrink-0" />
                    {expert.website}
                  </a>
                )}

                <a
                  href={`mailto:${expert.email}`}
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  <Mail className="size-4 flex-shrink-0" />
                  {expert.email}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA bottom */}
        <section className="bg-canvas border-t border-border py-16">
          <div className="section-container text-center max-w-xl mx-auto">
            <div className="size-12 rounded-2xl bg-surface-2 dark:bg-slate-800 border border-border flex items-center justify-center mx-auto mb-5">
              <Briefcase className="size-6 text-accent-primary dark:text-blue-300" />
            </div>
            <h2
              className="text-2xl text-text-primary mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Not a GSF member yet?
            </h2>
            <p className="text-text-secondary mb-6">
              Join to get direct access to {expert.name.split(" ")[0]} and 20+
              other world-class experts.
            </p>
            <Link href="/sign-up" className="btn-primary px-8 py-3">
              Join GSF
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}