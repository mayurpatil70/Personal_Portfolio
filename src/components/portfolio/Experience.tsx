import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

// Your experience data directly in this file
const experienceData = [
  {
    id: 1,
    company: "Cordiso Technologies",
    location: "Pune, Maharashtra",
    role: "Full Stack Developer",
    period: "Jan 2025 – Feb 2026",
    type: "Full-time",
    highlights: [
      "Developed and maintained scalable web applications using React, Node.js, and MongoDB.",
      "Integrated RESTful APIs and third‑party services for payment, analytics, and notifications.",
      "Led frontend architecture improvements, reducing page load time by 30%.",
      "Collaborated with designers and backend team using Git, Jira, and CI/CD pipelines.",
    ],
  },
  {
    id: 2,
    company: "ApMoSys Technologies Pvt Ltd",
    location: "Navi Mumbai, Maharashtra",
    role: "Frontend Developer (Intern)",
    period: "Jun 2021 – Dec 2021",
    type: "Internship",
    highlights: [
      "Built responsive UI components using React and CSS frameworks (Tailwind/Bootstrap).",
      "Implemented user authentication flows and form validations.",
      "Assisted in converting Figma designs into interactive web interfaces.",
      "Participated in code reviews and unit testing.",
    ],
  },
  {
    id: 3,
    company: "Freelance",
    location: "Remote",
    role: "Web & Application Developer",
    period: "Jan 2023 – present",
    type: "Freelance",
    highlights: [
      "Delivered multiple client websites using HTML, CSS, JavaScript, and React.",
      "Improved SEO and accessibility by restructuring page headings and semantic HTML.",
      "Configured and deployed sites on platforms like Render and Vercel.",
      "Provided ongoing maintenance and small feature updates.",
    ],
  },
];

export const Experience = () => {
  return (
    <section className="py-20 px-4">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Work{" "}
            <span className="bg-gradient-to-r from-theme-primary to-theme-secondary bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A timeline of my professional journey and key contributions.
          </p>
        </motion.div>

        <div className="relative">
          <div
            className="absolute left-4 sm:left-6 top-0 h-full w-px -translate-x-1/2"
            style={{
              background: `linear-gradient(to bottom, hsl(var(--theme-primary)), hsl(var(--theme-secondary)), transparent)`,
            }}
          />

          <div className="space-y-12">
            {experienceData.map((exp, index) => (
              <motion.div
                key={exp.id} // using id instead of index
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative pl-12 sm:pl-16"
              >
                <div
                  className="absolute left-4 sm:left-6 top-1 w-4 h-4 rounded-full border-4 border-background -translate-x-1/2"
                  style={{ background: `hsl(var(--theme-primary))` }}
                />

                <motion.div
                  whileHover={{ y: -3 }}
                  className="animated-border bg-card rounded-xl p-6 border shadow-sm hover:shadow-xl hover:shadow-theme-primary/20 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {exp.role}
                      </h3>
                      <p className="text-lg font-medium text-foreground">
                        {exp.company}
                      </p>
                    </div>
                    <span
                      className="text-xs font-medium mt-1 sm:mt-0 px-3 py-1 rounded-full border flex-shrink-0"
                      style={{
                        background: `hsl(var(--theme-primary) / 0.1)`,
                        borderColor: `hsl(var(--theme-primary) / 0.3)`,
                        color: `hsl(var(--theme-primary))`,
                      }}
                    >
                      {exp.period}
                      {exp.type && (
                        <span className="text-xs ml-2">{exp.type}</span>
                      )}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {exp.location}
                  </p>

                  <ul className="space-y-3 my-5">
                    {exp.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Optional: if you later add a 'tech' array for each job */}
                  {/* 
                  <div className="flex flex-wrap gap-2">
                    {exp.tech?.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-theme-primary/10 text-theme-primary border-theme-primary/30 hover:bg-theme-primary/20 transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  */}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
