import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { links } from "@/data/portfolioData";

// 3D NB Logo Component
const NBLogo = () => (
  <motion.div
    whileHover={{ rotateX: 20, rotateY: 20 }}
    transition={{ duration: 0.3 }}
    className="relative w-8 h-8 sm:w-10 sm:h-10"
    style={{
      perspective: "1000px",
    }}
  >
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      style={{
        filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))",
      }}
    >
      {/* Cricket Ball */}
      <defs>
        {/* Premium Kookaburra white leather gradient */}
        <radialGradient id="cricketBallGradient" cx="38%" cy="32%">
          <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
          <stop
            offset="35%"
            style={{ stopColor: "#fcfcfc", stopOpacity: 0.98 }}
          />
          <stop
            offset="60%"
            style={{ stopColor: "#f0f0f0", stopOpacity: 0.94 }}
          />
          <stop
            offset="85%"
            style={{ stopColor: "#e0e0e0", stopOpacity: 0.88 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "#c8c8c8", stopOpacity: 0.8 }}
          />
        </radialGradient>

        {/* Shadow filter for depth */}
        <filter id="ballShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.6" />
        </filter>

        {/* Soft leather texture */}
        <pattern
          id="leatherTexture"
          x="0"
          y="0"
          width="2"
          height="2"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="0.3" fill="rgba(0, 0, 0, 0.01)" />
        </pattern>
      </defs>

      {/* Main Kookaburra Cricket Ball */}
      <circle
        cx="50"
        cy="50"
        r="41"
        fill="url(#cricketBallGradient)"
        stroke="#c0c0c0"
        strokeWidth="0.5"
        filter="url(#ballShadow)"
      />

      {/* Subtle leather texture overlay */}
      <circle
        cx="50"
        cy="50"
        r="41"
        fill="url(#leatherTexture)"
        opacity="0.4"
      />

      {/* Premium Red Quarter Seam - Upper */}
      <path
        d="M 8 50 Q 25 38 42 35 Q 50 34 58 35 Q 75 38 92 50"
        fill="none"
        stroke="#c41e3a"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Premium Red Quarter Seam - Lower */}
      <path
        d="M 8 50 Q 25 62 42 65 Q 50 66 58 65 Q 75 62 92 50"
        fill="none"
        stroke="#a01830"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Seam stitching - authentic small stitches upper */}
      <g stroke="#b81a30" strokeWidth="0.9" strokeLinecap="round" opacity="0.9">
        <line x1="15" y1="48" x2="17" y2="50" />
        <line x1="26" y1="43" x2="28" y2="46" />
        <line x1="37" y1="37" x2="39" y2="41" />
        <line x1="50" y1="35" x2="50" y2="40" />
        <line x1="63" y1="37" x2="61" y2="41" />
        <line x1="74" y1="43" x2="72" y2="46" />
        <line x1="85" y1="48" x2="83" y2="50" />
      </g>

      {/* Seam stitching - authentic small stitches lower */}
      <g stroke="#8b1427" strokeWidth="0.9" strokeLinecap="round" opacity="0.9">
        <line x1="15" y1="52" x2="17" y2="50" />
        <line x1="26" y1="57" x2="28" y2="54" />
        <line x1="37" y1="63" x2="39" y2="59" />
        <line x1="50" y1="65" x2="50" y2="60" />
        <line x1="63" y1="63" x2="61" y2="59" />
        <line x1="74" y1="57" x2="72" y2="54" />
        <line x1="85" y1="52" x2="83" y2="50" />
      </g>

      {/* Glossy highlight - top left (strong shine) */}
      <ellipse cx="30" cy="28" rx="16" ry="13" fill="white" opacity="0.35" />

      {/* Secondary highlight for extra shine */}
      <ellipse cx="35" cy="32" rx="10" ry="8" fill="white" opacity="0.2" />

      {/* Subtle bottom shadow */}
      <ellipse cx="50" cy="72" rx="28" ry="6" fill="rgba(0, 0, 0, 0.06)" />

      {/* Edge highlight for 3D sphere effect */}
      <path
        d="M 15 50 Q 20 30 50 15 Q 80 30 85 50"
        fill="none"
        stroke="white"
        strokeWidth="0.4"
        opacity="0.15"
      />

      {/* Inner shadow for depth */}
      <circle
        cx="50"
        cy="50"
        r="41"
        fill="none"
        stroke="rgba(0, 0, 0, 0.04)"
        strokeWidth="1"
      />

      {/* NB Text - bold and prominent */}
      <g>
        {/* Text shadow for 3D depth */}
        <text
          x="50.8"
          y="60.5"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="30"
          fontWeight="950"
          fill="rgba(0, 0, 0, 0.12)"
          style={{
            fontFamily: "'Arial Black', 'Arial', sans-serif",
            letterSpacing: "-1px",
          }}
        >
          NB
        </text>

        {/* Main NB text - dark color for contrast */}
        <text
          x="50"
          y="59"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="30"
          fontWeight="950"
          fill="#1a1a1a"
          style={{
            fontFamily: "'Arial Black', 'Arial', sans-serif",
            letterSpacing: "-1px",
            paintOrder: "stroke",
          }}
        >
          NB
        </text>

        {/* Subtle white outline for elegance */}
        <text
          x="50"
          y="59"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="30"
          fontWeight="950"
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="0.5"
          style={{
            fontFamily: "'Arial Black', 'Arial', sans-serif",
            letterSpacing: "-1px",
          }}
        >
          NB
        </text>
      </g>
    </svg>

    {/* 3D depth effect with rotating glow */}
    <motion.div
      animate={{
        boxShadow: [
          "0 0 15px rgba(34, 197, 94, 0.4)",
          "0 0 25px rgba(34, 197, 94, 0.6)",
          "0 0 15px rgba(34, 197, 94, 0.4)",
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute inset-0 rounded-full pointer-events-none"
    />
  </motion.div>
);

interface NavLink {
  label: string;
  href: string;
  id: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "#hero", id: "hero" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Education", href: "#education", id: "education" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      // Update active section based on scroll position
      for (const link of navLinks) {
        const element = document.getElementById(link.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(link.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string, id: string) => {
    setIsOpen(false);
    setActiveSection(id);
    // Smooth scroll to section using the id parameter
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-30 w-full transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/90 backdrop-blur-md border-b border-purple-500/20 shadow-lg shadow-purple-500/10"
          : "bg-slate-900/50 border-b border-purple-500/10"
      }`}
    >
      <div className="container max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with Email */}
          <div className="flex flex-col gap-1">
            <a
              href={`${typeof window !== "undefined" ? links.instagram : "#"}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <NBLogo />
                <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">
                  Founder @NoBallOnDesk
                </span>
              </motion.div>
            </a>
            <a
              href="mailto:noballondesk@gmail.com"
              className="text-xs text-purple-300 hover:text-cyan-300 transition-colors whitespace-nowrap"
            >
              noballondesk@gmail.com
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <motion.button
                key={link.id}
                onClick={() => handleNavClick(link.href, link.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-200 ${
                  activeSection === link.id
                    ? "bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-lg shadow-purple-500/20"
                    : "text-slate-300 hover:text-purple-300 hover:bg-purple-500/10"
                }`}
              >
                {link.label}
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-purple-500/20 transition-colors text-purple-300"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden md:hidden"
        >
          <div className="flex flex-col gap-2 pt-4 pb-2">
            {navLinks.map((link) => (
              <motion.button
                key={link.id}
                onClick={() => handleNavClick(link.href, link.id)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === link.id
                    ? "bg-purple-500/20 text-purple-300 border border-purple-400/50"
                    : "text-slate-300 hover:text-purple-300 hover:bg-purple-500/10"
                }`}
              >
                {link.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};
