"use client";

export default function SafetyButton() {
  const baseStyle: React.CSSProperties = {
    position: "fixed",
    top: "16px",
    right: "20px",
    zIndex: 50,
    padding: "8px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 500,
    color: "#94a3b8",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    background: "rgba(15, 15, 30, 0.7)",
    backdropFilter: "blur(12px)",
    textDecoration: "none",
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
    transition: "all 0.2s ease",
  };

  return (
    <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" style={baseStyle}>
      Talk to someone real →
    </a>
  );
}