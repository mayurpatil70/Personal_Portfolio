import { motion } from "framer-motion";

export const Education = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-theme-primary to-theme-secondary bg-clip-text text-transparent">
              Education
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileHover={{ y: -3 }}
          className="max-w-2xl mx-auto animated-border"
        >
          <div className="bg-card rounded-xl p-6 sm:p-8 border shadow-sm hover:shadow-xl hover:shadow-theme-primary/20 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
                style={{
                  background: `linear-gradient(135deg, hsl(var(--theme-primary) / 0.15), hsl(var(--theme-secondary) / 0.15))`,
                }}
              >
                🎓
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 break-words">
                  Bachelor of Technology - Computer Science & Engineering
                </h3>
                <p className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-theme-primary to-theme-secondary bg-clip-text text-transparent mb-2 break-words">
                  Sandip University
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-muted-foreground mb-4">
                  <span className="text-sm sm:text-base">Nashik • 2025</span>
                  <span className="hidden sm:block">•</span>
                  <span className="font-semibold text-green-500 text-sm sm:text-base">
                    CGPA: 7.28/10
                  </span>
                </div>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Full Stack Developer skilled in building modern web
                  applications using React, Node.js, and various other
                  technologies. Passionate about creating scalable and
                  user-friendly solutions.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
