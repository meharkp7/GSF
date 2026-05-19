"use client";

import { useState } from "react";
import { Eye, Heart } from "lucide-react";

interface EngagementDonutChartProps {
  views: number;
  saves: number;
}

export default function EngagementDonutChart({ views, saves }: EngagementDonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = views + saves;
  const viewsPercent = total > 0 ? Math.round((views / total) * 100) : 0;
  const savesPercent = total > 0 ? Math.round((saves / total) * 100) : 0;

  // Donut Circle Math
  const radius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~314.16

  // View segment calculations
  const viewsRatio = total > 0 ? views / total : 1;
  const viewsStrokeLength = circumference * viewsRatio;
  const viewsStrokeOffset = circumference - viewsStrokeLength;

  // Save segment calculations
  const savesRatio = total > 0 ? saves / total : 0;
  const savesStrokeLength = circumference * savesRatio;
  const savesStrokeOffset = circumference - savesStrokeLength;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm transition-all duration-300">
      <div>
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Engagement Split</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Ratio of profile views to saves</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
        {/* SVG Donut */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Background Track */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke="#F3E3D0"
              className="dark:stroke-slate-700/50"
              strokeWidth={strokeWidth - 2}
            />

            {/* Views Segment */}
            {views > 0 && (
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke="#81A6C6"
                strokeWidth={hoveredIndex === 0 ? strokeWidth + 2 : strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={viewsStrokeOffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(0)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            )}

            {/* Saves Segment */}
            {saves > 0 && (
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke="#10B981"
                strokeWidth={hoveredIndex === 1 ? strokeWidth + 2 : strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={savesStrokeOffset}
                // Rotate the saves segment to start exactly where the views segment ends
                transform={`rotate(${(views / total) * 360} 60 60)`}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(1)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            )}
          </svg>

          {/* Central Stats Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-black text-gray-900 dark:text-white">
              {total.toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
              Interactions
            </span>
          </div>
        </div>

        {/* Custom Premium Side Legend */}
        <div className="flex-1 w-full space-y-4">
          {/* Views Legend Item */}
          <div
            className={`p-3 rounded-xl border border-transparent transition-all duration-200 ${
              hoveredIndex === 0
                ? "bg-blue-50/50 dark:bg-slate-700/30 border-blue-100 dark:border-slate-600 scale-[1.02]"
                : ""
            }`}
            onMouseEnter={() => setHoveredIndex(0)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#81A6C6]" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Eye className="size-3.5 text-[#81A6C6]" /> Profile Views
                </span>
              </div>
              <span className="text-xs font-bold text-gray-900 dark:text-white">{viewsPercent}%</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-bold text-gray-900 dark:text-white pl-4">
                {views.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">interactions</span>
            </div>
          </div>

          {/* Saves Legend Item */}
          <div
            className={`p-3 rounded-xl border border-transparent transition-all duration-200 ${
              hoveredIndex === 1
                ? "bg-emerald-50/30 dark:bg-slate-700/30 border-emerald-100 dark:border-slate-600 scale-[1.02]"
                : ""
            }`}
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Heart className="size-3.5 text-emerald-500" /> Saves
                </span>
              </div>
              <span className="text-xs font-bold text-gray-900 dark:text-white">{savesPercent}%</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-bold text-gray-900 dark:text-white pl-4">
                {saves.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">interactions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
