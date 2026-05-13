"use client";

import Link from "next/link";
import { TrendingUp, Star, MapPin, Briefcase, Target } from "lucide-react";

interface MatchScoreCardProps {
  id: string;
  name: string;
  type: "venture" | "investor";
  matchScore: number;
  breakdown?: {
    industry: number;
    stage: number;
    geography: number;
    investment: number;
    experience: number;
  };
  recommendation: string;
  industry?: string;
  stage?: string;
  location?: string;
}

export default function MatchScoreCard({
  id,
  name,
  type,
  matchScore,
  breakdown,
  recommendation,
  industry,
  stage,
  location,
}: MatchScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-blue-600 bg-blue-100";
    if (score >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return "🔥";
    if (score >= 60) return "👍";
    if (score >= 40) return "👌";
    return "ℹ️";
  };

  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#1A2332] dark:text-slate-100">{name}</h3>
          {industry && <p className="text-sm text-gray-500">{industry}</p>}
          {stage && <p className="text-xs text-blue-600 mt-1">{stage}</p>}
          {location && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <MapPin className="size-3" /> {location}
            </div>
          )}
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(matchScore)}`}>
          {getScoreEmoji(matchScore)} {matchScore}% Match
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-slate-300 mb-4">{recommendation}</p>

      {breakdown && (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs">
            <span>Industry</span>
            <span className="font-semibold">{Math.round(breakdown.industry * 0.3)}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${breakdown.industry}%` }} />
          </div>
          <div className="flex justify-between text-xs">
            <span>Stage</span>
            <span className="font-semibold">{Math.round(breakdown.stage * 0.25)}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${breakdown.stage}%` }} />
          </div>
        </div>
      )}

      <Link
        href={type === "venture" ? `/ventures/${id}` : `/investors/${id}`}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        View Details <TrendingUp className="size-3.5" />
      </Link>
    </div>
  );
}