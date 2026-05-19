"use client";

import { Eye, Heart } from "lucide-react";

interface Activity {
  id: string;
  ventureId: string;
  investorId: string;
  investorName: string;
  timestamp: string;
  type?: string;
}

interface ActivityListProps {
  activities: Activity[];
}

export default function ActivityList({ activities }: ActivityListProps) {
  const getTimeAgo = (timestamp: string) => {
    const minutes = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  const getIcon = (activity: Activity) => {
    if ('type' in activity && activity.type === 'save') {
      return <Heart className="size-4 text-red-500" />;
    }
    return <Eye className="size-4 text-blue-500" />;
  };

  const getMessage = (activity: Activity) => {
    if ('type' in activity && activity.type === 'save') {
      return `${activity.investorName} saved your venture`;
    }
    return `${activity.investorName} viewed your profile`;
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-500">
        No activity yet. Share your venture to attract investors!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
          <div className="mt-0.5">{getIcon(activity)}</div>
          <div className="flex-1">
            <p className="text-sm text-gray-900 dark:text-white">{getMessage(activity)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{getTimeAgo(activity.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}