"use client";

import { ArrowRight } from "lucide-react";

interface Step1Props {
  formData: any;
  onNext: (data: any) => void;
}

export default function Step1({ formData, onNext }: Step1Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement).value,
      lastName: (form.elements.namedItem("lastName") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
    };
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1A2332] mb-1.5">First name</label>
          <input name="firstName" type="text" className="input" defaultValue={formData.firstName || ""} placeholder="Aryan" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A2332] mb-1.5">Last name</label>
          <input name="lastName" type="text" className="input" defaultValue={formData.lastName || ""} placeholder="Kapoor" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1A2332] mb-1.5">University email</label>
        <input name="email" type="email" className="input" defaultValue={formData.email || ""} placeholder="you@university.edu" required />
      </div>
      <button type="submit" className="btn-primary w-full justify-center py-3 text-sm">
        Next Step <ArrowRight className="size-4" />
      </button>
    </form>
  );
}