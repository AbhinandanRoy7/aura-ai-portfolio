import { motion } from "framer-motion";
import { SplineScene } from "@/components/ui/splite";
import { Brain, Code2, Cpu, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center pt-24">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center px-6 relative z-10">
        {/* LEFT */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 font-mono text-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">UPLINK_ESTABLISHED</span>
          </motion.div>

          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9]"
            >
              <span className="block animate-glitch text-gradient">GENAI</span>
              <span className="block text-foreground">ENGINEER</span>
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-3xl md:text-5xl font-light text-muted-foreground tracking-tight"
            >
              & <span className="text-foreground/80">ML Engineer</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-lg leading-relaxed"
          >
            Building intelligent systems with{" "}
            <span className="text-primary font-medium">LLMs</span>,{" "}
            <span className="text-accent font-medium">RAG pipelines</span> & scalable AI infrastructure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="flex flex-wrap gap-3"
          >
            <a href="#projects" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:scale-105 transition-transform glow-border">
              View Work →
            </a>
            <a
              href="https://drive.google.com/file/d/1ahxUVfwFCKmw_K271EQQtRbeHdC3VLwP/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-full glass font-medium hover:border-primary/50 transition-colors"
            >
              Resume
            </a>
          </motion.div>

          {/* Floating UI cards */}
          <div className="hidden md:flex gap-3 pt-6">
            {[
              { icon: Brain, label: "LLM" },
              { icon: Cpu, label: "PyTorch" },
              { icon: Code2, label: "FastAPI" },
              { icon: Sparkles, label: "RAG" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="glass rounded-xl px-3 py-2 flex items-center gap-2 animate-float"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                <item.icon className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT - Spline 3D */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative h-[400px] lg:h-[600px] w-full"
        >
          <div className="absolute inset-0 rounded-3xl glass overflow-hidden">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
          {/* Decorative corner brackets */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary/60" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary/60" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary/60" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary/60" />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-muted-foreground"
      >
        SCROLL ↓
      </motion.div>
    </section>
  );
};
