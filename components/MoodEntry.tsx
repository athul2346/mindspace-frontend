"use client";
import { motion } from "framer-motion";

type MoodOption = {
  emoji: string;
  label: string;
  context: string;
};

const moodOptions: MoodOption[] = [
  { emoji: "😔", label: "Heavy",            context: "The user is feeling heavy and weighed down." },
  { emoji: "😤", label: "Frustrated",       context: "The user is feeling frustrated and irritated." },
  { emoji: "😰", label: "Anxious",          context: "The user is feeling anxious and on edge." },
  { emoji: "😶", label: "Numb",             context: "The user is feeling numb and disconnected." },
  { emoji: "😔", label: "Lonely",           context: "The user is feeling lonely and isolated." },
  { emoji: "🙂", label: "Okay",             context: "The user is feeling okay, nothing specific." },
  { emoji: "😊", label: "Good",             context: "The user is feeling good today." },
  { emoji: "💭", label: "A lot on my mind", context: "The user has a lot on their mind and needs to talk." },
];

type Props = {
  onSelect: (mood: MoodOption) => void;
};

export default function MoodEntry({ onSelect }: Props) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "24px",
      fontFamily: "'Inter', sans-serif",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: "420px", textAlign: "center" }}
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            fontSize: "28px",
            fontWeight: 600,
            background: "linear-gradient(to right, #818cf8, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px",
          }}
        >
          Mindspace
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            fontSize: "17px",
            color: "#64748b",
            marginBottom: "52px",
            lineHeight: "1.6",
            fontWeight: 300,
          }}
        >
          How are you arriving today?
        </motion.p>

        {/* Word cloud style — flowing wrap */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "40px",
          }}
        >
          {moodOptions.map((mood, i) => (
            <motion.button
              key={mood.label}
              onClick={() => onSelect(mood)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i + 0.4, duration: 0.3 }}
              whileHover={{
                scale: 1.06,
                background: "rgba(99, 102, 241, 0.15)",
                borderColor: "rgba(99, 102, 241, 0.4)",
                color: "#c7d2fe",
              }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: "10px 20px",
                borderRadius: "100px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.09)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "15px",
                fontWeight: 400,
                color: "#64748b",
                transition: "all 0.2s ease",
                letterSpacing: "0.01em",
              }}
            >
              {mood.emoji} {mood.label}
            </motion.button>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          onClick={() => onSelect({ emoji: "", label: "skip", context: "The user skipped the mood check-in." })}
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
          Skip for now
        </motion.button>
      </motion.div>
    </div>
  );
}