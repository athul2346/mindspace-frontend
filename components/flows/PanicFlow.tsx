"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Stage =
  | "anchor"
  | "ground"
  | "breathe"
  | "senses"
  | "landing";

type Props = {
  onBack: () => void;
};

const senseSteps = [
  { count: 5, sense: "see",   prompt: "Look around. Name 5 things you can see right now." },
  { count: 4, sense: "touch", prompt: "Name 4 things you can physically touch near you." },
  { count: 3, sense: "hear",  prompt: "Listen. Name 3 sounds you can hear right now." },
  { count: 2, sense: "smell", prompt: "Name 2 things you can smell. Even the air counts." },
  { count: 1, sense: "taste", prompt: "Name 1 thing you can taste right now." },
];

export default function PanicFlow({ onBack }: Props) {
  const [stage, setStage] = useState<Stage>("anchor");
  const [senseStep, setSenseStep] = useState(0);
  const [breatheScale, setBreatheScale] = useState(1);
  const router = useRouter();

  // Breathing animation loop
  useEffect(() => {
    if (stage !== "breathe") return;

    let expanding = true;
    const interval = setInterval(() => {
      setBreatheScale(expanding ? 1.5 : 1);
      expanding = !expanding;
    }, 4000);

    return () => clearInterval(interval);
  }, [stage]);

  function handleChatRedirect() {
    router.push("/");
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
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 24px",
    }}>

      {/* Back — subtle, always available */}
      <button
        onClick={onBack}
        style={{
          position: "fixed",
          top: "24px",
          left: "16px",
          background: "transparent",
          border: "none",
          color: "#1e293b",
          fontSize: "13px",
          cursor: "pointer",
          fontFamily: "inherit",
          padding: "8px",
        }}
      >
        ← Back
      </button>

      <div style={{ maxWidth: "380px", width: "100%", textAlign: "center" }}>
        <AnimatePresence mode="wait">

          {/* IMMEDIATE ANCHOR */}
          {stage === "anchor" && (
            <motion.div
              key="anchor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                style={{
                  fontSize: "28px",
                  fontWeight: 400,
                  color: "#e2e8f0",
                  lineHeight: "1.5",
                  marginBottom: "16px",
                }}
              >
                You are safe.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                style={{
                  fontSize: "18px",
                  fontWeight: 300,
                  color: "#64748b",
                  lineHeight: "1.6",
                  marginBottom: "48px",
                }}
              >
                This feeling will pass. It always does.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.6 }}
              >
                <motion.button
                  onClick={() => setStage("ground")}
                  whileTap={{ scale: 0.97 }}
                  style={primaryBtn}
                >
                  I'm here
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* PHYSICAL GROUNDING */}
          {stage === "ground" && (
            <motion.div
              key="ground"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
            >
              <div style={{ fontSize: "36px", marginBottom: "28px" }}>🦶</div>
              <p style={{
                fontSize: "22px",
                fontWeight: 400,
                color: "#e2e8f0",
                lineHeight: "1.6",
                marginBottom: "16px",
              }}>
                Press your feet into the floor.
              </p>
              <p style={{
                fontSize: "16px",
                fontWeight: 300,
                color: "#64748b",
                lineHeight: "1.7",
                marginBottom: "16px",
              }}>
                Feel the ground beneath you.
              </p>
              <p style={{
                fontSize: "16px",
                fontWeight: 300,
                color: "#64748b",
                lineHeight: "1.7",
                marginBottom: "48px",
              }}>
                You are here. You are solid. You are real.
              </p>
              <motion.button
                onClick={() => setStage("breathe")}
                whileTap={{ scale: 0.97 }}
                style={primaryBtn}
              >
                I can feel the floor
              </motion.button>
            </motion.div>
          )}

          {/* BREATHING */}
          {stage === "breathe" && (
            <motion.div
              key="breathe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p style={{
                fontSize: "15px",
                fontWeight: 300,
                color: "#64748b",
                marginBottom: "48px",
                lineHeight: "1.6",
              }}>
                Follow the circle with your breath.
              </p>

              {/* Simple breathing circle — no counts, just rhythm */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "48px",
              }}>
                <motion.div
                  animate={{ scale: breatheScale }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  style={{
                    width: "130px",
                    height: "130px",
                    borderRadius: "50%",
                    background: "rgba(99, 102, 241, 0.1)",
                    border: "2px solid rgba(99, 102, 241, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <motion.div
                    animate={{ scale: breatheScale === 1.5 ? 1.3 : 1 }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      opacity: 0.7,
                    }}
                  />
                </motion.div>
              </div>

              <p style={{
                fontSize: "14px",
                color: "#334155",
                marginBottom: "40px",
                lineHeight: "1.6",
              }}>
                In as it grows. Out as it shrinks.
              </p>

              <motion.button
                onClick={() => setStage("senses")}
                whileTap={{ scale: 0.97 }}
                style={primaryBtn}
              >
                Feeling a little steadier
              </motion.button>
            </motion.div>
          )}

          {/* 5-4-3-2-1 SENSES */}
          {stage === "senses" && (
            <motion.div
              key="senses"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
            >
              {/* Progress dots */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "36px",
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

              <motion.div
                key={senseStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div style={{
                  fontSize: "48px",
                  fontWeight: 200,
                  color: "#6366f1",
                  marginBottom: "16px",
                  lineHeight: 1,
                }}>
                  {senseSteps[senseStep].count}
                </div>

                <p style={{
                  fontSize: "18px",
                  fontWeight: 400,
                  color: "#e2e8f0",
                  lineHeight: "1.6",
                  marginBottom: "12px",
                }}>
                  {senseSteps[senseStep].prompt}
                </p>

                <p style={{
                  fontSize: "13px",
                  color: "#334155",
                  marginBottom: "40px",
                }}>
                  Take your time. No rush.
                </p>
              </motion.div>

              {senseStep < senseSteps.length - 1 ? (
                <motion.button
                  onClick={() => setSenseStep((s) => s + 1)}
                  whileTap={{ scale: 0.97 }}
                  style={primaryBtn}
                >
                  Done
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => setStage("landing")}
                  whileTap={{ scale: 0.97 }}
                  style={primaryBtn}
                >
                  Done
                </motion.button>
              )}
            </motion.div>
          )}

          {/* LANDING */}
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
                  fontSize: "26px",
                  fontWeight: 400,
                  color: "#e2e8f0",
                  lineHeight: "1.5",
                  marginBottom: "16px",
                }}
              >
                The worst has passed.
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
                You did that. You stayed with it and came through.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <button onClick={handleChatRedirect} style={primaryBtn}>
                  Talk about what happened
                </button>
                <button onClick={onBack} style={ghostBtn}>
                  I'm okay now
                </button>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}