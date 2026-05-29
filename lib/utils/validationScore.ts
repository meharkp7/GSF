export interface ScoredVenture {
  stage?: string;
  traction?: string;
  interested?: number;
  views?: number;
  tags?: string[];
  equity?: string;
  fundingGoal?: string;
  teamSize?: number | string;
  tagline?: string;
}

const STAGE_SCORES: Record<string, number> = {
  "Ideation": 0,
  "Idea Screening": 0,
  "Screening": 0,
  "Market Research": 1,
  "Research": 1,
  "MVP": 2,
  "Investment & Funding": 2,
  "Funding": 2,
  "Company Launch": 2,
  "Launch": 2,
  "Product-Market Fit": 2,
};

export function computeValidationScore(v: ScoredVenture): number {
  let score = 0;

  // 1. Stage advancement (0–2 pts)
  score += STAGE_SCORES[v.stage ?? ""] ?? 0;

  // 2. Traction quality (0–3 pts)
  const traction = (v.traction ?? "").trim();
  if (traction.length > 100) score += 3;
  else if (traction.length > 40) score += 2;
  else if (traction.length > 10) score += 1;

  // 3. Market clarity — tagline + tags (0–2 pts)
  const tagline = (v.tagline ?? "").trim();
  if (tagline.length >= 40) score += 1;
  const tagCount = Array.isArray(v.tags) ? v.tags.length : 0;
  if (tagCount >= 3) score += 1;

  // 4. Team signal (0–2 pts)
  const team = Number(v.teamSize ?? 0);
  if (team >= 3) score += 2;
  else if (team >= 1) score += 1;

  // 5. Funding clarity (0–1 pt)
  const hasEquity = v.equity && v.equity !== "0" && v.equity !== "";
  const hasGoal = v.fundingGoal && v.fundingGoal !== "0" && v.fundingGoal !== "";
  if (hasEquity && hasGoal) score += 1;

  return Math.min(10, Math.max(1, score));
}

export function getScoreColor(score: number): {
  bg: string; text: string; border: string; label: string;
} {
  if (score >= 8) return { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7", label: "Strong" };
  if (score >= 6) return { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD", label: "Promising" };
  if (score >= 4) return { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D", label: "Early" };
  return        { bg: "#FFE4E6", text: "#9F1239", border: "#FECDD3", label: "Nascent" };
}