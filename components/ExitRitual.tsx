"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { API_URL } from "../lib/api";

const intentions = [
  { emoji: "🌊", label: "Calm",      context: "The user wants to carry a sense of calm with them." },
  { emoji: "🔍", label: "Clarity",   context: "The user wants to carry clarity of mind with them." },
  { emoji: "🦁", label: "Courage",   context: "The user wants to carry courage with them." },
  { emoji: "🌙", label: "Rest",      context: "The user wants to allow themselves to rest." },
  { emoji: "🙏", label: "Gratitude", context: "The user wants to carry gratitude with them." },
  { emoji: "🌱", label: "Hope",      context: "The user wants to carry hope with them." },
];

type Props = {
  onClose: () => void;
  sessionId: string;
};

type Stage = "select" | "loading" | "closing" | "goodbye";

export default function ExitRitual({ onClose, sessionId }: Props) {
  const [stage, setStage] = useState<Stage>("select");
  const [selected, setSelected] = useState<typeof intentions[0] | null>(null);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [exiting, setExiting] = useState(false);

  async function handleSelect(intention: typeof intentions[0]) {
    setSelected(intention);
    setStage("loading");

    try {
      const response = await fetch(API_URL + "/intention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: intention.context,
        }),
      });
      const data = await response.json();
      setAiMessage(data.message);
    } catch {
      setAiMessage("Carry that with you. You showed up today — that matters.");
    } finally {
      setStage("closing");
    }
  }

  function handleClose() {
    setStage("goodbye");
    setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 600);
    }, 2800);
  }

  function handleSkip() {
    setExiting(true);
    setTimeout(onClose, 400);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(10, 10, 15, 0.95)",
        backdropFilter: "blur(16px)",
        padding: "24px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: "420px", width: "100%", textAlign: "center" }}>
        <AnimatePresence mode="wait">

          {stage === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <p style={{
                fontSize: "13px",
                color: "#475569",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}>
                Before you go
              </p>
              <h2 style={{
                fontSize: "22px",
                fontWeight: 600,
                color: "#e2e8f0",
                marginBottom: "8px",
                lineHeight: "1.4",
              }}>
                What's one thing you want to carry with you today?
              </h2>
              <p style={{
                fontSize: "13px",
                color: "#334155",
                marginBottom: "36px",
              }}>
                One small intention can change the texture of a day.
              </p>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "10px",
                marginBottom: "24px",
              }}>
                {intentions.map((item, i) => (
                  <motion.button
                    key={item.label}
                    onClick={() => handleSelect(item)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "14px 16px",
                      borderRadius: "14px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.07)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      textAlign: "left" as const,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{item.emoji}</span>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "#94a3b8" }}>
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={handleSkip}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#1e293b",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: "8px",
                }}
              >
                Skip for now
              </button>
            </motion.div>
          )}

          {stage === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "6px",
              }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#6366f1",
                    }}
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {stage === "closing" && (
            <motion.div
              key="closing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div style={{ fontSize: "40px", marginBottom: "20px" }}>
                {selected?.emoji}
              </div>

              <p style={{
                fontSize: "13px",
                color: "#6366f1",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}>
                {selected?.label}
              </p>

              <p style={{
                fontSize: "16px",
                color: "#e2e8f0",
                lineHeight: "1.7",
                marginBottom: "36px",
                fontWeight: 300,
              }}>
                {aiMessage}
              </p>

              <motion.button
                onClick={handleClose}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "12px 32px",
                  borderRadius: "14px",
                  background: "rgba(99, 102, 241, 0.15)",
                  border: "1px solid rgba(99, 102, 241, 0.25)",
                  color: "#818cf8",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Close session
              </motion.button>
            </motion.div>
          )}

          {stage === "goodbye" && (
            <motion.div
              key="goodbye"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div style={{ fontSize: "36px", marginBottom: "20px" }}>🌙</div>
              <p style={{
                fontSize: "20px",
                fontWeight: 300,
                color: "#e2e8f0",
                lineHeight: "1.6",
                marginBottom: "12px",
              }}>
                Take care of yourself.
              </p>
              <p style={{
                fontSize: "13px",
                color: "#334155",
              }}>
                Mindspace will be here when you need it.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
}