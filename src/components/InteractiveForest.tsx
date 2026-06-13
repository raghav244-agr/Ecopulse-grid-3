import React, { useRef, useEffect } from "react";

interface InteractiveForestProps {
  mobilityScore: number; // 0 to 100% (high means eco-friendly, i.e., high public transit/bike)
  energyScore: number;   // 0 to 100% (high means high renewable/electricity savings)
  wasteScore: number;    // 0 to 100% (high means high recycling/waste management)
}

export default function InteractiveForest({
  mobilityScore,
  energyScore,
  wasteScore,
}: InteractiveForestProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Overall ecosystem health score
  const overallHealth = Math.round((mobilityScore + energyScore + wasteScore) / 3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Set high-DPI quality
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Bird positioning parameters for active animation
    const birds = [
      { x: 50, y: 60, speed: 0.8, size: 5, angle: 0 },
      { x: 120, y: 40, speed: 1.1, size: 4, angle: 0.2 },
      { x: 200, y: 75, speed: 0.6, size: 6, angle: -0.1 },
    ];

    const draw = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // --- Background Sky Gradient (Reacting to Eco Health) ---
      // Healthy: Soft cyan and bright sky blue
      // Unhealthy: Grey/yellowish industrial smog
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      const healthFactor = overallHealth / 100;

      // Smooth interpolation of sky tints
      const r1 = Math.round(15 + (180 - 15) * (1 - healthFactor));
      const g1 = Math.round(50 + (240 - 50) * (1 - healthFactor));
      const b1 = Math.round(96 + (220 - 96) * (1 - healthFactor));

      const r2 = Math.round(9 + (120 - 9) * (1 - healthFactor));
      const g2 = Math.round(23 + (170 - 23) * (1 - healthFactor));
      const b2 = Math.round(42 + (160 - 42) * (1 - healthFactor));

      // Healthy vibrant sky colors
      const skyColorTop = `rgb(${Math.round(24 + (180 - 24) * (1 - healthFactor))}, ${Math.round(246 - 150 * (1 - healthFactor))}, ${Math.round(253 - 140 * (1 - healthFactor))})`;
      const skyColorBottom = `rgb(${Math.round(248 - 180 * (1 - healthFactor))}, ${Math.round(250 - 150 * (1 - healthFactor))}, ${Math.round(252 - 130 * (1 - healthFactor))})`;

      skyGrad.addColorStop(0, skyColorTop);
      skyGrad.addColorStop(1, skyColorBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // --- Draw the Sun or Sun Glow ---
      if (overallHealth > 20) {
        const sunRadius = 25 + (overallHealth * 0.15);
        ctx.beginPath();
        const sunGlow = ctx.createRadialGradient(width - 60, 50, 0, width - 60, 50, sunRadius * 2);
        sunGlow.addColorStop(0, `rgba(253, 224, 71, ${0.4 + healthFactor * 0.5})`);
        sunGlow.addColorStop(0.5, `rgba(253, 224, 71, ${0.1 + healthFactor * 0.2})`);
        sunGlow.addColorStop(1, "rgba(253, 224, 71, 0)");
        ctx.fillStyle = sunGlow;
        ctx.arc(width - 60, 50, sunRadius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Main Sun core
        ctx.beginPath();
        ctx.fillStyle = `rgba(253, 224, 71, ${0.8 + healthFactor * 0.2})`;
        ctx.arc(width - 60, 50, sunRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Smog / Clouds (Fades with high health) ---
      if (overallHealth < 80) {
        const cloudOpacity = (1 - healthFactor) * 0.6;
        ctx.fillStyle = `rgba(100, 116, 139, ${cloudOpacity})`;
        
        // Draw 3 dynamic floating smog clouds
        const cloudY1 = 40 + Math.sin(time * 0.5) * 5;
        const cloudY2 = 60 + Math.cos(time * 0.3) * 6;
        
        // Cloud 1
        ctx.beginPath();
        ctx.arc(60, cloudY1, 20, 0, Math.PI * 2);
        ctx.arc(85, cloudY1 - 8, 25, 0, Math.PI * 2);
        ctx.arc(110, cloudY1, 20, 0, Math.PI * 2);
        ctx.fill();

        // Cloud 2
        ctx.beginPath();
        ctx.arc(width * 0.5, cloudY2, 25, 0, Math.PI * 2);
        ctx.arc(width * 0.5 + 30, cloudY2 - 10, 35, 0, Math.PI * 2);
        ctx.arc(width * 0.5 + 65, cloudY2, 25, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Gentle falling leaves or renewable energy sparks ---
      if (overallHealth > 40) {
        ctx.fillStyle = "rgba(16, 185, 129, 0.4)";
        for (let i = 0; i < 5; i++) {
          const sparkX = (width * 0.2 + (i * width * 0.15) + Math.sin(time + i) * 15) % width;
          const sparkY = (height * 0.5 + (i * 30) - (time * 12) % 150 + 150) % (height - 80);
          ctx.beginPath();
          ctx.arc(sparkX, sparkY, 1.5 + Math.sin(time + i) * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- Flying Birds (Only appear when ecosystem is healthy) ---
      if (overallHealth > 50) {
        const birdHealthFactor = (overallHealth - 50) / 50; // 0 to 1
        ctx.strokeStyle = `rgba(15, 23, 42, ${0.4 * birdHealthFactor})`;
        ctx.lineWidth = 1.5;
        
        birds.forEach((bird) => {
          bird.x += bird.speed;
          if (bird.x > width + 40) bird.x = -30;
          
          const flap = Math.sin(time * 5 + bird.x * 0.05) * bird.size;
          
          ctx.beginPath();
          ctx.moveTo(bird.x - bird.size, bird.y + flap);
          ctx.quadraticCurveTo(bird.x, bird.y - bird.size, bird.x + bird.size, bird.y + flap);
          ctx.quadraticCurveTo(bird.x, bird.y + bird.size * 0.3, bird.x - bird.size, bird.y + flap);
          ctx.stroke();
        });
      }

      // --- Ground (Changes color based on health) ---
      // Healthy: Lush deep emerald grass
      // Sick: Dull rocky clay grey
      const groundGrad = ctx.createLinearGradient(0, height - 70, 0, height);
      
      const groundColorTop = `rgb(${Math.round(240 - 150 * healthFactor)}, ${Math.round(180 + 40 * healthFactor)}, ${Math.round(140 - 90 * healthFactor)})`;
      const groundColorBottom = `rgb(${Math.round(190 - 130 * healthFactor)}, ${Math.round(150 + 20 * healthFactor)}, ${Math.round(110 - 70 * healthFactor)})`;

      groundGrad.addColorStop(0, groundColorTop);
      groundGrad.addColorStop(1, groundColorBottom);
      ctx.fillStyle = groundGrad;
      
      // Draw smooth rolling hills
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height - 35);
      ctx.quadraticCurveTo(width * 0.25, height - 45 - Math.sin(time * 0.1) * 2, width * 0.5, height - 38);
      ctx.quadraticCurveTo(width * 0.75, height - 30 + Math.cos(time * 0.1) * 2, width, height - 42);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Foreground hill
      ctx.fillStyle = skyColorBottom === "rgb(248, 250, 252)" ? "rgba(16, 185, 129, 0.15)" : `rgba(5, 150, 105, ${0.1 + healthFactor * 0.2})`;
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height - 20);
      ctx.quadraticCurveTo(width * 0.4, height - 12, width * 0.75, height - 25);
      ctx.quadraticCurveTo(width * 0.9, height - 30, width, height - 15);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // --- Draw Procedural Ecosystem Trees ---
      // Low health: Bare stump/withered minimalist stick
      // Medium health: Normal healthy structure
      // High health: Huge branching rich evergreen structures
      const drawTree = (x: number, baseHeight: number, scale: number, foliageOpacity: number, speedOffset: number) => {
        const currentHeight = baseHeight + (overallHealth * 0.3 * scale);
        const trunkWidth = 4 + (overallHealth * 0.05 * scale);
        
        ctx.save();
        ctx.translate(x, height - 30);
        
        // Dynamic sway based on wind (waste/mobility score represents nature stability)
        const windPower = 0.08 - (overallHealth * 0.0005);
        const sway = Math.sin(time * 1.5 + speedOffset) * windPower;
        ctx.rotate(sway);

        // Trunk
        const trunkGrad = ctx.createLinearGradient(0, 0, 0, -currentHeight);
        trunkGrad.addColorStop(0, "#451a03"); // Very dark brown
        trunkGrad.addColorStop(1, "#78350f"); // Bark brown
        ctx.fillStyle = trunkGrad;

        ctx.beginPath();
        ctx.moveTo(-trunkWidth / 2, 0);
        ctx.lineTo(-trunkWidth / 3, -currentHeight * 0.7);
        ctx.lineTo(0, -currentHeight);
        ctx.lineTo(trunkWidth / 3, -currentHeight * 0.7);
        ctx.lineTo(trunkWidth / 2, 0);
        ctx.closePath();
        ctx.fill();

        // Branches (Procedural depending on health)
        if (overallHealth > 30) {
          ctx.fillStyle = `rgba(4, 120, 87, ${foliageOpacity})`;
          
          // Draw multiple layered foliage circles for a soft 3D stylized look
          const leafScale = 12 + (overallHealth * 0.12) * scale;
          
          // Left leaf cluster
          ctx.beginPath();
          ctx.arc(-10 * scale, -currentHeight * 0.85, leafScale, 0, Math.PI * 2);
          ctx.fill();

          // Right leaf cluster
          ctx.beginPath();
          ctx.arc(10 * scale, -currentHeight * 0.85, leafScale, 0, Math.PI * 2);
          ctx.fill();

          // Top leaf cluster
          ctx.fillStyle = `rgba(16, 185, 129, ${foliageOpacity})`;
          ctx.beginPath();
          ctx.arc(0, -currentHeight * 1.05, leafScale * 1.15, 0, Math.PI * 2);
          ctx.fill();

          // Highlight overlay to add visual craftsmanship depth
          ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
          ctx.beginPath();
          ctx.arc(-3 * scale, -currentHeight * 1.08, leafScale * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Dead branches for bleak view
          ctx.strokeStyle = "#451a03";
          ctx.lineWidth = trunkWidth * 0.6;
          ctx.beginPath();
          ctx.moveTo(0, -currentHeight * 0.5);
          ctx.lineTo(-12, -currentHeight * 0.8);
          ctx.moveTo(0, -currentHeight * 0.7);
          ctx.lineTo(10, -currentHeight * 0.95);
          ctx.stroke();
        }

        ctx.restore();
      };

      // Draw three trees layer after layer
      // Tree 1: Middle-Left (medium width)
      drawTree(width * 0.28, 20, 0.9, 0.8, 0);
      
      // Tree 2: Center-Main (large elegant ever-growing Redwood)
      const mainTreeAlpha = 0.4 + (overallHealth * 0.006);
      drawTree(width * 0.52, 28, 1.25, Math.min(mainTreeAlpha, 0.95), 1.2);

      // Tree 3: Middle-Right (smaller sapling, responds rapidly to energy savings tracker)
      const rightTreeScale = 0.5 + (energyScore * 0.005);
      drawTree(width * 0.72, 15, rightTreeScale, 0.85, 2.4);

      // --- Ground details (Wildflowers blooming based on Waste score) ---
      if (wasteScore > 10) {
        const flowerCount = Math.min(Math.floor(wasteScore / 10), 8);
        for (let i = 0; i < flowerCount; i++) {
          const fx = (width * 0.12 + (i * width * 0.11) + Math.cos(i) * 5) % width;
          const fy = height - 25 + (Math.sin(i * 3) * 3);

          // Flower stem
          ctx.strokeStyle = "#047857";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(fx, fy);
          ctx.lineTo(fx, fy - 6);
          ctx.stroke();

          // Flower petals (Vibrant custom colors)
          const petalColor = i % 2 === 0 ? "#f43f5e" : "#fbbf24"; // pink/yellow
          ctx.fillStyle = petalColor;
          ctx.beginPath();
          ctx.arc(fx - 2, fy - 8, 1.5, 0, Math.PI * 2);
          ctx.arc(fx + 2, fy - 8, 1.5, 0, Math.PI * 2);
          ctx.arc(fx, fy - 10, 1.5, 0, Math.PI * 2);
          ctx.arc(fx, fy - 6, 1.5, 0, Math.PI * 2);
          ctx.fill();

          // Flower Center
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(fx, fy - 8, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      draw();
    };

    window.addEventListener("resize", handleResize);

    const tick = () => {
      draw();
      animationFrameId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [overallHealth, mobilityScore, energyScore, wasteScore]);

  return (
    <div className="relative w-full h-full min-h-[220px] rounded-2xl overflow-hidden shadow-sm border border-emerald-500/10 dark:border-white/5 bg-slate-950/2">
      <canvas ref={canvasRef} className="w-full h-full block" />
      
      {/* Absolute overlay micro indicators */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 backdrop-blur-md bg-white/70 dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-white/5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <span className="text-[10px] font-mono tracking-widest text-emerald-600 dark:text-emerald-400 font-bold uppercase">
          Ecosystem Pulse
        </span>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${overallHealth > 60 ? "bg-emerald-500 animate-pulse" : overallHealth > 30 ? "bg-amber-400 animate-pulse" : "bg-rose-500"}`} />
          <span className="text-sm font-sans font-extrabold text-slate-900 dark:text-slate-100">
            {overallHealth}% Healthy
          </span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 text-[10px] uppercase font-mono tracking-wider px-2 py-1 rounded bg-slate-900/60 text-emerald-300 dark:text-emerald-400 backdrop-blur-sm shadow-sm border border-emerald-500/10">
        Live Sandbox Model
      </div>
    </div>
  );
}
