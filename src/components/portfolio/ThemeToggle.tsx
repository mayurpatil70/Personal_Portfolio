import { motion } from "framer-motion";
import { useTheme, colorThemes } from "./ThemeProvider";
import { Sun, Moon, Palette, ChevronDown, Zap } from "lucide-react";
import { useState } from "react";

export const ThemeToggle = () => {
  const { theme, toggleTheme, colorTheme, setColorTheme, isAutoCycling, setAutoCycling, autoCyclingDuration, setAutoCyclingDuration } = useTheme();
  const [showPalette, setShowPalette] = useState(false);
  const [showAllThemes, setShowAllThemes] = useState(false);

  const visibleThemes = colorThemes.slice(0, 5);
  const hiddenThemes = colorThemes.slice(5);
  const shouldShowMoreButton = colorThemes.length > 5;

  const handleSelectTheme = (themeName: string) => {
    setColorTheme(themeName as any);
    setShowPalette(false);
    setShowAllThemes(false);
  };

  const durations = [
    { value: 2000, label: "Fast (2s)" },
    { value: 4000, label: "Normal (4s)" },
    { value: 6000, label: "Slow (6s)" },
    { value: 8000, label: "Very Slow (8s)" },
  ];

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
      {/* Color Theme Picker */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPalette(!showPalette)}
          className="w-10 h-10 rounded-full bg-card border shadow-lg flex items-center justify-center text-foreground hover:bg-accent transition-colors"
          aria-label="Change color theme"
        >
          <Palette className="h-5 w-5" />
        </motion.button>
        {showPalette && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 top-12 bg-card border rounded-xl p-3 shadow-xl flex flex-col gap-3 min-w-[180px]"
          >
            {/* Auto-cycle toggle with better visual */}
            <div className="px-3 py-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-theme-primary" />
                  <span className="text-xs font-semibold text-foreground">Auto Theme</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAutoCycling(!isAutoCycling)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isAutoCycling ? "bg-theme-primary/80" : "bg-muted"
                  }`}
                >
                  <motion.div
                    initial={false}
                    animate={{ x: isAutoCycling ? 24 : 3 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5"
                  />
                </motion.button>
              </div>

              {/* Duration slider - only show when auto-cycling is enabled */}
              {isAutoCycling && (
                <div className="mt-3 space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Speed</label>
                  <div className="space-y-2">
                    {durations.map((duration) => (
                      <button
                        key={duration.value}
                        onClick={() => setAutoCyclingDuration(duration.value)}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                          autoCyclingDuration === duration.value
                            ? "bg-theme-primary/20 text-theme-primary font-semibold"
                            : "text-muted-foreground hover:bg-accent/50"
                        }`}
                      >
                        {duration.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-border" />

            {/* Visible themes */}
            {visibleThemes.map((t) => (
              <button
                key={t.name}
                onClick={() => handleSelectTheme(t.name)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  colorTheme === t.name ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50"
                }`}
              >
                <span className={`w-4 h-4 rounded-full ${t.color}`} />
                {t.label}
              </button>
            ))}

            {/* Show more button */}
            {shouldShowMoreButton && (
              <>
                <button
                  onClick={() => setShowAllThemes(!showAllThemes)}
                  className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent/50 transition-colors"
                >
                  {showAllThemes ? "Show less" : "Show more"}
                  <ChevronDown className={`h-4 w-4 transition-transform ${showAllThemes ? "rotate-180" : ""}`} />
                </button>

                {/* Hidden themes */}
                {showAllThemes && (
                  <>
                    <div className="h-px bg-border" />
                    {hiddenThemes.map((t) => (
                      <button
                        key={t.name}
                        onClick={() => handleSelectTheme(t.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          colorTheme === t.name ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50"
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full ${t.color}`} />
                        {t.label}
                      </button>
                    ))}
                  </>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* Dark/Light Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="w-10 h-10 rounded-full bg-card border shadow-lg flex items-center justify-center text-foreground hover:bg-accent transition-colors"
        aria-label="Toggle dark mode"
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </motion.button>
    </div>
  );
};
