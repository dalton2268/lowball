'use client';

import Image from "next/image";
import Link from "next/link";
import HowToPlayModal from "@/components/HowToPlayModal";
import { useEffect, useState } from "react";
import {HelpCircle } from "lucide-react";

type Puzzle = {
  id: string;
  title: string;
  slug: string;
};

export default function HomePageClient({
  puzzles,
  error,
}: {
  puzzles: Puzzle[];
  error: string | null;
}) {
  const [showHelp, setShowHelp] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setShowHelp(true); // 👈 auto-show on initial load

  }, []);

  return (
    <>
    {mounted && (
    <>

    <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #ddd",
    padding: "0.75rem 1.25rem",
    position: "sticky",
    top: 0,
    zIndex: 50,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  }}
>

  <button
    onClick={() => setShowHelp(true)}
    style={{
      background: "none",
      border: "none",
      fontSize: "1.25rem",
      cursor: "pointer",
      color: "#4B5563",
    }}
    title="How to play"
  >
    <HelpCircle size={22} />
  </button>
</div>
</>
)}

    <main
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ maxWidth: "300px", margin: "0 auto" }}>
          <Image
            src="/logo.svg"
            alt="LowBall logo"
            width={300}
            height={100}
            style={{ width: "100%", height: "auto" }}
            priority
          />
        </div>
        <h1 style={{ fontSize: "2.5rem", marginTop: "1rem" }}>Available Puzzles</h1>
      </div>

      {error ? (
        <p style={{ color: "red" }}>Error loading puzzles: {error}</p>
      ) : puzzles.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {puzzles.map((puzzle) => (
            <Link key={puzzle.id} href={`/play/${puzzle.slug}`} style={{ textDecoration: "none" }}>
              <div
                style={{
                  display: "block",
                  padding: "1.25rem",
                  backgroundColor: "#ffffff",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                  color: "#111",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.border = "2px solid #444";
                  el.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.1)";
                  el.style.backgroundColor = "#fafafa";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.border = "1px solid #ddd";
                  el.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.05)";
                  el.style.backgroundColor = "#ffffff";
                }}
              >
                <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{puzzle.title}</h2>
                <p style={{ fontSize: "0.9rem", color: "#555", margin: 0 }}>Start puzzle →</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p style={{ color: "#555" }}>No puzzles available yet.</p>
      )}
      <HowToPlayModal open={showHelp} onClose={() => setShowHelp(false)} />
    </main>
    </>
  );
}
