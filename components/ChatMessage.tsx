"use client";
import { motion } from "framer-motion";

type Props = {
  role: "user" | "assistant";
  content: string;
  showAvatar?: boolean;
};

export default function ChatMessage({ role, content, showAvatar = true }: Props) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: isUser ? "flex-end" : "flex-start",
        gap: "12px",
        padding: "4px 0",
        width: "100%",
        marginBottom: "6px",
      }}
    >
      {/* Avatar — only on AI, only when showAvatar is true */}
      {!isUser && (
        <div style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: showAvatar ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: "2px",
        }}>
          {showAvatar && (
            <span style={{ fontSize: "12px", fontWeight: 600, color: "white" }}>M</span>
          )}
        </div>
      )}

      {/* Single bubble — no nesting */}
      <div style={{
        maxWidth: "70%",
        padding: "12px 16px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        background: isUser ? "rgba(99, 102, 241, 0.18)" : "rgba(255, 255, 255, 0.08)",
        border: isUser ? "1px solid rgba(99, 102, 241, 0.35)" : "1px solid rgba(255, 255, 255, 0.12)",
        color: isUser ? "#c7d2fe" : "#e2e8f0",
        fontSize: "14px",
        lineHeight: "1.75",
        letterSpacing: "0.01em",
      }}>
        {content.split('\n\n').map((sentence, i) => (
          <p key={i} style={{ margin: i === 0 ? 0 : "10px 0 0 0", lineHeight: "1.75" }}>
            {sentence}
          </p>
        ))}
      </div>
    </motion.div>
  );
}