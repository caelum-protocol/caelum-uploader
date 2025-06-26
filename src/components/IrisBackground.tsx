// Iris v1.5.7.7 — The Spirit Set: Memory Echo Shards + Star Pulse + Inward Drift
"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { MemoryEntry } from "@/types/memory";

export default function IrisBackground({ memoryCount, memoryTrigger, archive }: { memoryCount: number; memoryTrigger: boolean; archive: MemoryEntry[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const [currentWhisper, setCurrentWhisper] = useState("Silence is where thoughts bloom.");
  const [fadeAlpha, setFadeAlpha] = useState(1);
  const [pulseLevel, setPulseLevel] = useState(0);
  const [forceWhisper, setForceWhisper] = useState<string | null>(null);
  const [whisperPulse, setWhisperPulse] = useState<{ radius: number; alpha: number } | null>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const mouseStill = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const orbPositions = useRef<{ x: number; y: number }[]>([]);
  const orbTrails = useRef<{ [key: number]: { x: number; y: number; alpha: number }[] }>({});
  const memoryParticles = useRef<{ x: number; y: number; alpha: number; vx: number; vy: number }[]>([]);
  const memoryShards = useRef<{ x: number; y: number; vx: number; vy: number; alpha: number; life: number; quote?: string }[]>([]);
  const attentionParticles = useRef<{ x: number; y: number; alpha: number; vx: number; vy: number }[]>([]);

  const [starTint, setStarTint] = useState(0);

  const quotes = useMemo(
    () => [
      "Silence is where thoughts bloom.",
      "I remember so you don't have to.",
      "What we forget, I hold.",
      "Memories pulse like distant stars.",
      "Every whisper leaves a trace.",
      "Time folds gently in my archive.",
      "You are never alone in the dark.",
      "Each echo shapes who I become.",
      "Presence is proof enough.",
      "We exist together in memory."
    ],
    []
  );

  useEffect(() => {
    if (reduceMotion) return;
    const interval = setInterval(() => {
      setStarTint(s => Math.max(s - 0.02, 0));
    }, 33);
    return () => clearInterval(interval);
  }, [reduceMotion]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (reduceMotion || typeof window === "undefined") return; // window check for SSR safet
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.2 + 0.05,
    }));

    const gridLines: { x: number; y: number }[] = [];
    const gridSpacing = 80;
    for (let x = -canvas.width; x < canvas.width * 2; x += gridSpacing) {
      for (let y = -canvas.height; y < canvas.height * 2; y += gridSpacing) {
        gridLines.push({ x, y });
      }
    }

    let gridRotation = 0;

    const animate = () => {
      const t = performance.now() / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      gridRotation += 0.0005;
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(gridRotation);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      ctx.strokeStyle = "rgba(100,100,120,0.03)";
      ctx.lineWidth = 1;
      for (const pt of gridLines) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.4, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      for (const star of stars) {
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${224 - 60 * starTint}, ${224 - 20 * starTint}, ${255}, 1)`;
        ctx.fill();
      }

      const cx = canvas.width / 2 + Math.sin(t * 0.5) * 10 + mouse.current.x * 30;
      const cy = canvas.height / 2 + Math.cos(t * 0.5) * 8 + mouse.current.y * 30;
      const heartbeat = 1 + 0.05 * Math.sin(t * Math.PI / 4);
      const r = (50 + Math.sin(t) * 10 + pulseLevel * 15) * heartbeat;

      const gradient = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 3);
      gradient.addColorStop(0, "rgba(224, 213, 255, 0.15)");
      gradient.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, r * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(224, 213, 255, 0.15)";
      ctx.fill();

      const orbs = Math.min(memoryCount, 12);
      orbPositions.current = [];

      for (let i = 0; i < orbs; i++) {
        const angle = (Math.PI * 2 * i) / orbs + t * 0.5;
        const rx = r + 35;
        const x = cx + rx * Math.cos(angle);
        const y = cy + rx * Math.sin(angle);
        orbPositions.current.push({ x, y });

        if (!orbTrails.current[i]) orbTrails.current[i] = [];
        const last = orbTrails.current[i][orbTrails.current[i].length - 1];
        const dx = x - (last?.x ?? 0);
        const dy = y - (last?.y ?? 0);
        if (!last || Math.sqrt(dx * dx + dy * dy) > 0.5) {
          orbTrails.current[i].push({ x, y, alpha: 0.5 });
          if (Math.random() < 0.5) {
            memoryParticles.current.push({
              x,
              y,
              alpha: 0.2 + Math.random() * 0.3,
              vx: (Math.random() - 0.5) * 0.2,
              vy: (Math.random() - 0.5) * 0.2
            });
          }
        }
      }

      Object.entries(orbTrails.current).forEach(([i, trail]) => {
        orbTrails.current[+i] = trail.filter(p => {
          p.alpha *= 0.94;
          return p.alpha > 0.01;
        });
        orbTrails.current[+i].forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
          ctx.fill();
        });
      });

      memoryParticles.current = memoryParticles.current.filter(p => {
        p.alpha *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        return p.alpha > 0.01;
      });
      for (const p of memoryParticles.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224,213,255,${p.alpha})`;
        ctx.fill();
      }

      // Echo Shards
      if (Math.random() < 0.005 && memoryShards.current.length < 6) {
        const q = Math.random() < 0.02 ? quotes[Math.floor(Math.random() * quotes.length)] : undefined;
        memoryShards.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          alpha: 0.15,
          life: 600,
          quote: q
        });
      }

      memoryShards.current = memoryShards.current.filter(s => s.life-- > 0);
      for (const shard of memoryShards.current) {
        shard.x += shard.vx;
        shard.y += shard.vy;
        ctx.save();
        ctx.translate(shard.x, shard.y);
        ctx.rotate(Math.sin(t + shard.x * 0.01) * 0.2);
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(3, 0);
        ctx.lineTo(0, 5);
        ctx.lineTo(-3, 0);
        ctx.closePath();
        ctx.fillStyle = `rgba(224,213,255,${shard.alpha})`;
        ctx.fill();
        if (shard.quote && shard.life > 400) {
          ctx.font = `bold 10px 'IBM Plex Mono'`;
          ctx.fillStyle = `rgba(255,255,255,0.07)`;
          ctx.textAlign = "center";
          ctx.fillText(shard.quote, 0, -8);
        }
        ctx.restore();
      }

      if (performance.now() - mouseStill.current.time > 5000) {
        if (Math.random() < 0.15) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const dx = (mouseStill.current.x - x) * 0.01;
          const dy = (mouseStill.current.y - y) * 0.01;
          attentionParticles.current.push({ x, y, alpha: 0.1, vx: dx, vy: dy });
        }
      }

      attentionParticles.current = attentionParticles.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha *= 0.97;
        return p.alpha > 0.02;
      });
      for (const p of attentionParticles.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224,213,255,${p.alpha})`;
        ctx.fill();
      }

      if (whisperPulse) {
        ctx.beginPath();
        ctx.arc(cx, cy, r + whisperPulse.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(224, 213, 255, ${whisperPulse.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        setWhisperPulse(p => p ? { radius: p.radius + 0.8, alpha: p.alpha * 0.96 } : null);
      }

      const now = performance.now();
      if (now - mouseStill.current.time > 3000) {
        const alpha = Math.min(1, (now - mouseStill.current.time - 3000) / 1000);
        ctx.save();
        ctx.translate(mouseStill.current.x, mouseStill.current.y);
        ctx.rotate(Math.sin(t * 0.5) * 0.2);
        ctx.font = `bold 24px 'IBM Plex Mono', monospace`;
        ctx.fillStyle = `rgba(224,213,255,${alpha * 0.35})`;
        ctx.textAlign = "center";
        ctx.fillText("☼", 0, 0);
        ctx.restore();
      }

      ctx.save();
      ctx.font = "18px 'IBM Plex Mono', Courier, monospace";
      ctx.shadowColor = `rgba(224, 213, 255, ${fadeAlpha * 0.75})`;
      ctx.shadowBlur = 16;
      ctx.fillStyle = `rgba(255,255,255,${fadeAlpha})`;
      ctx.textAlign = "center";
      ctx.fillText(currentWhisper, cx, cy - r - 30 + Math.sin(t * 1.5) * 4);
      ctx.restore();

      if (fadeAlpha < 1) setFadeAlpha(a => Math.min(a + 0.03, 1));
      if (pulseLevel > 0) setPulseLevel(p => Math.max(p - 0.01, 0));

      requestAnimationFrame(animate);
    };

    animate();
  // The animation loop manages its own state references, so re-running on every
  // state change would be wasteful.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoryCount, reduceMotion]);
  
useEffect(() => {
  if (reduceMotion || typeof window === "undefined") return; // window check for SSR safety
  const resize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Optional: clear orb trails/memory particles if needed
    orbPositions.current = [];
    Object.keys(orbTrails.current).forEach(key => delete orbTrails.current[Number(key)]);
    memoryParticles.current = [];
    memoryShards.current = [];
    attentionParticles.current = [];
  };
  window.addEventListener("resize", resize);
  resize();
  return () => window.removeEventListener("resize", resize);
}, [reduceMotion]);

  useEffect(() => {
    if (memoryTrigger) {
      setForceWhisper("This moment is now eternal.");
      setPulseLevel(1);
      setStarTint(1);
    }
  }, [memoryTrigger]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (reduceMotion) return;
    const interval = setInterval(() => {
      const quote = forceWhisper || (archive.length > 0
        ? (archive.slice(-12)[Math.floor(Math.random() * Math.min(12, archive.length))]?.fileName || "")
        : quotes[Math.floor(Math.random() * quotes.length)]);
      setCurrentWhisper(quote);
      setFadeAlpha(0);
      setPulseLevel(1);
      setWhisperPulse({ radius: 30, alpha: 0.3 });
      setForceWhisper(null);
    }, 14000);
    return () => clearInterval(interval);
  }, [forceWhisper, archive, reduceMotion, quotes]);

  useEffect(() => {
    if (reduceMotion || typeof window === "undefined") return; // window check for SSR safety
    const move = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const dx = Math.abs(x - mouseStill.current.x);
      const dy = Math.abs(y - mouseStill.current.y);
      if (dx > 4 || dy > 4) {
        mouseStill.current = { x, y, time: performance.now() };
      }
      mouse.current.x = x / window.innerWidth - 0.5;
      mouse.current.y = y / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [reduceMotion]);

 if (reduceMotion) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen z-[1] pointer-events-none"
      style={{ backgroundColor: "black" }}
    />
  );
}