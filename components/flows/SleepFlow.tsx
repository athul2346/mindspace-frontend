"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Stage =
  | "intro"
  | "menu"
  | "breathing"
  | "breathing_active"
  | "bodyscan"
  | "shuffle"
  | "done";

type Props = {
  onBack: () => void;
};

const breathePhases = [
  { label: "Breathe in",  duration: 4,  color: "#6366f1" },
  { label: "Hold",        duration: 7,  color: "#8b5cf6" },
  { label: "Breathe out", duration: 8,  color: "#a78bfa" },
];

const bodyScanSteps = [
  "Close your eyes and take a slow breath in.",
  "Feel the weight of your body against the bed.",
  "Notice your feet. Let them go heavy and warm.",
  "Move your attention up to your calves and shins. Soften them.",
  "Feel your knees, your thighs. Let them sink.",
  "Your lower back. Release any tension there.",
  "Your stomach rises and falls with each breath.",
  "Your chest. Let it be soft.",
  "Your shoulders. Drop them away from your ears.",
  "Your arms are heavy. Your hands are warm.",
  "Your neck. Your jaw. Let your face go slack.",
  "Your whole body is heavy and still.",
  "Stay here. Let sleep come to you.",
];

const shufflePrompts = [
  "Picture a red door. Any door.",
  "Now imagine a bicycle leaning against a tree.",
  "A cat sitting on a windowsill.",
  "Rain on a tin roof.",
  "A wooden spoon in a kitchen drawer.",
  "Clouds moving slowly across a blue sky.",
  "A lighthouse at dusk.",
  "Someone walking a dog on a quiet street.",
  "A bowl of fruit on a table.",
  "Just keep drifting...",
];

export default function SleepFlow({ onBack }: Props) {
  const [stage, setStage] = useState<Stage>("intro");
  const [breathePhase, setBreathePhase] = useState(0);
  const [breatheCount, setBreatheCount] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [scanStep, setScanStep] = useState(0);
  const [scanRunning, setScanRunning] = useState(false);
  const [shuffleStep, setShuffleStep] = useState(0);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const phaseRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (phaseRef.current) clearTimeout(phaseRef.current);
      window.speechSynthesis?.cancel();
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
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
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
        setStage("done");
        return;
      }
      runPhase(nextPhase, nextRound);
    }, phase.duration * 1000);
  }

  function startBodyScan() {
    setScanStep(0);
    setScanRunning(true);
    setStage("bodyscan");
    speakStep(0);
  }

  function speakStep(index: number) {
  if (index >= bodyScanSteps.length) {
    setScanRunning(false);
    setStage("done");
    return;
  }

  setScanStep(index);

  const utterance = new SpeechSynthesisUtterance(bodyScanSteps[index]);
  utterance.rate = 0.82;
  utterance.pitch = 0.95;
  utterance.volume = 1;

  function assignVoiceAndSpeak() {
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.name.includes("Samantha") ||
        v.name.includes("Karen") ||
        v.name.includes("Moira") ||
        v.name.includes("Tessa") ||
        v.name.includes("Serena") ||
        v.name.includes("Kate")
    );
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => {
      setTimeout(() => speakStep(index + 1), 2200);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  // Voices may not be loaded yet — wait for them
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      assignVoiceAndSpeak();
    };
  } else {
    assignVoiceAndSpeak();
  }
}
  function stopBodyScan() {
    window.speechSynthesis.cancel();
    setScanRunning(false);
  }

  function handleChatRedirect() {
    window.speechSynthesis?.cancel();
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
    cursor: "pointer",
    fontFamily: "inherit",
  };

  const ghostBtn = {
    background: "transparent",
    border: "none",
    color: "#334155",
    fontSize: "13px",
    cursor: "pointer",
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
      padding: "24px",
    }}>
      <button onClick={() => { stopBodyScan(); onBack(); }} style={{
        position: "fixed",
        top: "24px",
        left: "16px",
        background: "transparent",
        border: "none",
        color: "#334155",
        fontSize: "13px",
        cursor: "pointer",
        fontFamily: "inherit",
        padding: "8px",
      }}>
        ← Back
      </button>

      <div style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
        <AnimatePresence mode="wait">

          {stage === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div style={{ fontSize: "40px", marginBottom: "20px" }}>🌙</div>
              <h2 style={{
                fontSize: "22px",
                fontWeight: 500,
                color: "#e2e8f0",
                marginBottom: "12px",
                lineHeight: "1.4",
              }}>
                Sleep can be hard when your mind won't slow down.
              </h2>
              <p style={{
                fontSize: "14px",
                color: "#475569",
                lineHeight: "1.7",
                marginBottom: "36px",
              }}>
                These techniques are evidence-based and gentle. No pressure — just try one and see what helps.
              </p>
              <motion.button onClick={() => setStage("menu")} whileTap={{ scale: 0.97 }} style={primaryBtn}>
                I'm ready
              </motion.button>
            </motion.div>
          )}

          {stage === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <p style={{
                fontSize: "15px",
                color: "#64748b",
                marginBottom: "28px",
                fontWeight: 300,
              }}>
                What would you like to try?
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                {[
                  { id: "breathing", emoji: "💨", label: "4-7-8 Breathing",     desc: "Slow your nervous system down" },
                  { id: "bodyscan",  emoji: "🌊", label: "Body scan",           desc: "Guided audio — just close your eyes" },
                  { id: "shuffle",   emoji: "🎲", label: "Shuffle my thoughts", desc: "Interrupt anxious loops gently" },
                ].map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => {
                      if (option.id === "bodyscan") {
                        startBodyScan();
                      } else {
                        setStage(option.id as Stage);
                      }
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "16px 20px",
                      borderRadius: "16px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      textAlign: "left" as const,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span style={{ fontSize: "22px" }}>{option.emoji}</span>
                    <div>
                      <p style={{ color: "#94a3b8", fontSize: "14px", fontWeight: 500, margin: "0 0 2px 0" }}>
                        {option.label}
                      </p>
                      <p style={{ color: "#334155", fontSize: "12px", margin: 0 }}>
                        {option.desc}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>

              <button onClick={handleChatRedirect} style={ghostBtn}>
                I'd rather talk it through →
              </button>
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
              <div style={{ fontSize: "36px", marginBottom: "20px" }}>💨</div>
              <h2 style={{
                fontSize: "20px",
                fontWeight: 500,
                color: "#e2e8f0",
                marginBottom: "12px",
              }}>
                4-7-8 Breathing
              </h2>
              <p style={{
                fontSize: "14px",
                color: "#475569",
                lineHeight: "1.7",
                marginBottom: "12px",
              }}>
                Breathe in for 4, hold for 7, out for 8.
              </p>
              <p style={{
                fontSize: "13px",
                color: "#334155",
                lineHeight: "1.6",
                marginBottom: "32px",
              }}>
                This activates your parasympathetic nervous system — your body's natural calm response. We'll do 4 rounds.
              </p>
              <motion.button onClick={startBreathing} whileTap={{ scale: 0.97 }} style={primaryBtn}>
                Begin
              </motion.button>
            </motion.div>
          )}

          {/* BREATHING ACTIVE — no AnimatePresence on inner elements */}
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
                  animate={{
                    scale: breathePhase === 0 ? 1.5 : breathePhase === 1 ? 1.5 : 1,
                  }}
                  transition={{
                    duration: breathePhases[breathePhase].duration,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background: "rgba(99, 102, 241, 0.12)",
                    border: "2px solid rgba(99, 102, 241, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <motion.div
                    animate={{ opacity: breathePhase === 2 ? 0.4 : 0.8 }}
                    transition={{ duration: breathePhases[breathePhase].duration }}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: breathePhases[breathePhase].color,
                    }}
                  />
                </motion.div>
              </div>

              {/* Plain text — no motion, no key, no stacking */}
              <p style={{
                fontSize: "22px",
                fontWeight: 300,
                color: "#e2e8f0",
                marginBottom: "12px",
              }}>
                {breathePhases[breathePhase].label}
              </p>

              <p style={{
                fontSize: "48px",
                fontWeight: 200,
                color: breathePhases[breathePhase].color,
                lineHeight: 1,
                margin: 0,
              }}>
                {countdown}
              </p>
            </motion.div>
          )}

          {stage === "bodyscan" && (
            <motion.div
              key="bodyscan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div style={{ fontSize: "36px", marginBottom: "24px" }}>🌊</div>

              <p style={{
                fontSize: "13px",
                color: "#334155",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}>
                Step {scanStep + 1} of {bodyScanSteps.length}
              </p>

              <motion.p
                key={scanStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  fontSize: "18px",
                  fontWeight: 300,
                  color: "#e2e8f0",
                  lineHeight: "1.7",
                  marginBottom: "36px",
                  minHeight: "80px",
                }}
              >
                {bodyScanSteps[scanStep]}
              </motion.p>

              <p style={{
                fontSize: "13px",
                color: "#475569",
                marginBottom: "28px",
                lineHeight: "1.6",
              }}>
                Close your eyes and listen. Each step will play automatically.
              </p>

              {scanRunning && (
                <button onClick={() => { stopBodyScan(); setStage("menu"); }} style={ghostBtn}>
                  Stop
                </button>
              )}
            </motion.div>
          )}

          {stage === "shuffle" && (
            <motion.div
              key="shuffle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div style={{ fontSize: "36px", marginBottom: "24px" }}>🎲</div>
              <p style={{
                fontSize: "13px",
                color: "#475569",
                marginBottom: "8px",
                lineHeight: "1.6",
              }}>
                Picture each image slowly. Don't try too hard — just let them drift through your mind.
              </p>

              <motion.p
                key={shuffleStep}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  fontSize: "22px",
                  fontWeight: 300,
                  color: "#e2e8f0",
                  lineHeight: "1.6",
                  marginBottom: "40px",
                  minHeight: "60px",
                  marginTop: "24px",
                }}
              >
                {shufflePrompts[shuffleStep]}
              </motion.p>

              {shuffleStep < shufflePrompts.length - 1 ? (
                <motion.button onClick={() => setShuffleStep((s) => s + 1)} whileTap={{ scale: 0.97 }} style={primaryBtn}>
                  Next image
                </motion.button>
              ) : (
                <motion.button onClick={() => setStage("done")} whileTap={{ scale: 0.97 }} style={primaryBtn}>
                  Done
                </motion.button>
              )}
            </motion.div>
          )}

          {stage === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div style={{ fontSize: "40px", marginBottom: "20px" }}>🌙</div>
              <p style={{
                fontSize: "20px",
                fontWeight: 300,
                color: "#e2e8f0",
                lineHeight: "1.6",
                marginBottom: "12px",
              }}>
                That's all you can do right now.
              </p>
              <p style={{
                fontSize: "13px",
                color: "#475569",
                lineHeight: "1.6",
                marginBottom: "36px",
              }}>
                Rest is enough. You don't have to fall asleep — just let yourself be still.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button onClick={() => setStage("menu")} style={primaryBtn}>
                  Try something else
                </button>
                <button onClick={handleChatRedirect} style={ghostBtn}>
                  Talk it through instead →
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}