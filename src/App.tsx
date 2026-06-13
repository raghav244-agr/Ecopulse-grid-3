import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Leaf,
  Zap,
  TrendingDown,
  Trees,
  Flame,
  CheckCircle2,
  Trash2,
  Trophy,
  Users,
  ArrowUpRight,
  Globe,
  Mail,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Grid,
} from "lucide-react";
import InteractiveForest from "./components/InteractiveForest";
import CarbonCharts from "./components/CarbonCharts";
import { EcoBadge, RecommendationAction, Testimonial } from "./types";

export default function App() {
  // --- Simulators State ---
  const [mobilityScore, setMobilityScore] = useState<number>(75); // 0-100% eco rating
  const [energyScore, setEnergyScore] = useState<number>(60);
  const [wasteScore, setWasteScore] = useState<number>(45);

  // --- Newsletter Signup Form State ---
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // --- Active Quests (Recommendations with complete state integration) ---
  const [quests, setQuests] = useState<RecommendationAction[]>([
    {
      id: "q1",
      title: "Activate Grid Vampire Killer",
      impactLabel: "Saves 110kg CO₂ / yr",
      co2Saved: 110,
      pointsValue: 150,
      completed: false,
      category: "energy",
    },
    {
      id: "q2",
      title: "Adopt 3 Meat-Free Days / Week",
      impactLabel: "Saves 270kg CO₂ / yr",
      co2Saved: 270,
      pointsValue: 300,
      completed: false,
      category: "mobility",
    },
    {
      id: "q3",
      title: "Initiate Household Compost Loop",
      impactLabel: "Saves 95kg CO₂ / yr",
      co2Saved: 95,
      pointsValue: 180,
      completed: false,
      category: "waste",
    },
    {
      id: "q4",
      title: "Switch Workspace Lighting to LED",
      impactLabel: "Saves 65kg CO₂ / yr",
      co2Saved: 65,
      pointsValue: 120,
      completed: true, // starts completed to look active
      category: "energy",
    },
    {
      id: "q5",
      title: "Perform Local Micro-Commute by Bike",
      impactLabel: "Saves 350kg CO₂ / yr",
      co2Saved: 350,
      pointsValue: 400,
      completed: false,
      category: "mobility",
    },
  ]);

  // --- Toggle state of quests dynamically ---
  const handleToggleQuest = (id: string) => {
    setQuests((prevQuests) =>
      prevQuests.map((quest) => {
        if (quest.id === id) {
          const nextState = !quest.completed;
          // Apply a gentle nudge to sliders as a physical result of taking action
          if (nextState) {
            if (quest.category === "mobility") setMobilityScore((s) => Math.min(s + 8, 100));
            if (quest.category === "energy") setEnergyScore((s) => Math.min(s + 8, 100));
            if (quest.category === "waste") setWasteScore((s) => Math.min(s + 8, 100));
          } else {
            if (quest.category === "mobility") setMobilityScore((s) => Math.max(s - 8, 0));
            if (quest.category === "energy") setEnergyScore((s) => Math.max(s - 8, 0));
            if (quest.category === "waste") setWasteScore((s) => Math.max(s - 8, 0));
          }
          return { ...quest, completed: nextState };
        }
        return quest;
      })
    );
  };

  // --- Interactive Calculations ---
  // Calculates live actual carbon footprint, potential savings, points & level
  const totalCompletedPoints = useMemo(() => {
    return quests
      .filter((q) => q.completed)
      .reduce((sum, q) => sum + q.pointsValue, 1200); // 1200 is base starting score
  }, [quests]);

  const liveCarbonSavedKgs = useMemo(() => {
    // Calculates annual saving projection based on sliders and quests
    const sliderSavings = (mobilityScore * 14.2) + (energyScore * 18.5) + (wasteScore * 11.1);
    const questSavings = quests.filter((q) => q.completed).reduce((sum, q) => sum + q.co2Saved, 0);
    return Math.round(sliderSavings + questSavings);
  }, [mobilityScore, energyScore, wasteScore, quests]);

  // Baseline standard footprint is ~4500 kg per year
  const actualFootprintRemaining = useMemo(() => {
    const baseline = 4500;
    return Math.max(baseline - liveCarbonSavedKgs, 850);
  }, [liveCarbonSavedKgs]);

  const equivalentTreesPlanted = useMemo(() => {
    // 1 mature tree absorbs ~22kg of CO2 per year
    return Math.round(liveCarbonSavedKgs / 22);
  }, [liveCarbonSavedKgs]);

  const currentLevel = useMemo(() => {
    return Math.floor(totalCompletedPoints / 500) + 1;
  }, [totalCompletedPoints]);

  const nextLevelProgress = useMemo(() => {
    const currentLevelBase = (currentLevel - 1) * 500;
    const currentLevelExcess = totalCompletedPoints - currentLevelBase;
    return Math.min(Math.round((currentLevelExcess / 500) * 100), 100);
  }, [totalCompletedPoints, currentLevel]);

  // --- Badges list with state evaluation ---
  const badges = useMemo<EcoBadge[]>(() => {
    return [
      {
        id: "badge1",
        name: "Mobility Pioneer",
        description: "Maintain mobility eco metrics above 85%",
        icon: "biking",
        earned: mobilityScore >= 85,
        progress: mobilityScore,
        targetLabel: "85% Mobility",
      },
      {
        id: "badge2",
        name: "Grid Overlord",
        description: "Exceed 75% renewable efficiency optimization",
        icon: "zap",
        earned: energyScore >= 75,
        progress: energyScore,
        targetLabel: "75% Grid Saver",
      },
      {
        id: "badge3",
        name: "Compost Overlord",
        description: "Attain zero-waste habit simulation over 65%",
        icon: "trash",
        earned: wasteScore >= 65,
        progress: wasteScore,
        targetLabel: "65% Material Flow",
      },
      {
        id: "badge4",
        name: "Forest Archon",
        description: "Save equivalent of 120+ virtual mature trees",
        icon: "trees",
        earned: equivalentTreesPlanted >= 120,
        progress: Math.min(Math.round((equivalentTreesPlanted / 120) * 100), 100),
        targetLabel: "120 Trees Offset",
      },
    ];
  }, [mobilityScore, energyScore, wasteScore, equivalentTreesPlanted]);

  // Testimonials array
  const testimonials: Testimonial[] = [
    {
      id: "t1",
      name: "Celine Desrosiers",
      role: "Climate Intelligence Coordinator",
      quote: "Most ESG tools feel like clinical databases or empty forms. EcoPulse actually gamifies ecology through immersive sandboxes and rewards that feel tangible.",
      metrics: "Saved 2.4 Tons CO₂ Annualized",
      avatarSeed: "C",
    },
    {
      id: "t2",
      name: "Kaelen Finch",
      role: "Grid Security Analyst",
      quote: "The interface logic is flawless. The feedback loops between household habit parameters and procedural graphics on the canvas are masterfully structured.",
      metrics: "Neutralized Grid Drift",
      avatarSeed: "K",
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col relative overflow-x-hidden">
      
      {/* Decorative subtle ambient glows to represent biosphere energy (Linear Style) */}
      <div className="absolute top-[10%] left-[-10%] w-[35vw] h-[35vw] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vw] bg-yellow-500/3 rounded-full blur-[140px] pointer-events-none" />

      {/* --- Premium Navigation --- */}
      <nav className="sticky top-0 z-40 bg-[#070b13]/85 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo Brand Brand */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Leaf className="w-5 h-5 text-slate-950" />
              <div className="absolute inset-0 rounded-xl border border-white/20 animate-pulse-glow" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                EcoPulse <span className="text-[10px] font-mono py-0.5 px-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-semibold tracking-normal">Grid V3</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Autonomous ESG Orchestrator</span>
            </div>
          </div>

          {/* Center Metadata Displays (No AI telemetry slop, pure high-end functional tracking) */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/50">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Grid Node: <span className="text-white">Active</span></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/50">
              <span>Timestamp: <span className="text-emerald-400 font-bold">2026-06-13 UTC</span></span>
            </div>
          </div>

          {/* Score Hub & Level Display */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-slate-500">Eco-Karma Points</span>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-sm font-extrabold font-mono text-emerald-400">
                  {totalCompletedPoints}
                </span>
              </div>
            </div>

            <div className="h-9 w-px bg-slate-800" />

            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-950/40 to-emerald-900/10 px-3 py-1 rounded-xl border border-emerald-500/20">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-slate-400 uppercase">Tier</span>
                <span className="text-xs font-extrabold text-white">LVL {currentLevel}</span>
              </div>
            </div>
          </div>

        </div>
      </nav>

      {/* --- Main Contents Container --- */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-12">
        
        {/* --- SECTION 1: Asymmetric Split Hero & Live Sandbox --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-b from-slate-900/30 to-transparent p-1 rounded-3xl">
          
          {/* Hero Pitch (Left Column) */}
          <div className="lg:col-span-5 flex flex-col gap-5 justify-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono tracking-wider text-emerald-400 uppercase font-semibold">
                Hackathon Award Entrant
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
              The Pulse of <br />
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                Regenerative Life
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans max-w-md">
              A premium, intelligent carbon orchestration grid. Manage carbon outputs, optimize materials, and inspect ecological micro-biomes procedurally inside our live physics-guided sandbox vector module.
            </p>

            {/* Quick Micro Level Progress Indicator */}
            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 max-w-md">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-sans">Level {currentLevel} Path</span>
                <span className="text-emerald-400 font-mono font-bold">{nextLevelProgress}% to Level {currentLevel + 1}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${nextLevelProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <p className="text-[10px] text-slate-500 italic mt-0.5">
                Complete the daily grid quests listed in the Bento Grid below to trigger immediate rank promotion!
              </p>
            </div>

            <div className="flex items-center gap-4 mt-1">
              <a 
                href="#interactive-grid"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all shadow-[0_5px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_5px_25px_rgba(16,185,129,0.4)] transform hover:-translate-y-0.5"
              >
                Orchestrate Grid
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </a>
            </div>

          </div>

          {/* Interactive Live Canvas Ecosystem Sandbox (Right Column) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative group">
              {/* Luxury Frame Border styling */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-3xl opacity-[0.08] group-hover:opacity-[0.14] transition-all blur-md pointer-events-none" />
              <div className="relative bg-slate-900/40 p-1 rounded-2.5xl border border-slate-800/80">
                <InteractiveForest 
                  mobilityScore={mobilityScore}
                  energyScore={energyScore}
                  wasteScore={wasteScore}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Procedural Canvas Core
              </span>
              <span>Input vectors: Mobility, Energy, Zero-waste</span>
            </div>
          </div>

        </section>


        {/* --- SECTION 2: The Core Intelligent Bento Grid Hub --- */}
        <section id="interactive-grid" className="flex flex-col gap-8 scroll-mt-24">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                  Bento Architecture
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                EcoPulse Command Hub
              </h2>
            </div>
            <p className="text-slate-400 text-xs md:text-sm max-w-md font-sans">
              Interact directly with the simulation sliders, optimize live challenges, toggle action quests, and watch the entire database recalculate in real-time.
            </p>
          </div>

          {/* Bento grid wrapper layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Tile 1: Grid Controller Sliders (6 cols desktop) */}
            <div className="lg:col-span-6 bg-slate-900/40 p-6 rounded-2xl border border-slate-850 backdrop-blur-md flex flex-col justify-between gap-6 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
              <div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                    Ecosystem Vectors
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  Climate Habit Simulator
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Adjust standard indicators to project the impact of large-scale renewable adoption or community shifts on carbon burn rates.
                </p>
              </div>

              <div className="flex flex-col gap-5 mt-3">
                {/* Mobility Slider */}
                <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-slate-950/40 border border-slate-900">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <TrendingDown className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold">Mobility Habits (Green Commute)</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">{mobilityScore}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={mobilityScore}
                    onChange={(e) => setMobilityScore(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Lone Combustion Vehicle</span>
                    <span>Electric Grid / Low impact Commute</span>
                  </div>
                </div>

                {/* Energy Slider */}
                <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-slate-950/40 border border-slate-900">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold">Grid Optimization (Power Conservation)</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">{energyScore}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={energyScore}
                    onChange={(e) => setEnergyScore(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-850 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>100% Thermal Grid Gas</span>
                    <span>100% Solar & Virtualized Storage</span>
                  </div>
                </div>

                {/* Waste Slider */}
                <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-slate-950/40 border border-slate-900">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Trash2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold">Zero-Waste Material Flow</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">{wasteScore}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={wasteScore}
                    onChange={(e) => setWasteScore(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-850 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>100% Landfill Trash</span>
                    <span>Compost & Full Raw Material Reclamation</span>
                  </div>
                </div>
              </div>

              {/* Slider calibration stats */}
              <div className="p-3.5 rounded-xl bg-emerald-500/5 text-[11px] text-emerald-400 border border-emerald-500/10 font-mono mt-1 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Adjusting these levers directly controls the health percentage, birds, solar glow, and floral bloom cycle on the simulation canvas.</span>
              </div>
            </div>

            {/* Tile 2: Dynamic Offset Receipt / Ledger (6 cols desktop) */}
            <div className="lg:col-span-6 bg-slate-900/40 p-6 rounded-2xl border border-slate-850 backdrop-blur-md flex flex-col justify-between gap-6 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                    Ledger Summary
                  </span>
                  <span className="text-[10px] font-mono py-0.5 px-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                    Yearly Projected Audit
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  Active Resource Offsets
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Real-time carbon deficit balance sheet parsed from current active and saved states.
                </p>
              </div>

              {/* Elegant dynamic receipt structure */}
              <div className="flex flex-col divide-y divide-slate-800/80 bg-slate-950/60 p-4 rounded-xl border border-slate-900 font-mono">
                
                <div className="flex justify-between py-2 text-xs">
                  <span className="text-slate-500">Global Average Baseline</span>
                  <span className="text-slate-300">4,500 kg CO₂ / yr</span>
                </div>

                <div className="flex justify-between py-2.5 text-xs">
                  <span className="text-slate-500">Your Simulated Savings</span>
                  <span className="text-emerald-400 font-bold">-{liveCarbonSavedKgs} kg CO₂ / yr</span>
                </div>

                <div className="flex justify-between py-2.5 text-sm font-bold">
                  <span className="text-slate-300">Net Audited Footprint</span>
                  <span className="text-white">{actualFootprintRemaining} kg CO₂</span>
                </div>

                <div className="flex justify-between py-2.5 text-xs">
                  <span className="text-slate-500">Required Offsetting Forest</span>
                  <span className="text-slate-300 flex items-center gap-1">
                    <Trees className="w-3.5 h-3.5 text-emerald-400" />
                    {equivalentTreesPlanted} trees
                  </span>
                </div>

                <div className="flex justify-between py-2 text-[10px] text-slate-500">
                  <span>Carbon Status Indicator</span>
                  <span className={`font-semibold uppercase tracking-wider ${liveCarbonSavedKgs > 2200 ? "text-emerald-400" : "text-amber-500"}`}>
                    {liveCarbonSavedKgs > 2200 ? "● High Regeneration Tier" : "▲ Moderate Drift"}
                  </span>
                </div>
              </div>

              {/* Circular offset progress wheel */}
              <div className="flex items-center gap-4 bg-slate-950/20 p-4 rounded-xl border border-slate-900">
                <div className="relative flex items-center justify-center w-16 h-16 rounded-full border-4 border-slate-800 flex-shrink-0">
                  <span className="text-xs font-mono font-bold text-white">
                    {Math.round((liveCarbonSavedKgs / 4500) * 100)}%
                  </span>
                  
                  {/* Dynamic absolute progress indicator circle */}
                  <div className="absolute inset-[-4px] rounded-full border-4 border-emerald-500 border-t-transparent border-r-transparent rotate-45 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-xs font-bold text-slate-200">Deficit Reduction Index</h4>
                  <p className="text-[11px] text-slate-400 mt-1 font-sans">
                    Your current configurations offset <span className="font-bold text-emerald-400">{Math.round((liveCarbonSavedKgs / 4500) * 100)}%</span> of standard carbon burn rate targets per person.
                  </p>
                </div>
              </div>

            </div>

            {/* Tile 3: Carbon Analytics Visualizations (full-width on medium, nested in bento 12 cols desktop) */}
            <div className="lg:col-span-12">
              <CarbonCharts 
                mobilityValue={mobilityScore}
                energyValue={energyScore}
                wasteValue={wasteScore}
              />
            </div>

            {/* Tile 4: Smart Habit Quest Board / Daily Challenges (7 columns desktop) */}
            <div className="lg:col-span-7 bg-slate-900/40 p-6 rounded-2xl border border-slate-850 backdrop-blur-md flex flex-col justify-between gap-5 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                    Quests & Milestones
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    +Points Active
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  Climate Habit Quest Board
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enabling quests applies structural adjustments to your sustainability index metrics. Learn how real optimizations affect grid output.
                </p>
              </div>

              {/* Dynamic scrollable quest index */}
              <div className="flex flex-col gap-3 mt-2 max-h-[320px] overflow-y-auto pr-1">
                <AnimatePresence initial={false}>
                  {quests.map((quest) => (
                    <motion.div
                      key={quest.id}
                      onClick={() => handleToggleQuest(quest.id)}
                      className={`flex justify-between items-center p-3.5 rounded-xl border cursor-pointer transition-all ${
                        quest.completed
                          ? "bg-emerald-950/20 border-emerald-500/30 text-slate-250 shadow-[inset_0_1px_15px_rgba(16,185,129,0.05)]"
                          : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950/60"
                      }`}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-5 h-5 rounded-md border ${
                          quest.completed
                            ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                            : "border-slate-700 bg-slate-900 text-transparent"
                        }`}>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-xs font-bold leading-tight ${quest.completed ? "line-through text-slate-500" : "text-slate-200"}`}>
                            {quest.title}
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5">{quest.impactLabel}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono py-0.5 px-2 rounded bg-slate-800/50 text-slate-400">
                          {quest.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          +{quest.pointsValue}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="text-[10px] italic text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                Clicking tasks changes your points total, raises your tier Level, and feeds carbon parameters into the procedural engine.
              </div>
            </div>

            {/* Tile 5: Badges Achievement Locker (5 columns desktop) */}
            <div className="lg:col-span-5 bg-slate-900/40 p-6 rounded-2xl border border-slate-850 backdrop-blur-md flex flex-col justify-between gap-5 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                  Vault & Trophies
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Ecosystem Badges
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Locked trophies activate autonomously when you reach targets in the live slider parameters.
                </p>
              </div>

              {/* Grid of dynamic badges */}
              <div className="grid grid-cols-2 gap-4 mt-2">
                {badges.map((badge) => (
                  <div 
                    key={badge.id}
                    className={`p-3 rounded-xl border flex flex-col justify-between min-h-[110px] transition-all relative overflow-hidden ${
                      badge.earned 
                        ? "bg-gradient-to-br from-emerald-950/20 to-emerald-900/5 border-emerald-500/20 shadow-[0_4px_15px_rgba(16,185,129,0.06)]" 
                        : "bg-slate-950/30 border-slate-800/60 opacity-60"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className={`p-1.5 rounded-lg ${badge.earned ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" : "bg-slate-900 text-slate-500"}`}>
                        <Trophy className="w-4 h-4" />
                      </div>
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${badge.earned ? "bg-emerald-500/20 text-emerald-400 font-bold" : "bg-slate-900 text-slate-500"}`}>
                        {badge.earned ? "Earned" : "Locked"}
                      </span>
                    </div>

                    <div className="mt-2.5 flex flex-col gap-0.5">
                      <h4 className="text-[11px] font-bold text-slate-200 truncate">{badge.name}</h4>
                      <p className="text-[9px] text-slate-500 truncate">{badge.description}</p>
                    </div>

                    {/* Progress tracking line */}
                    <div className="mt-2 text-right">
                      <div className="flex justify-between text-[8px] font-mono text-slate-500 mb-1">
                        <span>Progress</span>
                        <span>{badge.progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${badge.earned ? "bg-emerald-500" : "bg-slate-600"}`}
                          style={{ width: `${badge.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Faint subtle backdrop text */}
                    <div className="absolute top-1 right-1 inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
                      <Leaf className="w-16 h-16 text-white" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-3.5 py-2.5 rounded-xl bg-slate-950/50 text-[10px] text-slate-500 border border-slate-900 font-mono flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Verify requirements by dragging the cockpit sliders high.</span>
              </div>
            </div>

          </div>

        </section>


        {/* --- SECTION 3: Global Community Initiatives Sprint --- */}
        <section className="bg-slate-900/20 p-8 rounded-2xl border border-slate-850/80 backdrop-blur-md relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
                  Collective Action
                </span>
              </div>
              <h3 className="text-xl font-bold text-white leading-tight">
                Tokyo-Bay Smart Grid Decarbonization Sprint
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Join a dynamic cooperative cohort where users align their cockpit adjustments to complete localized green targets collectively. Updated every 3 hours.
              </p>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-5">
              
              {/* Progress bar tracking team challenges */}
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-900">
                <div className="flex justify-between items-center text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">Active Stage Level 3</span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-400/20">78% COMPLETED</span>
                  </div>
                  <span className="font-mono text-slate-500">14.8k / 20.0k participants</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: "78%" }} />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
                  <span>Current Offset velocity: <span className="text-emerald-400 font-bold">+1,204 kg CO₂/hr</span></span>
                  <span>Ends in: <span className="font-mono">14h 22m 10s</span></span>
                </div>
              </div>

              {/* Dynamic status nodes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-950/20 border border-slate-900 rounded-xl flex flex-col gap-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Energy Target</span>
                  <span className="text-xs font-bold text-slate-300">Renewable Ratio &gt; 82%</span>
                  <span className="text-[9px] text-emerald-400 font-mono">Completed (Passed)</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-slate-900 rounded-xl flex flex-col gap-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Mobility Target</span>
                  <span className="text-xs font-bold text-slate-300">Public Transit ratio &gt; 65%</span>
                  <span className="text-[9px] text-amber-400 font-mono">In Progress (62% saved)</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-slate-900 rounded-xl flex flex-col gap-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Quest Completion</span>
                  <span className="text-xs font-bold text-slate-300">Compost tasks &gt; 4k</span>
                  <span className="text-[9px] text-emerald-400 font-mono">Completed (Passed)</span>
                </div>
              </div>

            </div>

          </div>

        </section>


        {/* --- SECTION 4: Professional Testimonials --- */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
              Endorsements
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              Trusted by Environmental Professionals
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((test) => (
              <div 
                key={test.id} 
                className="bg-slate-900/30 p-6 rounded-2xl border border-slate-850/80 backdrop-blur-md flex flex-col justify-between gap-4"
              >
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                  "{test.quote}"
                </p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-mono text-xs font-bold font-mono">
                      {test.avatarSeed}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-white">{test.name}</span>
                      <span className="text-[10px] text-slate-500">{test.role}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                    {test.metrics}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* --- SECTION 5: Beautiful Glassmorphic Call to Action --- */}
        <section className="relative rounded-3xl overflow-hidden py-10 px-6 sm:px-10 border border-emerald-500/20 bg-slate-900/40 backdrop-blur-md shadow-[0_10px_40px_rgba(16,185,129,0.06)] flex flex-col items-center text-center gap-5">
          
          {/* Internal gradient backdrop bulb */}
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <Leaf className="w-8 h-8 text-emerald-400 animate-bounce" />
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight max-w-lg leading-tight">
            Ready to Forge Your Autonomous Climate Journey?
          </h2>
          
          <p className="text-slate-400 text-xs sm:text-sm max-w-md">
            Enter your coordinates to initialize credentials next to standard community grid nodes. Keep track of metrics with weekly push reports.
          </p>

          <AnimatePresence mode="wait">
            {!newsletterSubmitted ? (
              <motion.form 
                onSubmit={handleNewsletterSubmit}
                className="w-full max-w-md flex flex-col sm:flex-row gap-2.5 mt-2 z-10"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <input 
                  type="email"
                  required
                  placeholder="Enter your security-grid email..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-slate-950/80 border border-slate-800 focus:border-emerald-500/50 hover:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none placeholder-slate-600 flex-grow"
                />
                <button 
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-sm focus:outline-none flex-shrink-0 cursor-pointer"
                >
                  Confirm Coordinates
                </button>
              </motion.form>
            ) : (
              <motion.div 
                className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono rounded-xl max-w-md text-left flex items-start gap-3 mt-2 z-10 shadow-sm"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">System Authorized!</h4>
                  <p className="text-slate-400 mt-0.5">Coordinates logged successfully. Validation key dispatched to <span className="text-emerald-300 font-bold underline">{newsletterEmail}</span>.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="border-t border-slate-800/80 bg-[#06090f] py-10 px-6 mt-16 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex flex-col gap-1.5 text-center md:text-left">
            <span className="font-extrabold text-white flex items-center gap-1.5 justify-center md:justify-start">
              <Leaf className="w-4 h-4 text-emerald-400" /> EcoPulse Redesign
            </span>
            <span>Uncompromising sustainability dashboard for hackathon judges.</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <a href="#interactive-grid" className="hover:text-emerald-400 transition-colors">Command Center</a>
            <span className="text-slate-700">|</span>
            <span>Secure SSL Protocol</span>
            <span>UTC 2026</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
