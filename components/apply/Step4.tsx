"use client";

import { ArrowLeft } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface Step4Props {
  formData: any;
  onPrev: () => void;
}

export default function Step4({ formData, onPrev }: Step4Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      console.log("Final form data:", formData);
      
      // Show toast notification (small popup)
      showSuccess("Application submitted successfully!");
      
      // Clear saved data
      localStorage.removeItem("applyFormData");
      
      // Optional: redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
      
    } catch (error) {
      showError("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-3 p-4 bg-[#F3E3D0] rounded-lg">
        <h3 className="font-semibold text-[#1A2332]">Review your information</h3>
        <div className="text-sm space-y-2">
          <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>University:</strong> {formData.university}</p>
          <p><strong>Role:</strong> {formData.role}</p>
          <p><strong>Startup Idea:</strong> {formData.idea || "Not provided"}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onPrev} className="btn-outline w-full justify-center py-3 text-sm">
          <ArrowLeft className="size-4" /> Back
        </button>
        <button type="submit" className="btn-primary w-full justify-center py-3 text-sm">
          Submit Application
        </button>
      </div>
    </form>
  );
}