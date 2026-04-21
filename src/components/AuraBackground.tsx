import { useEffect, useRef } from "react";

/**
 * AuraBackground
 * Canvas-based fluid energy ribbon that drifts slowly and reacts to cursor.
 * - Bezier wave with sine + pseudo-noise distortion
 * - Magnetic pull toward mouse (lerp)
 * - Parallax depth shift
 * - Local glow intensity near cursor
 */
export const AuraBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999, tx: -9999, ty: -9999, active: false });
  const reduced = useRef(false);

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
      if (now - lastMove < 16) return; // throttle ~60fps
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

    // pseudo-noise: sum of sines
    const noise = (x: number, t: number) =>
      Math.sin(x * 0.6 + t * 0.7) * 0.5 +
      Math.sin(x * 1.3 + t * 0.4) * 0.3 +
      Math.sin(x * 2.1 + t * 1.1) * 0.2;

    const drawRibbon = (
      t: number,
      yBase: number,
      amp: number,
      hue: string,
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

        // magnetic pull toward mouse
        if (mouse.current.active) {
          const dx = x - mx;
          const dist = Math.hypot(dx, y - my);
          const influence = Math.max(0, 1 - dist / 380);
          y += (my - y) * influence * pull;
        }
        points.push({ x, y });
      }

      ctx.save();
      ctx.filter = `blur(${blur}px)`;
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = alpha;

      // gradient along ribbon
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, "hsla(220, 100%, 70%, 0)");
      grad.addColorStop(0.2, `hsla(215, 100%, 70%, 1)`);
      grad.addColorStop(0.5, hue);
      grad.addColorStop(0.8, `hsla(190, 100%, 75%, 1)`);
      grad.addColorStop(1, "hsla(190, 100%, 80%, 0)");

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

      // inner brighter core
      ctx.filter = `blur(${blur * 0.3}px)`;
      ctx.lineWidth = 14;
      ctx.strokeStyle = "hsla(195, 100%, 92%, 0.85)";
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

    // init mouse to center for smooth start
    mouse.current.tx = window.innerWidth / 2;
    mouse.current.ty = window.innerHeight / 3;
    mouse.current.x = mouse.current.tx;
    mouse.current.y = mouse.current.ty;

    let raf = 0;
    let start = performance.now();
    const speed = reduced.current ? 0.0001 : 0.00045;

    const tick = (now: number) => {
      const t = (now - start) * speed;

      // lerp mouse for delayed magnetic feel
      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.06;
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.06;

      ctx.clearRect(0, 0, w, h);

      // parallax: shift base lines toward mouse subtly
      const px = mouse.current.active ? (mouse.current.x - w / 2) * 0.04 : 0;
      const py = mouse.current.active ? (mouse.current.y - h / 2) * 0.03 : 0;

      // local glow boost near cursor
      if (mouse.current.active) {
        const r = ctx.createRadialGradient(
          mouse.current.x,
          mouse.current.y,
          0,
          mouse.current.x,
          mouse.current.y,
          320,
        );
        r.addColorStop(0, "hsla(199, 100%, 70%, 0.18)");
        r.addColorStop(1, "hsla(199, 100%, 70%, 0)");
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = r;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }

      // three layered ribbons for depth
      drawRibbon(
        t,
        h * 0.45 + py,
        110,
        "hsla(199, 100%, 65%, 1)",
        0.45,
        40,
        0,
        mouse.current.x - px,
        mouse.current.y,
        0.18,
      );
      drawRibbon(
        t * 1.2,
        h * 0.55 + py * 1.3,
        90,
        "hsla(220, 100%, 72%, 1)",
        0.32,
        55,
        2.1,
        mouse.current.x - px * 1.5,
        mouse.current.y,
        0.12,
      );
      drawRibbon(
        t * 0.8,
        h * 0.5 + py * 0.6,
        70,
        "hsla(190, 100%, 78%, 1)",
        0.28,
        30,
        4.2,
        mouse.current.x - px * 0.5,
        mouse.current.y,
        0.22,
      );

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
      <div className="absolute inset-0 bg-background" />

      {/* Animated aura canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Grid overlay (preserved) */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(199 100% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(199 100% 60%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
    </div>
  );
};
