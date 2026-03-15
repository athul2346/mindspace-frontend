"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "../components/ChatMessage";
import TypingIndicator from "../components/TypingIndicator";
import SafetyButton from "../components/SafetyButton";
import BottomNav from "../components/BottomNav";
import MoodEntry from "../components/MoodEntry";
import ExitRitual from "../components/ExitRitual";
import { API_URL } from "../lib/api";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function generateSessionId() {
  return Math.random().toString(36).substring(2, 15);
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingGreeting, setLoadingGreeting] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(generateSessionId);
  const [showMoodEntry, setShowMoodEntry] = useState(true);
  const [showExitRitual, setShowExitRitual] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  }, [input]);

  async function handleMoodSelect(mood: { emoji: string; label: string; context: string }) {
    setShowMoodEntry(false);
    setLoadingGreeting(true);
    try {
      const response = await fetch(API_URL + "/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: mood.context,
        }),
      });
      const data = await response.json();
      setMessages([{ role: "assistant", content: data.greeting }]);
    } catch {
      setMessages([{ role: "assistant", content: "Glad you're here. What's on your mind?" }]);
    } finally {
      setLoadingGreeting(false);
    }
  }
  // Handling exit
  function handleExitClose() {
    setMessages([]);
    setInput("");
    setSessionId(generateSessionId());
    setShowMoodEntry(true);
    setShowExitRitual(false);
  }

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsTyping(true);
    try {
      const response = await fetch(API_URL + "/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: trimmed }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Something went quiet on my end. Try again.",
      }]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function shouldShowAvatar(index: number): boolean {
    if (messages[index].role === "user") return false;
    if (index === 0) return true;
    return messages[index - 1].role === "user";
  }

  // Mood entry screen
  if (showMoodEntry) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top left, #0f0f2a 0%, #0a0a0f 50%, #0a0f1a 100%)",
      }}>
        <SafetyButton />
        <MoodEntry onSelect={handleMoodSelect} />
      </div>
    );
  }

  // Chat screen
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "radial-gradient(ellipse at top left, #0f0f2a 0%, #0a0a0f 50%, #0a0f1a 100%)",
      fontFamily: "'Inter', sans-serif",
    }}>
      <SafetyButton />

      {/* Exit ritual overlay */}
      {showExitRitual && (
        <ExitRitual
          sessionId={sessionId}
          onClose={handleExitClose}
        />
      )}

      {/* Header */}
      <div style={{
        flexShrink: 0,
        textAlign: "center",
        padding: "24px 16px 12px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{
            fontSize: "24px",
            fontWeight: 600,
            letterSpacing: "0.05em",
            background: "linear-gradient(to right, #818cf8, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}>
            Mindspace
          </h1>
          <p style={{
            fontSize: "11px",
            color: "#475569",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginTop: "4px",
          }}>
            A quiet place to process your day
          </p>
        </motion.div>

        {/* Wrap up button */}
        <AnimatePresence>
          {messages.length >= 6 && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowExitRitual(true)}
              style={{
                position: "absolute",
                left: "16px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                color: "#475569",
                fontSize: "12px",
                padding: "6px 12px",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "color 0.2s ease, border-color 0.2s ease",
              }}
            >
              Wrap up
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", width: "100%" }}>

          {loadingGreeting && <TypingIndicator />}

          <AnimatePresence>
            {messages.map((msg, i) => (
              <ChatMessage
                key={i}
                role={msg.role}
                content={msg.content}
                showAvatar={shouldShowAvatar(i)}
              />
            ))}
          </AnimatePresence>

          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div style={{ flexShrink: 0, padding: "0 16px 90px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", width: "100%" }}>
          <div style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(12px)",
          }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share what's on your mind..."
              rows={1}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                resize: "none",
                color: "#e2e8f0",
                fontSize: "14px",
                lineHeight: "1.6",
                minHeight: "24px",
                maxHeight: "120px",
                fontFamily: "inherit",
              }}
            />
            <motion.button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              whileTap={{ scale: 0.92 }}
              style={{
                flexShrink: 0,
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none",
                cursor: !input.trim() || isTyping ? "not-allowed" : "pointer",
                opacity: !input.trim() || isTyping ? 0.3 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2px",
                transition: "opacity 0.2s",
              }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </motion.button>
          </div>

          <p style={{
            textAlign: "center",
            fontSize: "11px",
            color: "#334155",
            marginTop: "8px",
            letterSpacing: "0.02em",
          }}>
            Mindspace is not a substitute for professional mental health care
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}