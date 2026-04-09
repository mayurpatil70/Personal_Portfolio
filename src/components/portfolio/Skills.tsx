import { motion } from "framer-motion";

const skillCategories = [
  {
    category: "Backend",
    skills: [
      { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
      { name: "Express.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
      { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      { name: "Firebase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
      { name: "Spring Boot", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
      { name: ".NET Core", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg" },
      { name: "ASP.NET Core", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg" },
      { name: "MVC", logo: "🏗️" },
      { name: "MVVM", logo: "🏛️" },
      { name: "REST API", logo: "🔗" },
      { name: "Webhooks", logo: "🪝" }
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
      { name: "Angular", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
      { name: "shadcn/ui", logo: "⚡" }
    ],
  },
  {
    category: "Database",
    skills: [
      { name: "MySQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
      { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
      { name: "Prisma", logo: "🔺" },
      { name: "Elasticsearch", logo: "🔍" }
    ],
  },
  {
    category: "Tools & DevOps",
    skills: [
      { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "GitHub", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
      { name: "OAuth 2.0", logo: "🔐" },
      { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
      { name: "Supabase", logo: "⚡" }
    ],
  },
  {
    category: "Languages",
    skills: [
      { name: "Java", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
      { name: "C/C++", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
      { name: "C#", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" }
    ],
  },
  {
    category: "Concepts & Other",
    skills: [
      { name: "IMAP/SMTP", logo: "📧" },
      { name: "LLM API Integration", logo: "🤖" },
      { name: "Vector DB", logo: "🗄️" },
      { name: "Cron Jobs", logo: "⏰" },
      { name: "AJAX", logo: "🔄" },
      { name: "AI Agent", logo: "🤖" },
      { name: "AI Automation", logo: "⚙️" },
      { name: "AI Voice Assistance", logo: "🎤" },
      { name: "AI Chatbot", logo: "💬" }
    ],
  }
];

export const Skills = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Technical{" "}
            <span className="bg-gradient-to-r from-theme-primary to-theme-secondary bg-clip-text text-transparent">
              Skills
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A versatile toolkit for building modern, scalable, and efficient applications from end to end.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="animated-border bg-card rounded-xl p-6 border shadow-sm hover:shadow-xl hover:shadow-theme-primary/20 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-5">
                <h3 className="text-xl font-bold text-foreground">{category.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium border bg-background hover:bg-theme-primary/10 hover:border-theme-primary/30 transition-colors cursor-default"
                  >
                    {skill.logo.startsWith("http") ? (
                      <img src={skill.logo} alt={skill.name} className="w-5 h-5" />
                    ) : (
                      <span className="text-lg leading-none">{skill.logo}</span>
                    )}
                    <span className="text-foreground">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
