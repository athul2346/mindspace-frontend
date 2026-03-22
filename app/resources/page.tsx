"use client";
import { motion } from "framer-motion";
import BottomNav from "../../components/BottomNav";
import SafetyButton from "../../components/SafetyButton";

const resources = [
  {
    category: "Crisis Support",
    color: "#ef4444",
    items: [
      {
        name: "iCall (India)",
        description: "Free counselling and mental health support",
        contact: "9152987821",
        type: "phone",
      },
      {
        name: "Vandrevala Foundation",
        description: "24/7 crisis helpline — India",
        contact: "1860-2662-345",
        type: "phone",
      },
      {
        name: "International Association for Suicide Prevention",
        description: "Global directory of crisis centres",
        contact: "https://www.iasp.info/resources/Crisis_Centres",
        type: "link",
      },
    ],
  },
  {
    category: "Anxiety & Stress",
    color: "#8b5cf6",
    items: [
      {
        name: "Anxiety and Depression Association of America",
        description: "Resources, self-help tools and therapist finder",
        contact: "https://adaa.org",
        type: "link",
      },
      {
        name: "Mind (UK)",
        description: "Practical guidance on managing anxiety and stress",
        contact: "https://www.mind.org.uk",
        type: "link",
      },
      {
        name: "iCall India",
        description: "Online counselling for stress and anxiety",
        contact: "https://icallhelpline.org",
        type: "link",
      },
    ],
  },
  {
    category: "Loneliness & Connection",
    color: "#6366f1",
    items: [
      {
        name: "Samaritans",
        description: "Someone to talk to, any time you need",
        contact: "https://www.samaritans.org",
        type: "link",
      },
      {
        name: "7 Cups",
        description: "Free online chat with trained listeners",
        contact: "https://www.7cups.com",
        type: "link",
      },
      {
        name: "Vandrevala Foundation Chat",
        description: "Live chat support available 24/7",
        contact: "https://www.vandrevalafoundation.com",
        type: "link",
      },
    ],
  },
  {
    category: "Professional Help",
    color: "#10b981",
    items: [
      {
        name: "Practo (India)",
        description: "Find verified mental health professionals near you",
        contact: "https://www.practo.com/mental-health",
        type: "link",
      },
      {
        name: "Psychology Today",
        description: "Global therapist finder by location and specialty",
        contact: "https://www.psychologytoday.com/us/therapists",
        type: "link",
      },
      {
        name: "Open Path Collective",
        description: "Affordable therapy sessions — $30 to $80 per session",
        contact: "https://openpathcollective.org",
        type: "link",
      },
    ],
  },
];

type ResourceItem = {
  name: string;
  description: string;
  contact: string;
  type: string;
};

function ResourceAction({ item }: { item: ResourceItem }) {
  const phoneStyle = {
    flexShrink: 0 as const,
    padding: "8px 14px",
    borderRadius: "10px",
    background: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.25)",
    color: "#fca5a5",
    fontSize: "12px",
    fontWeight: 500,
    textDecoration: "none" as const,
    whiteSpace: "nowrap" as const,
  };

  const linkStyle = {
    flexShrink: 0 as const,
    padding: "8px 14px",
    borderRadius: "10px",
    background: "rgba(99, 102, 241, 0.12)",
    border: "1px solid rgba(99, 102, 241, 0.25)",
    color: "#a5b4fc",
    fontSize: "12px",
    fontWeight: 500,
    textDecoration: "none" as const,
    whiteSpace: "nowrap" as const,
  };

  const phoneHref = "tel:" + item.contact;

  if (item.type === "phone") {
    return <a href={phoneHref} style={phoneStyle}>Call</a>;
  }

  return (
    <a href={item.contact} target="_blank" rel="noopener noreferrer" style={linkStyle}>
      Visit →
    </a>
  );
}

export default function ResourcesPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at top left, #0f0f2a 0%, #0a0a0f 50%, #0a0f1a 100%)",
      fontFamily: "'Inter', sans-serif",
      padding: "48px 24px 120px",
    }}>
      <SafetyButton />

      <div style={{ maxWidth: "640px", margin: "0 auto", width: "100%" }}>
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
            Resources
          </h1>
          <p style={{
            color: "#475569",
            fontSize: "14px",
            marginBottom: "40px",
            lineHeight: "1.6",
          }}>
            Real support from real people. Mindspace is a companion — these are the people who can help further.
          </p>

          {resources.map((section, si) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.1 + 0.2, duration: 0.4 }}
              style={{ marginBottom: "36px" }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "14px",
              }}>
                <div style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: section.color,
                  flexShrink: 0,
                }} />
                <h2 style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#64748b",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  margin: 0,
                }}>
                  {section.category}
                </h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px" }}>
                {section.items.map((item) => (
                  <div
                    key={item.name}
                    style={{
                      padding: "16px 18px",
                      borderRadius: "14px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.07)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <p style={{
                        color: "#e2e8f0",
                        fontSize: "14px",
                        fontWeight: 500,
                        margin: "0 0 4px 0",
                      }}>
                        {item.name}
                      </p>
                      <p style={{
                        color: "#475569",
                        fontSize: "12px",
                        margin: 0,
                        lineHeight: "1.5",
                      }}>
                        {item.description}
                      </p>
                    </div>
                    <ResourceAction item={item} />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Emergency note */}
          <div style={{
            padding: "16px 20px",
            borderRadius: "14px",
            background: "rgba(99, 102, 241, 0.06)",
            border: "1px solid rgba(99, 102, 241, 0.15)",
            marginTop: "8px",
          }}>
            <p style={{
              color: "#64748b",
              fontSize: "12px",
              lineHeight: "1.6",
              margin: 0,
              textAlign: "center" as const,
            }}>
              If you are in immediate danger, please call your local emergency services.
            </p>
          </div>

          {/* Privacy link */}
          <p style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#334155",
            marginTop: "20px",
          }}>
            <a href="/privacy" style={{
              color: "#334155",
              textDecoration: "underline",
              fontFamily: "inherit",
            }}>
              Privacy Policy
            </a>
          </p>

        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}