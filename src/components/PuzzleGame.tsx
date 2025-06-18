"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import TextField from "@mui/material/TextField";
import type { AutocompleteProps } from "@mui/material/Autocomplete";
import "@fontsource/inter";
import Image from "next/image";

type PuzzleGameProps = {
  title: string;
  correctList: string[];
  autocompleteList: string[];
  revealTextList?: string[]; // optional

  
};

const Autocomplete = dynamic<AutocompleteProps<string, false, true, true>>(
  () =>
    import("@mui/material/Autocomplete").then(
      (mod) =>
        mod.default as React.ComponentType<
          AutocompleteProps<string, false, true, true>
        >
    ),
  { ssr: false }
);

export default function PuzzleGame({ title, correctList, autocompleteList, revealTextList }: PuzzleGameProps) {
  const [isClient, setIsClient] = useState(false);
  const [guess, setGuess] = useState("");
  const [correctGuesses, setCorrectGuesses] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [allowGuessingAfterGameOver, setAllowGuessingAfterGameOver] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sortedOptions = [...autocompleteList].sort((a, b) => a.localeCompare(b));

  const handleSubmit = () => {
    handleGuess(guess);
  };

  const handleGuess = (input: string) => {
    const cleaned = input.trim();
    if (!cleaned || showAnswers || (!allowGuessingAfterGameOver && gameOver)) return;

    const alreadyGuessed =
      correctGuesses.includes(cleaned) || wrongGuesses.includes(cleaned);

    if (alreadyGuessed) {
      alert("You already guessed that!");
      return;
    }

    const matchIndex = correctList.findIndex(
      (item) => item.toLowerCase() === cleaned.toLowerCase()
    );

    if (matchIndex !== -1) {
      setCorrectGuesses((prev) => [...prev, correctList[matchIndex]]);
      setScore((prev) => prev + (matchIndex + 1));
    } else {
      setWrongGuesses((prev) => [...prev, cleaned]);
      if (!gameOver && !allowGuessingAfterGameOver) {
        setLives((prev) => {
          const newLives = prev - 1;
          if (newLives <= 0) setGameOver(true);
          return newLives;
        });
      }
    }

    setGuess("");
  };

  return (
    <main
  style={{
    fontFamily: "Inter, sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    padding: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
  }}
>
  <div
    style={{
      backgroundColor: "#ffffff",
      border: "1px solid #ddd",
      borderRadius: "16px",
      padding: "2rem",
      maxWidth: "720px",
      width: "100%",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    }}
  > {/* ✅ Logo block */}
  <div style={{ maxWidth: "300px", margin: "0 auto 1.5rem auto" }}>
    <Image
      src="/logo.svg"
      alt="LowBall logo"
      width={300}
      height={80}
      style={{ width: "100%", height: "auto" }}
      priority
    />
  </div>
    <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#111" }}>{title}</h1>
    <p style={{ color: "#555", marginBottom: "0.75rem" }}>Try to guess as many as you can!</p>
    <p style={{ fontWeight: 600, color: "#b91c1c", marginBottom: "1rem" }}>
      Lives left: {lives}
    </p>

    {isClient && (
      <Autocomplete
        freeSolo
        disableClearable
        options={sortedOptions}
        inputValue={guess}
        onInputChange={(_, value, reason) => {
          if (reason === "input" && typeof value === "string") {
            setGuess(value);
          }
        }}
        onChange={(_, value) => {
          if (typeof value === "string") {
            handleGuess(value);
          }
        }}
        filterOptions={(options, state) =>
          options.filter((option) =>
            option.toLowerCase().includes(state.inputValue.toLowerCase())
          )
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Start typing..."
            variant="outlined"
            sx={{
              width: "100%",
              mb: 2,
              backgroundColor: "#fafafa",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ccc" },
                "&:hover fieldset": { borderColor: "#888" },
                "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
              },
              input: { color: "#111" },
            }}
          />
        )}
      />
    )}

    <button
      onClick={handleSubmit}
      style={{
        padding: "0.6rem 1.2rem",
        borderRadius: "6px",
        backgroundColor: "#3b82f6",
        color: "white",
        border: "none",
        cursor: "pointer",
        fontWeight: "600",
        marginBottom: "1rem",
      }}
    >
      Submit
    </button>

    <div style={{ marginTop: "1.5rem" }}>
      <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#1e40af" }}>
        Score: {score}
      </h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <h3 style={{ color: "#15803d" }}>✅ Correct Guesses ({correctGuesses.length})</h3>
          <ul style={{ paddingLeft: "1rem", color: "#111" }}>
            {correctGuesses
              .map((guess) => ({
                guess,
                rank: correctList.findIndex(
                  (item) => item.toLowerCase() === guess.toLowerCase()
                ),
              }))
              .sort((a, b) => a.rank - b.rank)
              .map(({ guess, rank }, i) => (
                <li key={i}>
                  #{rank + 1} —{" "}
                  {revealTextList && revealTextList[rank]
                    ? revealTextList[rank]
                    : guess}
                </li>
              ))}
          </ul>
        </div>

        <div>
          <h3 style={{ color: "#b91c1c" }}>❌ Incorrect Guesses ({wrongGuesses.length})</h3>
          <ul style={{ paddingLeft: "1rem", color: "#333" }}>
            {wrongGuesses.map((g, i) => {
              const idx = autocompleteList.findIndex(
                (item) => item.toLowerCase() === g.toLowerCase()
              );
              const displayText =
                idx !== -1 && revealTextList?.[idx] ? revealTextList[idx] : g;

              return <li key={i}>{displayText}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>

    {(gameOver || allowGuessingAfterGameOver) && !showAnswers && (
      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={() => setAllowGuessingAfterGameOver(true)}
          style={{
            padding: "0.5rem 1rem",
            marginRight: "1rem",
            backgroundColor: "#facc15",
            border: "none",
            borderRadius: "6px",
            color: "#111",
            cursor: "pointer",
          }}
        >
          Keep Guessing
        </button>
        <button
          onClick={() => setShowAnswers(true)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#e5e7eb",
            border: "1px solid #ccc",
            borderRadius: "6px",
            color: "#111",
            cursor: "pointer",
          }}
        >
          Reveal List
        </button>
      </div>
    )}

    {showAnswers && (
      <div style={{ marginTop: "2rem" }}>
        <h3 style={{ color: "#1d4ed8" }}>Full List:</h3>
        <ol style={{ paddingLeft: "1rem", color: "#111" }}>
          {correctList.map((item, i) => {
            const isCorrect = correctGuesses.some(
              (guess) => guess.toLowerCase() === item.toLowerCase()
            );
            return (
              <li
                key={i}
                style={{
                  color: isCorrect ? "#15803d" : "#555",
                  fontWeight: isCorrect ? "bold" : "normal",
                }}
              >
                {revealTextList && revealTextList[i]
                  ? revealTextList[i]
                  : item}
              </li>
            );
          })}
        </ol>
      </div>
    )}
  </div>
</main>

  );
}
