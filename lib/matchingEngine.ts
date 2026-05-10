// Venture Matching Engine - AI-powered recommendation system

export interface Venture {
  id: string;
  name: string;
  industry: string;
  stage: string;
  location: string;
  fundingNeeded: number;
  founderExperience: string;
  tags: string[];
}

export interface Investor {
  id: string;
  name: string;
  preferredIndustries: string[];
  preferredStage: string;
  location: string;
  investmentRangeMin: number;
  investmentRangeMax: number;
  preferredExperience: string;
  pastInvestments: string[];
}

export interface MatchScore {
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

// Weights for different matching criteria
const WEIGHTS = {
  industry: 0.30,   // 30% - Industry/category match
  stage: 0.25,      // 25% - Stage match (Pre-seed, Seed, Series A)
  geography: 0.20,  // 20% - Geography/location match
  investment: 0.15, // 15% - Investment range match
  experience: 0.10, // 10% - Founder background match
};

export class MatchingEngine {
  
  /**
   * Calculate match score between a venture and an investor
   * Returns score from 0-100
   */
  static calculateMatchScore(venture: Venture, investor: Investor): MatchScore {
    const breakdown = {
      industry: this.calculateIndustryMatch(venture, investor),
      stage: this.calculateStageMatch(venture, investor),
      geography: this.calculateGeographyMatch(venture, investor),
      investment: this.calculateInvestmentMatch(venture, investor),
      experience: this.calculateExperienceMatch(venture, investor),
    };

    const totalScore = 
      (breakdown.industry * WEIGHTS.industry) +
      (breakdown.stage * WEIGHTS.stage) +
      (breakdown.geography * WEIGHTS.geography) +
      (breakdown.investment * WEIGHTS.investment) +
      (breakdown.experience * WEIGHTS.experience);

    const roundedScore = Math.round(totalScore);

    let recommendation = "";
    if (roundedScore >= 80) recommendation = "🔥 Excellent Match - Highly Recommended";
    else if (roundedScore >= 60) recommendation = "👍 Good Match - Consider reaching out";
    else if (roundedScore >= 40) recommendation = "👌 Moderate Match - Potential fit";
    else recommendation = "ℹ️ Low Match - May not be ideal";

    return {
      ventureId: venture.id,
      investorId: investor.id,
      score: roundedScore,
      breakdown,
      recommendation,
    };
  }

  /**
   * Industry/Category match (0-100)
   */
  private static calculateIndustryMatch(venture: Venture, investor: Investor): number {
    if (investor.preferredIndustries.includes(venture.industry)) {
      return 100;
    }
    // Check for related industries via tags
    const ventureTags = venture.tags || [];
    const matchCount = investor.preferredIndustries.filter(ind => 
      ventureTags.some(tag => tag.toLowerCase().includes(ind.toLowerCase()))
    ).length;
    return matchCount > 0 ? 50 : 0;
  }

  /**
   * Stage match (0-100)
   */
  private static calculateStageMatch(venture: Venture, investor: Investor): number {
    if (investor.preferredStage === venture.stage) {
      return 100;
    }
    // Partial match for adjacent stages
    const stageOrder = ["Ideation", "Pre-seed", "Seed", "Series A", "Series B"];
    const ventureIndex = stageOrder.indexOf(venture.stage);
    const investorIndex = stageOrder.indexOf(investor.preferredStage);
    if (ventureIndex !== -1 && investorIndex !== -1 && Math.abs(ventureIndex - investorIndex) === 1) {
      return 50;
    }
    return 0;
  }

  /**
   * Geography/Location match (0-100)
   */
  private static calculateGeographyMatch(venture: Venture, investor: Investor): number {
    if (investor.location === venture.location) {
      return 100;
    }
    if (investor.location === "Remote" || venture.location === "Remote") {
      return 80;
    }
    return 30; // Different locations, still some potential
  }

  /**
   * Investment range match (0-100)
   */
  private static calculateInvestmentMatch(venture: Venture, investor: Investor): number {
    const fundingNeeded = venture.fundingNeeded;
    if (fundingNeeded >= investor.investmentRangeMin && fundingNeeded <= investor.investmentRangeMax) {
      return 100;
    }
    // Close to range
    if (Math.abs(fundingNeeded - investor.investmentRangeMin) <= investor.investmentRangeMin * 0.2) {
      return 60;
    }
    if (fundingNeeded > investor.investmentRangeMax && fundingNeeded <= investor.investmentRangeMax * 1.5) {
      return 40;
    }
    return 0;
  }

  /**
   * Founder/Investor experience match (0-100)
   */
  private static calculateExperienceMatch(venture: Venture, investor: Investor): number {
    if (investor.preferredExperience === venture.founderExperience) {
      return 100;
    }
    return 50;
  }

  /**
   * Get top N matching investors for a venture
   */
  static getTopInvestorsForVenture(venture: Venture, investors: Investor[], limit: number = 5): MatchScore[] {
    const scores = investors.map(investor => this.calculateMatchScore(venture, investor));
    return scores.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  /**
   * Get top N matching ventures for an investor
   */
  static getTopVenturesForInvestor(investor: Investor, ventures: Venture[], limit: number = 5): MatchScore[] {
    const scores = ventures.map(venture => this.calculateMatchScore(venture, investor));
    return scores.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}