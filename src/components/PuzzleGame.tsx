"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import TextField from "@mui/material/TextField";
import type { AutocompleteProps } from "@mui/material/Autocomplete";
import "@fontsource/inter";

type PuzzleGameProps = {
  title: string;
  correctList: string[];
  autocompleteList: string[];
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

export default function PuzzleGame({ title, correctList, autocompleteList }: PuzzleGameProps) {
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
        background: "#121212",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        color: "#E5E7EB",
      }}
    >
      <div
        style={{
          backgroundColor: "#1E1E1E",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          padding: "2.5rem",
          maxWidth: "650px",
          width: "100%",
        }}
      >
        <h1 style={{ fontSize: "2.25rem", marginBottom: "0.5rem", color: "#FFFFFF" }}>
          🎯 {title}
        </h1>
        <p style={{ marginBottom: "0.75rem", color: "#D1D5DB" }}>
          Try to guess as many as you can!
        </p>
        <p style={{ fontWeight: "bold", color: "#F87171", marginBottom: "1rem" }}>
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
                option.toLowerCase().startsWith(state.inputValue.toLowerCase())
              )
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Start typing..."
                variant="outlined"
                sx={{
                  width: 300,
                  mb: 2,
                  input: { color: "#E5E7EB" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#4B5563" },
                    "&:hover fieldset": { borderColor: "#9CA3AF" },
                    "&.Mui-focused fieldset": { borderColor: "#60A5FA" },
                  },
                  "& .MuiInputLabel-root": { color: "#9CA3AF" },
                }}
              />
            )}
          />
        )}

        <button
          onClick={handleSubmit}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            backgroundColor: "#2563EB",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Submit
        </button>

        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "#93C5FD" }}>
            Score: {score}
          </h2>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <div>
              <h3>✅ Correct Guesses ({correctGuesses.length})</h3>
              <ul style={{ paddingLeft: "1rem" }}>
                {correctGuesses
                  .map((guess) => ({
                    guess,
                    rank: correctList.findIndex(
                      (item) => item.toLowerCase() === guess.toLowerCase()
                    ),
                  }))
                  .sort((a, b) => a.rank - b.rank)
                  .map(({ guess, rank }, i) => (
                    <li key={i}>#{rank + 1} — {guess}</li>
                  ))}
              </ul>
            </div>

            <div>
              <h3>❌ Incorrect Guesses ({wrongGuesses.length})</h3>
              <ul style={{ paddingLeft: "1rem" }}>
                {wrongGuesses.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          </div>

          {allowGuessingAfterGameOver && !showAnswers && (
            <button
              onClick={() => setShowAnswers(true)}
              style={{
                marginTop: "1.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#374151",
                border: "1px solid #4B5563",
                borderRadius: "6px",
                color: "#E5E7EB",
                cursor: "pointer",
              }}
            >
              Give Up and Reveal List
            </button>
          )}

          {gameOver && !allowGuessingAfterGameOver && !showAnswers && (
            <div
              style={{
                marginTop: "2rem",
                border: "1px solid #4B5563",
                padding: "1rem",
                borderRadius: "6px",
                backgroundColor: "#1F2937",
              }}
            >
              <p style={{ fontWeight: "bold", marginBottom: "1rem" }}>
                You’re out of lives! Final score: {score}
              </p>
              <button
                onClick={() => setAllowGuessingAfterGameOver(true)}
                style={{
                  marginRight: "1rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#2563EB",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Keep Guessing
              </button>
              <button
                onClick={() => setShowAnswers(true)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border: "1px solid #4B5563",
                  backgroundColor: "#374151",
                  color: "#E5E7EB",
                  cursor: "pointer",
                }}
              >
                Reveal List
              </button>
            </div>
          )}
        </div>

        {showAnswers && (
          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ color: "#A5B4FC" }}>Full List:</h3>
            <ol style={{ paddingLeft: "1rem" }}>
              {correctList.map((item, i) => {
                const isCorrect = correctGuesses.some(
                  (guess) => guess.toLowerCase() === item.toLowerCase()
                );
                return (
                  <li
                    key={i}
                    style={{
                      color: isCorrect ? "#10B981" : "#9CA3AF",
                      fontWeight: isCorrect ? "bold" : "normal",
                    }}
                  >
                    {item}
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
