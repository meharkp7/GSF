import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Target, Users, Globe, Heart } from "lucide-react";

export const metadata = {
  title: "About — GSF | Global Society of Founders",
  description: "Learn about the mission, team, and story behind the Global Society of Founders.",
};

const TEAM = [
  {
    name: "Ayush Sharma",
    role: "Founder, GSF",
    bio: "Visionary behind the Global Society of Founders. Building the infrastructure to help every student founder get the right guidance, community, and opportunities — regardless of where they come from.",
    photo: "/team/ayush-sharma.png",
    linkedin: "https://www.linkedin.com/in/ayushh-sharmaa/",
    initials: "AS",
  },
  {
    name: "Tushar Goswami",
    role: "Co-Founder, GSF",
    bio: "Driven by the belief that the best founders are built through community and real-world mentorship. Leads platform strategy and the GSF expert network.",
    photo: "/team/tushar-goswami.png",
    linkedin: "https://www.linkedin.com/in/not-tushar/",
    initials: "TG",
  },
  {
    name: "Tanishk Bansal",
    role: "Co-Founder, GSF",
    bio: "Passionate about democratising access to startup knowledge. Shapes the GSF founder experience from onboarding to funding stage and beyond.",
    photo: "/team/tanishk-bansal.png",
    linkedin: "https://www.linkedin.com/in/tanishk-bansal-a07334381/",
    initials: "TB",
  },
];

// LinkedIn SVG icon
function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const VALUES = [
  { icon: Target, title: "Execution over ideas", description: "Ideas are abundant. We celebrate shipping, learning, and iterating — not planning and theorising." },
  { icon: Users, title: "Community as infrastructure", description: "The right network is more valuable than any class or textbook. We build deep community by design." },
  { icon: Globe, title: "Global, but local", description: "Great founders come from everywhere. We celebrate diverse contexts while building universal founder skills." },
  { icon: Heart, title: "Radical openness", description: "We share everything — playbooks, failures, connections. Hoarding knowledge has no place in our culture." },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#FDFAF7]">

        {/* Hero */}
        <section className="relative section-padding bg-soft-pattern overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid opacity-25" />
          <div className="section-container relative z-10 max-w-3xl">
            <span className="badge badge-blue mb-6"><span className="size-1.5 rounded-full bg-[#81A6C6]" /> Our story</span>
            <h1 className="text-5xl sm:text-6xl text-[#1A2332] tracking-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Every student deserves a fair shot{" "}
              <em className="not-italic text-gradient-primary">at building.</em>
            </h1>
            <p className="text-xl text-[#4A5668] leading-relaxed">
              GSF was born from a simple frustration: most startup education is too expensive, too theoretical, or too disconnected from the realities of building. We decided to fix that.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-white dark:bg-slate-900 border-y border-[#D2C4B4] dark:border-slate-700">
          <div className="section-container py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl text-[#1A2332] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Our mission</h2>
                <p className="text-[#4A5668] leading-relaxed mb-6">
                  The Global Society of Founders exists to democratise the founder journey. We are a global-first digital platform supporting student founders worldwide — regardless of geography, background, or access to networks.
                </p>
                <p className="text-[#4A5668] leading-relaxed">
                  Through video-based expert connect, a venture marketplace, and a global community, GSF gives students the tools, connections, and confidence to turn great ideas into funded, scalable ventures.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[{ value: "2026", label: "Founded" }, { value: "500+", label: "Students served" }, { value: "40+", label: "Expert mentors" }, { value: "30+", label: "Countries" }].map(({ value, label }) => (
                  <div key={label} className="card p-6 text-center card-hover">
                    <div className="text-3xl font-bold text-[#81A6C6] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{value}</div>
                    <div className="text-xs text-[#8A95A3] uppercase tracking-wide">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-container section-padding">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl text-[#1A2332] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>What we believe</h2>
            <p className="text-[#4A5668] max-w-xl mx-auto">Our values show up in how we run the platform, how we treat our community, and what we celebrate.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card p-8 card-hover">
                <div className="size-12 rounded-xl bg-[#EEF4F9] border border-[#AACDDC] flex items-center justify-center mb-5">
                  <Icon className="size-6 text-[#81A6C6]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1A2332] mb-3">{title}</h3>
                <p className="text-[#4A5668] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section id="team" className="bg-[#F7F2EC] border-t border-[#D2C4B4] section-padding">
          <div className="section-container">
            <div className="text-center mb-14">
              <h2 className="text-3xl text-[#1A2332] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Meet the team</h2>
              <p className="text-[#4A5668] max-w-lg mx-auto">
                Three founders. One mission — to make the founder journey accessible to every student on the planet.
              </p>
            </div>

            {/* 3-column grid, centred */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {TEAM.map((member) => (
                <div key={member.name} className="card p-7 text-center card-hover bg-white flex flex-col items-center">

                  {/* Photo */}
                  <div className="relative size-28 mb-5 flex-shrink-0">
                    <Image
                      src={member.photo}
                      alt={`${member.name} — ${member.role}`}
                      fill
                      className="object-cover rounded-full border-2 border-[#AACDDC] shadow-md"
                      sizes="112px"
                    />
                  </div>

                  {/* Name + role */}
                  <h3 className="font-bold text-[#1A2332] text-base mb-0.5">{member.name}</h3>
                  <p className="text-xs text-[#81A6C6] font-semibold uppercase tracking-wider mb-3">{member.role}</p>

                  {/* Bio */}
                  <p className="text-sm text-[#4A5668] leading-relaxed flex-1">{member.bio}</p>

                  {/* LinkedIn */}
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                    style={{
                      backgroundColor: "rgba(10,102,194,0.08)",
                      color: "#0A66C2",
                      border: "1px solid rgba(10,102,194,0.2)",
                    }}
                  >
                    <LinkedInIcon />
                    Connect on LinkedIn
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-container py-20 text-center">
          <h2 className="text-3xl text-[#1A2332] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Want to be part of this?</h2>
          <p className="text-[#4A5668] mb-8 max-w-lg mx-auto">Whether you&apos;re a student, expert, or investor — there&apos;s a place for you in the GSF ecosystem.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/sign-up" className="btn-primary px-7 py-3">Apply as a student <ArrowRight className="size-4" /></Link>
            <Link href="/contact" className="btn-outline px-7 py-3">Get in touch</Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

