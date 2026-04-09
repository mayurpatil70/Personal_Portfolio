import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, ChevronRight } from "lucide-react";
import { projectsData } from "@/data/portfolioData";

export const Projects = () => {
  return (
    <section className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Featured{" "}
            <span className="bg-gradient-to-r from-theme-primary to-theme-secondary bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A collection of my work, from complex backend systems to full-stack
            applications.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projectsData.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="animated-border"
            >
              <div className="flex flex-col h-full bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-xl hover:shadow-theme-primary/20 transition-all duration-300 group">
                {/* Image with overlay */}
                <div className="relative overflow-hidden bg-gradient-to-br from-theme-primary/10 via-theme-secondary/5 to-transparent p-6">
                  <img
                    src={project.image}
                    alt={project.title}
                    className={`w-full object-contain backdrop-blur-sm ${
                      index <= 1 ? "opacity-80 hover:opacity-95" : ""
                    } transition-opacity duration-300`}
                  />
                  <div
                    className={`absolute inset-0 ${
                      index <= 1
                        ? "bg-gradient-to-t from-theme-primary/30 via-theme-secondary/10 to-transparent"
                        : "bg-gradient-to-t from-card via-transparent to-transparent opacity-60"
                    }`}
                  />
                  <div
                    className="absolute top-4 left-4 rounded-xl w-12 h-12 flex items-center justify-center border shadow-lg backdrop-blur-sm"
                    style={{ background: `hsl(var(--theme-primary) / 0.2)` }}
                  >
                    <span className="text-2xl">{project.icon}</span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {project.title}
                    </h3>
                    <p className="font-medium text-base mb-4 text-theme-primary">
                      {project.subtitle}
                    </p>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>

                  <ul className="space-y-2 mb-5">
                    {project.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <ChevronRight className="h-5 w-5 text-theme-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-theme-primary/10 text-theme-primary border-theme-primary/30"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-3">
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-gradient-to-r from-theme-primary to-theme-secondary hover:opacity-90 text-white w-full sm:w-auto">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Live Demo
                      </Button>
                    </a>
                    <a
                      href={project.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="w-full sm:w-auto">
                        <Github className="mr-2 h-4 w-4" />
                        View Code
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
