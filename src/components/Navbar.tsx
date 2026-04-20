import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

export const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-40 px-6 py-4 md:px-12"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-full px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-sm tracking-wider text-foreground/90">ABHINANDAN.AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest">
          <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</a>
          <a href="#projects" className="text-muted-foreground hover:text-primary transition-colors">Projects</a>
          <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href="mailto:abhinandancr7@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.nav>
  );
};
