import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mindspace",
  description: "A quiet place to process your day",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mindspace",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "application-name": "Mindspace",
    "apple-mobile-web-app-title": "Mindspace",
    "theme-color": "#6366f1",
    "msapplication-navbutton-color": "#6366f1",
    "msapplication-starturl": "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mindspace" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, viewport-fit=cover" />
      </head>
      <body className="bg-mindspace">
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
            fetch('https://mindspace-backend-quyh.onrender.com/')
              .catch(() => {});
          `
        }} />
      </body>
    </html>
  );
}