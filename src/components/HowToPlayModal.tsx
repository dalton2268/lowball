"use client";
import React from "react";

type HowToPlayModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function HowToPlayModal({ open, onClose }: HowToPlayModalProps) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
        <div
          style={{
       background: "#fefefe",
        borderRadius: "12px",
        padding: "2rem",
        maxWidth: "500px",
        width: "90%",
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        position: "relative",
        border: "1px solid #e5e7eb",
        fontFamily: "Inter, sans-serif",
        transform: "scale(0.95)",
        opacity: 0,
        animation: "fadeIn 0.35s ease-out forwards",
          }}
          onClick={(e) => e.stopPropagation()}
        >

        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.25rem",
          }}
        >
          ✖
        </button>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            🧠 How to Play
          </h2>

          <p style={{ marginBottom: "1rem", color: "#333", fontSize: "1rem", lineHeight: "1.6" }}>
            The goal is to guess <strong>obscure but correct answers</strong> from a ranked list.
          </p>

          <ul
            style={{
              paddingLeft: "1.25rem",
              marginBottom: "1rem",
              color: "#444",
              fontSize: "0.95rem",
              lineHeight: "1.6",
            }}
          >
            <li><strong>More obscure answers score more points</strong>.</li>
            <li>You only have <strong>3 lives</strong>.</li>
            <li>Each incorrect guess costs a life.</li>
          </ul>

          <p style={{ color: "#333", fontSize: "0.95rem", lineHeight: "1.6" }}>
            Type a guess and click “Submit.” Be clever — the deeper the cut, the higher your score!
          </p>
          
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

    </div>
    
  );
}
