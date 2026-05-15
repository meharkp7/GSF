"use client";

import { Bell } from "lucide-react";

export function NotificationBell() {
  return (
    <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
      <Bell className="size-5 text-gray-600 dark:text-gray-400" />
      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
    </button>
  );
}