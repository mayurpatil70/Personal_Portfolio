import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Github,
  Linkedin,
  Mail,
  FileText,
  Code,
  Zap,
  TrendingUp,
  Copy,
  Check,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { links, heroData } from "@/data/portfolioData";
import { ResumeViewer } from "@/components/portfolio/ResumeViewer";
import { ThemeSettingsDialog } from "@/components/portfolio/ThemeSettingsDialog";

export const Hero = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isCopied) return;
    const timer = setTimeout(() => setIsCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [isCopied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(links.email);
    setIsCopied(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  };

  return (
    <>
      <section className="min-h-screen flex items-center justify-center px-4 py-20 sm:py-24 relative overflow-hidden">
        {/* Settings Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSettingsOpen(true)}
          className="fixed top-20 right-6 z-40 w-10 h-10 rounded-full bg-purple-500/20 border border-purple-400/50 shadow-lg shadow-purple-500/20 flex items-center justify-center text-purple-300 hover:bg-purple-500/30 transition-colors"
          aria-label="Open appearance settings"
        >
          <Settings className="h-5 w-5" />
        </motion.button>

        {/* Animated background blobs */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl"
            style={{ background: `hsl(var(--theme-primary))` }}
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-15 blur-3xl"
            style={{ background: `hsl(var(--theme-secondary))` }}
          />
        </div>

        <div className="container max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 lg:space-y-8 order-2 lg:order-1 text-center lg:text-left"
            >
              <div className="space-y-3 lg:space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground"
                >
                  {heroData.firstName}{" "}
                  <span className="bg-gradient-to-r from-theme-primary to-theme-secondary bg-clip-text text-transparent">
                    {heroData.lastName}
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-lg sm:text-xl lg:text-2xl text-muted-foreground font-medium"
                >
                  {heroData.title}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="flex flex-wrap gap-2 sm:gap-3 mt-4 justify-center lg:justify-start"
                >
                  <div className="flex items-center gap-2 bg-theme-primary/10 px-3 py-1 rounded-full border border-theme-primary/30">
                    <Code className="h-4 w-4 text-theme-primary" />
                    <span className="text-sm font-medium text-theme-primary">
                      1+ years Experience
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-theme-primary/10 px-3 py-1 rounded-full border border-theme-primary/30">
                    <Zap className="h-4 w-4 text-theme-primary" />
                    <span className="text-sm font-medium text-theme-primary">
                      Real-Time Systems
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-theme-primary/10 px-3 py-1 rounded-full border border-theme-primary/30">
                    <TrendingUp className="h-4 w-4 text-theme-primary" />
                    <span className="text-sm font-medium text-theme-primary">
                      Scalable Architecture
                    </span>
                  </div>
                </motion.div>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0"
              >
                {heroData.description}
                <span className="block mt-4 text-sm sm:text-base">
                  <a
                    href="mailto:noballondesk@gmail.com"
                    className="inline-flex items-center gap-2 bg-theme-primary/10 px-4 py-2 rounded-lg border border-theme-primary/30 hover:border-theme-primary/60 hover:bg-theme-primary/20 transition-all text-theme-primary hover:text-theme-primary/90"
                  >
                    <Mail className="h-4 w-4" />
                    noballondesk@gmail.com
                  </a>
                </span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-wrap items-center gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={links.github}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-theme-primary to-theme-secondary hover:opacity-90 text-white w-full sm:w-auto"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={links.linkedin}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </Button>
                </a>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setIsResumeOpen(true)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Resume
                </Button>
                <div className="flex items-center gap-2">
                  <a href={`mailto:${links.email}`}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </Button>
                  </a>
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={handleCopy}
                        >
                          {isCopied ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isCopied ? "Copied!" : "Copy email"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </motion.div>
            </motion.div>

            {/* Interactive Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex justify-center order-1 lg:order-2"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            >
              <div className="relative">
                {/* Outer glow ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -inset-3 rounded-full"
                  style={{
                    background: `conic-gradient(from 0deg, hsl(var(--theme-primary)), hsl(var(--theme-secondary)), transparent, hsl(var(--theme-primary)))`,
                    filter: "blur(2px)",
                  }}
                />
                {/* Hexagonal-ish frame with 3D tilt */}
                <motion.div
                  animate={{ rotateX: mousePos.y, rotateY: -mousePos.x }}
                  transition={{ type: "spring", stiffness: 150, damping: 15 }}
                  className="relative w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-[2rem] p-1 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--theme-primary)), hsl(var(--theme-secondary)))`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="w-full h-full rounded-[1.75rem] bg-background overflow-hidden">
                    <img
                      src="profile.jpg"
                      alt={`${heroData.firstName} ${heroData.lastName} - ${heroData.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                {/* Floating status badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full border shadow-lg text-sm font-bold bg-card text-foreground whitespace-nowrap"
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                  Open to Work
                </motion.div>

                {/* Floating emoji */}
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center bg-card border shadow-lg"
                >
                  <span className="text-2xl lg:text-3xl">⚡</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <ResumeViewer
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        fileUrl={links.resume}
      />

      <ThemeSettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
