import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { links } from "@/data/portfolioData";
import {
  Github,
  Linkedin,
  Mail,
  FileText,
  Send,
  MessageCircle,
  CheckCircle,
  MessageSquare,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeViewer } from "@/components/portfolio/ResumeViewer";
import {
  saveFormData,
  getSavedFormData,
  FormData,
} from "@/lib/formDataPersistence";
import { sendWhatsAppMessage, storeClientData } from "@/lib/whatsappService";

const LS_FC_CONVOS = "fc_conversations";
const WORKER_URL = import.meta.env.VITE_WORKER_URL;

interface FloatingChatConversation {
  id: string;
  category: string;
  formData: Record<string, string>;
  bubbles: Array<{
    role: "user" | "ai" | "system";
    content: string;
    label?: string;
    loading?: boolean;
  }>;
  timestamp: number;
}

const socialLinks = [
  { icon: Github, label: "GitHub", href: links.github },
  { icon: Linkedin, label: "LinkedIn", href: links.linkedin },
  { icon: Mail, label: "Email", href: `mailto:${links.email}` },
  {
    icon: Mail,
    label: "Business Email",
    href: `mailto:${links.businessEmail}`,
  },
  { icon: Instagram, label: "Instagram", href: links.instagram },
];

// Helper to generate unique ID
function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// Load conversations from localStorage
function loadFloatingChatConvos(): FloatingChatConversation[] {
  try {
    return JSON.parse(localStorage.getItem(LS_FC_CONVOS) ?? "[]");
  } catch {
    return [];
  }
}

// Save conversations to localStorage
function saveFloatingChatConvos(convos: FloatingChatConversation[]) {
  try {
    localStorage.setItem(LS_FC_CONVOS, JSON.stringify(convos));
  } catch {}
}

// API functions matching FloatingChat
async function postToDiscord(category: string, data: Record<string, string>) {
  if (!WORKER_URL) return;
  try {
    const res = await fetch(`${WORKER_URL}/discord`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, data }),
    });
    if (!res.ok) console.warn("Discord post failed");
  } catch (error) {
    console.error("Error posting to Discord:", error);
  }
}

async function fetchThankYou(
  category: string,
  data: Record<string, string>,
): Promise<string> {
  if (!WORKER_URL) {
    return `Thanks ${data.name || ""}! I'll be in touch soon. 🚀`;
  }
  try {
    const res = await fetch(`${WORKER_URL}/thankyou`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        name: data.name || "there",
        formData: data,
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    const body = (await res.json()) as { ok: boolean; message: string };
    return body.message;
  } catch (error) {
    console.error("Error fetching thank you:", error);
    return `Thanks ${data.name || ""}! I'll be in touch soon. 🚀`;
  }
}

// Dispatch custom event to open FloatingChat with conversation
function openContactInFloatingChat(conversationId: string) {
  const event = new CustomEvent("floatingchat:open-contact", {
    detail: { conversationId },
  });
  window.dispatchEvent(event);
}

export const Contact = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Load saved form data on mount
  useEffect(() => {
    const savedData = getSavedFormData();
    setFormData((prev) => ({ ...prev, ...savedData }));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save persistent fields
      saveFormData(formData);

      // Create a new conversation for FloatingChat
      const formDataRecord: Record<string, string> = {
        name: formData.name || "",
        email: formData.email || "",
        whatsapp: formData.whatsapp || "",
        subject: formData.subject || "",
        message: formData.message || "",
      };

      // Build form summary like FloatingChat does
      const lines = [
        `**Name:** ${formDataRecord.name}`,
        `**Email:** ${formDataRecord.email}`,
        ...(formDataRecord.whatsapp
          ? [`**WhatsApp:** ${formDataRecord.whatsapp}`]
          : []),
        ...(formDataRecord.subject
          ? [`**Subject:** ${formDataRecord.subject}`]
          : []),
        `**Message:** ${formDataRecord.message}`,
      ].filter(Boolean);

      const formSummary = `📧 **Contact Form**\n${lines.join("\n")}`;
      const newId = uid();

      // Create conversation with loading AI bubble
      const newConversation: FloatingChatConversation = {
        id: newId,
        category: "contact",
        formData: formDataRecord,
        bubbles: [
          {
            role: "user",
            content: formSummary,
            label: "📧 Contact Form Submission",
          },
          {
            role: "ai",
            content: "",
            loading: true,
          },
        ],
        timestamp: Date.now(),
      };

      // Load existing conversations, add new one, and save
      let convos = loadFloatingChatConvos();
      convos.unshift(newConversation);
      saveFloatingChatConvos(convos);

      // Store client data in database and send WhatsApp message
      const clientId = storeClientData({
        name: formDataRecord.name,
        email: formDataRecord.email,
        subject: formDataRecord.subject,
        message: formDataRecord.message,
      });

      // Fire requests in parallel (Discord alert + Thank You message + WhatsApp)
      const [, tyResult] = await Promise.allSettled([
        postToDiscord("contact", formDataRecord),
        fetchThankYou("contact", formDataRecord),
        sendWhatsAppMessage({
          name: formDataRecord.name,
          email: formDataRecord.email,
          subject: formDataRecord.subject,
          message: formDataRecord.message,
          id: clientId,
        }),
      ]);

      const thankYouMsg =
        tyResult.status === "fulfilled"
          ? (tyResult.value as string)
          : `Thanks ${formDataRecord.name || ""}! I'll be in touch soon. 🚀`;

      // Update conversation with thank you message + system message
      convos = loadFloatingChatConvos();
      const updatedConvo = convos.find((c) => c.id === newId);
      if (updatedConvo) {
        updatedConvo.bubbles = [
          updatedConvo.bubbles[0],
          { role: "ai" as const, content: thankYouMsg },
          {
            role: "system" as const,
            content: "✅ Sent to inbox — I'll reply to your email shortly!",
          },
        ];
        saveFloatingChatConvos(convos);
      }

      setSubmitStatus("success");
      // Reset form but keep name, email and whatsapp
      setFormData((prev) => ({
        ...prev,
        subject: "",
        message: "",
      }));

      // Open the conversation in FloatingChat
      openContactInFloatingChat(newId);

      // Reset success message after 4 seconds
      setTimeout(() => setSubmitStatus("idle"), 4000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
              Get In{" "}
              <span className="bg-gradient-to-r from-theme-primary to-theme-secondary bg-clip-text text-transparent">
                Touch
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Have a project in mind? Let's collaborate and create something
              amazing together.
            </p>
          </motion.div>

          {/* Business Email Highlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 flex justify-center"
          >
            <a
              href="mailto:noballondesk@gmail.com"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-theme-primary/10 to-theme-secondary/10 border border-theme-primary/30 hover:border-theme-primary/60 hover:shadow-lg hover:shadow-theme-primary/20 transition-all group"
            >
              <Mail className="h-5 w-5 text-theme-primary group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Business Email</p>
                <p className="text-base font-semibold bg-gradient-to-r from-theme-primary to-theme-secondary bg-clip-text text-transparent">
                  noballondesk@gmail.com
                </p>
              </div>
            </a>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-theme-primary" />
                Connect With Me
              </h3>

              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-lg hover:shadow-theme-primary/10 hover:border-theme-primary/30 transition-all group"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ background: `hsl(var(--theme-primary) / 0.1)` }}
                  >
                    <link.icon className="h-5 w-5 text-theme-primary" />
                  </div>
                  <span className="font-medium text-foreground">
                    {link.label}
                  </span>
                </motion.a>
              ))}

              {/* Resume Button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ x: 5 }}
                onClick={() => setIsResumeOpen(true)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-lg hover:shadow-theme-primary/10 hover:border-theme-primary/30 transition-all group mt-6"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ background: `hsl(var(--theme-primary) / 0.1)` }}
                >
                  <FileText className="h-5 w-5 text-theme-primary" />
                </div>
                <span className="font-medium text-foreground">Resume</span>
              </motion.button>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-card border rounded-2xl p-8"
            >
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Send className="h-5 w-5 text-theme-primary" />
                Send me a message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-theme-primary/50 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-theme-primary/50 transition-all"
                  />
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label
                    htmlFor="whatsapp"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    WhatsApp Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp || ""}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-theme-primary/50 transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Add your WhatsApp number to receive instant replies
                  </p>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject || ""}
                    onChange={handleChange}
                    placeholder="Project collaboration"
                    className="w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-theme-primary/50 transition-all"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message || ""}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    rows={4}
                    required
                    className="w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-theme-primary/50 transition-all resize-none"
                  />
                </div>

                {/* Status Message */}
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 flex items-center gap-2 text-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Message sent! Opening your chat now...
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 text-sm"
                  >
                    Failed to send message. Please try again.
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-theme-primary to-theme-secondary hover:opacity-90 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="inline-block"
                    >
                      <Send className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2 inline" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <ResumeViewer
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        fileUrl={links.resume}
      />
    </>
  );
};
