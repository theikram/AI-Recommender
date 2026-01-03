import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Recommender System | Link-Based Content Discovery",
  description: "Discover similar content using advanced AI embeddings and vector similarity search. Powered by Gemini AI and FAISS.",
  keywords: ["AI", "recommendations", "embeddings", "FAISS", "machine learning", "data science"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
