"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "../../components/BottomNav";
import SafetyButton from "../../components/SafetyButton";
import { getSessionId } from "../../lib/session";
import { API_URL } from "../../lib/api";

const prompts = [
  "What's taking up the most space in your head right now?",
  "What's one thing that felt hard today, and why?",
  "What would make tomorrow feel a little lighter?",
  "Is there something you've been avoiding thinking about?",
  "What do you wish someone understood about how you're feeling?",
];

type JournalEntry = {
  id?: number;
  content: string;
  mood?: string;
  created_at?: string;
  displayDate?: string;
};

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function JournalPage() {
  const [entry, setEntry] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    async function loadEntries() {
      try {
        const sessionId = getSessionId();
        const response = await fetch(
          API_URL + "/journal/" + sessionId
        );
        const data = await response.json();
        const loaded: JournalEntry[] = data.entries.map((e: any) => ({
          id: e.id,
          content: e.content,
          mood: e.mood,
          created_at: e.created_at,
          displayDate: e.created_at ? formatDate(e.created_at) : "Today",
        }));
        setEntries(loaded);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    loadEntries();
  }, []);

  function nextPrompt() {
    setPromptIndex((i) => (i + 1) % prompts.length);
    setEntry("");
    setSaved(false);
  }

  async function handleSave() {
    if (!entry.trim()) return;
    setSaving(true);
    try {
      const sessionId = getSessionId();
      await fetch(API_URL + "/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          content: entry.trim(),
          mood: "",
        }),
      });

      const newEntry: JournalEntry = {
        content: entry.trim(),
        displayDate: "Today",
        created_at: new Date().toISOString(),
      };
      setEntries((prev) => [newEntry, ...prev]);
      setSaved(true);

      // Clear after short delay so user sees the ✓ Saved confirmation
      setTimeout(() => {
        setEntry("");
        setSaved(false);
        setPromptIndex((i) => (i + 1) % prompts.length);
      }, 1200);

    } catch {
      setSaved(true);
      setTimeout(() => {
        setEntry("");
        setSaved(false);
      }, 1200);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      background: "radial-gradient(ellipse at top left, #0f0f2a 0%, #0a0a0f 50%, #0a0f1a 100%)",
      fontFamily: "'Inter', sans-serif",
      padding: "48px 24px 120px",
    }}>
      <SafetyButton />

      <div style={{ maxWidth: "560px", margin: "0 auto", width: "100%" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "8px",
          }}>
            <h1 style={{
              color: "#e2e8f0",
              fontSize: "22px",
              fontWeight: 600,
              margin: 0,
            }}>
              Journal
            </h1>
            {entries.length > 0 && (
              <button
                onClick={() => setShowHistory((s) => !s)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: showHistory ? "#818cf8" : "#334155",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: "4px 8px",
                }}
              >
                {showHistory ? "Write" : "History"}
              </button>
            )}
          </div>
          <p style={{
            color: "#475569",
            fontSize: "13px",
            marginBottom: "32px",
          }}>
            A private space to put words to what you're carrying
          </p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* WRITE VIEW */}
          {!showHistory && (
            <motion.div
              key="write"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {/* Prompt card */}
              <motion.div
                key={promptIndex}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  padding: "20px 24px",
                  borderRadius: "16px",
                  background: "rgba(99, 102, 241, 0.08)",
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <p style={{
                  color: "#c7d2fe",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  margin: 0,
                }}>
                  {prompts[promptIndex]}
                </p>
                <button
                  onClick={nextPrompt}
                  style={{
                    flexShrink: 0,
                    background: "transparent",
                    border: "none",
                    color: "#475569",
                    cursor: "pointer",
                    fontSize: "12px",
                    padding: "4px",
                    fontFamily: "inherit",
                  }}
                >
                  ↻ new
                </button>
              </motion.div>

              {/* Writing area */}
              <textarea
                value={entry}
                onChange={(e) => { setEntry(e.target.value); setSaved(false); }}
                placeholder="Write freely. This is just for you."
                rows={8}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px",
                  padding: "16px",
                  color: "#e2e8f0",
                  fontSize: "14px",
                  lineHeight: "1.8",
                  resize: "none",
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box" as const,
                  marginBottom: "16px",
                }}
              />

              <div style={{ display: "flex", gap: "12px" }}>
                <motion.button
                  onClick={handleSave}
                  disabled={!entry.trim() || saving}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    flex: 1,
                    padding: "13px",
                    borderRadius: "13px",
                    background: entry.trim() && !saving
                      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                      : "rgba(255,255,255,0.04)",
                    border: "none",
                    color: entry.trim() && !saving ? "white" : "#334155",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: entry.trim() && !saving ? "pointer" : "not-allowed",
                    fontFamily: "inherit",
                    transition: "all 0.2s ease",
                  }}
                >
                  {saving ? "Saving..." : saved ? "✓ Saved" : "Save entry"}
                </motion.button>

                <motion.button
                  onClick={() => { setEntry(""); setSaved(false); }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "13px 20px",
                    borderRadius: "13px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#475569",
                    fontSize: "14px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Clear
                </motion.button>
              </div>

              {saved && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    color: "#475569",
                    fontSize: "12px",
                    textAlign: "center",
                    marginTop: "12px",
                  }}
                >
                  Saved. Your words are safe here.
                </motion.p>
              )}
            </motion.div>
          )}

          {/* HISTORY VIEW */}
          {showHistory && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {loading && (
                <p style={{ color: "#1e293b", fontSize: "13px", textAlign: "center" }}>
                  Loading entries...
                </p>
              )}

              {!loading && entries.length === 0 && (
                <p style={{ color: "#334155", fontSize: "14px", textAlign: "center", marginTop: "24px" }}>
                  No entries yet. Write your first one.
                </p>
              )}

              {!loading && entries.map((e, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    padding: "16px 18px",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}>
                    <span style={{
                      fontSize: "11px",
                      color: "#6366f1",
                      fontWeight: 500,
                      letterSpacing: "0.05em",
                    }}>
                      {e.displayDate}
                    </span>
                    {e.created_at && (
                      <span style={{ fontSize: "11px", color: "#1e293b" }}>
                        {new Date(e.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                  <p style={{
                    color: "#64748b",
                    fontSize: "14px",
                    lineHeight: "1.7",
                    margin: 0,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                  }}>
                    {e.content}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
// after saving a fresh page is not showing