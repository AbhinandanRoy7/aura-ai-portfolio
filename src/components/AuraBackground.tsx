export const AuraBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-background" />

      {/* Aura wave - layered glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full animate-aura animate-aura-pulse"
        style={{ background: "radial-gradient(circle, hsl(199 100% 60% / 0.35), transparent 60%)" }}
      />
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] rounded-full animate-aura"
        style={{
          background: "radial-gradient(circle, hsl(270 80% 65% / 0.25), transparent 60%)",
          animationDelay: "-6s",
          filter: "blur(70px)",
        }}
      />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full animate-aura"
        style={{
          background: "radial-gradient(circle, hsl(220 100% 70% / 0.2), transparent 60%)",
          animationDelay: "-12s",
          filter: "blur(60px)",
        }}
      />

      {/* Animated SVG wave */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="aura-blur">
            <feGaussianBlur stdDeviation="20" />
          </filter>
          <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(199 100% 60%)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(220 100% 70%)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(270 80% 65%)" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path
          fill="none"
          stroke="url(#wave-grad)"
          strokeWidth="3"
          filter="url(#aura-blur)"
          d="M 0 400 Q 300 200 600 400 T 1200 400 T 1800 400"
        >
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M 0 400 Q 300 200 600 400 T 1200 400 T 1800 400;
              M 0 420 Q 300 600 600 380 T 1200 420 T 1800 380;
              M 0 380 Q 300 300 600 420 T 1200 380 T 1800 420;
              M 0 400 Q 300 200 600 400 T 1200 400 T 1800 400"
          />
        </path>
      </svg>

      {/* Grid */}
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
