"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { RefreshCcw } from "lucide-react";

export default function DarkScratchPadOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [resetKey, setResetKey] = useState(Date.now());
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion || typeof window === "undefined") return;
    const canvas = canvasRef.current!;
    const overlay = overlayRef.current!;
    const ctx = canvas.getContext("2d")!;
    const overlayCtx = overlay.getContext("2d")!;

    // Use the bounding box of the parent div (the theme-card panel)
    const parent = canvas.parentElement!;
    const resize = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = overlay.width = rect.width;
      canvas.height = overlay.height = rect.height;

      // Generate gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      const stops = 12;
      const hueOffset = Math.floor(Math.random() * 360);
      for (let i = 0; i <= stops; i++) {
        const hue = (hueOffset + (360 / stops) * i) % 360;
        gradient.addColorStop(i / stops, `hsl(${hue}, 100%, 60%)`);
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Fill overlay with black
      overlayCtx.fillStyle = "black";
      overlayCtx.fillRect(0, 0, overlay.width, overlay.height);
    };

    resize();
    window.addEventListener("resize", resize);

    overlayCtx.globalCompositeOperation = "destination-out";
    overlayCtx.lineCap = "round";
    overlayCtx.lineJoin = "round";
    overlayCtx.lineWidth = 6;

    let drawing = false;

    overlayCtx.fillStyle = "rgba(255, 255, 255, 0.28)";
    overlayCtx.font = "24px 'Courier New', monospace";
    overlayCtx.textAlign = "center";
    overlayCtx.textBaseline = "middle";
    overlayCtx.fillText("Draw on me", overlay.width / 2, overlay.height / 2);

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = overlay.getBoundingClientRect();
      if ("touches" in e) {
        const t = e.touches[0];
        return { x: t.clientX - rect.left, y: t.clientY - rect.top };
      }
      return { x: (e as MouseEvent).clientX - rect.left, y: (e as MouseEvent).clientY - rect.top };
    };

    const startDraw = (e: MouseEvent | TouchEvent) => {
      drawing = true;
      const { x, y } = getPos(e);
      overlayCtx.beginPath();
      overlayCtx.moveTo(x, y);
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!drawing) return;
      const { x, y } = getPos(e);
      overlayCtx.lineTo(x, y);
      overlayCtx.stroke();
    };

    const stopDraw = () => {
      drawing = false;
      overlayCtx.closePath();
    };

    overlay.addEventListener("mousedown", startDraw);
    overlay.addEventListener("mousemove", draw);
    overlay.addEventListener("mouseup", stopDraw);
    overlay.addEventListener("mouseleave", stopDraw);

    overlay.addEventListener("touchstart", startDraw);
    overlay.addEventListener("touchmove", draw);
    overlay.addEventListener("touchend", stopDraw);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [resetKey, reduceMotion]);

  if (reduceMotion) return null;
  return (
    <div className="absolute inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <canvas
        ref={overlayRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
      />
      <button
        onClick={() => setResetKey(Date.now())}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 text-white rounded-full p-2 border border-white hover:bg-white hover:text-black transition"
        aria-label="Reset Scratchpad"
        style={{ pointerEvents: "auto" }}
      >
        <RefreshCcw className="w-5 h-5" />
      </button>
    </div>
  );
}
