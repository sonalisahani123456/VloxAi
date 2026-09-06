import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bot,
  Check,
  ChevronDown,
  Clapperboard,
  Copy,
  Feather,
  FileText,
  Globe2,
  Info,
  Palette,
  Plus,
  Send,
  Sparkles,
  Wand2,
  X,
  Zap,
} from "lucide-react";

import { useBlog } from "../context/BlogContext";
import { api } from "../services/api";

const PERSONAS = {
  quill: {
    name: "Scribe",
    role: "Blog Editor",
    icon: Feather,
    iconClass: "text-violet-400",
    avatarClass: "bg-violet-500/15 border-violet-400/20",
    accentClass: "bg-violet-500",
    placeholder: "Ask Scribe to improve your content...",
  },
  nova: {
    name: "Frame",
    role: "Vlog Director",
    icon: Clapperboard,
    iconClass: "text-cyan-400",
    avatarClass: "bg-cyan-500/15 border-cyan-400/20",
    accentClass: "bg-cyan-500",
    placeholder: "Ask Frame about your vlog...",
  },
  assistant: {
    name: "Vlox AI",
    role: "Creative Assistant",
    icon: Bot,
    iconClass: "text-indigo-400",
    avatarClass: "bg-indigo-500/15 border-indigo-400/20",
    accentClass: "bg-indigo-500",
    placeholder: "Ask Vlox AI anything...",
  },
};

const QUICK_ACTIONS = [
  {
    id: "grammar",
    label: "Polish",
    description: "Improve writing",
    icon: Wand2,
    iconClass: "text-violet-400",
    prompt:
      "✍️ Check and polish my content with a professional, engaging tone.",
  },
  {
    id: "summary",
    label: "Summary",
    description: "Key points",
    icon: FileText,
    iconClass: "text-emerald-400",
    prompt: "📝 Generate a concise 3-bullet summary of my content.",
  },
  {
    id: "translate",
    label: "Translate",
    description: "Reach globally",
    icon: Globe2,
    iconClass: "text-cyan-400",
    prompt: "🌍 Translate my content into Spanish and Japanese.",
  },
  {
    id: "color",
    label: "Visuals",
    description: "Color ideas",
    icon: Palette,
    iconClass: "text-pink-400",
    prompt: "🎨 Recommend a modern, premium color palette for my content.",
  },
];

const INITIAL_MESSAGE = {
  id: "m-1",
  sender: "ai",
  text: "Welcome to VloxAI. I’m here to help you create, refine, and optimize your content.\n\nChoose a specialist above or tell me what you’d like to create.",
  time: "Now",
};

const createMessage = (sender, text) => ({
  id: `${sender}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  sender,
  text,
  time: "Just now",
});

const AiChatbot = () => {
  const { aiCredits, consumeAiCredits, showToast } = useBlog();

  const [isOpen, setIsOpen] = useState(false);
  const [activePersona, setActivePersona] = useState("assistant");
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showCreditInfo, setShowCreditInfo] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const personaMenuRef = useRef(null);

  const persona = PERSONAS[activePersona];
  const PersonaIcon = persona.icon;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(scrollToBottom, 80);
      return () => clearTimeout(timer);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        personaMenuRef.current &&
        !personaMenuRef.current.contains(event.target)
      ) {
        setShowPersonaMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  const changePersona = (personaId) => {
    setActivePersona(personaId);
    setShowPersonaMenu(false);
  };

  const addMessagesAndRequest = async ({ userText, actionType }) => {
    if (!consumeAiCredits(5)) return;

    const userEntry = createMessage("user", userText);

    setMessages((prev) => [...prev, userEntry]);
    setIsTyping(true);

    try {
      const payload = {
        prompt: userText,
        persona: activePersona,
      };

      if (actionType) {
        payload.actionType = actionType;
      }

      const res = await api.chatCopilot(payload);

      const replyText =
        res?.success && res?.reply
          ? res.reply
          : "I couldn’t process that request. Please try again.";

      setMessages((prev) => [...prev, createMessage("ai", replyText)]);
    } catch (error) {
      console.error("AI Copilot error:", error);

      setMessages((prev) => [
        ...prev,
        createMessage(
          "ai",
          "Something went wrong while connecting to VloxAI. Please try again in a moment.",
        ),
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = async (action) => {
    await addMessagesAndRequest({
      userText: action.prompt,
      actionType: action.id,
    });
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const userQuery = inputPrompt.trim();

    if (!userQuery || isTyping) return;

    setInputPrompt("");

    await addMessagesAndRequest({
      userText: userQuery,
    });
  };

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedId(id);
      showToast?.("Copied to clipboard!");

      setTimeout(() => {
        setCopiedId(null);
      }, 1800);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        ...INITIAL_MESSAGE,
        id: `welcome-${Date.now()}`,
      },
    ]);

    setInputPrompt("");
    setIsTyping(false);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[100]">
      {/* Floating Button */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.button
            key="floating-button"
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsOpen(true)}
            className="
              group
              flex items-center gap-3
              rounded-2xl
              bg-slate-950/95
              backdrop-blur-xl
              border border-slate-800
              shadow-[0_16px_50px_rgba(0,0,0,0.35)]
              px-4 py-3
              text-left
              transition-all
              hover:border-indigo-500/40
            "
            aria-label="Open VloxAI Assistant"
          >
            <div className="relative">
              <div
                className="
                w-10 h-10
                rounded-xl
                bg-indigo-500/15
                border border-indigo-400/20
                flex items-center justify-center
              "
              >
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>

              <span
                className="
                absolute -right-0.5 -bottom-0.5
                w-3 h-3
                rounded-full
                bg-emerald-400
                border-2
                border-slate-950
              "
              />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-white">
                VloxAI Assistant
              </p>

              <p className="text-[11px] text-slate-500 mt-0.5">
                Your creative AI copilot
              </p>
            </div>

            <Sparkles
              className="
              w-4 h-4
              text-indigo-400
              ml-1
              transition-transform
              group-hover:rotate-12
            "
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.94,
              y: 20,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="
              fixed
              inset-x-3 bottom-3
              sm:inset-x-auto sm:bottom-6 sm:right-6
              w-auto sm:w-[430px]
              h-[min(700px,calc(100vh-24px))]
              sm:h-[680px]
              flex flex-col
              overflow-hidden
              rounded-[24px]
              bg-slate-950
              border border-slate-800
              shadow-[0_24px_80px_rgba(0,0,0,0.55)]
            "
          >
            {/* Header */}
            <header
              className="
              shrink-0
              px-4 py-3.5
              border-b border-slate-800/80
              bg-slate-950
            "
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`
                    w-10 h-10
                    shrink-0
                    rounded-xl
                    border
                    flex items-center justify-center
                    ${persona.avatarClass}
                  `}
                  >
                    <PersonaIcon
                      className={`w-[18px] h-[18px] ${persona.iconClass}`}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-white truncate">
                        {persona.name}
                      </h2>

                      <span
                        className="
                        flex items-center gap-1
                        text-[9px]
                        font-medium
                        text-emerald-400
                        uppercase
                        tracking-wide
                      "
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Online
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {persona.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Credits */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCreditInfo((prev) => !prev)}
                      className="
                        h-8
                        px-2.5
                        rounded-lg
                        border border-slate-800
                        bg-slate-900/70
                        flex items-center gap-1.5
                        text-[10px]
                        text-slate-300
                        hover:text-white
                        hover:border-slate-700
                        transition-colors
                      "
                    >
                      <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{aiCredits}</span>
                    </button>

                    <AnimatePresence>
                      {showCreditInfo && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="
                            absolute
                            top-10
                            right-0
                            z-50
                            w-56
                            rounded-xl
                            bg-slate-900
                            border border-slate-800
                            shadow-2xl
                            p-3
                          "
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Info className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-[11px] font-semibold text-white">
                              AI Credits
                            </span>
                          </div>

                          <p className="text-[10px] leading-relaxed text-slate-500">
                            Each AI request currently uses 5 credits.
                          </p>

                          <div className="mt-3 space-y-1.5">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-slate-500">
                                Chat / Polish / SEO
                              </span>
                              <span className="text-slate-300">5 Cr</span>
                            </div>

                            <div className="flex justify-between text-[10px]">
                              <span className="text-slate-500">
                                Headlines / Fact Check
                              </span>
                              <span className="text-slate-300">5 Cr</span>
                            </div>

                            <div className="flex justify-between text-[10px]">
                              <span className="text-slate-500">
                                Blog / Vlog Outlines
                              </span>
                              <span className="text-slate-300">10 Cr</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* New Chat */}
                  <button
                    type="button"
                    onClick={handleNewChat}
                    title="New chat"
                    className="
                      w-8 h-8
                      rounded-lg
                      border border-slate-800
                      text-slate-500
                      flex items-center justify-center
                      hover:text-white
                      hover:bg-slate-900
                      transition-colors
                    "
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Close */}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    title="Close"
                    className="
                      w-8 h-8
                      rounded-lg
                      border border-slate-800
                      text-slate-500
                      flex items-center justify-center
                      hover:text-white
                      hover:bg-slate-900
                      transition-colors
                    "
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </header>

            {/* Persona Selector */}
            <div
              className="
              shrink-0
              px-4 py-2.5
              border-b border-slate-800/70
              bg-slate-950
            "
            >
              <div ref={personaMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setShowPersonaMenu((prev) => !prev)}
                  className="
                    w-full
                    flex items-center justify-between
                    px-3 py-2
                    rounded-xl
                    border border-slate-800
                    bg-slate-900/50
                    hover:bg-slate-900
                    transition-colors
                  "
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`
                      w-7 h-7
                      rounded-lg
                      border
                      flex items-center justify-center
                      ${persona.avatarClass}
                    `}
                    >
                      <PersonaIcon
                        className={`w-3.5 h-3.5 ${persona.iconClass}`}
                      />
                    </div>

                    <div className="text-left">
                      <p className="text-[11px] font-medium text-white">
                        {persona.name}
                      </p>

                      <p className="text-[9px] text-slate-500">
                        {persona.role}
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    className={`
                      w-3.5 h-3.5
                      text-slate-500
                      transition-transform
                      ${showPersonaMenu ? "rotate-180" : ""}
                    `}
                  />
                </button>

                <AnimatePresence>
                  {showPersonaMenu && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -4,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -4,
                      }}
                      className="
                        absolute
                        left-0 right-0
                        top-[calc(100%+6px)]
                        z-40
                        p-1.5
                        rounded-xl
                        bg-slate-900
                        border border-slate-800
                        shadow-2xl
                      "
                    >
                      {Object.entries(PERSONAS).map(([id, item]) => {
                        const Icon = item.icon;
                        const isActive = activePersona === id;

                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => changePersona(id)}
                            className={`
                                w-full
                                flex items-center gap-2.5
                                p-2
                                rounded-lg
                                text-left
                                transition-colors
                                ${
                                  isActive
                                    ? "bg-slate-800"
                                    : "hover:bg-slate-800/60"
                                }
                              `}
                          >
                            <div
                              className={`
                                w-8 h-8
                                rounded-lg
                                border
                                flex items-center justify-center
                                ${item.avatarClass}
                              `}
                            >
                              <Icon className={`w-4 h-4 ${item.iconClass}`} />
                            </div>

                            <div className="flex-1">
                              <p className="text-[11px] font-medium text-white">
                                {item.name}
                              </p>

                              <p className="text-[9px] text-slate-500">
                                {item.role}
                              </p>
                            </div>

                            {isActive && (
                              <Check className="w-3.5 h-3.5 text-indigo-400" />
                            )}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Messages */}
            <main
              className="
                flex-1
                min-h-0
                overflow-y-auto
                px-4
                py-5
                space-y-5
                scrollbar-thin
                scrollbar-thumb-slate-800
                scrollbar-track-transparent
              "
            >
              {messages.map((message) => {
                const isAi = message.sender === "ai";

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isAi ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`
                        flex
                        gap-2.5
                        max-w-[88%]
                        ${isAi ? "items-start" : "items-end"}
                      `}
                    >
                      {isAi && (
                        <div
                          className="
                          shrink-0
                          w-7 h-7
                          rounded-lg
                          bg-indigo-500/10
                          border border-indigo-400/15
                          flex items-center justify-center
                        "
                        >
                          <Bot className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                      )}

                      <div>
                        <div
                          className={`
                            px-3.5 py-3
                            rounded-2xl
                            ${
                              isAi
                                ? `
                                  bg-slate-900
                                  border border-slate-800
                                  rounded-tl-md
                                `
                                : `
                                  bg-indigo-600
                                  rounded-tr-md
                                  shadow-lg shadow-indigo-950/20
                                `
                            }
                          `}
                        >
                          <p
                            className="
                            text-[12px]
                            leading-[1.65]
                            whitespace-pre-line
                            text-slate-200
                          "
                          >
                            {message.text}
                          </p>
                        </div>

                        <div
                          className={`
                          mt-1.5
                          flex items-center gap-2
                          ${isAi ? "justify-start" : "justify-end"}
                        `}
                        >
                          <span className="text-[9px] text-slate-600">
                            {message.time}
                          </span>

                          {isAi && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(message.text, message.id)
                              }
                              className="
                                flex items-center gap-1
                                text-[9px]
                                text-slate-600
                                hover:text-slate-300
                                transition-colors
                              "
                            >
                              {copiedId === message.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-2.5"
                  >
                    <div
                      className="
                      w-7 h-7
                      shrink-0
                      rounded-lg
                      bg-indigo-500/10
                      border border-indigo-400/15
                      flex items-center justify-center
                    "
                    >
                      <Bot className="w-3.5 h-3.5 text-indigo-400" />
                    </div>

                    <div
                      className="
                      px-3.5 py-3
                      rounded-2xl rounded-tl-md
                      bg-slate-900
                      border border-slate-800
                    "
                    >
                      <div className="flex items-center gap-1">
                        <span
                          className="
                          w-1.5 h-1.5
                          rounded-full
                          bg-slate-500
                          animate-bounce
                        "
                        />
                        <span
                          className="
                          w-1.5 h-1.5
                          rounded-full
                          bg-slate-500
                          animate-bounce
                          [animation-delay:120ms]
                        "
                        />
                        <span
                          className="
                          w-1.5 h-1.5
                          rounded-full
                          bg-slate-500
                          animate-bounce
                          [animation-delay:240ms]
                        "
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </main>

            <section
              className="
              shrink-0
              px-4 pt-2.5 pb-2
              border-t border-slate-800/70
              bg-slate-950
            "
            >
              <div
                className="
                flex items-center justify-between
                mb-2
              "
              >
                <span
                  className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-slate-600
                "
                >
                  Quick actions
                </span>

                <Sparkles className="w-3 h-3 text-slate-700" />
              </div>

              <div
                className="
                grid
                grid-cols-2
                gap-1.5
              "
              >
                {QUICK_ACTIONS.map((action) => {
                  const ActionIcon = action.icon;

                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => handleActionClick(action)}
                      disabled={isTyping}
                      className="
                        flex items-center gap-2
                        px-2.5 py-2
                        rounded-xl
                        border border-slate-800
                        bg-slate-900/40
                        text-left
                        transition-all
                        hover:bg-slate-900
                        hover:border-slate-700
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                      "
                    >
                      <ActionIcon
                        className={`w-3.5 h-3.5 shrink-0 ${action.iconClass}`}
                      />

                      <div className="min-w-0">
                        <p
                          className="
                          text-[10px]
                          font-medium
                          text-slate-300
                        "
                        >
                          {action.label}
                        </p>

                        <p
                          className="
                          text-[8px]
                          text-slate-600
                          truncate
                        "
                        >
                          {action.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <form
              onSubmit={handleSendMessage}
              className="
                shrink-0
                px-4 pt-2 pb-4
                bg-slate-950
              "
            >
              <div
                className="
                flex items-center gap-2
                p-1.5
                rounded-2xl
                bg-slate-900
                border border-slate-800
                focus-within:border-indigo-500/40
                transition-colors
              "
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputPrompt}
                  onChange={(event) => setInputPrompt(event.target.value)}
                  disabled={isTyping}
                  placeholder={persona.placeholder}
                  className="
                    flex-1
                    min-w-0
                    bg-transparent
                    px-2.5
                    py-2
                    text-[12px]
                    text-white
                    placeholder:text-slate-600
                    outline-none
                    disabled:cursor-not-allowed
                  "
                  autoComplete="off"
                />

                <button
                  type="submit"
                  disabled={!inputPrompt.trim() || isTyping}
                  className="
                    w-9 h-9
                    shrink-0
                    rounded-xl
                    bg-indigo-600
                    text-white
                    flex items-center justify-center
                    transition-all
                    hover:bg-indigo-500
                    disabled:bg-slate-800
                    disabled:text-slate-600
                    disabled:cursor-not-allowed
                  "
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              <p
                className="
                text-center
                text-[8px]
                text-slate-700
                mt-2
              "
              >
                VloxAI can make mistakes. Review AI-generated content before
                publishing.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiChatbot;
