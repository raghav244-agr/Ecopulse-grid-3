import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

// Weekly tracking data for carbon output
const weeklyData = [
  { day: "Mon", current: 8.4, target: 6.0, saved: 2.4 },
  { day: "Tue", current: 7.9, target: 5.8, saved: 2.1 },
  { day: "Wed", current: 6.8, target: 5.8, saved: 3.2 },
  { day: "Thu", current: 9.1, target: 5.5, saved: 1.4 },
  { day: "Fri", current: 5.7, target: 5.5, saved: 4.8 },
  { day: "Sat", current: 4.2, target: 5.0, saved: 5.8 },
  { day: "Sun", current: 3.5, target: 5.0, saved: 6.5 },
];

interface CarbonChartsProps {
  mobilityValue: number; // Impact of changes
  energyValue: number;
  wasteValue: number;
}

export default function CarbonCharts({
  mobilityValue,
  energyValue,
  wasteValue,
}: CarbonChartsProps) {
  // Compute active dynamic projected savings data
  const currentTotalSavings = Math.round(
    (mobilityValue * 12.5) + (energyValue * 15.2) + (wasteValue * 8.6)
  );

  const projectionData = [
    { name: "Mobility", value: Math.round(mobilityValue * 1.25), color: "#10b981" },
    { name: "Energy Grid", value: Math.round(energyValue * 1.52), color: "#fbbf24" },
    { name: "Zero Waste", value: Math.round(wasteValue * 0.86), color: "#3b82f6" },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Header metrics inside Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Metric Area Chart */}
        <div className="flex flex-col gap-4 bg-white/70 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/60 dark:border-white/5 backdrop-blur-md shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
                Historical Drift vs Target
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                Carbon Burn Rate (kg CO₂/day)
              </h4>
            </div>
            
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-400 font-medium">Activity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-slate-300 dark:bg-slate-700" />
                <span className="text-slate-600 dark:text-slate-400 font-medium">Target</span>
              </div>
            </div>
          </div>

          <div className="h-[180px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.12)" />
                <XAxis 
                  dataKey="day" 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: "rgba(148, 163, 184, 0.8)", fontSize: 10, fontFamily: "monospace" }} 
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "rgba(148, 163, 184, 0.8)", fontSize: 10, fontFamily: "monospace" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="backdrop-blur-xl bg-slate-900/90 text-white p-3 rounded-xl border border-white/10 shadow-lg flex flex-col gap-1.5 text-xs">
                          <p className="font-mono text-[10px] text-emerald-400 uppercase font-bold">{payload[0].payload.day}</p>
                          <div className="flex flex-col gap-0.5">
                            <p className="font-sans text-slate-300 text-xs">
                              Burn: <span className="font-mono font-bold text-white">{payload[0].value} kg</span>
                            </p>
                            <p className="font-sans text-slate-400 text-xs">
                              Saved: <span className="font-mono text-emerald-300 font-semibold">+{payload[0].payload.saved} kg</span>
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="current" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorSaved)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  stroke="rgba(148, 163, 184, 0.4)" 
                  strokeDasharray="4 4"
                  strokeWidth={1.5} 
                  fill="none" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic projected distribution Bar Chart */}
        <div className="flex flex-col gap-4 bg-white/70 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/60 dark:border-white/5 backdrop-blur-md shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
                CO₂ Offset Distribution
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                Projected Savings Breakdown
              </h4>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {currentTotalSavings}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">kg/yr</span>
            </div>
          </div>

          <div className="h-[180px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectionData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.12)" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: "rgba(148, 163, 184, 0.8)", fontSize: 10, fontFamily: "monospace" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "rgba(148, 163, 184, 0.8)", fontSize: 10, fontFamily: "monospace" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="backdrop-blur-xl bg-slate-900/90 text-white p-3 rounded-xl border border-white/10 shadow-md text-xs">
                          <p className="font-bold text-slate-100">{data.name}</p>
                          <p className="font-mono text-emerald-400 mt-1 font-semibold">
                            Offsetting: {data.value} kg CO₂ / yr
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {projectionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
