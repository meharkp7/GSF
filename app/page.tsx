import { HeroSection } from "@/components/landing/HeroSection";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { IntroAnimationWrapper } from "@/components/landing/IntroAnimation";
import Link from "next/link";
import { Video, Lightbulb, Users, ArrowRight, Shield, Star, Crown } from "lucide-react";

export default function HomePage() {
  return (
    <IntroAnimationWrapper>
      <Navbar />
      <main>
        <HeroSection />

        {/* Two core platforms */}
        <section className="bg-white dark:bg-slate-900 border-y border-[#D2C4B4] dark:border-slate-700 py-20">
          <div className="section-container">
            <div className="text-center mb-14">
              <h2 className="text-4xl sm:text-5xl text-[#1A2332] dark:text-slate-100 mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Two platforms. One mission.
              </h2>
              <p className="text-[#4A5668] dark:text-slate-300 text-lg max-w-xl mx-auto">
                Connect with experts who&apos;ve done it. Fund the ideas that will shape tomorrow.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Connect */}
              <div className="card p-8 card-hover group">
                <div className="size-14 rounded-2xl bg-[#EEF4F9] flex items-center justify-center mb-6 border border-[#AACDDC]">
                  <Video className="size-7 text-[#81A6C6]" />
                </div>
                <h3 className="text-2xl text-[#1A2332] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  GSF Connect
                </h3>
                <p className="text-[#4A5668] leading-relaxed mb-6">
                  Book 1-on-1 video calls with world-class startup experts. Continue the conversation via direct chat. Like Zoom — built exclusively for ambitious student founders.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {["Live Video Calls", "Expert Chat", "Calendar Booking", "Session Notes"].map((f) => (
                    <span key={f} className="badge badge-blue">{f}</span>
                  ))}
                </div>
                <Link href="/connect" className="btn-primary text-sm px-6 py-2.5">
                  Find an Expert <ArrowRight className="size-4" />
                </Link>
              </div>

              {/* Ventures */}
              <div className="card p-8 card-hover" style={{ borderColor: '#D2C4B4' }}>
                <div className="size-14 rounded-2xl bg-[#F3E3D0] flex items-center justify-center mb-6 border border-[#D2C4B4]">
                  <Lightbulb className="size-7 text-[#5B4A3A]" />
                </div>
                <h3 className="text-2xl text-[#1A2332] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  GSF Ventures
                </h3>
                <p className="text-[#4A5668] leading-relaxed mb-6">
                  Students list startup ideas with equity terms. Venture creators and investors fund them directly. GSF earns a transparent 1–2% fee on successful deals — nothing more.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {["Equity Deals", "Investor Network", "1–2% Fee Only", "Escrow Protected"].map((f) => (
                    <span key={f} className="badge badge-warm">{f}</span>
                  ))}
                </div>
                <Link href="/ventures"
                  className="inline-flex items-center gap-2 bg-[#D2C4B4] text-[#1A2332] font-semibold px-6 py-2.5 rounded-xl hover:bg-[#AACDDC] transition-all text-sm shadow-soft-sm">
                  Browse Ventures <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Subscription plans */}
        <section className="section-container section-padding">
          <div className="text-center mb-14">
            <span className="badge badge-blue mb-4">
              Transparent pricing
            </span>
            <h2 className="text-4xl font-bold text-[#1A2332] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Choose your plan
            </h2>
            <p className="text-[#4A5668] max-w-xl mx-auto">
              Start with Basic free for your first 30 days. Upgrade anytime to unlock senior experts and exclusive GSF access.
            </p>
          </div>

          {/* 3–plan grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "Basic",
                price: "₹499",
                period: "/month",
                freeBadge: true,
                credits: "600 credits / month",
                experienceRange: "0–10 yrs experience experts",
                icon: Shield,
                iconColor: "text-[#81A6C6]",
                iconBg: "bg-[#EEF4F9] border-[#AACDDC]",
                features: [
                  "600 credits / month",
                  "Connect with experts: 0–10 yrs experience",
                  "Venture marketplace access",
                  "Community & peer circles",
                ],
                highlight: false,
                cta: "Start free — 30 days",
                ctaHref: "/sign-up",
              },
              {
                name: "Standard",
                price: "₹999",
                period: "/month",
                freeBadge: false,
                credits: "1,500 credits / month",
                experienceRange: "10–15 yrs experience experts",
                icon: Star,
                iconColor: "text-[#3D74A0]",
                iconBg: "bg-[#DCEEF8] border-[#81A6C6]",
                features: [
                  "1,500 credits / month",
                  "Connect with experts: 10–15 yrs experience",
                  "Priority booking slots",
                  "All Basic features",
                ],
                highlight: true,
                cta: "Choose Standard",
                ctaHref: "/sign-up",
              },
              {
                name: "Premium",
                price: "₹1,499",
                period: "/month",
                freeBadge: false,
                credits: "2,000 credits / month",
                experienceRange: "15+ yrs · GSF exclusive experts",
                icon: Crown,
                iconColor: "text-[#5B4A3A]",
                iconBg: "bg-[#F3E3D0] border-[#D2C4B4]",
                features: [
                  "2,000 credits / month",
                  "Exclusive GSF experts: 15+ yrs experience",
                  "Investor introductions",
                  "All Standard features",
                ],
                highlight: false,
                cta: "Choose Premium",
                ctaHref: "/sign-up",
              },
            ].map((plan) => {
              const PlanIcon = plan.icon;
              return (
                <div
                  key={plan.name}
                  className={`card p-6 flex flex-col card-hover ${
                    plan.highlight
                      ? "border-[#81A6C6] shadow-[0_4px_24px_rgba(129,166,198,0.22)] relative"
                      : ""
                  }`}
                >
                  {plan.highlight && (
                    <span className="badge badge-blue text-xs mb-3 w-fit">Most Popular</span>
                  )}
                  {plan.freeBadge && (
                    <span className="badge badge-warm text-xs mb-3 w-fit">Free first 30 days</span>
                  )}

                  {/* Icon */}
                  <div className={`size-12 rounded-xl flex items-center justify-center mb-4 border ${plan.iconBg}`}>
                    <PlanIcon className={`size-6 ${plan.iconColor}`} />
                  </div>

                  <div className="font-bold text-lg text-[#1A2332] mb-1">{plan.name}</div>
                  <div className="mb-1">
                    <span
                      className="text-3xl font-bold"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        background: "linear-gradient(90deg, #5B8CFF, #22D3EE)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {plan.price}
                    </span>
                    <span className="text-xs text-[#8A95A3] ml-1">{plan.period}</span>
                  </div>
                  <div className="text-xs font-medium text-[#81A6C6] mb-1">{plan.credits}</div>

                  {/* Experience range badge */}
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#4A5668] bg-[#F3E3D0] border border-[#D2C4B4] rounded-lg px-2 py-1 mb-5 w-fit">
                    {plan.experienceRange}
                  </div>

                  <ul className="space-y-2.5 flex-1 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-[#4A5668]">
                        <span className="size-1.5 rounded-full bg-[#81A6C6] shrink-0 mt-1" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.ctaHref}
                    className={plan.highlight ? "btn-primary justify-center text-sm" : "btn-outline justify-center text-sm"}
                  >
                    {plan.cta}
                  </Link>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-[#8A95A3] mt-8">
            All plans include auto-pay. Cancel anytime. No hidden fees.
          </p>
        </section>

        {/* Expert teaser */}
        <section className="bg-[#F7F2EC] border-t border-[#D2C4B4] section-padding">
          <div className="section-container">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-lg">
                <h2 className="text-4xl text-[#1A2332] mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  40+ experts.<br />
                  <span className="text-gradient-primary">Zero gatekeepers.</span>
                </h2>
                <p className="text-[#4A5668] leading-relaxed mb-6">
                  VCs, exited founders, product leaders, legal advisors — every GSF expert is vetted, accessible, and ready to give you the real talk that books never will.
                </p>
                <Link href="/experts" className="btn-primary px-7 py-3">
                  <Users className="size-4" />
                  Meet the Experts
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                {[
                  { initials: "AP", name: "Anika P.", role: "VC Partner", bg: "#EEF4F9", text: "#3D74A0" },
                  { initials: "JW", name: "James W.", role: "Founder", bg: "#F3E3D0", text: "#5B4A3A" },
                  { initials: "SM", name: "Sara M.", role: "Product", bg: "#EEF4F9", text: "#3D74A0" },
                  { initials: "YT", name: "Yuki T.", role: "Growth", bg: "#F3E3D0", text: "#5B4A3A" },
                  { initials: "RD", name: "Raj D.", role: "Legal", bg: "#EEF4F9", text: "#3D74A0" },
                  { initials: "FA", name: "Fatima A.", role: "Impact", bg: "#F3E3D0", text: "#5B4A3A" },
                ].map((e) => (
                  <div key={e.initials} className="card p-3 text-center card-hover">
                    <div className="size-10 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold border border-[#D2C4B4]"
                      style={{ background: e.bg, color: e.text }}>
                      {e.initials}
                    </div>
                    <div className="text-xs font-semibold text-[#1A2332] truncate">{e.name}</div>
                    <div className="text-[10px] text-[#8A95A3]">{e.role}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section-container py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-5xl text-[#1A2332] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              A Society for Founders.
            </h2>
            <p className="text-xl text-[#81A6C6] font-medium italic mb-8"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Not Talkers.
            </p>
            <p className="text-[#4A5668] mb-10">
              Basic plan free for 30 days. No credit card. Start building today.
            </p>
            <Link href="/sign-up" className="btn-primary text-base px-10 py-4 mx-auto">
              Join GSF Free <ArrowRight className="size-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </IntroAnimationWrapper>
  );
}
