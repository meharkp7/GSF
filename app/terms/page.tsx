import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "Terms of Service — GSF", description: "GSF Terms of Service." };

const sections = [
  { heading: "Acceptance of Terms", body: "By creating an account or using the GSF platform, you agree to these Terms of Service. If you do not agree, please do not use the platform." },
  { heading: "Platform Description", body: "GSF provides a platform for student founders to connect with expert mentors via video call and chat (GSF Connect) and to list startup ideas for equity investment (GSF Ventures). GSF acts as an intermediary and is not responsible for the outcomes of any mentorship sessions or investment transactions." },
  { heading: "User Conduct", body: "You agree to use GSF only for lawful purposes. You must not misrepresent your identity, qualifications, or business details. Harassment, spam, and fraudulent activity will result in immediate account termination." },
  { heading: "Venture Listings & Equity Deals", body: "Students may list startup ideas with equity terms on GSF Ventures. GSF facilitates introductions but is not a registered broker-dealer or investment adviser. GSF charges a 1–2% platform fee on completed equity deals. All investment decisions are made at the sole discretion of the parties involved." },
  { heading: "Subscription & Payments", body: "After your 30-day free trial, continued access to GSF Connect requires a paid subscription. Fees are charged monthly and are non-refundable except where required by law. You may cancel your subscription at any time, effective at the end of your billing period." },
  { heading: "Intellectual Property", body: "Content you submit to GSF remains yours. By posting, you grant GSF a non-exclusive licence to display and distribute your content on the platform. GSF's brand, design, and code are proprietary and may not be copied or used without permission." },
  { heading: "Limitation of Liability", body: "GSF is provided 'as is' without warranties of any kind. To the maximum extent permitted by law, GSF is not liable for indirect, incidental, or consequential damages arising from your use of the platform." },
  { heading: "Governing Law", body: "These terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in Bangalore, Karnataka." },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#FDFAF7]">
        <section className="section-container py-20 max-w-3xl mx-auto">
          <h1 className="text-4xl text-[#1A2332] dark:text-slate-100 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Terms of Service</h1>
          <p className="text-[#8A95A3] text-sm mb-10">Last updated: April 2026</p>
          <div className="space-y-8">
            {sections.map(({ heading, body }) => (
              <div key={heading} className="border-t border-[#D2C4B4] pt-8">
                <h2 className="text-lg font-semibold text-[#1A2332] dark:text-slate-100 mb-3">{heading}</h2>
                <p className="text-[#4A5668] leading-relaxed text-sm">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
