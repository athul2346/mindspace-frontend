"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Stage = "intro" | "breathing" | "breathing_active" | "landing";

type Props = {
  onBack: () => void;
};

const breathePhases = [
  { label: "Breathe in",  duration: 4, color: "#6366f1" },
  { label: "Hold",        duration: 7, color: "#8b5cf6" },
  { label: "Breathe out", duration: 8, color: "#a78bfa" },
];

export default function AnxiousFlow({ onBack }: Props) {
  const [stage, setStage] = useState<Stage>("intro");
  const [breathePhase, setBreathePhase] = useState(0);
  const [breatheCount, setBreatheCount] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const phaseRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (phaseRef.current) clearTimeout(phaseRef.current);
    };
  }, []);

  function startBreathing() {
    setStage("breathing_active");
    runPhase(0, 0);
  }

  function runPhase(phaseIndex: number, roundCount: number) {
    const phase = breathePhases[phaseIndex];
    setBreathePhase(phaseIndex);
    setCountdown(phase.duration);

    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(countdownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);

    if (phaseRef.current) clearTimeout(phaseRef.current);
    phaseRef.current = setTimeout(() => {
      const nextPhase = (phaseIndex + 1) % breathePhases.length;
      const nextRound = nextPhase === 0 ? roundCount + 1 : roundCount;
      setBreatheCount(nextRound);
      if (nextRound >= 4) {
        clearInterval(countdownRef.current!);
        setStage("landing");
        return;
      }
      runPhase(nextPhase, nextRound);
    }, phase.duration * 1000);
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
              <div style={{ fontSize: "36px", marginBottom: "24px" }}>💨</div>
              <p style={{
                fontSize: "22px",
                fontWeight: 400,
                color: "#e2e8f0",
                lineHeight: "1.6",
                marginBottom: "16px",
              }}>
                Anxiety tightens your breathing without you noticing.
              </p>
              <p style={{
                fontSize: "15px",
                fontWeight: 300,
                color: "#64748b",
                lineHeight: "1.7",
                marginBottom: "48px",
              }}>
                4-7-8 breathing signals your nervous system to stand down. Four rounds is enough to feel a shift.
              </p>
              <motion.button
                onClick={() => setStage("breathing")}
                whileTap={{ scale: 0.97 }}
                style={primaryBtn}
              >
                Let's try it
              </motion.button>
            </motion.div>
          )}

          {stage === "breathing" && (
            <motion.div
              key="breathing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <p style={{
                fontSize: "16px",
                fontWeight: 300,
                color: "#64748b",
                marginBottom: "20px",
                lineHeight: "1.6",
              }}>
                Breathe in for 4 — hold for 7 — out for 8.
              </p>
              <p style={{
                fontSize: "13px",
                color: "#334155",
                marginBottom: "36px",
                lineHeight: "1.6",
              }}>
                Find somewhere comfortable. We'll do 4 rounds together.
              </p>
              <motion.button
                onClick={startBreathing}
                whileTap={{ scale: 0.97 }}
                style={primaryBtn}
              >
                Begin
              </motion.button>
            </motion.div>
          )}

          {stage === "breathing_active" && (
            <motion.div
              key="breathing_active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p style={{
                fontSize: "12px",
                color: "#334155",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "40px",
              }}>
                Round {breatheCount + 1} of 4
              </p>

              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "40px",
              }}>
                <motion.div
                  animate={{ scale: breathePhase === 0 ? 1.5 : breathePhase === 1 ? 1.5 : 1 }}
                  transition={{ duration: breathePhases[breathePhase].duration, ease: "easeInOut" }}
                  style={{
                    width: "120px", height: "120px", borderRadius: "50%",
                    background: "rgba(99, 102, 241, 0.12)",
                    border: "2px solid rgba(99, 102, 241, 0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <motion.div
                    animate={{ opacity: breathePhase === 2 ? 0.4 : 0.8 }}
                    transition={{ duration: breathePhases[breathePhase].duration }}
                    style={{
                      width: "60px", height: "60px", borderRadius: "50%",
                      background: breathePhases[breathePhase].color,
                    }}
                  />
                </motion.div>
              </div>

              <p style={{ fontSize: "22px", fontWeight: 300, color: "#e2e8f0", marginBottom: "12px" }}>
                {breathePhases[breathePhase].label}
              </p>
              <p style={{ fontSize: "48px", fontWeight: 200, color: breathePhases[breathePhase].color, lineHeight: 1, margin: 0 }}>
                {countdown}
              </p>
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
                Your nervous system is settling.
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
                Anxiety lies about urgency. Most things can wait a few minutes.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <button onClick={() => router.push("/")} style={primaryBtn}>
                  Talk about what's worrying me
                </button>
                <button onClick={onBack} style={ghostBtn}>
                  I'm feeling better
                </button>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}