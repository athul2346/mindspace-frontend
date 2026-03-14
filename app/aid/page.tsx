"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import BottomNav from "../../components/BottomNav";
import SafetyButton from "../../components/SafetyButton";
import SleepFlow from "../../components/flows/SleepFlow";
import PanicFlow from "../../components/flows/PanicFlow";
import TenseFlow from "../../components/flows/TenseFlow";
import OverwhelmedFlow from "../../components/flows/OverwhelmedFlow";
import HardMomentFlow from "../../components/flows/HardMomentFlow";
import AnxiousFlow from  "../../components/flows/AnxiousFlow";

type Flow = "sleep" | "anxious" | "panic" | "tense" | "overwhelmed" | "hardmoment";

const feelings = [
  { id: "sleep",       emoji: "🌙", label: "Can't sleep",           description: "Mind won't quiet down at night" },
  { id: "anxious",     emoji: "💨", label: "Anxious",               description: "Chest tight, thoughts racing" },
  { id: "panic",       emoji: "⚡", label: "Panic attack",          description: "Heart racing, feel out of control" },
  { id: "tense",       emoji: "🪨", label: "Tense and wound up",    description: "Body feels tight and restless" },
  { id: "overwhelmed", emoji: "🌊", label: "Overwhelmed",           description: "Too much, can't focus on anything" },
  { id: "hardmoment",  emoji: "🎯", label: "Hard moment coming up", description: "Something difficult ahead" },
];

export default function AidPage() {
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);

  if (selectedFlow === "sleep") {
    return <SleepFlow onBack={() => setSelectedFlow(null)} />;
  }

  if (selectedFlow === "panic") {
  return <PanicFlow onBack={() => setSelectedFlow(null)} />;
  }

  if (selectedFlow === "tense") {
  return <TenseFlow onBack={() => setSelectedFlow(null)} />;
  }

  if (selectedFlow === "overwhelmed") {
  return <OverwhelmedFlow onBack={() => setSelectedFlow(null)} />;
  }

  if (selectedFlow === "hardmoment") {
  return <HardMomentFlow onBack={() => setSelectedFlow(null)} />;
  }

  if (selectedFlow === "anxious") {
    return <AnxiousFlow onBack={() => setSelectedFlow(null)} />;
  }

  if (selectedFlow) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top left, #0f0f2a 0%, #0a0a0f 50%, #0a0f1a 100%)",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}>
        <SafetyButton />
        <div style={{ textAlign: "center", color: "#475569" }}>
          <p style={{ fontSize: "14px", marginBottom: "16px" }}>
            Coming soon
          </p>
          <button
            onClick={() => setSelectedFlow(null)}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              color: "#475569",
              fontSize: "13px",
              padding: "8px 16px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ← Back
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

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
            Aid
          </h1>
          <p style={{
            color: "#334155",
            fontSize: "13px",
            marginBottom: "40px",
          }}>
            Immediate support for difficult moments
          </p>

          <p style={{
            fontSize: "17px",
            color: "#64748b",
            fontWeight: 300,
            marginBottom: "28px",
            lineHeight: "1.6",
          }}>
            What's happening right now?
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {feelings.map((feeling, i) => (
              <motion.button
                key={feeling.id}
                onClick={() => setSelectedFlow(feeling.id as Flow)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 + 0.2, duration: 0.3 }}
                whileHover={{ scale: 1.01, background: "rgba(99, 102, 241, 0.08)" }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px 20px",
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left" as const,
                  transition: "all 0.2s ease",
                  width: "100%",
                }}
              >
                <span style={{ fontSize: "24px", flexShrink: 0 }}>{feeling.emoji}</span>
                <div>
                  <p style={{
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "#94a3b8",
                    margin: "0 0 2px 0",
                  }}>
                    {feeling.label}
                  </p>
                  <p style={{
                    fontSize: "12px",
                    color: "#334155",
                    margin: 0,
                  }}>
                    {feeling.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}