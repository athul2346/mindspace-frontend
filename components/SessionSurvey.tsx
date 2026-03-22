"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../lib/api";
import { getSessionId } from "../lib/session";

const feelingOptions = [
  { id: "like_friend",    label: "Like talking to a friend" },
  { id: "helpful_robotic", label: "Helpful but a bit robotic" },
  { id: "not_needed",     label: "Not what I needed" },
  { id: "just_okay",      label: "Just okay" },
];

const improvementOptions = [
  { id: "more_understanding", label: "More understanding" },
  { id: "simpler_language",   label: "Simpler language" },
  { id: "less_questions",     label: "Less questions" },
  { id: "its_good",           label: "It's good as is" },
];

type Props = {
  onDone: () => void;
};

export default function SessionSurvey({ onDone }: Props) {
  const [step, setStep] = useState<"feeling" | "improvement" | "done">("feeling");
  const [feeling, setFeeling] = useState<string | null>(null);
  const [improvement, setImprovement] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleImprovementSelect(value: string) {
    setImprovement(value);
    setSaving(true);

    try {
      await fetch(API_URL + "/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: getSessionId(),
          feeling: feeling,
          improvement: value,
        }),
      });
    } catch {
      // silently fail — don't block the user
    } finally {
      setSaving(false);
      setStep("done");
      setTimeout(onDone, 1200);
    }
  }

  const primaryBtn = {
    padding: "12px 32px",
    borderRadius: "14px",
    background: "rgba(99, 102, 241, 0.15)",
    border: "1px solid rgba(99, 102, 241, 0.25)",
    color: "#818cf8",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer" as const,
    fontFamily: "inherit",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(10, 10, 15, 0.95)",
        backdropFilter: "blur(16px)",
        padding: "24px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: "380px", width: "100%", textAlign: "center" }}>
        <AnimatePresence mode="wait">

          {step === "feeling" && (
            <motion.div
              key="feeling"
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
                marginBottom: "16px",
              }}>
                Quick question
              </p>
              <p style={{
                fontSize: "20px",
                fontWeight: 400,
                color: "#e2e8f0",
                marginBottom: "28px",
                lineHeight: "1.5",
              }}>
                How did this feel today?
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                {feelingOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => {
                      setFeeling(option.id);
                      setStep("improvement");
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: "14px 18px",
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "#94a3b8",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.2s ease",
                      textAlign: "left" as const,
                    }}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>

              <button
                onClick={onDone}
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
                Skip
              </button>
            </motion.div>
          )}

          {step === "improvement" && (
            <motion.div
              key="improvement"
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
                marginBottom: "16px",
              }}>
                One more
              </p>
              <p style={{
                fontSize: "20px",
                fontWeight: 400,
                color: "#e2e8f0",
                marginBottom: "28px",
                lineHeight: "1.5",
              }}>
                What would make it better?
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                {improvementOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => handleImprovementSelect(option.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: "14px 18px",
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "#94a3b8",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.2s ease",
                      textAlign: "left" as const,
                    }}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>

              <button
                onClick={onDone}
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
                Skip
              </button>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p style={{
                fontSize: "20px",
                fontWeight: 300,
                color: "#e2e8f0",
                lineHeight: "1.6",
              }}>
                Thank you — this helps a lot.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
}