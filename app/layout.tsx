import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mindspace",
  description: "A quiet place to process your day",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-mindspace">
        {children}
      </body>
    </html>
  );
}