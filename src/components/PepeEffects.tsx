// PepeEffects.tsx — Enhanced Forge with Inner Pulse Ring + Vertical Energy Flow
"use client";
import { useEffect, useRef } from "react";

export default function PepeEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stardustCount = 120;
    const starCount = 80;
    const echoCount = 35;
    const verticalSparksCount = 25;

    let stardust = Array.from({ length: stardustCount }, () => createStardust());
    let stars = Array.from({ length: starCount }, () => createStar());
    let echoes = Array.from({ length: echoCount }, () => createEcho());
    let sparks = Array.from({ length: verticalSparksCount }, () => createSpark());

    let pulse = { radius: 0, alpha: 0 };

    function createStardust() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.4 + 0.6,
        speed: Math.random() * 0.3 + 0.1,
        alpha: Math.random() * 0.4 + 0.3
      };
    }

    function createStar() {
      const zone = Math.random();
      const x = zone < 0.5
        ? Math.random() * (width * 0.25)
        : Math.random() * (width * 0.25) + width * 0.75;
      return {
        x,
        y: Math.random() * height,
        size: Math.random() * 1.2 + 0.4,
        alpha: Math.random() * 0.4 + 0.2,
        twinkle: Math.random() * 0.02 + 0.005
      };
    }

    function createEcho() {
      const angle = Math.random() * Math.PI * 2;
      const radius = 180 + Math.random() * 40;
      return {
        baseX: width / 2 + 236,
        baseY: height * 0.74,
        angle,
        radius,
        size: Math.random() * 4 + 2,
        speed: 0.006 + Math.random() * 0.003,
        alpha: 0.3 + Math.random() * 0.35
      };
    }

    function createSpark() {
      return {
        x: width / 2 + 236 + (Math.random() - 0.5) * 8,
        y: height * 0.74 + Math.random() * 20,
        vy: -1.2 - Math.random() * 0.8,
        alpha: 0.3 + Math.random() * 0.3,
        size: Math.random() * 1.5 + 1.2
      };
    }

    let pulseTimer = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        s.alpha += (Math.random() - 0.5) * s.twinkle;
        s.alpha = Math.max(0.1, Math.min(0.6, s.alpha));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.fill();
      }

      for (const p of stardust) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 130, 214, ${p.alpha})`;
        ctx.fill();
        p.y += p.speed;
        if (p.y > height) {
          p.x = Math.random() * width;
          p.y = -5;
        }
      }

      for (const e of echoes) {
        e.angle += e.speed;
        const x = e.baseX + Math.cos(e.angle) * e.radius;
        const y = e.baseY + Math.sin(e.angle) * e.radius * 0.4;
        ctx.beginPath();
        ctx.arc(x, y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 130, 214, ${e.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(255, 130, 214, ${e.alpha * 0.6})`;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(x - Math.cos(e.angle) * 4, y - Math.sin(e.angle) * 2, e.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,130,214,${e.alpha * 0.3})`;
        ctx.fill();
      }

      for (const sp of sparks) {
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,130,214,${sp.alpha})`;
        ctx.fill();
        sp.y += sp.vy;
        sp.alpha *= 0.97;
      }
      sparks = sparks.filter(sp => sp.alpha > 0.05);
      while (sparks.length < verticalSparksCount) {
        sparks.push(createSpark());
      }

      if (pulse.alpha > 0.01) {
        ctx.beginPath();
        ctx.arc(width / 2 + 236, height * 0.74, pulse.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,130,214,${pulse.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        pulse.radius += 0.7;
        pulse.alpha *= 0.96;
      } else {
        pulseTimer++;
        if (pulseTimer >= 180) {
          pulse = { radius: 5, alpha: 0.2 };
          pulseTimer = 0;
        }
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      stardust = Array.from({ length: stardustCount }, () => createStardust());
      stars = Array.from({ length: starCount }, () => createStar());
      echoes = Array.from({ length: echoCount }, () => createEcho());
      sparks = Array.from({ length: verticalSparksCount }, () => createSpark());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-[1] pointer-events-none"
      style={{ backgroundColor: "transparent" }}
    />
  );
}

