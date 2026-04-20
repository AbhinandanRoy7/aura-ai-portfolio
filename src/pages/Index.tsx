import { AuraBackground } from "@/components/AuraBackground";
import { CursorGlow } from "@/components/CursorGlow";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "Abhinandan Roy — GenAI & ML Engineer";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "GenAI & ML Engineer building intelligent systems with LLMs, RAG pipelines and scalable AI infrastructure.");
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <div className="relative min-h-screen">
      <AuraBackground />
      <CursorGlow />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
