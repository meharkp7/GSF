"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import MetricsCards from "@/components/analytics/MetricsCards";
import ActivityList from "@/components/analytics/ActivityList";
import { RefreshCw, Eye, Heart } from "lucide-react";

interface AnalyticsData {
  views: {
    today: number;
    thisWeek: number;
    total: number;
  };
  saves: number;
  recentActivity: any[];
}

export default function AnalyticsDashboard() {
  const [ventureId, setVentureId] = useState("1");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [ventureId]);

  async function fetchAnalytics() {
    try {
      const res = await fetch(`/api/analytics?ventureId=${ventureId}`);
      const analytics = await res.json();
      setData(analytics);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  }

  async function simulateView() {
    setSimulating(true);
    try {
      await fetch(`/api/ventures/${ventureId}/track-view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investorId: `sim_${Date.now()}`,
          investorName: `Investor ${Math.floor(Math.random() * 100)}`
        })
      });
      await fetchAnalytics();
    } catch (error) {
      console.error("Failed to simulate view:", error);
    } finally {
      setSimulating(false);
    }
  }

  async function simulateSave() {
    setSimulating(true);
    try {
      await fetch(`/api/analytics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          ventureId,
          investorId: `sim_${Date.now()}`,
          investorName: `Investor ${Math.floor(Math.random() * 100)}`
        })
      });
      await fetchAnalytics();
    } catch (error) {
      console.error("Failed to simulate save:", error);
    } finally {
      setSimulating(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#FDFAF7] dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#1A2332] dark:text-white mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-[#4A5668] dark:text-gray-400">
                Real-time insights into investor engagement
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={simulateView}
                disabled={simulating}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                <Eye className="size-4" /> Simulate View
              </button>
              <button
                onClick={simulateSave}
                disabled={simulating}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
              >
                <Heart className="size-4" /> Simulate Save
              </button>
              <button
                onClick={fetchAnalytics}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-all"
              >
                <RefreshCw className="size-4" /> Refresh
              </button>
            </div>
          </div>

          {/* Venture Selector */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">Select Venture:</label>
            <select
              value={ventureId}
              onChange={(e) => setVentureId(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            >
              <option value="1">EduLoop (EdTech)</option>
              <option value="2">Supplify (B2B SaaS)</option>
              <option value="3">HealthBridge (HealthTech)</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-3">Loading analytics...</p>
            </div>
          ) : data ? (
            <>
              <MetricsCards views={data.views} saves={data.saves} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                  <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Investor interactions</p>
                  </div>
                  <div className="p-4">
                    <ActivityList activities={data.recentActivity} />
                  </div>
                </div>

                {/* Summary Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                  <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Quick Summary</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Engagement overview</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Engagement</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {(data.views.total + data.saves).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">views + saves</p>
                    </div>
                    <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {data.views.total > 0 ? Math.round((data.saves / data.views.total) * 100) : 0}%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">saves per view</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No analytics data available.</p>
            </div>
          )}

          {/* How It Works */}
          <div className="mt-8 p-5 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">How It Works</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">1️⃣</span>
                <span className="text-gray-700 dark:text-gray-300">Investors view your profile</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">2️⃣</span>
                <span className="text-gray-700 dark:text-gray-300">Real-time tracking</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">3️⃣</span>
                <span className="text-gray-700 dark:text-gray-300">View analytics dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}