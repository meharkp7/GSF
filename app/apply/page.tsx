"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ProgressIndicator from "@/components/apply/ProgressIndicator";
import Step1 from "@/components/apply/Step1";
import Step2 from "@/components/apply/Step2";
import Step3 from "@/components/apply/Step3";
import Step4 from "@/components/apply/Step4";
import { CheckCircle, Users, Lightbulb, Clock } from "lucide-react";

const STEPS = ["Personal Info", "Education", "Startup Idea", "Review & Submit"];

const PERKS = [
  { icon: CheckCircle, text: "Full platform access — Connect + Ventures" },
  { icon: Users, text: "Access to 40+ expert advisors" },
  { icon: Lightbulb, text: "List your startup idea on the Venture marketplace" },
  { icon: Clock, text: "Free for 30 days, no credit card required" },
];

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("applyFormData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed);
      if (parsed.currentStep) setCurrentStep(parsed.currentStep);
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (data: any, step: number) => {
    const newData = { ...formData, ...data, currentStep: step };
    setFormData(newData);
    localStorage.setItem("applyFormData", JSON.stringify(newData));
  };

  const nextStep = (data: any) => {
    saveProgress(data, currentStep + 1);
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 formData={formData} onNext={nextStep} />;
      case 2:
        return <Step2 formData={formData} onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <Step3 formData={formData} onNext={nextStep} onPrev={prevStep} />;
      case 4:
        return <Step4 formData={formData} onPrev={prevStep} />;
      default:
        return null;
    }
  };

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

              {/* Right form - Multi-step */}
              <div className="lg:col-span-3 card p-8 bg-white dark:bg-slate-800">
                <ProgressIndicator currentStep={currentStep} totalSteps={4} steps={STEPS} />
                {renderStep()}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}