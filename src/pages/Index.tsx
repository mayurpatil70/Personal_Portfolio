import { Hero } from "@/components/portfolio/Hero";
import { Skills } from "@/components/portfolio/Skills";
import { Experience } from "@/components/portfolio/Experience";
import { Projects } from "@/components/portfolio/Projects";
import { Education } from "@/components/portfolio/Education";
import { Contact } from "@/components/portfolio/Contact";
import { FloatingChat } from "@/components/portfolio/FloatingChat";
import { ClientNotifications } from "@/components/portfolio/ClientNotifications";
import { Navbar } from "@/components/portfolio/Navbar";
import { SpaceBackground } from "@/components/portfolio/SpaceBackground";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <SpaceBackground />
      <div className="relative z-10">
        <Navbar />
        <section id="hero">
          <Hero />
        </section>
        {/* Section divider */}
        <div className="w-full flex justify-center py-2">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "60%" }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="h-px bg-gradient-to-r from-transparent via-theme-primary to-transparent"
            style={{ background: `linear-gradient(to right, transparent, hsl(var(--theme-primary)), transparent)` }}
          />
        </div>
        <section id="skills">
          <Skills />
        </section>
        <div className="w-full flex justify-center py-2">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "60%" }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="h-px"
            style={{ background: `linear-gradient(to right, transparent, hsl(var(--theme-primary)), transparent)` }}
          />
        </div>
        <section id="experience">
          <Experience />
        </section>
        <div className="w-full flex justify-center py-2">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "60%" }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="h-px"
            style={{ background: `linear-gradient(to right, transparent, hsl(var(--theme-primary)), transparent)` }}
          />
        </div>
        <section id="projects">
          <Projects />
        </section>
        <div className="w-full flex justify-center py-2">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "60%" }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="h-px"
            style={{ background: `linear-gradient(to right, transparent, hsl(var(--theme-primary)), transparent)` }}
          />
        </div>
        <section id="education">
          <Education />
        </section>
        <div className="w-full flex justify-center py-2">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "60%" }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="h-px"
            style={{ background: `linear-gradient(to right, transparent, hsl(var(--theme-primary)), transparent)` }}
          />
        </div>
        <section id="contact">
          <Contact />
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Mayur Patil founder NoBallonDesk.
          </p>
        </footer>
      </div>

      <FloatingChat />
      <ClientNotifications />
    </div>
  );
};

export default Index;
