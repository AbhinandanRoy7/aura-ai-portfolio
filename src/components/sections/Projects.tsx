import { motion } from "framer-motion";
import { Film, Sparkles, Brain, Code2 } from "lucide-react";
import RadialOrbitalTimeline, { TimelineItem } from "@/components/ui/radial-orbital-timeline";

const projects: TimelineItem[] = [
  {
    id: 1,
    title: "Video Engine",
    date: "Jun 2025",
    content: "Backend recommendation service serving 100K+ videos with 83% accuracy and 15% lift over collaborative filtering. Optimized FastAPI endpoints to <100ms latency.",
    category: "Recommendation",
    icon: Film,
    relatedIds: [4],
    status: "completed",
    energy: 95,
    tech: ["FastAPI", "Python", "PostgreSQL", "Redis"],
    metrics: [
      { label: "Accuracy", value: "83%" },
      { label: "Latency", value: "<100ms" },
      { label: "RPS", value: "500+/min" },
      { label: "Engagement", value: "+25%" },
    ],
    github: "https://github.com",
  },
  {
    id: 2,
    title: "GAN Faces",
    date: "Jan 2026",
    content: "Trained on 200K+ images to generate high-resolution faces. Implemented Batch Normalization to stabilize training, reducing convergence time by 40%.",
    category: "Generative AI",
    icon: Sparkles,
    relatedIds: [3],
    status: "completed",
    energy: 88,
    tech: ["PyTorch", "GANs", "CUDA", "OpenCV"],
    metrics: [
      { label: "Dataset", value: "200K+" },
      { label: "Convergence", value: "-40%" },
      { label: "Compute Saved", value: "12hrs" },
      { label: "Resolution", value: "HD" },
    ],
    github: "https://github.com",
  },
  {
    id: 3,
    title: "Brain Tumor Seg",
    date: "Mar 2026",
    content: "U-Net (ResNet50) brain tumor segmentation system using PyTorch & Flask. Reduced manual effort by 70% and sped up MRI analysis 5x with Grad-CAM visualization.",
    category: "Medical AI",
    icon: Brain,
    relatedIds: [2, 4],
    status: "in-progress",
    energy: 79,
    tech: ["PyTorch", "U-Net", "ResNet50", "Flask", "Grad-CAM"],
    metrics: [
      { label: "Dice Score", value: "0.79" },
      { label: "Manual Effort", value: "-70%" },
      { label: "Speed Up", value: "5x" },
      { label: "Backbone", value: "ResNet50" },
    ],
    github: "https://github.com",
  },
  {
    id: 4,
    title: "Code Navigator",
    date: "Mar 2026",
    content: "RAG-based code assistant (FastAPI, FAISS, Gemini) for GitHub repos. AST chunking + vector search + LLM reasoning with fallbacks delivering <5s responses.",
    category: "GenAI / RAG",
    icon: Code2,
    relatedIds: [1, 3],
    status: "completed",
    energy: 92,
    tech: ["FastAPI", "FAISS", "Gemini", "RAG", "AST"],
    metrics: [
      { label: "Response", value: "<5s" },
      { label: "Exploration", value: "-70%" },
      { label: "Onboarding", value: "+50%" },
      { label: "Speed Up", value: "60%" },
    ],
    github: "https://github.com",
  },
];

export const Projects = () => {
  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-mono text-xs text-primary tracking-widest mb-4">// 02 — PROJECTS</p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Orbital <span className="text-gradient">Constellation</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Click any node to expand. Each satellite is a deployed system shipping real impact.
          </p>
        </motion.div>

        <RadialOrbitalTimeline timelineData={projects} />
      </div>
    </section>
  );
};
