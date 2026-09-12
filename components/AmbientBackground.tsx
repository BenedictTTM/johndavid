"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

// ─── Warm Atmospheric Blob Config ──────────────────────────────────────────
// Custom warm ambient lights floating gracefully on #F5F1D5 ivory background
const BLOBS = [
  // Warm Primary Amber Glow — bottom-left
  { x: 0.15, y: 0.75, rx: 0.50, ry: 0.44, color: [238, 222, 185] as const, alpha: 0.32, phase: 0.00, speed: 0.00045, driftX: 0.050, driftY: 0.040 },
  // Soft Accent Honey Glow — top-right
  { x: 0.82, y: 0.20, rx: 0.42, ry: 0.36, color: [242, 218, 175] as const, alpha: 0.25, phase: 2.10, speed: 0.00035, driftX: 0.045, driftY: 0.055 },
  // Centre Subtle Diffusion — mid
  { x: 0.50, y: 0.50, rx: 0.36, ry: 0.30, color: [248, 241, 215] as const, alpha: 0.20, phase: 4.30, speed: 0.00055, driftX: 0.035, driftY: 0.030 },
  // Warm Terracotta Accent — bottom-right
  { x: 0.85, y: 0.82, rx: 0.28, ry: 0.24, color: [225, 175, 125] as const, alpha: 0.15, phase: 1.20, speed: 0.00040, driftX: 0.040, driftY: 0.035 },
  // Soft Ivory Highlight — top area
  { x: 0.28, y: 0.15, rx: 0.30, ry: 0.25, color: [255, 248, 216] as const, alpha: 0.35, phase: 3.50, speed: 0.00050, driftX: 0.040, driftY: 0.045 },
] as const;

const GRAIN_SIZE = 192;
const GRAIN_UPDATE = 3;

export default function AmbientBackground() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const tickRef = useRef(0);
  const drawFrameRef = useRef<((ts: number) => void) | null>(null);

  const grainTileRef = useRef<string[]>([]);

  const buildGrainPool = useCallback(() => {
    const pool: string[] = [];
    for (let i = 0; i < 8; i++) {
      const off = document.createElement("canvas");
      off.width = off.height = GRAIN_SIZE;
      const oc = off.getContext("2d")!;
      const id = oc.createImageData(GRAIN_SIZE, GRAIN_SIZE);
      for (let j = 0; j < id.data.length; j += 4) {
        const v = (Math.random() * 255) | 0;
        id.data[j] = id.data[j + 1] = id.data[j + 2] = v;
        id.data[j + 3] = 255;
      }
      oc.putImageData(id, 0, 0);
      pool.push(off.toDataURL());
    }
    grainTileRef.current = pool;
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
  }, []);

  const drawFrame = useCallback((ts: number) => {
    const canvas = canvasRef.current;
    const grain = grainRef.current;
    if (!canvas || !grain) return;

    const ctx = canvas.getContext("2d")!;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    tickRef.current++;

    // 1 ── Base warm ivory environment gradient (#F5F1D5 base)
    ctx.clearRect(0, 0, w, h);
    const base = ctx.createLinearGradient(0, 0, 0, h);
    base.addColorStop(0, "#F5F1D5");
    base.addColorStop(0.5, "#F0ECCF");
    base.addColorStop(1, "#E8E2C0");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    // 2 ── Atmospheric blobs
    for (const b of BLOBS) {
      const angle = ts * b.speed;
      const ox = Math.sin(angle + b.phase) * b.driftX;
      const oy = Math.cos(angle * 0.71 + b.phase) * b.driftY;
      const breath = 1 + Math.sin(angle * 1.27 + b.phase * 0.5) * 0.055;
      const bx = (b.x + ox) * w;
      const by = (b.y + oy) * h;
      const srx = b.rx * w * breath;
      const sry = b.ry * h * breath;
      const radius = Math.max(srx, sry);
      const alphaV = b.alpha * (0.88 + Math.sin(angle * 0.93 + b.phase) * 0.12);

      const [r, g, bl] = b.color;
      const grad = ctx.createRadialGradient(bx, by, 0, bx, by, radius);
      grad.addColorStop(0, `rgba(${r},${g},${bl},${alphaV})`);
      grad.addColorStop(0.40, `rgba(${r},${g},${bl},${alphaV * 0.50})`);
      grad.addColorStop(0.75, `rgba(${r},${g},${bl},${alphaV * 0.15})`);
      grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);

      ctx.save();
      ctx.translate(bx, by);
      ctx.scale(srx / radius, sry / radius);
      ctx.translate(-bx, -by);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bx, by, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3 ── Subtle warm vignette framing
    const vig = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
    vig.addColorStop(0, "rgba(245,241,213,0)");
    vig.addColorStop(0.65, "rgba(245,241,213,0)");
    vig.addColorStop(1, "rgba(84,42,0,0.04)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);

    // 4 ── Animated paper film grain
    if (tickRef.current % GRAIN_UPDATE === 0 && grainTileRef.current.length) {
      const idx = ((tickRef.current / GRAIN_UPDATE) % grainTileRef.current.length) | 0;
      grain.style.backgroundImage = `url(${grainTileRef.current[idx]})`;
      grain.style.backgroundPosition = `${(Math.random() * GRAIN_SIZE) | 0}px ${(Math.random() * GRAIN_SIZE) | 0}px`;
    }

    rafRef.current = requestAnimationFrame((nextTs) => drawFrameRef.current?.(nextTs));
  }, []);

  useEffect(() => {
    drawFrameRef.current = drawFrame;
    if (isAdmin) return;
    buildGrainPool();
    resize();
    rafRef.current = requestAnimationFrame(drawFrame);

    const ro = new ResizeObserver(resize);
    if (canvasRef.current) ro.observe(canvasRef.current);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [isAdmin, buildGrainPool, resize, drawFrame]);

  if (isAdmin) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          willChange: "transform",
        }}
      />
      <div
        ref={grainRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.022,
          backgroundSize: `${GRAIN_SIZE}px ${GRAIN_SIZE}px`,
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}