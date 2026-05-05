import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, Heart, Globe, Zap, Users, MapPin } from "lucide-react";

export const metadata = {
  title: "Careers — GSF | Join Our Team",
  description: "Help build the world's best platform for student founders.",
};

const PERKS = [
  { icon: Globe, title: "Fully remote", desc: "Work from anywhere. We care about outcomes, not offices." },
  { icon: Heart, title: "Meaningful work", desc: "Every day you're directly impacting the founders of tomorrow." },
  { icon: Zap, title: "Fast-paced growth", desc: "We're early. Your work will define the culture and product." },
  { icon: Users, title: "Smart team", desc: "Small, senior, and deeply mission-aligned team." },
];

const ROLES = [
  { title: "Full-Stack Engineer", team: "Engineering", location: "Remote · India", type: "Full-time", description: "Build and scale the GSF platform using Next.js, TypeScript, and modern cloud infrastructure." },
  { title: "Product Designer", team: "Design", location: "Remote · Anywhere", type: "Full-time", description: "Own GSF's visual identity and UX across the Connect, Ventures, and community platforms." },
  { title: "Community Manager", team: "Community", location: "Remote · India", type: "Full-time", description: "Build and run the GSF member experience — onboarding, events, Slack community, and retention." },
  { title: "Expert Partnerships", team: "Partnerships", location: "Remote · India", type: "Contract", description: "Source, onboard, and manage the GSF expert mentor network. Relationship-first role." },
];

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#FDFAF7]">
        {/* Hero */}
        <section className="relative section-padding bg-soft-pattern overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid opacity-25" />
          <div className="section-container relative z-10 text-center max-w-3xl mx-auto">
            <span className="badge badge-blue mb-6"><span className="size-1.5 rounded-full bg-[#81A6C6]" /> We're hiring</span>
            <h1 className="text-5xl sm:text-6xl text-[#1A2332] tracking-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Help build the platform<br />
              <em className="not-italic text-gradient-primary">founders deserve</em>
            </h1>
            <p className="text-xl text-[#4A5668] max-w-xl mx-auto">
              Join a small, mission-driven team working to democratise the founder journey for students worldwide.
            </p>
          </div>
        </section>

        {/* Perks */}
        <section className="bg-white dark:bg-slate-900 border-y border-[#D2C4B4] dark:border-slate-700">
          <div className="section-container py-14">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {PERKS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="text-center">
                  <div className="size-12 rounded-2xl bg-[#EEF4F9] border border-[#AACDDC] flex items-center justify-center mx-auto mb-4">
                    <Icon className="size-6 text-[#81A6C6]" />
                  </div>
                  <h3 className="font-semibold text-[#1A2332] mb-2 text-sm">{title}</h3>
                  <p className="text-xs text-[#4A5668] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open roles */}
        <section className="section-container section-padding">
          <h2 className="text-3xl text-[#1A2332] mb-10 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Open roles</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {ROLES.map((role) => (
              <div key={role.title} className="card p-6 card-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold text-[#1A2332]">{role.title}</h3>
                    <span className="badge badge-blue text-xs">{role.team}</span>
                    <span className="badge badge-warm text-xs">{role.type}</span>
                  </div>
                  <p className="text-sm text-[#4A5668] leading-relaxed mb-2">{role.description}</p>
                  <span className="flex items-center gap-1.5 text-xs text-[#8A95A3]">
                    <MapPin className="size-3" />{role.location}
                  </span>
                </div>
                <Link href="/contact" className="btn-primary text-sm px-5 py-2.5 shrink-0 whitespace-nowrap">
                  Apply now <ArrowRight className="size-3.5" />
                </Link>
              </div>
            ))}
          </div>

          {/* Generic CTA */}
          <div className="card card-warm p-8 text-center max-w-2xl mx-auto mt-10">
            <h3 className="text-xl text-[#1A2332] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Don't see your role?</h3>
            <p className="text-[#4A5668] mb-6">We're always open to meeting exceptional people. Send us a note and tell us how you'd contribute.</p>
            <Link href="/contact" className="btn-primary px-7 py-3">
              Get in touch <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
