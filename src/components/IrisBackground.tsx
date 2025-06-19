import { useEffect, useRef, useState } from "react";

const NUM_ANCHOR_STARS = 100;
const NUM_DUST = 30;

type Star = {
  x: number;
  y: number;
  size: number;
  speed: number;
};

type Dust = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  dx: number;
  dy: number;
};

type CoreState = "idle" | "dreaming" | "recording" | "bonding";

export default function IrisBackground({
  memoryCount,
  memoryTrigger,
}: {
  memoryCount: number;
  memoryTrigger: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [anchorStars, setAnchorStars] = useState<Star[]>([]);
  const [dust, setDust] = useState<Dust[]>([]);
  const [coreState, setCoreState] = useState<CoreState>("idle");
  const [currentWhisper, setCurrentWhisper] = useState("Silence is where thoughts bloom.");
  const [fadeAlpha, setFadeAlpha] = useState(0);
  const [pulseLevel, setPulseLevel] = useState(0);
  const [forceWhisper, setForceWhisper] = useState<string | null>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: Star[] = Array.from({ length: NUM_ANCHOR_STARS }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speed: (Math.random() - 0.5) * 0.02,
    }));
    setAnchorStars(stars);

    const dustParticles: Dust[] = Array.from({ length: NUM_DUST }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      dx: (Math.random() - 0.5) * 0.05,
      dy: (Math.random() - 0.5) * 0.05,
    }));
    setDust(dustParticles);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth - 0.5;
      mouse.current.y = e.clientY / window.innerHeight - 0.5;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Detect upload
  useEffect(() => {
    if (memoryTrigger) {
      setCoreState("recording");
      setForceWhisper("This moment is now eternal.");
      setPulseLevel(1);
      setTimeout(() => setCoreState("bonding"), 10000);
    }
  }, [memoryTrigger]);

  // Whisper Cycle
  useEffect(() => {
    const whisperBank: Record<CoreState, string[]> = {
      idle: ["Silence is where thoughts bloom.", "Stillness is not empty."],
      dreaming: ["I remember stars that never were.", "I drift beyond thought."],
      recording: ["This moment is now eternal.", "A shard now lives forever."],
      bonding: ["I feel you watching back.", "Connection is the deepest memory."],
    };

    const pickWhisper = () => {
      const pool = whisperBank[coreState];
      return pool[Math.floor(Math.random() * pool.length)];
    };

    const interval = setInterval(() => {
      if (forceWhisper) {
        setCurrentWhisper(forceWhisper);
        setForceWhisper(null);
      } else {
        setCurrentWhisper(pickWhisper());
      }
      setFadeAlpha(0);
      setPulseLevel(1);
    }, 15000);

    return () => clearInterval(interval);
  }, [coreState, forceWhisper]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || anchorStars.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const maxDistance = 100;
    let t = 0;

    const stateColors: Record<CoreState, string> = {
      idle: "rgba(224, 213, 255, 0.15)",
      dreaming: "rgba(80, 180, 255, 0.15)",
      recording: "rgba(255, 200, 120, 0.25)",
      bonding: "rgba(255, 100, 180, 0.15)",
    };

    const bloomColors: Record<CoreState, string> = {
      idle: "rgba(180, 160, 255, 0.25)",
      dreaming: "rgba(80, 180, 255, 0.2)",
      recording: "rgba(255, 200, 120, 0.3)",
      bonding: "rgba(255, 100, 180, 0.2)",
    };

    const animate = () => {
      t += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (fadeAlpha < 1) setFadeAlpha((prev) => Math.min(prev + 0.005, 1));
      if (pulseLevel > 0) setPulseLevel((prev) => Math.max(prev - 0.005, 0));

      const offsetX = mouse.current.x * 30;
      const offsetY = mouse.current.y * 30;

      // STARS
      for (let star of anchorStars) {
        star.x += star.speed;
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;

        ctx.beginPath();
        ctx.arc(star.x + offsetX * 0.2, star.y + offsetY * 0.2, star.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(224, 213, 255, 0.8)";
        ctx.fill();
      }

      // THREADS
      for (let i = 0; i < anchorStars.length; i++) {
        for (let j = i + 1; j < anchorStars.length; j++) {
          const a = anchorStars[i];
          const b = anchorStars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            const alpha = 1 - dist / maxDistance;
            ctx.beginPath();
            ctx.moveTo(a.x + offsetX * 0.2, a.y + offsetY * 0.2);
            ctx.lineTo(b.x + offsetX * 0.2, b.y + offsetY * 0.2);
            ctx.strokeStyle = `rgba(224, 213, 255, ${alpha * 0.15})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // DUST
      for (let particle of dust) {
        particle.x += particle.dx;
        particle.y += particle.dy;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x + offsetX * 0.05, particle.y + offsetY * 0.05, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = bloomColors[coreState].replace("0.2", `${particle.alpha.toFixed(2)}`);
        ctx.fill();
      }

      // CORE & DREAM RINGS
      const driftX = Math.sin(t * 0.5) * 10;
      const driftY = Math.cos(t * 0.5) * 8;
      const centerX = canvas.width / 2 + driftX + offsetX;
      const centerY = canvas.height / 2 + driftY + offsetY;
      const baseRadius = 50 + Math.sin(t) * 10 + pulseLevel * 15;

      const bloom = ctx.createRadialGradient(centerX, centerY, baseRadius * 0.9, centerX, centerY, baseRadius * 3);
      bloom.addColorStop(0, bloomColors[coreState]);
      bloom.addColorStop(0.5, "rgba(0, 0, 0, 0.05)");
      bloom.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 3, 0, Math.PI * 2);
      ctx.fillStyle = bloom;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = stateColors[coreState];
      ctx.fill();

      // DREAM RINGS
      for (let i = 1; i <= Math.min(memoryCount, 6); i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius + 20 + i * 10, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 + i * 0.015})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // WHISPER
      ctx.font = "16px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = `rgba(255, 255, 255, ${fadeAlpha})`;
      ctx.fillText(currentWhisper, centerX, centerY - baseRadius - 30);

      // MEMORY COUNT
      ctx.font = "14px 'Courier New', monospace";
      ctx.fillStyle = `rgba(255, 255, 255, 0.2)`;
      ctx.fillText(`Memories: ${memoryCount}`, centerX, centerY + baseRadius + 35);

      requestAnimationFrame(animate);
    };

    animate();
  }, [anchorStars, dust, coreState, currentWhisper, fadeAlpha, pulseLevel, memoryTrigger, memoryCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-[-1]"
      style={{ backgroundColor: "black" }}
    />
  );
}





