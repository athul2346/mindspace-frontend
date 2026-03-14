"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Stage = "intro" | "reframe" | "breathe" | "breathing_active" | "anchor" | "sendoff";

type Props = {
  onBack: () => void;
};

const boxPhases = [
  { label: "Breathe in",  duration: 4, color: "#6366f1" },
  { label: "Hold",        duration: 4, color: "#8b5cf6" },
  { label: "Breathe out", duration: 4, color: "#a78bfa" },
  { label: "Hold",        duration: 4, color: "#7c3aed" },
];

const boxSides = ["top", "right", "bottom", "left"];

const anchors = [
  "I have done hard things before.",
  "I don't need to be perfect — I just need to show up.",
  "Whatever happens, I will handle it.",
  "My worth is not decided by this moment.",
  "I am allowed to take up space.",
];

export default function HardMomentFlow({ onBack }: Props) {
  const [stage, setStage] = useState<Stage>("intro");
  const [breathePhase, setBreathePhase] = useState(0);
  const [breatheCount, setBreatheCount] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [selectedAnchor, setSelectedAnchor] = useState<string | null>(null);
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
      if (nextRound >= 3) {
        clearInterval(countdownRef.current!);
        setStage("anchor");
        return;
      }
      runPhase(nextPhase, nextRound);
    }, phase.duration * 1000);
  }

  const activeSide = boxSides[breathePhase];

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

          {/* INTRO */}
          {stage === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div style={{ fontSize: "36px", marginBottom: "24px" }}>🎯</div>
              <p style={{
                fontSize: "22px",
                fontWeight: 400,
                color: "#e2e8f0",
                lineHeight: "1.6",
                marginBottom: "16px",
              }}>
                Something hard is ahead.
              </p>
              <p style={{
                fontSize: "15px",
                fontWeight: 300,
                color: "#64748b",
                lineHeight: "1.7",
                marginBottom: "48px",
              }}>
                That feeling of dread is your mind trying to protect you. We're going to work with it — not against it.
              </p>
              <motion.button
                onClick={() => setStage("reframe")}
                whileTap={{ scale: 0.97 }}
                style={primaryBtn}
              >
                Okay
              </motion.button>
            </motion.div>
          )}

          {/* REFRAME */}
          {stage === "reframe" && (
            <motion.div
              key="reframe"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p style={{
                fontSize: "13px",
                color: "#475569",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "28px",
              }}>
                Before we prepare
              </p>
              <p style={{
                fontSize: "19px",
                fontWeight: 400,
                color: "#e2e8f0",
                lineHeight: "1.6",
                marginBottom: "16px",
              }}>
                You've already survived every hard moment you've ever faced.
              </p>
              <p style={{
                fontSize: "15px",
                fontWeight: 300,
                color: "#64748b",
                lineHeight: "1.7",
                marginBottom: "16px",
              }}>
                Your brain predicts the worst to keep you safe. But predictions aren't facts.
              </p>
              <p style={{
                fontSize: "15px",
                fontWeight: 300,
                color: "#64748b",
                lineHeight: "1.7",
                marginBottom: "48px",
              }}>
                Let's reset your body first. Then we'll find something solid to hold onto.
              </p>
              <motion.button
                onClick={() => setStage("breathe")}
                whileTap={{ scale: 0.97 }}
                style={primaryBtn}
              >
                Ready
              </motion.button>
            </motion.div>
          )}

          {/* BREATHE INTRO */}
          {stage === "breathe" && (
            <motion.div
              key="breathe"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <p style={{
                fontSize: "16px",
                fontWeight: 300,
                color: "#64748b",
                marginBottom: "16px",
                lineHeight: "1.6",
              }}>
                Three rounds of box breathing.
              </p>
              <p style={{
                fontSize: "13px",
                color: "#334155",
                marginBottom: "36px",
                lineHeight: "1.6",
              }}>
                In for 4 — hold for 4 — out for 4 — hold for 4.
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

          {/* BREATHING ACTIVE */}
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
                Round {breatheCount + 1} of 3
              </p>

              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "36px",
              }}>
                <div style={{ position: "relative", width: "120px", height: "120px" }}>
                  <motion.div
                    animate={{ opacity: activeSide === "top" ? 1 : 0.12 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: "absolute", top: 0, left: 0, right: 0,
                      height: "3px", borderRadius: "2px",
                      background: boxPhases[breathePhase].color,
                    }}
                  />
                  <motion.div
                    animate={{ opacity: activeSide === "right" ? 1 : 0.12 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: "absolute", top: 0, right: 0, bottom: 0,
                      width: "3px", borderRadius: "2px",
                      background: boxPhases[breathePhase].color,
                    }}
                  />
                  <motion.div
                    animate={{ opacity: activeSide === "bottom" ? 1 : 0.12 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      height: "3px", borderRadius: "2px",
                      background: boxPhases[breathePhase].color,
                    }}
                  />
                  <motion.div
                    animate={{ opacity: activeSide === "left" ? 1 : 0.12 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: "absolute", top: 0, left: 0, bottom: 0,
                      width: "3px", borderRadius: "2px",
                      background: boxPhases[breathePhase].color,
                    }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <p style={{
                      fontSize: "40px", fontWeight: 200,
                      color: boxPhases[breathePhase].color,
                      margin: 0, lineHeight: 1,
                    }}>
                      {countdown}
                    </p>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "22px", fontWeight: 300, color: "#e2e8f0", margin: 0 }}>
                {boxPhases[breathePhase].label}
              </p>
            </motion.div>
          )}

          {/* ANCHOR SELECTION */}
          {stage === "anchor" && (
            <motion.div
              key="anchor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p style={{
                fontSize: "13px",
                color: "#475569",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}>
                Choose one to carry with you
              </p>
              <p style={{
                fontSize: "15px",
                fontWeight: 300,
                color: "#64748b",
                marginBottom: "28px",
                lineHeight: "1.6",
              }}>
                Pick the one that feels most true right now.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                {anchors.map((anchor) => (
                  <motion.button
                    key={anchor}
                    onClick={() => setSelectedAnchor(anchor)}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: "14px 18px",
                      borderRadius: "14px",
                      background: selectedAnchor === anchor
                        ? "rgba(99, 102, 241, 0.18)"
                        : "rgba(255,255,255,0.03)",
                      border: selectedAnchor === anchor
                        ? "1px solid rgba(99, 102, 241, 0.4)"
                        : "1px solid rgba(255,255,255,0.07)",
                      color: selectedAnchor === anchor ? "#c7d2fe" : "#64748b",
                      fontSize: "14px",
                      fontWeight: 400,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      textAlign: "left" as const,
                      lineHeight: "1.5",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {anchor}
                  </motion.button>
                ))}
              </div>

              <motion.button
                onClick={() => { if (selectedAnchor) setStage("sendoff"); }}
                whileTap={{ scale: 0.97 }}
                style={{
                  ...primaryBtn,
                  opacity: selectedAnchor ? 1 : 0.3,
                  cursor: selectedAnchor ? "pointer" : "not-allowed" as const,
                }}
              >
                This one
              </motion.button>
            </motion.div>
          )}

          {/* SEND OFF */}
          {stage === "sendoff" && (
            <motion.div
              key="sendoff"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                style={{
                  fontSize: "13px",
                  color: "#6366f1",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "20px",
                }}
              >
                Remember this
              </motion.p>

              <motion.p
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{
                  fontSize: "20px",
                  fontWeight: 400,
                  color: "#e2e8f0",
                  lineHeight: "1.6",
                  marginBottom: "32px",
                  padding: "20px",
                  borderRadius: "16px",
                  background: "rgba(99, 102, 241, 0.08)",
                  border: "1px solid rgba(99, 102, 241, 0.15)",
                }}
              >
                {selectedAnchor}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                style={{
                  fontSize: "15px",
                  fontWeight: 300,
                  color: "#64748b",
                  lineHeight: "1.7",
                  marginBottom: "48px",
                }}
              >
                You're more ready than you feel right now.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <button onClick={() => router.push("/")} style={primaryBtn}>
                  Talk it through first
                </button>
                <button onClick={onBack} style={ghostBtn}>
                  I'm ready to go
                </button>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}