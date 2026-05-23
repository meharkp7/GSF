import { Metadata } from "next";
import RoadmapTracker from "@/components/roadmap/RoadmapTracker";

export const metadata: Metadata = {
  title: "Milestone Roadmap Tracker",
  description: "Interactive milestone roadmap tracker for venture strategic planning",
};

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-base">
      <div className="section-container section-padding">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
              Interactive Milestone Roadmap
            </h1>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Map out your venture's strategic development timeline. Define stages, track
              progress, and visualize your journey from ideation to product-market fit.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="card p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg
                  className="size-6 text-accent-indigo"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-primary mb-1">Dynamic Management</h3>
              <p className="text-sm text-secondary">
                Add, edit, and reorder milestones with ease
              </p>
            </div>

            <div className="card p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg
                  className="size-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-primary mb-1">Status Tracking</h3>
              <p className="text-sm text-secondary">
                Track pending, in-progress, and completed stages
              </p>
            </div>

            <div className="card p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <svg
                  className="size-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-primary mb-1">Local Persistence</h3>
              <p className="text-sm text-secondary">
                Auto-saves to localStorage, export/import support
              </p>
            </div>
          </div>

          {/* Main Tracker Component */}
          <RoadmapTracker />

          {/* Usage Tips */}
          <div className="card p-6 mt-8">
            <h3 className="text-lg font-display font-bold text-primary mb-4">
              💡 Quick Tips
            </h3>
            <ul className="space-y-2 text-sm text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-accent-indigo mt-0.5">•</span>
                <span>
                  <strong>Click the status node</strong> (circle icon) to cycle through
                  pending → in-progress → completed
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-indigo mt-0.5">•</span>
                <span>
                  <strong>Use templates</strong> to quickly populate common startup
                  milestones
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-indigo mt-0.5">•</span>
                <span>
                  <strong>Export your roadmap</strong> as JSON to share with team members
                  or investors
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-indigo mt-0.5">•</span>
                <span>
                  <strong>Hover over milestone cards</strong> to reveal edit and delete
                  actions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-indigo mt-0.5">•</span>
                <span>
                  <strong>Your data persists</strong> automatically in your browser's
                  localStorage
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
