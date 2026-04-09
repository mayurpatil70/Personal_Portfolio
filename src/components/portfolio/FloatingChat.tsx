import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  ChevronRight,
  Loader2,
  Clock,
  CheckCheck,
  Plus,
  ArrowLeft,
  Inbox,
  Trash2,
  Sparkles,
} from "lucide-react";
import { DISCORD_WEBHOOK_URL } from "./Contact";

// ── Config ────────────────────────────────────────────────────────────────────
const WORKER_URL = import.meta.env.VITE_WORKER_URL;
const RATE_LIMIT_MS = 60_000; // 1 minute
const LS_CONVOS = "fc_conversations";
const LS_RL = "fc_last_submit";

// ── Static data ───────────────────────────────────────────────────────────────
const floatingMessages = [
  "Let's discuss an idea 💬",
  "Book a meeting 📅",
  "Hire me for a project 🚀",
  "Say hello! 👋",
  "Got a question? 🤔",
];

const categories = [
  {
    value: "idea",
    label: "Discuss an Idea",
    emoji: "💡",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    description: "Let's brainstorm together",
  },
  {
    value: "hiring",
    label: "Hiring / HR",
    emoji: "💼",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.12)",
    description: "Looking for talent",
  },
  {
    value: "project",
    label: "Collaboration",
    emoji: "🚀",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    description: "Build something cool",
  },
  {
    value: "general",
    label: "Just Chatting",
    emoji: "💬",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
    description: "Say hello",
  },
  {
    value: "meeting",
    label: "Book a Meeting",
    emoji: "📅",
    color: "#ec4899",
    bg: "rgba(236,72,153,0.12)",
    description: "Schedule time together",
  },
];

const categoryFields: Record<
  string,
  {
    id: string;
    label: string;
    placeholder: string;
    type?: string;
    multiline?: boolean;
  }[]
> = {
  idea: [
    { id: "name", label: "Your Name", placeholder: "Ada Lovelace" },
    {
      id: "email",
      label: "Email",
      placeholder: "ada@example.com",
      type: "email",
    },
    {
      id: "idea",
      label: "The Idea",
      placeholder: "Describe your idea in a few lines…",
      multiline: true,
    },
    {
      id: "collab",
      label: "How can I help?",
      placeholder: "Feedback, co-build, mentorship…",
      multiline: true,
    },
  ],
  hiring: [
    { id: "name", label: "Your Name", placeholder: "Recruiter's name" },
    {
      id: "email",
      label: "Work Email",
      placeholder: "hr@company.com",
      type: "email",
    },
    { id: "company", label: "Company / Org", placeholder: "Acme Inc." },
    {
      id: "role",
      label: "Role / Position",
      placeholder: "Frontend Developer, Full-stack…",
    },
    {
      id: "message",
      label: "Tell me more",
      placeholder: "Compensation, timeline, expectations…",
      multiline: true,
    },
  ],
  project: [
    { id: "name", label: "Your Name", placeholder: "Your name" },
    {
      id: "email",
      label: "Email",
      placeholder: "you@example.com",
      type: "email",
    },
    {
      id: "project",
      label: "Project Name / Summary",
      placeholder: "What are we building?",
    },
    { id: "stack", label: "Tech Stack", placeholder: "React, Node, Python…" },
    {
      id: "message",
      label: "Details & Expectations",
      placeholder: "Timeline, scope, your role…",
      multiline: true,
    },
  ],
  general: [
    { id: "name", label: "Your Name", placeholder: "Hey, I'm…" },
    {
      id: "email",
      label: "Email",
      placeholder: "so I can reply 😊",
      type: "email",
    },
    {
      id: "message",
      label: "Message",
      placeholder: "Anything on your mind!",
      multiline: true,
    },
  ],
  meeting: [
    { id: "name", label: "Your Name", placeholder: "Your name" },
    {
      id: "email",
      label: "Email",
      placeholder: "you@example.com",
      type: "email",
    },
    {
      id: "agenda",
      label: "Meeting Agenda",
      placeholder: "What should we discuss?",
    },
    {
      id: "availability",
      label: "Your Availability",
      placeholder: "Mon–Fri after 3pm IST, or share a Calendly…",
    },
  ],
};

// ── Types ─────────────────────────────────────────────────────────────────────
type BubbleRole = "user" | "ai" | "system";
interface Bubble {
  role: BubbleRole;
  content: string;
  label?: string;
  loading?: boolean;
}

interface Conversation {
  id: string;
  category: string;
  formData: Record<string, string>;
  bubbles: Bubble[];
  timestamp: number; // ms epoch
}

// ── LocalStorage helpers ──────────────────────────────────────────────────────
function loadConvos(): Conversation[] {
  try {
    return JSON.parse(localStorage.getItem(LS_CONVOS) ?? "[]");
  } catch {
    return [];
  }
}
function saveConvos(convos: Conversation[]) {
  try {
    localStorage.setItem(LS_CONVOS, JSON.stringify(convos));
  } catch {}
}
function getRLSecsRemaining(): number {
  try {
    const last = parseInt(localStorage.getItem(LS_RL) ?? "0", 10);
    const elapsed = Date.now() - last;
    return elapsed >= RATE_LIMIT_MS
      ? 0
      : Math.ceil((RATE_LIMIT_MS - elapsed) / 1000);
  } catch {
    return 0;
  }
}
function stampRL() {
  try {
    localStorage.setItem(LS_RL, Date.now().toString());
  } catch {}
}

// ── Misc helpers ──────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function buildFormSummary(
  category: string,
  data: Record<string, string>,
): string {
  const cat = categories.find((c) => c.value === category);
  const lines = (categoryFields[category] ?? [])
    .filter((f) => data[f.id]?.trim())
    .map((f) => `**${f.label}:** ${data[f.id]}`);
  return `${cat?.emoji ?? ""} **${cat?.label ?? category}**\n${lines.join("\n")}`;
}

function formatRelTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

// ── Worker API ────────────────────────────────────────────────────────────────
async function postToDiscord(category: string, data: Record<string, string>) {
  const res = await fetch(`${WORKER_URL}/discord`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, data }),
  });
  if (!res.ok) throw new Error(await res.text());
}
async function fetchThankYou(
  category: string,
  data: Record<string, string>,
): Promise<string> {
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
}

// ── Bubble renderer (shared) ──────────────────────────────────────────────────
const BubbleList = ({
  bubbles,
  endRef,
}: {
  bubbles: Bubble[];
  endRef?: React.RefObject<HTMLDivElement>;
}) => (
  <div className="flex flex-col gap-3">
    <AnimatePresence initial={false}>
      {bubbles.map((bubble, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", damping: 22, stiffness: 320 }}
        >
          {bubble.role === "system" && (
            <div className="flex justify-center">
              <span className="text-xs text-muted-foreground bg-muted/60 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCheck className="h-3 w-3 text-green-500" />{" "}
                {bubble.content}
              </span>
            </div>
          )}

          {bubble.role === "user" && (
            <div className="flex justify-end">
              <div className="max-w-[85%]">
                {bubble.label && (
                  <p className="text-xs text-right text-muted-foreground mb-1 pr-1 opacity-70">
                    {bubble.label}
                  </p>
                )}
                <div
                  className="rounded-2xl rounded-tr-sm px-4 py-2.5 text-white text-sm leading-relaxed"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--theme-primary)), hsl(var(--theme-secondary)))`,
                  }}
                >
                  {bubble.content.split("\n").map((line, li) => {
                    const field = line.match(/^\*\*(.+?):\*\* (.+)$/);
                    if (field)
                      return (
                        <div key={li} className="mb-0.5">
                          <span className="opacity-60 text-xs">
                            {field[1]}:{" "}
                          </span>
                          <span>{field[2]}</span>
                        </div>
                      );
                    const hdr = line.match(/^(.+?) \*\*(.+)\*\*$/);
                    if (hdr)
                      return (
                        <div key={li} className="font-semibold mb-1.5">
                          {hdr[1]} {hdr[2]}
                        </div>
                      );
                    return <div key={li}>{line}</div>;
                  })}
                </div>
              </div>
            </div>
          )}

          {bubble.role === "ai" && (
            <div className="flex items-end gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5 text-white text-xs font-bold"
                style={{
                  background: `linear-gradient(135deg, hsl(var(--theme-primary)), hsl(var(--theme-secondary)))`,
                }}
              >
                AK
              </div>
              <div
                className="max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed border"
                style={{
                  background: "hsl(var(--muted))",
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
              >
                {bubble.loading ? <TypingDots /> : bubble.content}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </AnimatePresence>
    {endRef && <div ref={endRef} />}
  </div>
);

// ── Typing dots ───────────────────────────────────────────────────────────────
const TypingDots = () => (
  <div className="flex items-center gap-1 h-4">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: "hsl(var(--muted-foreground))" }}
        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
      />
    ))}
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
// Main component
// ═════════════════════════════════════════════════════════════════════════════
type View = "home" | "history" | "select" | "form" | "chat";

export const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>("home");
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [activeConvoId, setActiveId] = useState<string | null>(null);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [messageIndex, setMsgIdx] = useState(0);
  const [isSubmitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showPeek, setShowPeek] = useState(false);
  const [peekDismissed, setPeekDismissed] = useState(false);
  const peekTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const peekAutoCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Init ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    setConvos(loadConvos());
    const rem = getRLSecsRemaining();
    if (rem > 0) startCooldownTicker(rem);

    // Listen for contact form submissions
    const handleOpenContact = (e: Event) => {
      const customEvent = e as CustomEvent<{ conversationId: string }>;
      const conversationId = customEvent.detail.conversationId;
      // Reload conversations to get the updated one with thank you message
      const updatedConvos = loadConvos();
      setConvos(updatedConvos);
      setIsOpen(true);
      setActiveId(conversationId);
      setView("chat");
    };

    window.addEventListener("floatingchat:open-contact", handleOpenContact);
    return () =>
      window.removeEventListener(
        "floatingchat:open-contact",
        handleOpenContact,
      );
  }, []);

  // ── Rotate floating label ───────────────────────────────────────────────────
  useEffect(() => {
    const iv = setInterval(
      () => setMsgIdx((p) => (p + 1) % floatingMessages.length),
      3000,
    );
    return () => clearInterval(iv);
  }, []);

  // ── Auto-scroll chat ────────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convos, activeConvoId]);

  // ── Cleanup cooldown interval ───────────────────────────────────────────────
  useEffect(
    () => () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    },
    [],
  );

  // ── Attention-grabber: peek notification after 8s of no interaction ─────────
  useEffect(() => {
    if (peekDismissed || isOpen) return;
    // Show peek after 8s
    peekTimerRef.current = setTimeout(() => {
      setShowPeek(true);
      // Auto-dismiss after 6s
      peekAutoCloseRef.current = setTimeout(() => {
        setShowPeek(false);
      }, 6000);
    }, 8000);
    return () => {
      if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
      if (peekAutoCloseRef.current) clearTimeout(peekAutoCloseRef.current);
    };
  }, [peekDismissed, isOpen]);

  // Hide peek when chat opens
  useEffect(() => {
    if (isOpen) {
      setShowPeek(false);
      setPeekDismissed(true);
      if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
      if (peekAutoCloseRef.current) clearTimeout(peekAutoCloseRef.current);
    }
  }, [isOpen]);

  // ── Derived state ───────────────────────────────────────────────────────────
  const activeConvo = convos.find((c) => c.id === activeConvoId) ?? null;
  const activeCatMeta = categories.find((c) => c.value === selectedCat);
  const fields = selectedCat ? categoryFields[selectedCat] : [];
  const chatLocked = activeConvo
    ? activeConvo.bubbles.some((b) => b.role === "system")
    : false;

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const startCooldownTicker = (initial: number) => {
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    setCooldown(initial);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const updateConvo = (
    id: string,
    updater: (c: Conversation) => Conversation,
  ) => {
    setConvos((prev) => {
      const next = prev.map((c) => (c.id === id ? updater(c) : c));
      saveConvos(next);
      return next;
    });
  };

  const pushBubble = (id: string, bubble: Bubble) => {
    updateConvo(id, (c) => ({ ...c, bubbles: [...c.bubbles, bubble] }));
  };

  const replaceLoadingBubble = (id: string, replacement: Bubble) => {
    updateConvo(id, (c) => ({
      ...c,
      bubbles: [...c.bubbles.filter((b) => !b.loading), replacement],
    }));
  };

  // ── Event handlers ──────────────────────────────────────────────────────────
  const handleOpen = () => {
    setIsOpen(true);
    const saved = loadConvos();
    setConvos(saved);
    setView(saved.length > 0 ? "home" : "select");
  };

  const handleClose = () => setIsOpen(false);

  const handleNewChat = () => {
    const rem = getRLSecsRemaining();
    if (rem > 0) {
      startCooldownTicker(rem);
      setView("select"); // still show select but categories will be disabled
    } else {
      setView("select");
    }
    setSelectedCat(null);
    setFormData({});
    setFormError(null);
  };

  const handleCategorySelect = (val: string) => {
    setSelectedCat(val);
    setFormData({});
    setFormError(null);
    setView("form");
  };

  const handleViewHistory = (id: string) => {
    setActiveId(id);
    setView("chat");
  };

  const handleDeleteConvo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConvos((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveConvos(next);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCat || isSubmitting) return;

    const rem = getRLSecsRemaining();
    if (rem > 0) {
      setFormError(`Please wait ${rem}s before submitting again.`);
      startCooldownTicker(rem);
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const cat = categories.find((c) => c.value === selectedCat)!;
    const summary = buildFormSummary(selectedCat, formData);
    const newId = uid();

    const newConvo: Conversation = {
      id: newId,
      category: selectedCat,
      formData: { ...formData },
      timestamp: Date.now(),
      bubbles: [
        { role: "user", content: summary, label: `${cat.emoji} ${cat.label}` },
        { role: "ai", content: "", loading: true },
      ],
    };

    setConvos((prev) => {
      const next = [newConvo, ...prev];
      saveConvos(next);
      return next;
    });
    setActiveId(newId);
    setView("chat");

    stampRL();
    startCooldownTicker(Math.ceil(RATE_LIMIT_MS / 1000));

    // Fire both in parallel, one is direct webhook
    const [, tyResult] = await Promise.allSettled([
      // ↓↓ Direct webhook instead of postToDiscord / worker
      fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `New ${selectedCat} submission from portfolio`,
          embeds: [
            {
              title: `Category: ${selectedCat}`,
              fields: Object.entries(formData).map(([key, value]) => ({
                name: key,
                value: value || "–",
                inline: false,
              })),
              color: 3447003,
            },
          ],
        }),
      }).catch(console.error),
      // ↓↓ Your existing thank-you fetch
      fetchThankYou(selectedCat, formData).catch(
        () => `Thanks ${formData.name || ""}! I'll be in touch soon. 🚀`,
      ),
    ]);

    const msg =
      tyResult.status === "fulfilled"
        ? (tyResult.value as string)
        : `Thanks ${formData.name || ""}! I'll be in touch soon. 🚀`;

    setConvos((prev) => {
      const next = prev.map((c) => {
        if (c.id !== newId) return c;
        return {
          ...c,
          bubbles: [
            ...c.bubbles.filter((b) => !b.loading),
            { role: "ai" as BubbleRole, content: msg },
            {
              role: "system" as BubbleRole,
              content: "✅ Sent to inbox — I'll reply to your email shortly!",
            },
          ],
        };
      });
      saveConvos(next);
      return next;
    });

    setSubmitting(false);
  };

  // ── Header logic ─────────────────────────────────────────────────────────────
  const headerInfo = (): { title: string; subtitle: string } => {
    if (view === "home")
      return {
        title: "Messages",
        subtitle:
          convos.length > 0
            ? `${convos.length} conversation${convos.length > 1 ? "s" : ""}`
            : "No messages yet",
      };
    if (view === "select")
      return { title: "New Message", subtitle: "Pick a reason to connect" };
    if (view === "form")
      return {
        title: `${activeCatMeta?.emoji} ${activeCatMeta?.label}`,
        subtitle: activeCatMeta?.description ?? "",
      };
    if (view === "chat")
      return {
        title: activeConvo
          ? (categories.find((c) => c.value === activeConvo.category)?.label ??
            "Chat")
          : "Chat",
        subtitle: activeConvo ? formatRelTime(activeConvo.timestamp) : "",
      };
    return { title: "Contact", subtitle: "" };
  };

  const canGoBack = view === "select" || view === "form" || view === "chat";
  const handleBack = () => {
    if (view === "form") setView("select");
    else if (view === "select" || view === "chat")
      setView(convos.length > 0 ? "home" : "select");
  };

  const hi = headerInfo();

  // ── Unread badge: convos with loading bubbles (submitting) ───────────────────
  const submittingCount = convos.filter((c) =>
    c.bubbles.some((b) => b.loading),
  ).length;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* ── Panel ─────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="w-[370px] rounded-2xl shadow-2xl overflow-hidden border flex flex-col"
            style={{
              background: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              height: view === "chat" || view === "home" ? "540px" : "auto",
              maxHeight: "84vh",
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3.5 flex items-center gap-3 flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, hsl(var(--theme-primary)), hsl(var(--theme-secondary)))`,
              }}
            >
              {canGoBack && (
                <button
                  onClick={handleBack}
                  className="text-white/80 hover:text-white p-1 rounded-full transition-colors flex-shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight truncate">
                  {hi.title}
                </p>
                <p className="text-white/65 text-xs mt-0.5 truncate">
                  {hi.subtitle}
                </p>
              </div>
              {/* New chat button shown on home & chat views */}
              {view === "chat" && (
                <button
                  onClick={handleNewChat}
                  title="New message"
                  className="text-white/80 hover:text-white p-1.5 rounded-full transition-colors flex-shrink-0 relative"
                >
                  <Plus className="h-4 w-4" />
                  {cooldown > 0 && (
                    <span className="absolute -top-1 -right-1 text-[9px] bg-amber-400 text-black rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                      {cooldown > 99 ? "…" : cooldown}
                    </span>
                  )}
                </button>
              )}
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white p-1 rounded-full transition-colors flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <AnimatePresence mode="wait">
                {/* ── HOME: conversation list ─────────────────────────────── */}
                {view === "home" && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    className="flex-1 overflow-y-auto flex flex-col"
                  >
                    {/* ── Prominent New Message CTA ── */}
                    <div className="px-4 pt-4 pb-2">
                      <motion.button
                        onClick={handleNewChat}
                        disabled={cooldown > 0}
                        whileHover={
                          cooldown === 0 ? { scale: 1.02, y: -1 } : {}
                        }
                        whileTap={cooldown === 0 ? { scale: 0.98 } : {}}
                        className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-white font-semibold text-sm relative overflow-hidden disabled:opacity-60 transition-opacity shadow-md"
                        style={{
                          background: `linear-gradient(135deg, hsl(var(--theme-primary)), hsl(var(--theme-secondary)))`,
                        }}
                      >
                        {/* Shimmer sweep */}
                        {cooldown === 0 && (
                          <motion.div
                            className="absolute inset-0 opacity-20"
                            style={{
                              background:
                                "linear-gradient(105deg, transparent 35%, white 50%, transparent 65%)",
                            }}
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{
                              duration: 2.4,
                              repeat: Infinity,
                              repeatDelay: 1.8,
                              ease: "easeInOut",
                            }}
                          />
                        )}
                        {cooldown > 0 ? (
                          <>
                            <Clock className="h-4 w-4" /> New message in{" "}
                            {cooldown}s
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4" /> New Message
                          </>
                        )}
                      </motion.button>
                    </div>

                    {convos.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
                        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                          <Inbox className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">No messages yet</p>
                        <p className="text-xs text-muted-foreground">
                          Start a conversation and it'll appear here.
                        </p>
                      </div>
                    ) : (
                      <div
                        className="flex flex-col divide-y"
                        style={{ borderColor: "hsl(var(--border))" }}
                      >
                        {convos.map((convo, i) => {
                          const cat = categories.find(
                            (c) => c.value === convo.category,
                          );
                          const lastBubble = [...convo.bubbles]
                            .reverse()
                            .find((b) => !b.loading && b.role !== "system");
                          const isLoading = convo.bubbles.some(
                            (b) => b.loading,
                          );
                          const preview =
                            lastBubble?.content
                              .replace(/\*\*/g, "")
                              .split("\n")[0] ?? "";
                          return (
                            <motion.button
                              key={convo.id}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.04 }}
                              onClick={() => handleViewHistory(convo.id)}
                              whileHover={{
                                backgroundColor: "hsl(var(--muted)/0.5)",
                              }}
                              className="flex items-center gap-3 px-4 py-3.5 text-left w-full group transition-colors"
                            >
                              {/* Avatar */}
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                                style={{
                                  background: cat ? cat.bg : "rgba(0,0,0,0.05)",
                                  border: `1.5px solid ${cat?.color ?? "#ccc"}30`,
                                }}
                              >
                                {cat?.emoji ?? "💬"}
                              </div>
                              {/* Text */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <p
                                    className="text-sm font-semibold truncate"
                                    style={{ color: cat?.color }}
                                  >
                                    {cat?.label ?? convo.category}
                                  </p>
                                  <span className="text-xs text-muted-foreground flex-shrink-0">
                                    {formatRelTime(convo.timestamp)}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                  {isLoading ? (
                                    <span className="italic">Sending…</span>
                                  ) : preview.length > 60 ? (
                                    preview.slice(0, 57) + "…"
                                  ) : (
                                    preview
                                  )}
                                </p>
                              </div>
                              {/* Delete */}
                              <button
                                onClick={(e) => handleDeleteConvo(convo.id, e)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-red-400" />
                              </button>
                            </motion.button>
                          );
                        })}
                      </div>
                    )}

                    {/* Footer */}
                    <div
                      className="mt-auto px-4 py-3 border-t flex items-center justify-between"
                      style={{ borderColor: "hsl(var(--border))" }}
                    >
                      <p className="text-xs text-muted-foreground">
                        Stored locally on your device
                      </p>
                      {convos.length > 0 && (
                        <button
                          onClick={() => {
                            setConvos([]);
                            saveConvos([]);
                          }}
                          className="text-xs text-red-400 hover:text-red-500 transition-colors"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── SELECT: category cards ──────────────────────────────── */}
                {view === "select" && (
                  <motion.div
                    key="select"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    className="p-4 flex flex-col gap-2 overflow-y-auto"
                  >
                    {cooldown > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 px-3 py-2 rounded-xl mb-1"
                      >
                        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                        Rate limited — new submission in{" "}
                        <strong className="ml-1">{cooldown}s</strong>
                      </motion.div>
                    )}
                    {categories.map((cat, i) => (
                      <motion.button
                        key={cat.value}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.055 }}
                        onClick={() => handleCategorySelect(cat.value)}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={cooldown > 0}
                        className="flex items-center gap-3 w-full text-left rounded-xl px-4 py-3 transition-all group border disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: cat.bg,
                          borderColor: `${cat.color}30`,
                        }}
                      >
                        <span
                          className="flex items-center justify-center w-10 h-10 rounded-xl text-xl flex-shrink-0"
                          style={{
                            background: cat.bg,
                            border: `1.5px solid ${cat.color}40`,
                          }}
                        >
                          {cat.emoji}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-semibold text-sm"
                            style={{ color: cat.color }}
                          >
                            {cat.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {cat.description}
                          </p>
                        </div>
                        <ChevronRight
                          className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-1"
                          style={{ color: cat.color }}
                        />
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {/* ── FORM ───────────────────────────────────────────────────── */}
                {view === "form" && (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    onSubmit={handleSubmit}
                    className="p-4 flex flex-col gap-3 overflow-y-auto"
                  >
                    {fields.map((field) => (
                      <div key={field.id} className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-muted-foreground">
                          {field.label}
                        </label>
                        {field.multiline ? (
                          <textarea
                            required
                            rows={3}
                            placeholder={field.placeholder}
                            value={formData[field.id] || ""}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                [field.id]: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2"
                          />
                        ) : (
                          <input
                            required
                            type={field.type || "text"}
                            placeholder={field.placeholder}
                            value={formData[field.id] || ""}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                [field.id]: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2"
                          />
                        )}
                      </div>
                    ))}

                    {formError && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg"
                      >
                        ⚠️ {formError}
                      </motion.p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={isSubmitting || cooldown > 0}
                      whileTap={{ scale: 0.97 }}
                      className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
                      style={{
                        background: `linear-gradient(135deg, hsl(var(--theme-primary)), hsl(var(--theme-secondary)))`,
                      }}
                    >
                      {cooldown > 0 ? (
                        <>
                          <Clock className="h-4 w-4" /> Wait {cooldown}s
                        </>
                      ) : isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-4 w-4" /> Send Message
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}

                {/* ── CHAT: view conversation ─────────────────────────────── */}
                {view === "chat" && activeConvo && (
                  <motion.div
                    key={`chat-${activeConvo.id}`}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    className="flex-1 flex flex-col min-h-0"
                  >
                    {/* Date stamp */}
                    <div className="px-4 pt-3 pb-1 flex justify-center">
                      <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                        {new Date(activeConvo.timestamp).toLocaleString(
                          undefined,
                          { dateStyle: "medium", timeStyle: "short" },
                        )}
                      </span>
                    </div>

                    {/* Bubbles */}
                    <div className="flex-1 overflow-y-auto px-4 pb-4 pt-2">
                      <BubbleList
                        bubbles={activeConvo.bubbles}
                        endRef={chatEndRef}
                      />
                    </div>

                    {/* Footer */}
                    <div
                      className="flex-shrink-0 border-t px-4 py-2.5"
                      style={{ borderColor: "hsl(var(--border))" }}
                    >
                      {chatLocked ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                            <CheckCheck className="h-3.5 w-3.5 text-green-500" />
                            Conversation complete
                          </div>
                          <button
                            onClick={handleNewChat}
                            disabled={cooldown > 0}
                            className="w-full mt-1 flex items-center justify-center gap-2 py-2 rounded-xl text-white text-xs font-semibold disabled:opacity-50 transition-opacity"
                            style={{
                              background: `linear-gradient(135deg, hsl(var(--theme-primary)), hsl(var(--theme-secondary)))`,
                            }}
                          >
                            {cooldown > 0 ? (
                              <>
                                <Clock className="h-3.5 w-3.5" /> New message in{" "}
                                {cooldown}s
                              </>
                            ) : (
                              <>
                                <Plus className="h-3.5 w-3.5" /> Start a new
                                message
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Sending…
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating button ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Peek attention-grabber notification */}
        <AnimatePresence>
          {showPeek && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              transition={{ type: "spring", damping: 18, stiffness: 260 }}
              className="relative hidden sm:flex flex-col gap-1 max-w-[340px]"
            >
              {/* Card */}
              <div
                className="rounded-2xl px-4 py-3 shadow-xl border cursor-pointer select-none"
                style={{
                  background: `linear-gradient(135deg, hsl(var(--theme-primary)/0.12), hsl(var(--theme-secondary)/0.08))`,
                  borderColor: `hsl(var(--theme-primary)/0.25)`,
                  backdropFilter: "blur(8px)",
                }}
                onClick={() => {
                  setShowPeek(false);
                  setPeekDismissed(true);
                  handleOpen();
                }}
              >
                {/* Dismiss X */}
                <button
                  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPeek(false);
                    setPeekDismissed(true);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>

                <div className="flex items-start gap-2.5 pr-3 max-w-[280px] sm:max-w-[320px]">
                  {/* Animated avatar */}
                  <motion.div
                    animate={{ rotate: [0, -8, 8, -5, 5, 0] }}
                    transition={{
                      duration: 1.2,
                      delay: 0.4,
                      ease: "easeInOut",
                    }}
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5"
                    style={{
                      background: `linear-gradient(135deg, hsl(var(--theme-primary)), hsl(var(--theme-secondary)))`,
                    }}
                  >
                    AK
                  </motion.div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <p
                        className="text-xs font-semibold leading-tight"
                        style={{ color: "hsl(var(--theme-primary))" }}
                      >
                        Hey there 👋
                      </p>
                      <motion.span
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          repeatDelay: 1.5,
                        }}
                      >
                        <Sparkles
                          className="h-2.5 w-2.5"
                          style={{ color: "hsl(var(--theme-primary))" }}
                        />
                      </motion.span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Have an idea, opportunity, or question?
                      <br />
                      Let’s build something great together.
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <motion.div
                  className="mt-2.5 flex items-center gap-1 text-xs font-semibold"
                  style={{ color: "hsl(var(--theme-primary))" }}
                  animate={{ x: [0, 3, 0] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatDelay: 0.8,
                  }}
                >
                  <MessageCircle className="h-3 w-3" />
                  Start a conversation →
                </motion.div>
              </div>

              {/* Pointer triangle */}
              <div
                className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-r border-t"
                style={{
                  background: `hsl(var(--theme-primary)/0.12)`,
                  borderColor: `hsl(var(--theme-primary)/0.25)`,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rotating floating label (only when peek is hidden) */}
        {!isOpen && !showPeek && (
          <AnimatePresence mode="wait">
            <motion.span
              key={messageIndex}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="hidden sm:block bg-card text-foreground text-sm font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap border"
            >
              {floatingMessages[messageIndex]}
            </motion.span>
          </AnimatePresence>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={isOpen ? handleClose : handleOpen}
          className="relative w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, hsl(var(--theme-primary)), hsl(var(--theme-secondary)))`,
          }}
          // Wiggle animation to draw attention when peek is showing
          animate={
            showPeek && !isOpen
              ? {
                  rotate: [0, -12, 12, -8, 8, -4, 4, 0],
                  scale: [1, 1.08, 1.08, 1.08, 1.08, 1.05, 1.05, 1],
                }
              : {}
          }
          transition={
            showPeek ? { duration: 0.8, delay: 0.3, ease: "easeInOut" } : {}
          }
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Conversation count badge */}
          {!isOpen && convos.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-gray-900"
            >
              {convos.length > 9 ? "9+" : convos.length}
            </motion.span>
          )}

          {/* Ping rings — 2 layered rings when no convos */}
          {!isOpen && convos.length === 0 && (
            <>
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-25"
                style={{ background: `hsl(var(--theme-primary))` }}
              />
              <motion.span
                className="absolute inset-0 rounded-full opacity-0"
                style={{ border: `2px solid hsl(var(--theme-primary))` }}
                animate={
                  showPeek
                    ? {
                        opacity: [0, 0.6, 0],
                        scale: [1, 1.6, 1.6],
                      }
                    : {}
                }
                transition={{
                  duration: 1.5,
                  repeat: showPeek ? Infinity : 0,
                  repeatDelay: 0.5,
                }}
              />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};
