"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Stage = "intro" | "senses" | "landing";

type Props = {
  onBack: () => void;
};

const senseSteps = [
  { count: 5, emoji: "👁️",  sense: "see",   prompt: "Name 5 things you can see right now.", sub: "Look slowly around the room." },
  { count: 4, emoji: "🤚",  sense: "touch", prompt: "Name 4 things you can physically touch.", sub: "Feel textures — rough, smooth, warm, cool." },
  { count: 3, emoji: "👂",  sense: "hear",  prompt: "Name 3 sounds you can hear right now.", sub: "Listen for distant sounds too." },
  { count: 2, emoji: "👃",  sense: "smell", prompt: "Name 2 things you can smell.", sub: "Even the air or your own skin counts." },
  { count: 1, emoji: "👅",  sense: "taste", prompt: "Name 1 thing you can taste.", sub: "Take a slow breath through your mouth." },
];

export default function OverwhelmedFlow({ onBack }: Props) {
  const [stage, setStage] = useState<Stage>("intro");
  const [senseStep, setSenseStep] = useState(0);
  const router = useRouter();

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

  const ghostBtn = {
    background: "transparent",
    border: "none",
    color: "#334155",
    fontSize: "13px",
    cursor: "pointer" as const,
    fontFamily: "inherit",
    padding: "8px",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at top left, #0f0f2a 0%, #0a0a0f 50%, #0a0f1a 100%)",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 24px",
    }}>
      <button onClick={onBack} style={{
        position: "fixed", top: "24px", left: "16px",
        background: "transparent", border: "none",
        color: "#1e293b", fontSize: "13px",
        cursor: "pointer", fontFamily: "inherit", padding: "8px",
      }}>
        ← Back
      </button>

      <div style={{ maxWidth: "380px", width: "100%", textAlign: "center" }}>
        <AnimatePresence mode="wait">

          {stage === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div style={{ fontSize: "36px", marginBottom: "24px" }}>🌊</div>
              <p style={{
                fontSize: "22px",
                fontWeight: 400,
                color: "#e2e8f0",
                lineHeight: "1.6",
                marginBottom: "16px",
              }}>
                When everything feels like too much —
              </p>
              <p style={{
                fontSize: "15px",
                fontWeight: 300,
                color: "#64748b",
                lineHeight: "1.7",
                marginBottom: "16px",
              }}>
                your mind has left the present moment. This exercise pulls it back using your senses — the only things that exist right now.
              </p>
              <p style={{
                fontSize: "13px",
                color: "#334155",
                lineHeight: "1.6",
                marginBottom: "48px",
              }}>
                Five senses. Five steps. Take your time with each one.
              </p>
              <motion.button
                onClick={() => setStage("senses")}
                whileTap={{ scale: 0.97 }}
                style={primaryBtn}
              >
                I'm ready
              </motion.button>
            </motion.div>
          )}

          {stage === "senses" && (
            <motion.div
              key="senses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Progress dots */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "40px",
              }}>
                {senseSteps.map((_, i) => (
                  <div key={i} style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: i <= senseStep
                      ? "#6366f1"
                      : "rgba(255,255,255,0.08)",
                    transition: "background 0.3s ease",
                  }} />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={senseStep}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                >
                  <div style={{ fontSize: "36px", marginBottom: "16px" }}>
                    {senseSteps[senseStep].emoji}
                  </div>

                  <div style={{
                    fontSize: "56px",
                    fontWeight: 200,
                    color: "#6366f1",
                    lineHeight: 1,
                    marginBottom: "20px",
                  }}>
                    {senseSteps[senseStep].count}
                  </div>

                  <p style={{
                    fontSize: "20px",
                    fontWeight: 400,
                    color: "#e2e8f0",
                    lineHeight: "1.5",
                    marginBottom: "10px",
                  }}>
                    {senseSteps[senseStep].prompt}
                  </p>

                  <p style={{
                    fontSize: "13px",
                    color: "#334155",
                    marginBottom: "40px",
                    lineHeight: "1.6",
                  }}>
                    {senseSteps[senseStep].sub}
                  </p>
                </motion.div>
              </AnimatePresence>

              {senseStep < senseSteps.length - 1 ? (
                <motion.button
                  onClick={() => setSenseStep((s) => s + 1)}
                  whileTap={{ scale: 0.97 }}
                  style={primaryBtn}
                >
                  Done — next sense
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => setStage("landing")}
                  whileTap={{ scale: 0.97 }}
                  style={primaryBtn}
                >
                  I'm done
                </motion.button>
              )}
            </motion.div>
          )}

          {stage === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                style={{
                  fontSize: "24px",
                  fontWeight: 400,
                  color: "#e2e8f0",
                  lineHeight: "1.5",
                  marginBottom: "16px",
                }}
              >
                You're back in the room.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.8 }}
                style={{
                  fontSize: "15px",
                  fontWeight: 300,
                  color: "#64748b",
                  lineHeight: "1.7",
                  marginBottom: "48px",
                }}
              >
                Overwhelm shrinks when you bring it back to the present. One thing at a time from here.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <button onClick={() => router.push("/")} style={primaryBtn}>
                  Talk through what's overwhelming me
                </button>
                <button onClick={onBack} style={ghostBtn}>
                  I'm feeling clearer
                </button>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}