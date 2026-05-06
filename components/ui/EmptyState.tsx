"use client";

import Link from "next/link";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}

export default function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-2xl border-2 border-dashed border-[#D2C4B4] bg-[#FDFAF7] min-h-[360px]">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-[#F3E3D0] flex items-center justify-center mb-5 text-3xl">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-2xl text-[#1A2332] mb-3 font-semibold">{title}</h3>

      {/* Description */}
      <p className="text-[#4A5668] text-base max-w-md mb-8">{description}</p>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap justify-center">
        {primaryAction && (
          <Link
            href={primaryAction.href}
            className="px-6 py-2.5 rounded-lg bg-[#81A6C6] text-white text-sm font-medium hover:bg-[#6b91b3] transition-colors"
          >
            {primaryAction.label}
          </Link>
        )}
        {secondaryAction && (
          <Link
            href={secondaryAction.href}
            className="px-6 py-2.5 rounded-lg border border-[#D2C4B4] text-[#4A5668] text-sm font-medium hover:bg-[#F3E3D0] transition-colors"
          >
            {secondaryAction.label}
          </Link>
        )}
      </div>
    </div>
  );
}