"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Stage = "intro" | "breathing_active" | "landing";

type Props = {
  onBack: () => void;
};

const boxPhases = [
  { label: "Breathe in",  duration: 4, color: "#6366f1" },
  { label: "Hold",        duration: 4, color: "#8b5cf6" },
  { label: "Breathe out", duration: 4, color: "#a78bfa" },
  { label: "Hold",        duration: 4, color: "#7c3aed" },
];

// Box drawing — each phase highlights one side
const boxSides = ["top", "right", "bottom", "left"];

export default function TenseFlow({ onBack }: Props) {
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
    const phase = boxPhases[phaseIndex];
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
      const nextPhase = (phaseIndex + 1) % boxPhases.length;
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

  // Box sides highlight based on current phase
  const activeSide = boxSides[breathePhase];

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
              <div style={{ fontSize: "36px", marginBottom: "24px" }}>🪨</div>
              <p style={{
                fontSize: "22px",
                fontWeight: 400,
                color: "#e2e8f0",
                lineHeight: "1.6",
                marginBottom: "16px",
              }}>
                Tension lives in the body before the mind notices it.
              </p>
              <p style={{
                fontSize: "15px",
                fontWeight: 300,
                color: "#64748b",
                lineHeight: "1.7",
                marginBottom: "16px",
              }}>
                Box breathing is equal on all four sides — breathe in, hold, out, hold. Four counts each.
              </p>
              <p style={{
                fontSize: "13px",
                color: "#334155",
                lineHeight: "1.6",
                marginBottom: "48px",
              }}>
                Used by military, surgeons, and athletes to reset under pressure.
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
                marginBottom: "36px",
              }}>
                Round {breatheCount + 1} of 4
              </p>

              {/* Box visual */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "36px",
              }}>
                <div style={{
                  position: "relative",
                  width: "120px",
                  height: "120px",
                }}>
                  {/* Top */}
                  <motion.div
                    animate={{ opacity: activeSide === "top" ? 1 : 0.12 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: "absolute",
                      top: 0, left: 0, right: 0,
                      height: "3px",
                      borderRadius: "2px",
                      background: boxPhases[breathePhase].color,
                    }}
                  />
                  {/* Right */}
                  <motion.div
                    animate={{ opacity: activeSide === "right" ? 1 : 0.12 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: "absolute",
                      top: 0, right: 0, bottom: 0,
                      width: "3px",
                      borderRadius: "2px",
                      background: boxPhases[breathePhase].color,
                    }}
                  />
                  {/* Bottom */}
                  <motion.div
                    animate={{ opacity: activeSide === "bottom" ? 1 : 0.12 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: "absolute",
                      bottom: 0, left: 0, right: 0,
                      height: "3px",
                      borderRadius: "2px",
                      background: boxPhases[breathePhase].color,
                    }}
                  />
                  {/* Left */}
                  <motion.div
                    animate={{ opacity: activeSide === "left" ? 1 : 0.12 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: "absolute",
                      top: 0, left: 0, bottom: 0,
                      width: "3px",
                      borderRadius: "2px",
                      background: boxPhases[breathePhase].color,
                    }}
                  />

                  {/* Center countdown */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <p style={{
                      fontSize: "40px",
                      fontWeight: 200,
                      color: boxPhases[breathePhase].color,
                      margin: 0,
                      lineHeight: 1,
                    }}>
                      {countdown}
                    </p>
                  </div>
                </div>
              </div>

              <p style={{
                fontSize: "22px",
                fontWeight: 300,
                color: "#e2e8f0",
                margin: 0,
              }}>
                {boxPhases[breathePhase].label}
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
                The tension is starting to release.
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
                Your body held a lot. It's okay to let it go now.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <button onClick={() => router.push("/")} style={primaryBtn}>
                  Talk about what's going on
                </button>
                <button onClick={onBack} style={ghostBtn}>
                  I'm feeling looser
                </button>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}