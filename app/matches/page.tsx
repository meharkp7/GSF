"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import MatchScoreCard from "@/components/matching/MatchScoreCard";
import { Loader2, Building2, Users } from "lucide-react";

interface Match {
  ventureId: string;
  investorId: string;
  score: number;
  breakdown: {
    industry: number;
    stage: number;
    geography: number;
    investment: number;
    experience: number;
  };
  recommendation: string;
}

interface Venture {
  id: string;
  name: string;
  industry: string;
  stage: string;
  location: string;
}

interface Investor {
  id: string;
  name: string;
  preferredIndustries: string[];
  preferredStage: string;
  location: string;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<"investor" | "venture">("investor");
  const [userId, setUserId] = useState("1");
  const [ventureDetails, setVentureDetails] = useState<Record<string, Venture>>({});
  const [investorDetails, setInvestorDetails] = useState<Record<string, Investor>>({});

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      try {
        const res = await fetch(`/api/matches?type=${userType}&id=${userId}`);
        const data = await res.json();
        setMatches(data.matches || []);
        
        // Fetch details for each matched item
        if (userType === "investor" && data.matches) {
          const ventureIds = data.matches.map((m: Match) => m.ventureId);
          const venturePromises = ventureIds.map(async (id: string) => {
            const ventureRes = await fetch(`/api/ventures?id=${id}`);
            const ventureData = await ventureRes.json();
            return { id, data: ventureData };
          });
          const ventureResults = await Promise.all(venturePromises);
          const ventureMap: Record<string, Venture> = {};
          ventureResults.forEach(({ id, data }) => {
            ventureMap[id] = data;
          });
          setVentureDetails(ventureMap);
        } else if (userType === "venture" && data.matches) {
          const investorIds = data.matches.map((m: Match) => m.investorId);
          const investorPromises = investorIds.map(async (id: string) => {
            const investorRes = await fetch(`/api/investors?id=${id}`);
            const investorData = await investorRes.json();
            return { id, data: investorData };
          });
          const investorResults = await Promise.all(investorPromises);
          const investorMap: Record<string, Investor> = {};
          investorResults.forEach(({ id, data }) => {
            investorMap[id] = data;
          });
          setInvestorDetails(investorMap);
        }
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, [userType, userId]);

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#FDFAF7] dark:bg-slate-950">
        <div className="section-container py-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#1A2332] dark:text-slate-100 mb-2">
              AI-Powered Matching Engine
            </h1>
            <p className="text-gray-500 dark:text-slate-400">
              Intelligent recommendations based on industry, stage, location, and investment preferences
            </p>
          </div>

          {/* Toggle between Investor and Venture view */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => {
                setUserType("investor");
                setUserId("1");
              }}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                userType === "investor"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300"
              }`}
            >
              <Users className="inline size-4 mr-2" />
              As an Investor
            </button>
            <button
              onClick={() => {
                setUserType("venture");
                setUserId("1");
              }}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                userType === "venture"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300"
              }`}
            >
              <Building2 className="inline size-4 mr-2" />
              As a Venture
            </button>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="size-8 animate-spin text-blue-600" />
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">No matches found. Try updating your preferences.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matches.map((match, index) => {
                if (userType === "investor") {
                  const venture = ventureDetails[match.ventureId];
                  return (
                    <MatchScoreCard
                      key={`${match.ventureId}-${index}`}
                      id={match.ventureId}
                      name={venture?.name || "Loading..."}
                      type="venture"
                      matchScore={match.score}
                      breakdown={match.breakdown}
                      recommendation={match.recommendation}
                      industry={venture?.industry}
                      stage={venture?.stage}
                      location={venture?.location}
                    />
                  );
                } else {
                  const investor = investorDetails[match.investorId];
                  return (
                    <MatchScoreCard
                      key={`${match.investorId}-${index}`}
                      id={match.investorId}
                      name={investor?.name || "Loading..."}
                      type="investor"
                      matchScore={match.score}
                      breakdown={match.breakdown}
                      recommendation={match.recommendation}
                    />
                  );
                }
              })}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">How Match Scores Are Calculated</h3>
            <div className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
              <div className="flex justify-between">
                <span>Industry/Category Match</span>
                <span className="font-medium">30% weight</span>
              </div>
              <div className="flex justify-between">
                <span>Stage Match (Pre-seed, Seed, Series A)</span>
                <span className="font-medium">25% weight</span>
              </div>
              <div className="flex justify-between">
                <span>Geography/Location Match</span>
                <span className="font-medium">20% weight</span>
              </div>
              <div className="flex justify-between">
                <span>Investment Range Match</span>
                <span className="font-medium">15% weight</span>
              </div>
              <div className="flex justify-between">
                <span>Founder/Investor Experience Match</span>
                <span className="font-medium">10% weight</span>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}