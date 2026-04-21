import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

/**
 * AuraBackground
 * Canvas-based fluid energy ribbon, theme-aware (dark/light).
 * - Smoothly interpolates color/opacity/blur between themes
 * - Magnetic cursor pull, parallax, local glow
 */

type Palette = {
  stops: [string, string, string, string, string]; // 5 gradient stops
  core: string;
  glow: string; // radial glow color near cursor
  alphas: [number, number, number]; // ribbon alphas
  blurs: [number, number, number];
  pullScale: number;
  blend: GlobalCompositeOperation;
};

const DARK: Palette = {
  stops: [
    "hsla(220, 100%, 70%, 0)",
    "hsla(215, 100%, 70%, 1)",
    "hsla(199, 100%, 65%, 1)",
    "hsla(190, 100%, 75%, 1)",
    "hsla(190, 100%, 80%, 0)",
  ],
  core: "hsla(195, 100%, 92%, 0.85)",
  glow: "hsla(199, 100%, 70%, 0.18)",
  alphas: [0.45, 0.32, 0.28],
  blurs: [40, 55, 30],
  pullScale: 1,
  blend: "screen",
};

const LIGHT: Palette = {
  stops: [
    "hsla(210, 100%, 70%, 0)",
    "hsla(210, 100%, 65%, 0.9)",
    "hsla(195, 90%, 60%, 0.9)",
    "hsla(220, 90%, 70%, 0.9)",
    "hsla(220, 100%, 80%, 0)",
  ],
  core: "hsla(210, 100%, 75%, 0.55)",
  glow: "hsla(210, 100%, 60%, 0.10)",
  alphas: [0.22, 0.16, 0.14],
  blurs: [55, 70, 45],
  pullScale: 0.5,
  blend: "multiply",
};

// parse hsla(h, s%, l%, a) -> [h,s,l,a]
const parseHsla = (s: string): [number, number, number, number] => {
  const m = s.match(/hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*,?\s*([\d.]+)?\s*\)/);
  if (!m) return [0, 0, 0, 1];
  return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]), m[4] ? parseFloat(m[4]) : 1];
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpHsla = (a: string, b: string, t: number) => {
  const [h1, s1, l1, a1] = parseHsla(a);
  const [h2, s2, l2, a2] = parseHsla(b);
  return `hsla(${lerp(h1, h2, t)}, ${lerp(s1, s2, t)}%, ${lerp(l1, l2, t)}%, ${lerp(a1, a2, t)})`;
};
const lerpPalette = (a: Palette, b: Palette, t: number): Palette => ({
  stops: a.stops.map((s, i) => lerpHsla(s, b.stops[i], t)) as Palette["stops"],
  core: lerpHsla(a.core, b.core, t),
  glow: lerpHsla(a.glow, b.glow, t),
  alphas: [
    lerp(a.alphas[0], b.alphas[0], t),
    lerp(a.alphas[1], b.alphas[1], t),
    lerp(a.alphas[2], b.alphas[2], t),
  ],
  blurs: [
    lerp(a.blurs[0], b.blurs[0], t),
    lerp(a.blurs[1], b.blurs[1], t),
    lerp(a.blurs[2], b.blurs[2], t),
  ],
  pullScale: lerp(a.pullScale, b.pullScale, t),
  blend: t < 0.5 ? a.blend : b.blend,
});

export const AuraBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999, tx: -9999, ty: -9999, active: false });
  const reduced = useRef(false);
  const { resolvedTheme } = useTheme();
  const targetTheme = useRef<"dark" | "light">("dark");
  const blend = useRef(0); // 0 = dark, 1 = light
  const blendTarget = useRef(0);

  useEffect(() => {
    targetTheme.current = resolvedTheme === "light" ? "light" : "dark";
    blendTarget.current = targetTheme.current === "light" ? 1 : 0;
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let lastMove = 0;
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMove < 16) return;
      lastMove = now;
      const rect = canvas.getBoundingClientRect();
      mouse.current.tx = e.clientX - rect.left;
      mouse.current.ty = e.clientY - rect.top;
      mouse.current.active = true;
    };
    const onLeave = () => {
      mouse.current.active = false;
      mouse.current.tx = w / 2;
      mouse.current.ty = h / 2;
    };
    if (!isMobile) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseleave", onLeave);
    }

    const noise = (x: number, t: number) =>
      Math.sin(x * 0.6 + t * 0.7) * 0.5 +
      Math.sin(x * 1.3 + t * 0.4) * 0.3 +
      Math.sin(x * 2.1 + t * 1.1) * 0.2;

    const drawRibbon = (
      pal: Palette,
      t: number,
      yBase: number,
      amp: number,
      alpha: number,
      blur: number,
      phase: number,
      mx: number,
      my: number,
      pull: number,
    ) => {
      const segments = 60;
      const points: { x: number; y: number }[] = [];
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * (w + 200) - 100;
        const n = noise(i * 0.15 + phase, t);
        let y = yBase + n * amp + Math.sin(t * 0.6 + i * 0.2 + phase) * (amp * 0.25);

        if (mouse.current.active) {
          const dx = x - mx;
          const dist = Math.hypot(dx, y - my);
          const influence = Math.max(0, 1 - dist / 380);
          y += (my - y) * influence * pull * pal.pullScale;
        }
        points.push({ x, y });
      }

      ctx.save();
      ctx.filter = `blur(${blur}px)`;
      ctx.globalCompositeOperation = pal.blend;
      ctx.globalAlpha = alpha;

      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, pal.stops[0]);
      grad.addColorStop(0.2, pal.stops[1]);
      grad.addColorStop(0.5, pal.stops[2]);
      grad.addColorStop(0.8, pal.stops[3]);
      grad.addColorStop(1, pal.stops[4]);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 90;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.stroke();

      ctx.filter = `blur(${blur * 0.3}px)`;
      ctx.lineWidth = 14;
      ctx.strokeStyle = pal.core;
      ctx.globalAlpha = alpha * 0.7;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.stroke();

      ctx.restore();
    };

    mouse.current.tx = window.innerWidth / 2;
    mouse.current.ty = window.innerHeight / 3;
    mouse.current.x = mouse.current.tx;
    mouse.current.y = mouse.current.ty;

    let raf = 0;
    const start = performance.now();
    const speed = reduced.current ? 0.0001 : 0.00045;

    const tick = (now: number) => {
      const t = (now - start) * speed;

      // smooth theme blend
      blend.current += (blendTarget.current - blend.current) * 0.05;
      const pal = lerpPalette(DARK, LIGHT, blend.current);

      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.06;
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.06;

      ctx.clearRect(0, 0, w, h);

      const px = mouse.current.active ? (mouse.current.x - w / 2) * 0.04 : 0;
      const py = mouse.current.active ? (mouse.current.y - h / 2) * 0.03 : 0;

      if (mouse.current.active) {
        const r = ctx.createRadialGradient(
          mouse.current.x,
          mouse.current.y,
          0,
          mouse.current.x,
          mouse.current.y,
          320,
        );
        r.addColorStop(0, pal.glow);
        r.addColorStop(1, pal.glow.replace(/[\d.]+\)$/, "0)"));
        ctx.save();
        ctx.globalCompositeOperation = pal.blend;
        ctx.fillStyle = r;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }

      drawRibbon(pal, t, h * 0.45 + py, 110, pal.alphas[0], pal.blurs[0], 0, mouse.current.x - px, mouse.current.y, 0.18);
      drawRibbon(pal, t * 1.2, h * 0.55 + py * 1.3, 90, pal.alphas[1], pal.blurs[1], 2.1, mouse.current.x - px * 1.5, mouse.current.y, 0.12);
      drawRibbon(pal, t * 0.8, h * 0.5 + py * 0.6, 70, pal.alphas[2], pal.blurs[2], 4.2, mouse.current.x - px * 0.5, mouse.current.y, 0.22);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base background */}
      <div className="absolute inset-0 bg-background transition-colors duration-500" />

      {/* Animated aura canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background transition-colors duration-500" />
    </div>
  );
};
