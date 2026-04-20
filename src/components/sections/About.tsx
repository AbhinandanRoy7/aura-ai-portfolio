import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, Award } from "lucide-react";

const skills = [
  "Python", "PyTorch", "TensorFlow", "LLMs", "RAG", "FastAPI",
  "Transformers", "Kafka", "Docker", "Kubernetes", "PostgreSQL",
  "FAISS", "Gemini", "OpenCV", "YOLO", "Scikit-Learn"
];

const cards = [
  {
    icon: Briefcase,
    title: "ML Intern @ IFA",
    date: "May 2025 – Jul 2025",
    desc: "Built UFC prediction app with LightGBM (72% accuracy). Contributed to 5.8% prediction system uplift via retraining pipelines.",
  },
  {
    icon: GraduationCap,
    title: "B.Tech CSE — AI/ML",
    date: "SRMIST · 2023 – 2027",
    desc: "Specialization in Artificial Intelligence & Machine Learning. CGPA 9.02.",
  },
  {
    icon: Award,
    title: "AWS Certified",
    date: "Cloud Practitioner · 2026",
    desc: "AWS · Intro to ML (IIT KGP NPTEL) · Alteryx ML Fundamentals.",
  },
];

export const About = () => {
  return (
    <section id="about" className="relative py-32 px-6">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-3xl"
        >
          <p className="font-mono text-xs text-primary tracking-widest mb-4">// 01 — ABOUT</p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="text-gradient">Abhinandan Roy</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            GenAI-focused developer building <span className="text-foreground">LLM-based systems</span>,{" "}
            <span className="text-foreground">RAG pipelines</span>, and ML models. Skilled in Python and
            FastAPI, with experience deploying scalable, AI-powered applications and working with real-world data.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="glass p-6 h-full group hover:border-primary/50 transition-all hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                <p className="font-mono text-xs text-muted-foreground mb-3">{card.date}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-xs text-muted-foreground tracking-widest mb-4">// STACK</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
              >
                <Badge variant="outline" className="font-mono text-xs border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-default">
                  {s}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
