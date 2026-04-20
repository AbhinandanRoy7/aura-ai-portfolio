import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link as LinkIcon, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
  tech?: string[];
  metrics?: { label: string; value: string }[];
  github?: string;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({ timelineData }: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState: Record<number, boolean> = {};
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relatedItems = getRelatedItems(id);
        const np: Record<number, boolean> = {};
        relatedItems.forEach((r) => (np[r] = true));
        setPulseEffect(np);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return newState;
    });
  };

  useEffect(() => {
    let t: ReturnType<typeof setInterval>;
    if (autoRotate) {
      t = setInterval(() => {
        setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
      }, 50);
    }
    return () => clearInterval(t);
  }, [autoRotate]);

  const centerViewOnNode = (nodeId: number) => {
    const idx = timelineData.findIndex((i) => i.id === nodeId);
    const total = timelineData.length;
    const target = (idx / total) * 360;
    setRotationAngle(270 - target);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 220;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (id: number) => timelineData.find((i) => i.id === id)?.relatedIds || [];
  const isRelatedToActive = (id: number) => activeNodeId !== null && getRelatedItems(activeNodeId).includes(id);

  const getStatusStyles = (s: TimelineItem["status"]) => {
    switch (s) {
      case "completed": return "text-primary-foreground bg-primary border-primary/50";
      case "in-progress": return "text-background bg-accent border-accent/50";
      case "pending": return "text-foreground bg-muted border-border";
    }
  };

  return (
    <div
      className="w-full h-[700px] flex items-center justify-center overflow-hidden relative"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center" ref={orbitRef}>
        {/* Center sun */}
        <div className="absolute w-20 h-20 rounded-full flex items-center justify-center z-10"
          style={{ background: "var(--gradient-glow)", boxShadow: "var(--shadow-neon)" }}>
          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
          <div className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Orbit rings */}
        <div className="absolute w-[440px] h-[440px] rounded-full border border-primary/20" />
        <div className="absolute w-[460px] h-[460px] rounded-full border border-accent/10" />

        {timelineData.map((item, index) => {
          const position = calculateNodePosition(index, timelineData.length);
          const isExpanded = expandedItems[item.id];
          const isRelated = isRelatedToActive(item.id);
          const isPulsing = pulseEffect[item.id];
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              ref={(el) => (nodeRefs.current[item.id] = el)}
              className="absolute transition-all duration-700 cursor-pointer"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                zIndex: isExpanded ? 200 : position.zIndex,
                opacity: isExpanded ? 1 : position.opacity,
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleItem(item.id);
              }}
            >
              {/* Glow + ping */}
              {isPulsing && <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" style={{ width: 56, height: 56, left: -8, top: -8 }} />}
              <div
                className={`absolute rounded-full -inset-2 ${isExpanded ? "bg-primary/30" : isRelated ? "bg-accent/20" : "bg-primary/10"} blur-md transition-all`}
              />

              <div
                className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                  ${isExpanded ? "bg-primary border-primary scale-125 text-primary-foreground" :
                    isRelated ? "bg-accent/30 border-accent text-accent" :
                    "bg-background/80 border-primary/40 text-primary hover:border-primary"}`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className={`absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider transition-all
                ${isExpanded ? "text-primary font-bold scale-110" : "text-muted-foreground"}`}>
                {item.title}
              </div>

              {isExpanded && (
                <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-80 glass border-primary/30 shadow-2xl"
                  style={{ boxShadow: "var(--shadow-neon)" }}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center mb-1">
                      <Badge className={`text-[10px] font-mono ${getStatusStyles(item.status)}`}>
                        {item.status.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] font-mono text-muted-foreground">{item.date}</span>
                    </div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-3">
                    <p className="text-muted-foreground leading-relaxed">{item.content}</p>

                    {/* Energy */}
                    <div>
                      <div className="flex justify-between font-mono text-[10px] mb-1">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Zap className="w-3 h-3" /> Impact
                        </span>
                        <span className="text-primary">{item.energy}%</span>
                      </div>
                      <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${item.energy}%`, background: "var(--gradient-glow)" }} />
                      </div>
                    </div>

                    {/* Metrics */}
                    {item.metrics && (
                      <div className="grid grid-cols-2 gap-2">
                        {item.metrics.map((m) => (
                          <div key={m.label} className="glass rounded-md p-2 border-primary/10">
                            <div className="text-[10px] text-muted-foreground font-mono uppercase">{m.label}</div>
                            <div className="text-sm font-bold text-primary">{m.value}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech */}
                    {item.tech && (
                      <div>
                        <div className="font-mono text-[10px] text-muted-foreground mb-1.5">// STACK</div>
                        <div className="flex flex-wrap gap-1">
                          {item.tech.map((t) => (
                            <Badge key={t} variant="outline" className="text-[9px] font-mono border-primary/30">{t}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.relatedIds.length > 0 && (
                      <div className="pt-2 border-t border-border">
                        <div className="flex items-center gap-1 mb-1.5">
                          <LinkIcon className="w-3 h-3 text-muted-foreground" />
                          <span className="font-mono text-[10px] text-muted-foreground">CONNECTED</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.relatedIds.map((rid) => {
                            const r = timelineData.find((i) => i.id === rid);
                            return (
                              <Button
                                key={rid}
                                variant="outline"
                                size="sm"
                                className="h-6 text-[10px] px-2 border-primary/20 hover:border-primary"
                                onClick={(e) => { e.stopPropagation(); toggleItem(rid); }}
                              >
                                {r?.title} <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {item.github && (
                      <a href={item.github} target="_blank" rel="noreferrer">
                        <Button size="sm" className="w-full mt-2 h-7 text-xs">View on GitHub →</Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
