import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "Privacy Policy — GSF", description: "How GSF collects and uses your data." };

const sections = [
  { heading: "Information We Collect", body: "We collect information you provide directly to us — such as your name, email address, university, and any content you submit (venture listings, messages). We also automatically collect usage data including browser type, pages visited, and device information to improve the platform." },
  { heading: "How We Use Your Information", body: "We use your information to operate and improve the GSF platform, facilitate connections between members, process subscription payments, send product updates and community communications, and comply with legal obligations. We do not sell your personal data to third parties." },
  { heading: "Data Sharing", body: "Your profile information is shared with other GSF members as part of the platform's core function (e.g., experts can see your name and question when you book a call). Venture listings are visible to all registered investors. We use trusted third-party services (e.g., Stripe for payments) who are contractually bound to protect your data." },
  { heading: "Data Retention", body: "We retain your data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting hello@gsf.community." },
  { heading: "Cookies", body: "We use cookies to maintain session state, analyse usage patterns, and personalise your experience. See our Cookies Policy for full details. You may disable cookies in your browser settings, though some platform features may not function correctly." },
  { heading: "Your Rights", body: "Depending on your jurisdiction, you may have rights to access, correct, or delete your personal data. Contact us at hello@gsf.community to exercise these rights." },
  { heading: "Contact", body: "If you have questions about this policy, contact us at hello@gsf.community or write to Global Society of Founders, Bangalore, India." },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#FDFAF7]">
        <section className="section-container py-20 max-w-3xl mx-auto">
          <h1 className="text-4xl text-[#1A2332] dark:text-slate-100 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Privacy Policy</h1>
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
