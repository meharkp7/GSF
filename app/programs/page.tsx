import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, Video, Lightbulb, Users } from "lucide-react";

export const metadata = {
  title: "Programs — GSF | Global Society of Founders",
  description: "Explore the GSF platform — Connect, Ventures, and Expert Network.",
};

export default function ProgramsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#FDFAF7]">
        <section className="relative section-padding bg-soft-pattern overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid opacity-25" />
          <div className="section-container relative z-10 text-center max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl text-[#1A2332] dark:text-slate-100 tracking-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              The GSF <em className="not-italic text-gradient-primary">Platform</em>
            </h1>
            <p className="text-xl text-[#4A5668] mb-12">
              GSF isn't a traditional program — it's a live platform connecting students, experts, and investors. Here's what you get access to on day one.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
              {[
                { icon: Video, href: "/connect", label: "Connect", tagline: "1-on-1 video calls with experts", desc: "Book live sessions with mentors, VCs, and founders. Continue via built-in chat.", color: "bg-[#EEF4F9] border-[#AACDDC]", iconColor: "text-[#81A6C6]", badgeClass: "badge-blue" },
                { icon: Lightbulb, href: "/ventures", label: "Ventures", tagline: "Startup idea marketplace", desc: "List your idea with equity terms and attract investors. GSF takes 1–2% on deals.", color: "bg-[#F3E3D0] border-[#D2C4B4]", iconColor: "text-[#5B4A3A]", badgeClass: "badge-warm" },
                { icon: Users, href: "/experts", label: "Experts", tagline: "40+ world-class experts", desc: "Domain experts across fundraising, product, growth, legal, and impact — ready for your call.", color: "bg-[#EEF4F9] border-[#AACDDC]", iconColor: "text-[#81A6C6]", badgeClass: "badge-blue" },
              ].map(({ icon: Icon, href, label, tagline, desc, color, iconColor, badgeClass }) => (
                <div key={label} className="card p-6 card-hover flex flex-col">
                  <div className={`size-12 rounded-2xl flex items-center justify-center mb-5 border ${color}`}>
                    <Icon className={`size-6 ${iconColor}`} />
                  </div>
                  <span className={`badge w-fit mb-3 ${badgeClass}`}>{label}</span>
                  <h2 className="text-lg font-semibold text-[#1A2332] dark:text-slate-100 mb-2">{tagline}</h2>
                  <p className="text-sm text-[#4A5668] leading-relaxed flex-1 mb-6">{desc}</p>
                  <Link href={href} className="btn-outline text-sm py-2 justify-center">
                    Explore <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-container py-20 text-center">
          <h2 className="text-3xl text-[#1A2332] dark:text-slate-100 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to start?
          </h2>
          <p className="text-[#4A5668] mb-8 max-w-lg mx-auto">Access the full GSF platform free for 30 days. No credit card required.</p>
          <Link href="/sign-up" className="btn-primary px-8 py-3.5 text-base mx-auto">
            Join free <ArrowRight className="size-4" />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
