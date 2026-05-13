"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Send, ArrowRight } from "lucide-react";
import { showSuccess } from "@/utils/toast";

const FOOTER_LINKS = {
  Platform: [
    { label: "Connect",   href: "/connect" },
    { label: "Ventures",  href: "/ventures" },
    { label: "Experts",   href: "/experts" },
    { label: "Community", href: "/community" },
    { label: "Insights",  href: "/insights" },
  ],
  Company: [
    { label: "About",    href: "/about" },
    { label: "Careers",  href: "/careers" },
    { label: "Contact",  href: "/contact" },
    { label: "Login",    href: "/login" },
    { label: "Join Free",href: "/sign-up" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms",   href: "/terms" },
    { label: "Cookies", href: "/cookies" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      showSuccess("Thanks for joining GSF! Check your inbox soon. 🚀");
      setEmail("");
    }
  };

  return (
    <footer style={{ backgroundColor: "var(--bg-canvas)", borderTopColor: "var(--border-default)" }} className="border-t">
      <div className="section-container py-16 lg:py-20">
        
        {/* Newsletter / Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 pb-12 border-b" style={{ borderBottomColor: "var(--border-default)" }}>
          <div className="max-w-md">
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Stay in the loop
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Get weekly insights from top founders, cohort announcements, and exclusive expert additions delivered to your inbox.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative w-full sm:max-w-sm">
              <input
                type="email"
                placeholder="Enter your email"
                className="input w-full pr-12 bg-[var(--bg-surface)]"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[var(--accent-indigo)] hover:scale-110 transition-transform">
                <Send className="size-4" />
              </button>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] mt-2 sm:mt-0 max-w-[200px]">
              By subscribing, you agree to our <Link href="/privacy" className="underline hover:text-[var(--text-primary)]">Privacy Policy</Link>.
            </p>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="md:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3 w-fit group">
              <div className="logo-circle group-hover:shadow-[0_0_0_3px_rgba(91,108,255,0.2)] transition-all">
                <Image src="/gsf-logo.jpeg" alt="GSF" width={36} height={36} className="object-cover w-full h-full" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight block" style={{ color: "var(--text-primary)" }}>GSF</span>
                <span className="text-[10px] tracking-widest uppercase font-medium" style={{ color: "var(--text-muted)" }}>Global Society of Founders</span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--text-secondary)" }}>
              A global-first digital platform for student founders. Connect with world-class experts, list your venture, and build what matters.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(91,108,255,0.08)", border: "1px solid rgba(91,108,255,0.2)" }}>
              <span className="size-1.5 rounded-full" style={{ backgroundColor: "var(--accent-indigo)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--accent-indigo)" }}>Free for 30 days · No credit card</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://www.linkedin.com/company/global-society-of-founders"
                target="_blank" rel="noopener noreferrer" aria-label="GSF on LinkedIn"
                className="size-9 rounded-lg flex items-center justify-center transition-all hover:scale-110 border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-soft-sm"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="#0077B5">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-primary)" }}>
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-all hover:text-[var(--accent-indigo)] hover:translate-x-1 inline-flex items-center group/link"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {link.label}
                      <ArrowRight className="size-3 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all ml-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTopColor: "var(--border-default)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} Global Society of Founders. All rights reserved.
          </p>
          <p className="text-xs italic" style={{ color: "var(--text-muted)", fontFamily: "'Playfair Display', serif" }}>
            A Society for Founders — Not Talkers.
          </p>
        </div>
      </div>
    </footer>
  );
}

