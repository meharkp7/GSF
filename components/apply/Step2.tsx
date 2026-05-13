"use client";

import { ArrowRight, ArrowLeft } from "lucide-react";

import type { ApplicationFormData } from "@/types";

interface Step2Props {
  formData: ApplicationFormData;
  onNext: (data: Partial<ApplicationFormData>) => void;
  onPrev: () => void;
}


export default function Step2({ formData, onNext, onPrev }: Step2Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      university: (form.elements.namedItem("university") as HTMLInputElement).value,
      role: (form.elements.namedItem("role") as HTMLSelectElement).value,
    };
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-[#1A2332] mb-1.5">University / College</label>
        <input name="university" type="text" className="input" defaultValue={formData.university || ""} placeholder="IIT Delhi, BITS Pilani..." required />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1A2332] mb-1.5">I am a...</label>
        <select name="role" className="input" defaultValue={formData.role || ""} required>
          <option value="">Select your current role</option>
          <option>Undergraduate student</option>
          <option>Postgraduate student</option>
          <option>Recent graduate (within 2 years)</option>
          <option>First-time founder</option>
        </select>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onPrev} className="btn-outline w-full justify-center py-3 text-sm">
          <ArrowLeft className="size-4" /> Back
        </button>
        <button type="submit" className="btn-primary w-full justify-center py-3 text-sm">
          Next Step <ArrowRight className="size-4" />
        </button>
      </div>
    </form>
  );
}