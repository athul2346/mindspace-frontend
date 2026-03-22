"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const sections = [
  {
    title: "Who we are",
    content: "Mindspace is a free mental health companion app built to give anyone a quiet, private space to process their day. We are not a therapy service. We are not a crisis line. We are a tool built with care for people who need somewhere to talk."
  },
  {
    title: "What we collect",
    content: "Mindspace does not ask for your name, email, or any personal details. You are completely anonymous by default. We store an anonymous session ID in your browser to keep your mood logs and journal entries connected across visits. Your mood scores, journal entries, and chat messages are stored securely in our database tied only to this anonymous ID — never to you as a person."
  },
  {
    title: "Your conversations",
    content: "When you chat with Mindspace, your messages are sent to Groq — an AI infrastructure provider — to generate responses. Groq processes your messages to produce the AI reply and does not use your conversations to train their models. Your chat history is stored in our database to maintain conversation context. We do not read your conversations. No human ever sees what you write."
  },
  {
    title: "Who we share data with",
    content: "We share your chat messages with Groq solely to generate AI responses. We use Supabase to store your mood logs and journal entries securely. We do not sell your data. We do not share your data with advertisers. We do not share your data with any third party beyond what is necessary to run the app."
  },
  {
    title: "Your data is yours",
    content: "You can clear your data at any time by clearing your browser's local storage — this removes your session ID and disconnects you from your stored data. We are building a full data deletion feature that will let you permanently delete everything with one tap. This is coming soon."
  },
  {
    title: "Cookies and tracking",
    content: "Mindspace does not use advertising cookies. We do not track you across websites. We do not use any analytics that identify you personally. The only thing stored in your browser is your anonymous session ID."
  },
  {
    title: "Children",
    content: "Mindspace is intended for users aged 16 and above. If you are under 16 please talk to a trusted adult about how you are feeling."
  },
  {
    title: "Changes to this policy",
    content: "If we make significant changes to how we handle your data we will update this page and note the date it was changed. We will never change our policy in a way that compromises your privacy without being transparent about it."
  },
  {
    title: "Questions",
    content: "If you have any questions about your privacy or your data please reach out. We are a small team that genuinely cares about getting this right."
  },
];

export default function PrivacyPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at top left, #0f0f2a 0%, #0a0a0f 50%, #0a0f1a 100%)",
      fontFamily: "'Inter', sans-serif",
      padding: "48px 24px 80px",
    }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", width: "100%" }}>

        {/* Back */}
        <Link href="/" style={{
          color: "#334155",
          fontSize: "13px",
          textDecoration: "none",
          display: "inline-block",
          marginBottom: "32px",
        }}>
          ← Back to Mindspace
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{
            fontSize: "26px",
            fontWeight: 600,
            color: "#e2e8f0",
            marginBottom: "8px",
          }}>
            Privacy Policy
          </h1>
          <p style={{
            color: "#334155",
            fontSize: "13px",
            marginBottom: "8px",
          }}>
            Last updated: March 2026
          </p>
          <p style={{
            color: "#475569",
            fontSize: "15px",
            lineHeight: "1.7",
            marginBottom: "48px",
          }}>
            Mindspace is built on the belief that a safe space has to actually be safe. This page explains honestly and plainly what we do with your data.
          </p>

          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 + 0.2, duration: 0.4 }}
              style={{ marginBottom: "36px" }}
            >
              <h2 style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#818cf8",
                marginBottom: "10px",
                letterSpacing: "0.01em",
              }}>
                {section.title}
              </h2>
              <p style={{
                color: "#64748b",
                fontSize: "14px",
                lineHeight: "1.8",
                margin: 0,
              }}>
                {section.content}
              </p>
            </motion.div>
          ))}

          {/* Bottom note */}
          <div style={{
            padding: "20px 24px",
            borderRadius: "14px",
            background: "rgba(99, 102, 241, 0.06)",
            border: "1px solid rgba(99, 102, 241, 0.15)",
            marginTop: "16px",
          }}>
            <p style={{
              color: "#475569",
              fontSize: "13px",
              lineHeight: "1.7",
              margin: 0,
              textAlign: "center",
            }}>
              Mindspace is anonymous by default. We don't know who you are and we don't need to. Your privacy is not a feature — it is the foundation.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}