"use client";

import { ArrowRight, ArrowLeft } from "lucide-react";

interface Step3Props {
  formData: any;
  onNext: (data: any) => void;
  onPrev: () => void;
}

export default function Step3({ formData, onNext, onPrev }: Step3Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      idea: (form.elements.namedItem("idea") as HTMLTextAreaElement).value,
    };
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-[#1A2332] mb-1.5">Do you have a startup idea? (optional)</label>
        <textarea name="idea" className="input" style={{ minHeight: '120px' }}
          defaultValue={formData.idea || ""}
          placeholder="Briefly describe your idea or the problem you want to solve..." />
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