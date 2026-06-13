export interface EcoBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress: number; // 0 to 100
  targetLabel: string;
}

export interface RecommendationAction {
  id: string;
  title: string;
  impactLabel: string; // e.g. "Saves 2.5kg CO2"
  co2Saved: number; // kg
  pointsValue: number;
  completed: boolean;
  category: "mobility" | "energy" | "waste";
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  metrics: string;
  avatarSeed: string;
}

export interface SystemScoreMetrics {
  currentBurnRate: number;      // Current daily emission
  yearlyProjections: number;    // Yearly saved
  globalRank: number;           // Competition standing/user rank
  activeStreak: number;         // Streak in weeks
  totalKarmaPoints: number;     // Karma reward points
}
