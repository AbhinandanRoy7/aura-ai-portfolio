import { useEffect, useState } from "react";

export const CursorGlow = () => {
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-50 h-[400px] w-[400px] rounded-full transition-transform duration-100 ease-out hidden md:block"
      style={{
        left: pos.x - 200,
        top: pos.y - 200,
        background: "radial-gradient(circle, hsl(199 100% 60% / 0.15), transparent 60%)",
        filter: "blur(40px)",
      }}
    />
  );
};
