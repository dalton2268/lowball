import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LowBall – Puzzle Game",
  description: "Guess-based puzzle games powered by data and speed.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
