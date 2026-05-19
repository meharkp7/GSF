"use client";

import { useState, useRef } from "react";
import { Eye, Heart } from "lucide-react";

interface DailyStat {
  date: string;
  views: number;
  saves: number;
}

interface VentureGrowthChartProps {
  dailyStats: DailyStat[];
}

export default function VentureGrowthChart({ dailyStats }: VentureGrowthChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  if (!dailyStats || dailyStats.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 h-80 flex items-center justify-center">
        <p className="text-gray-500">No chart data available.</p>
      </div>
    );
  }

  // Dimensions
  const svgWidth = 600;
  const svgHeight = 240;
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };

  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Max values for scaling
  const maxViews = Math.max(...dailyStats.map((d) => d.views), 1);
  const maxSaves = Math.max(...dailyStats.map((d) => d.saves), 1);
  const maxY = Math.ceil(Math.max(maxViews, maxSaves * 2.5) / 5) * 5; // Scale so views look great and saves are scaled nicely

  // Calculate coordinates
  const points = dailyStats.map((d, index) => {
    const x = padding.left + (index / (dailyStats.length - 1)) * chartWidth;
    const yViews = padding.top + chartHeight - (d.views / maxY) * chartHeight;
    const ySaves = padding.top + chartHeight - (d.saves / maxY) * chartHeight;
    return { x, yViews, ySaves, date: d.date, views: d.views, saves: d.saves };
  });

  // Generate SVG path strings
  const getAreaPath = (pts: typeof points, key: "yViews" | "ySaves") => {
    if (pts.length === 0) return "";
    let path = `M ${pts[0].x} ${pts[0][key]}`;
    for (let i = 1; i < pts.length; i++) {
      path += ` L ${pts[i].x} ${pts[i][key]}`;
    }
    // Close area path at the baseline
    path += ` L ${pts[pts.length - 1].x} ${padding.top + chartHeight}`;
    path += ` L ${pts[0].x} ${padding.top + chartHeight} Z`;
    return path;
  };

  const getLinePath = (pts: typeof points, key: "yViews" | "ySaves") => {
    if (pts.length === 0) return "";
    let path = `M ${pts[0].x} ${pts[0][key]}`;
    for (let i = 1; i < pts.length; i++) {
      path += ` L ${pts[i].x} ${pts[i][key]}`;
    }
    return path;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - padding.left;
    
    // Find closest data point based on horizontal mouse position
    const totalStep = chartWidth / (dailyStats.length - 1);
    const calculatedIndex = Math.round(mouseX / totalStep);
    const clampedIndex = Math.max(0, Math.min(dailyStats.length - 1, calculatedIndex));
    
    setHoveredIndex(clampedIndex);

    // Tooltip coordinates
    const targetPoint = points[clampedIndex];
    setTooltipPos({
      x: targetPoint.x,
      y: Math.min(targetPoint.yViews, targetPoint.ySaves) - 10
    });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Generate horizontal grid lines
  const gridLines = [];
  const numGridLines = 4;
  for (let i = 0; i <= numGridLines; i++) {
    const val = (maxY / numGridLines) * i;
    const y = padding.top + chartHeight - (val / maxY) * chartHeight;
    gridLines.push({ y, value: Math.round(val) });
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm relative transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Venture Growth Trends</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Daily profile views and saves over the last 14 days</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 text-[#81A6C6]">
            <span className="w-3 h-3 rounded-full bg-[#81A6C6]/20 border border-[#81A6C6]" />
            <span>Profile Views</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-500">
            <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500" />
            <span>Investor Saves</span>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#81A6C6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#81A6C6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="savesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLines.map((line, i) => (
            <g key={i} className="opacity-40 dark:opacity-20">
              <line
                x1={padding.left}
                y1={line.y}
                x2={svgWidth - padding.right}
                y2={line.y}
                stroke="#D2C4B4"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={line.y + 4}
                textAnchor="end"
                className="text-[10px] fill-gray-400 dark:fill-gray-500 font-medium"
              >
                {line.value}
              </text>
            </g>
          ))}

          {/* Fill Areas */}
          <path d={getAreaPath(points, "yViews")} fill="url(#viewsGrad)" className="transition-all duration-300" />
          <path d={getAreaPath(points, "ySaves")} fill="url(#savesGrad)" className="transition-all duration-300" />

          {/* Trend Lines */}
          <path
            d={getLinePath(points, "yViews")}
            fill="none"
            stroke="#81A6C6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />
          <path
            d={getLinePath(points, "ySaves")}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Bottom X-Axis labels */}
          {points.map((pt, i) => {
            // Only render every 2nd or 3rd label to prevent overcrowding
            if (i % 2 !== 0 && i !== points.length - 1) return null;
            return (
              <text
                key={i}
                x={pt.x}
                y={svgHeight - padding.bottom + 18}
                textAnchor="middle"
                className="text-[10px] fill-gray-400 dark:fill-gray-500 font-medium"
              >
                {pt.date}
              </text>
            );
          })}

          {/* Hover Crosshair vertical bar */}
          {hoveredIndex !== null && (
            <line
              x1={points[hoveredIndex].x}
              y1={padding.top}
              x2={points[hoveredIndex].x}
              y2={padding.top + chartHeight}
              stroke="#D2C4B4"
              strokeWidth="1.5"
              className="opacity-70 dark:opacity-40"
              strokeDasharray="2 2"
            />
          )}

          {/* Hover Data Nodes */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g key={i} className={`transition-all duration-200 ${isHovered ? "opacity-100 scale-105" : "opacity-0"}`}>
                {/* Views Node */}
                <circle
                  cx={pt.x}
                  cy={pt.yViews}
                  r="6"
                  fill="#ffffff"
                  stroke="#81A6C6"
                  strokeWidth="3"
                  className="shadow-sm"
                />
                {/* Saves Node */}
                <circle
                  cx={pt.x}
                  cy={pt.ySaves}
                  r="5"
                  fill="#ffffff"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  className="shadow-sm"
                />
              </g>
            );
          })}
        </svg>

        {/* Dynamic Premium HTML Tooltip */}
        {hoveredIndex !== null && (
          <div
            style={{
              left: `${(tooltipPos.x / svgWidth) * 100}%`,
              top: `${(tooltipPos.y / svgHeight) * 100}%`,
              transform: "translate(-50%, -105%)",
            }}
            className="absolute z-10 pointer-events-none bg-[#1A2332] text-white text-xs rounded-xl p-3 shadow-xl border border-gray-800 space-y-1.5 transition-all duration-75 min-w-[130px] animate-fadeIn"
          >
            <div className="font-bold border-b border-gray-700 pb-1 text-gray-300">
              {dailyStats[hoveredIndex].date}
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-gray-400">
                <Eye className="size-3 text-[#81A6C6]" /> Views:
              </span>
              <span className="font-semibold">{dailyStats[hoveredIndex].views}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-gray-400">
                <Heart className="size-3 text-emerald-400" /> Saves:
              </span>
              <span className="font-semibold text-emerald-400">{dailyStats[hoveredIndex].saves}</span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-gray-800 text-[10px] text-gray-500">
              <span>Conversion:</span>
              <span className="font-medium text-[#AACDDC]">
                {dailyStats[hoveredIndex].views > 0
                  ? Math.round((dailyStats[hoveredIndex].saves / dailyStats[hoveredIndex].views) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
