import { motion } from "framer-motion";
import { useTheme, colorThemes } from "./ThemeProvider";
import { Sun, Moon, X, Settings, Zap, Type } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const ThemeSettingsDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const {
    theme,
    toggleTheme,
    colorTheme,
    setColorTheme,
    isAutoCycling,
    setAutoCycling,
    autoCyclingDuration,
    setAutoCyclingDuration,
    fontFamily,
    setFontFamily,
    fontWeight,
    setFontWeight,
    letterSpacing,
    setLetterSpacing,
  } = useTheme();

  const [showAllThemes, setShowAllThemes] = useState(false);
  const visibleThemes = colorThemes.slice(0, 5);
  const hiddenThemes = colorThemes.slice(5);

  const durations = [
    { value: 2000, label: "Fast (2s)" },
    { value: 4000, label: "Normal (4s)" },
    { value: 6000, label: "Slow (6s)" },
    { value: 8000, label: "Very Slow (8s)" },
  ];

  const fontFamilies = [
    { value: "sans", label: "Sans Serif", preview: "sans-serif" },
    { value: "serif", label: "Serif", preview: "serif" },
    { value: "mono", label: "Monospace", preview: "monospace" },
  ];

  const fontWeights = [
    { value: "normal", label: "Normal", weight: 400 },
    { value: "medium", label: "Medium", weight: 500 },
    { value: "bold", label: "Bold", weight: 700 },
  ];

  const letterSpacings = [
    { value: "tight", label: "Tight" },
    { value: "normal", label: "Normal" },
    { value: "wide", label: "Wide" },
  ];

  const handleSelectTheme = (themeName: string) => {
    setColorTheme(themeName as any);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Settings className="h-6 w-6 text-theme-primary" />
            Appearance Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Light/Dark Mode */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Theme Mode
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (theme === "light") return;
                  toggleTheme();
                }}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  theme === "light"
                    ? "border-theme-primary bg-theme-primary/10 text-foreground"
                    : "border-border hover:border-theme-primary/50 text-muted-foreground"
                }`}
              >
                <Sun className="h-5 w-5 mx-auto mb-2" />
                Light
              </button>
              <button
                onClick={() => {
                  if (theme === "dark") return;
                  toggleTheme();
                }}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  theme === "dark"
                    ? "border-theme-primary bg-theme-primary/10 text-foreground"
                    : "border-border hover:border-theme-primary/50 text-muted-foreground"
                }`}
              >
                <Moon className="h-5 w-5 mx-auto mb-2" />
                Dark
              </button>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Color Themes */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-theme-primary" />
              Color Theme
            </h3>

            {/* Auto-cycle toggle */}
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-theme-primary" />
                  <span className="font-medium text-foreground">Auto Theme</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAutoCycling(!isAutoCycling)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    isAutoCycling ? "bg-theme-primary/80" : "bg-muted"
                  }`}
                >
                  <motion.div
                    initial={false}
                    animate={{ x: isAutoCycling ? 28 : 3 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-6 h-6 rounded-full bg-white shadow-md absolute top-0.5"
                  />
                </motion.button>
              </div>

              {/* Speed control */}
              {isAutoCycling && (
                <div className="mt-4 space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Cycle Speed</label>
                  <div className="grid grid-cols-2 gap-2">
                    {durations.map((duration) => (
                      <button
                        key={duration.value}
                        onClick={() => setAutoCyclingDuration(duration.value)}
                        className={`px-3 py-2 rounded text-sm transition-all ${
                          autoCyclingDuration === duration.value
                            ? "bg-theme-primary/20 text-theme-primary font-semibold border border-theme-primary/50"
                            : "text-muted-foreground hover:bg-accent/50 border border-transparent"
                        }`}
                      >
                        {duration.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Manual color selection */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {isAutoCycling ? "Select theme to disable auto-cycling" : "Choose your color theme"}
              </p>
              <div className="grid grid-cols-5 gap-2">
                {visibleThemes.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => handleSelectTheme(t.name)}
                    className={`p-3 rounded-lg border-2 transition-all text-center text-sm font-medium ${
                      colorTheme === t.name
                        ? "border-theme-primary bg-theme-primary/10"
                        : "border-border hover:border-theme-primary/50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${t.color}`} />
                    <span className="text-xs">{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Show more themes */}
              {hiddenThemes.length > 0 && (
                <>
                  {showAllThemes && (
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {hiddenThemes.map((t) => (
                        <button
                          key={t.name}
                          onClick={() => handleSelectTheme(t.name)}
                          className={`p-3 rounded-lg border-2 transition-all text-center text-sm font-medium ${
                            colorTheme === t.name
                              ? "border-theme-primary bg-theme-primary/10"
                              : "border-border hover:border-theme-primary/50"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${t.color}`} />
                          <span className="text-xs">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => setShowAllThemes(!showAllThemes)}
                    className="w-full mt-2 py-2 text-sm text-theme-primary hover:bg-theme-primary/10 rounded-lg transition-colors"
                  >
                    {showAllThemes ? "Show less" : "Show more colors"}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Typography */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Type className="h-4 w-4" />
              Typography
            </h3>

            {/* Font Family */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Font Family</label>
              <div className="grid grid-cols-3 gap-2">
                {fontFamilies.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => setFontFamily(font.value as any)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      fontFamily === font.value
                        ? "border-theme-primary bg-theme-primary/10"
                        : "border-border hover:border-theme-primary/50"
                    }`}
                    style={{ fontFamily: font.preview }}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Weight */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Font Weight</label>
              <div className="grid grid-cols-3 gap-2">
                {fontWeights.map((weight) => (
                  <button
                    key={weight.value}
                    onClick={() => setFontWeight(weight.value as any)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      fontWeight === weight.value
                        ? "border-theme-primary bg-theme-primary/10"
                        : "border-border hover:border-theme-primary/50"
                    }`}
                    style={{ fontWeight: weight.weight }}
                  >
                    {weight.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Letter Spacing */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Letter Spacing</label>
              <div className="grid grid-cols-3 gap-2">
                {letterSpacings.map((spacing) => (
                  <button
                    key={spacing.value}
                    onClick={() => setLetterSpacing(spacing.value as any)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      letterSpacing === spacing.value
                        ? "border-theme-primary bg-theme-primary/10"
                        : "border-border hover:border-theme-primary/50"
                    }`}
                  >
                    {spacing.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3 bg-accent/20 p-4 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground">PREVIEW</p>
            <p className="text-sm text-foreground">This is how your text will look with the selected settings.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
