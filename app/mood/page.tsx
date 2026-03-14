"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "../../components/BottomNav";
import SafetyButton from "../../components/SafetyButton";
import { getSessionId } from "../../lib/session";
import { API_URL } from "../../lib/api";

const moodColors: Record<number, string> = {
  1:  "#ef4444",
  2:  "#f97316",
  3:  "#f59e0b",
  4:  "#eab308",
  5:  "#84cc16",
  6:  "#22c55e",
  7:  "#10b981",
  8:  "#06b6d4",
  9:  "#6366f1",
  10: "#8b5cf6",
};

const moodLabels: Record<number, string> = {
  1:  "Terrible",
  2:  "Really low",
  3:  "Low",
  4:  "Not great",
  5:  "Okay",
  6:  "Alright",
  7:  "Good",
  8:  "Really good",
  9:  "Great",
  10: "Amazing",
};

type LogEntry = {
  id?: number;
  score: number;
  note: string;
  time: string;
  created_at?: string;
};

export default function MoodPage() {
  const [score, setScore] = useState<number>(5);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load history on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const sessionId = getSessionId();
        const response = await fetch(
          API_URL + "/mood/" + sessionId
        );
        const data = await response.json();
        const entries: LogEntry[] = data.logs.map((l: any) => ({
          id: l.id,
          score: l.score,
          note: l.note || "",
          time: l.created_at
            ? new Date(l.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          created_at: l.created_at,
        }));
        setLog(entries);
      } catch {
        // silently fail — history just won't show
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  async function handleSubmit() {
    setSaving(true);
    try {
      const sessionId = getSessionId();
      await fetch(API_URL + "/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          score,
          note,
        }),
      });

      const entry: LogEntry = {
        score,
        note,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setLog((prev) => [entry, ...prev]);
      setSubmitted(true);
    } catch {
      // still update UI even if save fails
      const entry: LogEntry = {
        score,
        note,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setLog((prev) => [entry, ...prev]);
      setSubmitted(true);
    } finally {
      setSaving(false);
    }
  }

  function handleAgain() {
    setSubmitted(false);
    setScore(5);
    setNote("");
  }

  const color = moodColors[score];

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at top left, #0f0f2a 0%, #0a0a0f 50%, #0a0f1a 100%)",
      fontFamily: "'Inter', sans-serif",
      padding: "48px 24px 120px",
    }}>
      <SafetyButton />

      <div style={{ maxWidth: "480px", margin: "0 auto", width: "100%" }}>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{
            fontSize: "22px",
            fontWeight: 600,
            color: "#e2e8f0",
            marginBottom: "4px",
          }}>
            Mood
          </h1>
          <p style={{
            color: "#334155",
            fontSize: "13px",
            marginBottom: "32px",
          }}>
            Track how you feel over time
          </p>
        </motion.div>

        {/* 7-day strip */}
        {log.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "32px",
              alignItems: "flex-end",
            }}
          >
            {log.slice(0, 7).reverse().map((entry, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <div style={{
                  width: "28px",
                  height: (entry.score / 10) * 40 + 8 + "px",
                  borderRadius: "6px",
                  background: moodColors[entry.score],
                  opacity: 0.7,
                }} />
                <span style={{ fontSize: "10px", color: "#334155" }}>
                  {entry.score}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <motion.div
                  key={score}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    fontSize: "56px",
                    fontWeight: 700,
                    color: color,
                    lineHeight: 1,
                    marginBottom: "8px",
                  }}
                >
                  {score}
                </motion.div>
                <motion.p
                  key={moodLabels[score]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ fontSize: "14px", color: "#64748b", fontWeight: 400 }}
                >
                  {moodLabels[score]}
                </motion.p>
              </div>

              <div style={{ marginBottom: "28px", padding: "0 4px" }}>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  style={{
                    width: "100%",
                    appearance: "none",
                    height: "4px",
                    borderRadius: "2px",
                    background: `linear-gradient(to right, ${color} 0%, ${color} ${(score - 1) / 9 * 100}%, rgba(255,255,255,0.08) ${(score - 1) / 9 * 100}%, rgba(255,255,255,0.08) 100%)`,
                    outline: "none",
                    cursor: "pointer",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                  <span style={{ fontSize: "11px", color: "#1e293b" }}>Low</span>
                  <span style={{ fontSize: "11px", color: "#1e293b" }}>High</span>
                </div>
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's contributing to this? (optional)"
                rows={3}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "14px",
                  padding: "14px 16px",
                  color: "#e2e8f0",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  resize: "none",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box" as const,
                  marginBottom: "20px",
                }}
              />

              <motion.button
                onClick={handleSubmit}
                disabled={saving}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "none",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: 500,
                  cursor: saving ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  opacity: saving ? 0.7 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {saving ? "Saving..." : "Log mood"}
              </motion.button>
            </motion.div>

          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ textAlign: "center", paddingTop: "16px" }}
            >
              <div style={{
                fontSize: "52px",
                fontWeight: 700,
                color: color,
                marginBottom: "12px",
              }}>
                {score}
              </div>
              <p style={{
                color: "#e2e8f0",
                fontSize: "18px",
                fontWeight: 500,
                marginBottom: "8px",
              }}>
                {moodLabels[score]}
              </p>
              <p style={{
                color: "#334155",
                fontSize: "13px",
                marginBottom: "32px",
              }}>
                Logged at {log[0]?.time}. Small moments of awareness add up.
              </p>
              <button
                onClick={handleAgain}
                style={{
                  padding: "10px 24px",
                  borderRadius: "12px",
                  background: "rgba(99, 102, 241, 0.12)",
                  border: "1px solid rgba(99, 102, 241, 0.25)",
                  color: "#818cf8",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Log another
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History list */}
        {!loading && log.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginTop: "40px" }}
          >
            <p style={{
              fontSize: "11px",
              color: "#1e293b",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}>
              Recent
            </p>
            {log.map((entry, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                marginBottom: "8px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: moodColors[entry.score],
                    flexShrink: 0,
                  }} />
                  <div>
                    <p style={{
                      color: "#94a3b8",
                      fontSize: "14px",
                      margin: 0,
                      fontWeight: 500,
                    }}>
                      {moodLabels[entry.score]}
                    </p>
                    {entry.note && (
                      <p style={{ color: "#334155", fontSize: "12px", margin: "2px 0 0 0" }}>
                        {entry.note}
                      </p>
                    )}
                  </div>
                </div>
                <span style={{ fontSize: "12px", color: "#1e293b", flexShrink: 0 }}>
                  {entry.time}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {loading && (
          <p style={{
            textAlign: "center",
            color: "#1e293b",
            fontSize: "13px",
            marginTop: "32px",
          }}>
            Loading history...
          </p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}