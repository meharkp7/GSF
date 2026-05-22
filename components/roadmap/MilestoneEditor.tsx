"use client";

import { useState, useEffect } from "react";
import { X, Calendar, DollarSign, Plus, Trash2 } from "lucide-react";
import type { Milestone, MilestoneStatus } from "@/lib/types/roadmap";

interface MilestoneEditorProps {
  milestone: Milestone | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (milestone: Milestone) => void;
}

export default function MilestoneEditor({
  milestone,
  isOpen,
  onClose,
  onSave,
}: MilestoneEditorProps) {
  const [formData, setFormData] = useState<Milestone>({
    id: "",
    title: "",
    description: "",
    status: "pending",
    order: 0,
  });

  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [newDeliverable, setNewDeliverable] = useState("");

  useEffect(() => {
    if (milestone) {
      setFormData(milestone);
      setDeliverables(milestone.metadata?.keyDeliverables || []);
    } else {
      setFormData({
        id: crypto.randomUUID(),
        title: "",
        description: "",
        status: "pending",
        order: 0,
      });
      setDeliverables([]);
    }
  }, [milestone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedMilestone: Milestone = {
      ...formData,
      metadata: {
        ...formData.metadata,
        keyDeliverables: deliverables.filter(d => d.trim() !== ""),
      },
    };

    onSave(updatedMilestone);
    onClose();
  };

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setDeliverables([...deliverables, newDeliverable.trim()]);
      setNewDeliverable("");
    }
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-default p-6 flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-primary">
            {milestone ? "Edit Milestone" : "Create New Milestone"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-2 text-muted hover:text-primary transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Milestone Title *
            </label>
            <input
              type="text"
              required
              className="input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., MVP Development"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Description *
            </label>
            <textarea
              required
              className="input textarea"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what needs to be achieved..."
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Status
            </label>
            <select
              className="input"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as MilestoneStatus })}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Target Date */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Target Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted pointer-events-none" />
              <input
                type="date"
                className="input pl-10"
                value={formData.targetDate || ""}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              />
            </div>
          </div>

          {/* Funding Amount */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Funding Amount (Optional)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted pointer-events-none" />
              <input
                type="number"
                className="input pl-10"
                value={formData.metadata?.fundingAmount || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metadata: {
                      ...formData.metadata,
                      fundingAmount: e.target.value ? parseFloat(e.target.value) : undefined,
                    },
                  })
                }
                placeholder="0"
              />
            </div>
          </div>

          {/* Key Deliverables */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Key Deliverables
            </label>
            <div className="space-y-2">
              {deliverables.map((deliverable, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    className="input flex-1"
                    value={deliverable}
                    onChange={(e) => {
                      const updated = [...deliverables];
                      updated[index] = e.target.value;
                      setDeliverables(updated);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeDeliverable(index)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-muted hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="input flex-1"
                  value={newDeliverable}
                  onChange={(e) => setNewDeliverable(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addDeliverable();
                    }
                  }}
                  placeholder="Add a deliverable..."
                />
                <button
                  type="button"
                  onClick={addDeliverable}
                  className="btn-outline px-3 py-2"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Notes (Optional)
            </label>
            <textarea
              className="input textarea"
              rows={2}
              value={formData.metadata?.notes || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  metadata: {
                    ...formData.metadata,
                    notes: e.target.value,
                  },
                })
              }
              placeholder="Additional notes or context..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-default">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              {milestone ? "Update Milestone" : "Create Milestone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
