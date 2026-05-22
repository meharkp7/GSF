"use client";

import { useState } from "react";
import { Calendar, CheckCircle2, Circle, Clock, Edit2, Trash2 } from "lucide-react";
import type { Milestone, MilestoneStatus } from "@/lib/types/roadmap";

interface MilestoneCardProps {
  milestone: Milestone;
  isFirst: boolean;
  isLast: boolean;
  onEdit: (milestone: Milestone) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: MilestoneStatus) => void;
}

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Circle,
    badgeClass: "badge-warn",
    nodeClass: "stage-node",
  },
  "in-progress": {
    label: "In Progress",
    icon: Clock,
    badgeClass: "badge-blue",
    nodeClass: "stage-node-active",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    badgeClass: "badge-live",
    nodeClass: "stage-node-complete",
  },
} as const;

export default function MilestoneCard({
  milestone,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onStatusChange,
}: MilestoneCardProps) {
  const [showActions, setShowActions] = useState(false);
  const config = STATUS_CONFIG[milestone.status];
  const StatusIcon = config.icon;

  const handleStatusCycle = () => {
    const statusOrder: MilestoneStatus[] = ["pending", "in-progress", "completed"];
    const currentIndex = statusOrder.indexOf(milestone.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    onStatusChange(milestone.id, nextStatus);
  };

  return (
    <div className="relative flex items-center gap-4">
      {/* Connector Line - Before */}
      {!isFirst && (
        <div
          className={`absolute left-5 -top-8 w-1 h-8 transition-all duration-500 ${
            milestone.status === "completed"
              ? "bg-gradient-to-b from-green-500 to-green-400"
              : milestone.status === "in-progress"
              ? "bg-gradient-to-b from-blue-500/50 to-gray-300"
              : "bg-gray-300 dark:bg-gray-700"
          }`}
        />
      )}

      {/* Status Node */}
      <button
        onClick={handleStatusCycle}
        className={`${config.nodeClass} cursor-pointer hover:scale-110 transition-transform z-10`}
        title={`Click to change status (Current: ${config.label})`}
      >
        <StatusIcon className="size-4" />
      </button>

      {/* Milestone Card */}
      <div
        className="card flex-1 p-4 hover:shadow-lg transition-all duration-300 group"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-base text-primary truncate">
                {milestone.title}
              </h3>
              <span className={`badge ${config.badgeClass} text-xs`}>
                {config.label}
              </span>
            </div>
            
            <p className="text-sm text-secondary mb-3 line-clamp-2">
              {milestone.description}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap gap-3 text-xs text-muted">
              {milestone.targetDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  <span>Target: {new Date(milestone.targetDate).toLocaleDateString()}</span>
                </div>
              )}
              {milestone.metadata?.fundingAmount && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold">
                    ${milestone.metadata.fundingAmount.toLocaleString()}
                  </span>
                </div>
              )}
              {milestone.completedDate && (
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="size-3" />
                  <span>Completed: {new Date(milestone.completedDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Key Deliverables */}
            {milestone.metadata?.keyDeliverables && milestone.metadata.keyDeliverables.length > 0 && (
              <div className="mt-3 pt-3 border-t border-default">
                <p className="text-xs font-medium text-muted mb-1">Key Deliverables:</p>
                <ul className="text-xs text-secondary space-y-1">
                  {milestone.metadata.keyDeliverables.slice(0, 3).map((deliverable, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-accent-indigo mt-0.5">•</span>
                      <span className="line-clamp-1">{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div
            className={`flex gap-1 transition-opacity duration-200 ${
              showActions ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <button
              onClick={() => onEdit(milestone)}
              className="p-1.5 rounded-lg hover:bg-surface-2 text-muted hover:text-primary transition-colors"
              title="Edit milestone"
            >
              <Edit2 className="size-4" />
            </button>
            <button
              onClick={() => onDelete(milestone.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-muted hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Delete milestone"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Connector Line - After */}
      {!isLast && (
        <div
          className={`absolute left-5 bottom-0 w-1 h-8 transition-all duration-500 ${
            milestone.status === "completed"
              ? "bg-gradient-to-b from-green-400 to-green-500"
              : "bg-gray-300 dark:bg-gray-700"
          }`}
        />
      )}
    </div>
  );
}
