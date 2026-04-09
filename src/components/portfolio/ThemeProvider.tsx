import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ColorTheme = "blue" | "emerald" | "rose" | "amber" | "violet" | "cyan" | "pink" | "indigo" | "teal" | "orange";
type FontFamily = "sans" | "serif" | "mono";
type FontWeight = "normal" | "medium" | "bold";
type LetterSpacing = "tight" | "normal" | "wide";

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  isAutoCycling: boolean;
  autoCyclingDuration: number;
  fontFamily: FontFamily;
  fontWeight: FontWeight;
  letterSpacing: LetterSpacing;
  toggleTheme: () => void;
  setColorTheme: (theme: ColorTheme) => void;
  setAutoCycling: (enabled: boolean) => void;
  setAutoCyclingDuration: (duration: number) => void;
  setFontFamily: (font: FontFamily) => void;
  setFontWeight: (weight: FontWeight) => void;
  setLetterSpacing: (spacing: LetterSpacing) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  colorTheme: "blue",
  isAutoCycling: true,
  autoCyclingDuration: 6000,
  fontFamily: "sans",
  fontWeight: "normal",
  letterSpacing: "normal",
  toggleTheme: () => {},
  setColorTheme: () => {},
  setAutoCycling: () => {},
  setAutoCyclingDuration: () => {},
  setFontFamily: () => {},
  setFontWeight: () => {},
  setLetterSpacing: () => {},
});

export const colorThemes: { name: ColorTheme; label: string; color: string }[] = [
  { name: "blue", label: "Ocean", color: "bg-blue-500" },
  { name: "emerald", label: "Forest", color: "bg-emerald-500" },
  { name: "rose", label: "Rose", color: "bg-rose-500" },
  { name: "amber", label: "Sunset", color: "bg-amber-500" },
  { name: "violet", label: "Grape", color: "bg-violet-500" },
  { name: "cyan", label: "🎨 A combination of effects", color: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" },
  { name: "pink", label: "Flamingo", color: "bg-pink-500" },
  { name: "indigo", label: "Deep", color: "bg-indigo-500" },
  { name: "teal", label: "Lagoon", color: "bg-teal-500" },
  { name: "orange", label: "Blaze", color: "bg-orange-500" },
];

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "dark";
    }
    return "dark";
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("colorTheme");
      return saved ? (saved as ColorTheme) : "cyan";
    }
    return "cyan";
  });

  const [isAutoCycling, setIsAutoCycling] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("colorTheme");
      return saved === null;
    }
    return true;
  });

  const [autoCyclingDuration, setAutoCyclingDuration] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("autoCyclingDuration");
      return saved ? parseInt(saved) : 6000;
    }
    return 6000;
  });

  const [fontFamily, setFontFamilyState] = useState<FontFamily>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("fontFamily") as FontFamily) || "sans";
    }
    return "sans";
  });

  const [fontWeight, setFontWeightState] = useState<FontWeight>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("fontWeight") as FontWeight) || "normal";
    }
    return "normal";
  });

  const [letterSpacing, setLetterSpacingState] = useState<LetterSpacing>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("letterSpacing") as LetterSpacing) || "normal";
    }
    return "normal";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    colorThemes.forEach((t) => root.classList.remove(`theme-${t.name}`));
    root.classList.add(`theme-${colorTheme}`);
    root.setAttribute("data-color-theme", colorTheme);

    if (!isAutoCycling) {
      localStorage.setItem("colorTheme", colorTheme);
    }
  }, [colorTheme, isAutoCycling]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("font-sans", "font-serif", "font-mono");
    root.classList.add(`font-${fontFamily}`);
    localStorage.setItem("fontFamily", fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-font-weight", fontWeight);
    localStorage.setItem("fontWeight", fontWeight);
  }, [fontWeight]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-letter-spacing", letterSpacing);
    localStorage.setItem("letterSpacing", letterSpacing);
  }, [letterSpacing]);

  // Auto-cycle themes if no preference is set
  useEffect(() => {
    if (!isAutoCycling) return;

    let currentIndex = colorThemes.findIndex((t) => t.name === colorTheme);
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % colorThemes.length;
      setColorThemeState(colorThemes[currentIndex].name);
    }, autoCyclingDuration);

    return () => clearInterval(interval);
  }, [isAutoCycling, colorTheme, autoCyclingDuration]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const setColorTheme = (t: ColorTheme) => {
    setColorThemeState(t);
    setIsAutoCycling(false);
    localStorage.setItem("colorTheme", t);
  };

  const setAutoCycling = (enabled: boolean) => {
    setIsAutoCycling(enabled);
    if (!enabled) {
      localStorage.setItem("colorTheme", colorTheme);
    } else {
      localStorage.removeItem("colorTheme");
    }
  };

  const setAutoCyclingDurationHandler = (duration: number) => {
    setAutoCyclingDuration(duration);
    localStorage.setItem("autoCyclingDuration", duration.toString());
  };

  const setFontFamily = (font: FontFamily) => {
    setFontFamilyState(font);
  };

  const setFontWeight = (weight: FontWeight) => {
    setFontWeightState(weight);
  };

  const setLetterSpacing = (spacing: LetterSpacing) => {
    setLetterSpacingState(spacing);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorTheme,
        isAutoCycling,
        autoCyclingDuration,
        fontFamily,
        fontWeight,
        letterSpacing,
        toggleTheme,
        setColorTheme,
        setAutoCycling,
        setAutoCyclingDuration: setAutoCyclingDurationHandler,
        setFontFamily,
        setFontWeight,
        setLetterSpacing,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
