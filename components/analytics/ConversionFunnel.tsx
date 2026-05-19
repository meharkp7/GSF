"use client";

import { Eye, Heart, Sparkles } from "lucide-react";

interface ConversionFunnelProps {
  views: number;
  saves: number;
}

export default function ConversionFunnel({ views, saves }: ConversionFunnelProps) {
  // Estimate bottom-of-funnel (Matches) as approx 30% of saves (rounded up, minimum 0)
  const matches = Math.ceil(saves * 0.3);

  // Conversion rates
  const viewsToSavesRate = views > 0 ? Math.round((saves / views) * 100) : 0;
  const savesToMatchesRate = saves > 0 ? Math.round((matches / saves) * 100) : 0;
  const overallConversion = views > 0 ? ((matches / views) * 100).toFixed(1) : "0.0";

  const stages = [
    {
      title: "1. Profile Views",
      subtitle: "Total times your venture profile was opened",
      value: views,
      rate: 100,
      icon: <Eye className="size-5 text-blue-600 dark:text-blue-400" />,
      colorClass: "bg-blue-600",
      barWidth: "w-full",
    },
    {
      title: "2. Venture Saves",
      subtitle: "Investors who bookmarked or saved your venture",
      value: saves,
      rate: viewsToSavesRate,
      icon: <Heart className="size-5 text-rose-600 dark:text-rose-400" />,
      colorClass: "bg-rose-500",
      barWidth: views > 0 ? `${Math.max(10, Math.min(100, (saves / views) * 100))}%` : "w-10",
      dropoff: `${100 - viewsToSavesRate}% drop-off`,
    },
    {
      title: "3. Investor Matches",
      subtitle: "Warm introductions or meetings requested",
      value: matches,
      rate: Math.round(Number(overallConversion)),
      icon: <Sparkles className="size-5 text-amber-500" />,
      colorClass: "bg-amber-500",
      barWidth: views > 0 ? `${Math.max(5, Math.min(100, (matches / views) * 100))}%` : "w-5",
      dropoff: `${100 - savesToMatchesRate}% drop-off`,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Investor Funnel</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Conversion from first discovery to match request</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 px-3 py-1.5 rounded-lg text-right">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold block">Overall Match Rate</span>
          <span className="text-lg font-black text-amber-600 dark:text-amber-400">{overallConversion}%</span>
        </div>
      </div>

      <div className="space-y-6 relative">
        {stages.map((stage, idx) => (
          <div key={idx} className="relative">
            {/* Stage Info Row */}
            <div className="flex items-start gap-4 mb-2">
              <div className="p-2.5 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-100 dark:border-slate-600">
                {stage.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{stage.title}</h4>
                  <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                    {stage.value.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{stage.subtitle}</p>
              </div>
            </div>

            {/* Stage Bar Gauge */}
            <div className="h-6 w-full bg-gray-100 dark:bg-slate-700/50 rounded-lg overflow-hidden relative flex items-center px-3 border border-gray-200/50 dark:border-slate-600/50">
              <div
                style={{ width: stage.barWidth }}
                className={`absolute left-0 top-0 bottom-0 ${stage.colorClass} opacity-15 dark:opacity-25 transition-all duration-500`}
              />
              <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 z-10">
                {idx === 0 ? "Baseline Discovery" : `${stage.rate}% of views`}
              </span>
            </div>

            {/* Funnel Connector Arrow / Dropoff */}
            {idx < stages.length - 1 && (
              <div className="flex items-center gap-2 pl-6 my-2 text-[10px] font-bold text-rose-500 dark:text-rose-400">
                <span className="w-0.5 h-4 bg-gray-200 dark:bg-slate-700" />
                <span>⚠️ {stages[idx + 1].dropoff}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
