import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, Users, Lightbulb } from "lucide-react";

export const metadata = {
  title: "Apply — GSF | Global Society of Founders",
  description: "Apply to join the GSF community. Free for your first 30 days.",
};

const PERKS = [
  { icon: CheckCircle, text: "Full platform access — Connect + Ventures" },
  { icon: Users, text: "Access to 40+ expert advisors" },
  { icon: Lightbulb, text: "List your startup idea on the Venture marketplace" },
  { icon: Clock, text: "Free for 30 days, no credit card required" },
];

export default function ApplyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#FDFAF7]">
        <section className="relative section-padding bg-soft-pattern overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid opacity-25" />
          <div className="section-container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

              {/* Left info */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <span className="badge badge-blue mb-4"><span className="size-1.5 rounded-full bg-[#81A6C6]" /> Applications open</span>
                  <h1 className="text-4xl sm:text-5xl text-[#1A2332] leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                    Start your founder journey.
                  </h1>
                </div>
                <p className="text-[#4A5668] leading-relaxed">
                  Your first 30 days on GSF are completely free. Get full access to expert video calls, the venture marketplace, and our global community — no credit card needed.
                </p>
                <div className="space-y-3">
                  {PERKS.map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-[#EEF4F9] border border-[#AACDDC] flex items-center justify-center shrink-0">
                        <Icon className="size-4 text-[#81A6C6]" />
                      </div>
                      <span className="text-sm text-[#4A5668]">{text}</span>
                    </div>
                  ))}
                </div>
                <div className="card card-warm p-5">
                  <p className="text-sm text-[#4A5668] italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                    "I applied on a Tuesday and had my first expert call by Thursday. GSF moved faster than I expected."
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="size-8 rounded-full bg-[#EEF4F9] border border-[#AACDDC] flex items-center justify-center text-xs font-bold text-[#3D74A0]">PS</div>
                    <div>
                      <div className="text-xs font-semibold text-[#1A2332]">Priya Sharma</div>
                      <div className="text-[10px] text-[#8A95A3]">Founder, EduLoop</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right form */}
              <div className="lg:col-span-3 card p-8 bg-white dark:bg-slate-800">
                <h2 className="text-lg font-semibold text-[#1A2332] mb-6">Create your account</h2>
                <form className="space-y-5" id="apply-form">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A2332] mb-1.5" htmlFor="apply-firstname">First name</label>
                      <input id="apply-firstname" type="text" className="input" placeholder="Aryan" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A2332] mb-1.5" htmlFor="apply-lastname">Last name</label>
                      <input id="apply-lastname" type="text" className="input" placeholder="Kapoor" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A2332] mb-1.5" htmlFor="apply-email">University email</label>
                    <input id="apply-email" type="email" className="input" placeholder="you@university.edu" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A2332] mb-1.5" htmlFor="apply-university">University / College</label>
                    <input id="apply-university" type="text" className="input" placeholder="IIT Delhi, BITS Pilani..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A2332] mb-1.5" htmlFor="apply-role">I am a...</label>
                    <select id="apply-role" className="input">
                      <option value="">Select your current role</option>
                      <option>Undergraduate student</option>
                      <option>Postgraduate student</option>
                      <option>Recent graduate (within 2 years)</option>
                      <option>First-time founder</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A2332] mb-1.5" htmlFor="apply-idea">Do you have a startup idea? (optional)</label>
                    <textarea id="apply-idea" className="input textarea" style={{ minHeight: '88px' }}
                      placeholder="Briefly describe your idea or the problem you want to solve..." />
                  </div>
                  <button id="apply-submit" type="submit" className="btn-primary w-full justify-center py-3 text-sm">
                    Join GSF Free — 30 Days Access <ArrowRight className="size-4" />
                  </button>
                  <p className="text-xs text-[#8A95A3] text-center">
                    No credit card required. Cancel anytime after trial.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
