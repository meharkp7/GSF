"use client";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export default function ProgressIndicator({ currentStep, totalSteps, steps }: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-[#4A5668]">Step {currentStep} of {totalSteps}</span>
        <span className="text-sm font-medium text-[#1A2332]">{steps[currentStep - 1]}</span>
      </div>
      <div className="h-2 bg-[#D2C4B4] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#81A6C6] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-3 text-xs text-[#8A95A3]">
        {steps.map((step, index) => (
          <span key={step} className={index + 1 <= currentStep ? "text-[#81A6C6]" : ""}>
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}