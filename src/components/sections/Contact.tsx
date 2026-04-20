import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Phone } from "lucide-react";

export const Contact = () => {
  return (
    <section id="contact" className="relative py-32 px-6">
      <div className="container max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-xs text-primary tracking-widest mb-4">// 03 — CONTACT</p>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6">
            Let's build the <span className="text-gradient">future</span>.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10">
            Open for opportunities in GenAI, ML engineering, and applied research.
          </p>

          <a
            href="mailto:abhinandancr7@gmail.com"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:scale-105 transition-transform glow-border text-lg"
          >
            <Mail className="w-5 h-5" />
            abhinandancr7@gmail.com
          </a>

          <div className="flex justify-center gap-6 mt-12">
            {[
              { icon: Github, href: "https://github.com", label: "GitHub" },
              { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
              { icon: Phone, href: "tel:+919831294139", label: "+91 98312 94139" },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                className="glass rounded-full p-4 hover:border-primary/60 hover:scale-110 transition-all">
                <s.icon className="w-5 h-5 text-primary" />
              </a>
            ))}
          </div>
        </motion.div>

        <div className="mt-24 pt-8 border-t border-border font-mono text-xs text-muted-foreground">
          <p>© 2026 ABHINANDAN ROY · UPLINK_TERMINATED_</p>
        </div>
      </div>
    </section>
  );
};
