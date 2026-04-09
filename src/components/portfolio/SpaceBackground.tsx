import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const generateStars = (count: number): Star[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));
};

interface Planet {
  id: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  x: string;
  y: string;
  opacity: number;
  name: string;
  orbitRadius: number;
  hasRings: boolean;
  texture?: string;
}

const planets: Planet[] = [
  {
    id: 1,
    name: "Mercury",
    size: 40,
    color: "rgba(184, 134, 11, 0.9)",
    duration: 12,
    delay: 0,
    x: "50%",
    y: "50%",
    opacity: 0.8,
    orbitRadius: 120,
    hasRings: false,
  },
  {
    id: 2,
    name: "Venus",
    size: 65,
    color: "rgba(255, 200, 87, 0.85)",
    duration: 16,
    delay: 2,
    x: "50%",
    y: "50%",
    opacity: 0.75,
    orbitRadius: 200,
    hasRings: false,
  },
  {
    id: 3,
    name: "Earth",
    size: 70,
    color: "rgba(65, 105, 225, 0.9)",
    duration: 20,
    delay: 4,
    x: "50%",
    y: "50%",
    opacity: 0.8,
    orbitRadius: 280,
    hasRings: false,
  },
  {
    id: 4,
    name: "Mars",
    size: 45,
    color: "rgba(214, 88, 58, 0.85)",
    duration: 24,
    delay: 6,
    x: "50%",
    y: "50%",
    opacity: 0.75,
    orbitRadius: 350,
    hasRings: false,
  },
  {
    id: 5,
    name: "Jupiter",
    size: 120,
    color: "rgba(218, 165, 32, 0.88)",
    duration: 32,
    delay: 8,
    x: "50%",
    y: "50%",
    opacity: 0.7,
    orbitRadius: 480,
    hasRings: false,
  },
  {
    id: 6,
    name: "Saturn",
    size: 100,
    color: "rgba(255, 215, 0, 0.85)",
    duration: 40,
    delay: 10,
    x: "50%",
    y: "50%",
    opacity: 0.7,
    orbitRadius: 580,
    hasRings: true,
  },
  {
    id: 7,
    name: "Uranus",
    size: 70,
    color: "rgba(100, 149, 237, 0.8)",
    duration: 48,
    delay: 12,
    x: "50%",
    y: "50%",
    opacity: 0.65,
    orbitRadius: 660,
    hasRings: false,
  },
  {
    id: 8,
    name: "Neptune",
    size: 68,
    color: "rgba(30, 144, 255, 0.85)",
    duration: 56,
    delay: 14,
    x: "50%",
    y: "50%",
    opacity: 0.65,
    orbitRadius: 740,
    hasRings: false,
  },
];

export const SpaceBackground = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setStars(generateStars(100));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-background pointer-events-none overflow-hidden perspective">
      {/* Deep space background with 3D depth gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900" />

      {/* 3D Space depth layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-950/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-transparent to-slate-950/20" />

      {/* Far background nebula - creates depth */}
      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 w-full h-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 80%)",
        }}
      />

      {/* Nebula clouds with 3D layering */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
        }}
      />

      <motion.div
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-0 right-0 w-full h-full rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
        }}
      />

      <motion.div
        animate={{
          opacity: [0.15, 0.4, 0.15],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Additional nebula layer for more depth */}
      <motion.div
        animate={{
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6,
        }}
        className="absolute right-1/4 bottom-1/3 w-72 h-72 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)",
        }}
      />

      {/* Central Sun */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 60px rgba(255, 200, 0, 0.8)",
            "0 0 80px rgba(255, 200, 0, 0.6)",
            "0 0 60px rgba(255, 200, 0, 0.8)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 80,
          height: 80,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle at 35% 35%, rgba(255, 220, 0, 1), rgba(255, 140, 0, 0.9))",
          boxShadow:
            "0 0 60px rgba(255, 200, 0, 0.8), inset -15px -15px 30px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Solar flare effect */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent)",
          }}
        />
      </motion.div>

      {/* Solar System - Planets in Orbits */}
      {planets.map((planet) => {
        const angle = (planet.delay * 45) % 360;
        const baseRotation = planet.delay * 30;

        return (
          <motion.div
            key={planet.id}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: planet.duration,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute"
            style={{
              width: planet.orbitRadius * 2,
              height: planet.orbitRadius * 2,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Orbit path */}
            <div
              className="absolute inset-0 border rounded-full pointer-events-none"
              style={{
                borderColor: `rgba(${100 + planet.id * 15}, ${150}, ${200 - planet.id * 10}, 0.15)`,
                borderWidth: 1,
              }}
            />

            {/* Planet */}
            <motion.div
              animate={{
                rotateX: [0, 10, -10, 0],
              }}
              transition={{
                duration: planet.duration * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute rounded-full shadow-2xl"
              style={{
                width: planet.size,
                height: planet.size,
                left: "50%",
                top: "0%",
                transform: "translateX(-50%)",
                background: `radial-gradient(circle at 30% 30%, ${planet.color}, ${planet.color.replace("0.", "0.")}CC)`,
                opacity: planet.opacity,
                boxShadow: `0 0 30px ${planet.color}, inset -${planet.size / 4}px -${planet.size / 4}px ${planet.size / 2}px rgba(0, 0, 0, 0.5), 0 ${planet.size / 4}px ${planet.size / 1.5}px rgba(0, 0, 0, 0.7)`,
                filter: `drop-shadow(0 0 20px ${planet.color})`,
              }}
            >
              {/* Surface texture animation */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: planet.duration * 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15), transparent 60%)`,
                }}
              />

              {/* Planet rings - Saturn */}
              {planet.hasRings && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: planet.duration * 1.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute"
                  style={{
                    width: planet.size * 1.8,
                    height: planet.size * 0.4,
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%) rotateX(75deg)",
                    border: `3px solid rgba(255, 215, 0, 0.4)`,
                    borderRadius: "50%",
                    boxShadow: "0 0 15px rgba(255, 215, 0, 0.2)",
                  }}
                />
              )}

              {/* Label on hover area */}
              <div
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white opacity-0 hover:opacity-100 whitespace-nowrap pointer-events-auto transition-opacity"
                style={{
                  textShadow: "0 0 3px rgba(0, 0, 0, 0.5)",
                }}
              >
                {planet.name}
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Asteroid Belt */}
      {Array.from({ length: 40 }).map((_, i) => {
        const asteroidAngle = (i / 40) * 360;
        const asteroidDistance = 420;
        const x =
          50 +
          (asteroidDistance / window.innerWidth) *
            100 *
            Math.cos((asteroidAngle * Math.PI) / 180);
        const y =
          50 +
          (asteroidDistance / window.innerHeight) *
            100 *
            Math.sin((asteroidAngle * Math.PI) / 180);

        return (
          <motion.div
            key={`asteroid-${i}`}
            animate={{
              rotate: 360,
              x: Math.random() * 20 - 10,
              y: Math.random() * 20 - 10,
            }}
            transition={{
              rotate: {
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "linear",
              },
              x: {
                duration: Math.random() * 4 + 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
              y: {
                duration: Math.random() * 4 + 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 8 + 3,
              height: Math.random() * 8 + 3,
              left: `${x}%`,
              top: `${y}%`,
              background: `radial-gradient(circle, rgba(150, 120, 80, 0.8), rgba(100, 80, 60, 0.6))`,
              boxShadow: "0 0 5px rgba(150, 120, 80, 0.5)",
            }}
          />
        );
      })}

      {/* Animated planets with 3D rotation - OLD CODE REMOVED */}
      {/* Lens flares for 3D effect */}
      {Array.from({ length: 2 }).map((_, i) => (
        <motion.div
          key={`flare-${i}`}
          animate={{
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 3,
          }}
          className="absolute rounded-full blur-2xl pointer-events-none"
          style={{
            width: 200,
            height: 200,
            left: `${20 + i * 60}%`,
            top: `${15 + i * 20}%`,
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
          }}
        />
      ))}

      {/* Twinkling stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
          className="absolute rounded-full bg-white"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
            boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.9), 0 0 ${star.size * 5}px rgba(100, 200, 255, 0.3)`,
          }}
        />
      ))}

      {/* Parallax effect with scroll - 3D depth */}
      <motion.div
        animate={{
          y: scrollY * 0.5,
        }}
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 80%)`,
        }}
      />

      {/* Cosmic dust particles with depth */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`dust-${i}`}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute rounded-full bg-white/30 blur-sm"
          style={{
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: `0 0 ${Math.random() * 5 + 2}px rgba(255, 255, 255, 0.5)`,
          }}
        />
      ))}

      {/* Enhanced shooting stars with 3D effect */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`shooting-${i}`}
          animate={{
            x: ["-100%", "150%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeIn",
            delay: i * 6,
          }}
          className="absolute h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-md"
          style={{
            width: 300,
            top: `${15 + i * 18}%`,
            transform: "rotate(-45deg)",
            boxShadow: "0 0 20px rgba(34, 211, 238, 0.8)",
          }}
        />
      ))}

      {/* Orbital rings for solar system effect */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`orbit-${i}`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 50 + i * 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute border opacity-20 rounded-full"
          style={{
            width: 400 + i * 300,
            height: 400 + i * 300,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            borderColor: `rgba(${100 + i * 40}, ${150 + i * 30}, ${200 - i * 30}, 0.3)`,
            borderWidth: 1,
          }}
        />
      ))}
    </div>
  );
};
