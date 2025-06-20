"use client";
import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  score: number;
  averageScore: number | null;
  onReveal: () => void;
  playCount: number | null; // ✅ Add this line
  onKeepGuessing: () => void;
};

export default function GameOverModal({
  open,
  onClose,
  score,
  averageScore,
  playCount, // ✅ ADD THIS

  onReveal,
  onKeepGuessing,
}: Props) {
  if (!open) return null;

return (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 100,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Inter, sans-serif",
    }}
    onClick={onClose}
  >
    <div
      style={{
        background: "#fff",
        padding: "2.5rem 2rem",
        borderRadius: "16px",
        width: "90%",
        maxWidth: "420px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        position: "relative",
        textAlign: "center",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <h2
        style={{
          marginBottom: "1rem",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "#111",
        }}
      >
        🧠 Game Over!
      </h2>

      <p style={{ fontSize: "1.1rem", marginBottom: "0.75rem", color: "#111" }}>
        You scored <strong>{score}</strong> points!
      </p>

      {averageScore !== null && (
        <p style={{ fontSize: "1rem", color: "#666", marginBottom: "0.5rem" }}>
          Avg. score for this puzzle: <strong>{averageScore}</strong>
        </p>
      )}

      {playCount !== null && (
        <p style={{ fontSize: "0.95rem", color: "#999", marginBottom: "1.5rem" }}>
          Played {playCount} {playCount === 1 ? "time" : "times"}
        </p>
      )}

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button
          onClick={onKeepGuessing}
          style={{
            backgroundColor: "#facc15",
            border: "none",
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
            color: "#111",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Keep Guessing
        </button>

        <button
          onClick={onReveal}
          style={{
            backgroundColor: "#f3f4f6",
            border: "1px solid #ccc",
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: 500,
            cursor: "pointer",
            color: "#111",
          }}
        >
          Reveal List
        </button>
      </div>
    </div>
  </div>
);
}
