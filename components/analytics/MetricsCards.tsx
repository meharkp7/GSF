"use client";

import { Eye, Heart, TrendingUp, Calendar } from "lucide-react";

interface MetricsCardsProps {
  views: {
    today: number;
    thisWeek: number;
    total: number;
  };
  saves: number;
}

export default function MetricsCards({ views, saves }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {/* Today Views */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</span>
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
            <Eye className="size-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{views.today}</div>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">profile views</p>
      </div>

      {/* This Week Views */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</span>
          <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-xl">
            <Calendar className="size-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{views.thisWeek}</div>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">profile views</p>
      </div>

      {/* Total Views */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</span>
          <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
            <TrendingUp className="size-5 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{views.total}</div>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">all time</p>
      </div>

      {/* Saves */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Saves</span>
          <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
            <Heart className="size-5 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{saves}</div>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">investors saved</p>
      </div>
    </div>
  );
}