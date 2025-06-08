"use client";

import { useState } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { girlNames7000 } from "@/data/girlNames7000";

// Fake Top 100 list — just a few sample items for now
import { top100GirlNames as top100 } from "@/data/top100GirlNames";
const sortedOptions = [...girlNames7000].sort((a, b) =>
  a.localeCompare(b)
);

export default function Home() {
  const [guess, setGuess] = useState("");
  const [correctGuesses, setCorrectGuesses] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [allowGuessingAfterGameOver, setAllowGuessingAfterGameOver] = useState(false);

  const handleSubmit = () => {
    const cleaned = guess.trim();
    if (!cleaned) return;

    if (!allowGuessingAfterGameOver && gameOver) return;

    const alreadyGuessed =
      correctGuesses.includes(cleaned) || wrongGuesses.includes(cleaned);

    if (alreadyGuessed) {
      alert("You already guessed that!");
      return;
    }

    const matchIndex = top100.findIndex(
      (item) => item.toLowerCase() === cleaned.toLowerCase()
    );

    if (matchIndex !== -1) {
      setCorrectGuesses((prev) => [...prev, cleaned]);
      const points = matchIndex+1;
      setScore((prev) => prev + points);
    } else {
      setWrongGuesses((prev) => [...prev, cleaned]);

      if (!gameOver && !allowGuessingAfterGameOver) {
        setLives((prev) => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameOver(true);
          }
          return newLives;
        });
      }
    }

    setGuess("");
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Lowball</h1>
      <p style={{ fontWeight: "bold", color: "#555" }}>
        Category: Top 100 Most Popular Baby Girl Names 2024
      </p>
      <p>Try to guess items from today&rsquo;s Top 100 list!</p>
      <p style={{ fontWeight: "bold", color: "crimson" }}>
        Lives left: {lives}
      </p>
      <Autocomplete
        freeSolo
        options={sortedOptions}
        inputValue={guess}
        onInputChange={(_, value) => setGuess(value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        openOnFocus={false}
        filterOptions={(options, state) =>
          options.filter((option) =>
            option.toLowerCase().startsWith(state.inputValue.toLowerCase())
          )
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Enter your guess"
            variant="outlined"
            style={{ width: 300, marginBottom: "1rem" }}
          />
        )}
      />

      <button onClick={handleSubmit} style={{ padding: "0.5rem 1rem", marginLeft: "1rem" }}>
        Submit
      </button>


      <div style={{ marginTop: "2rem" }}>
        <h2>Score: {score}</h2>
        <div style={{ display: "flex", gap: "2rem" }}>
          <div>
            <h3>✅ Correct Guesses ({correctGuesses.length})</h3>
            <ul>
              {correctGuesses
                .map((guess) => ({
                  guess,
                  rank: top100.findIndex(
                    (item) => item.toLowerCase() === guess.toLowerCase()
                  ),
                }))
                .sort((a, b) => a.rank - b.rank)
                .map(({ guess, rank }, i) => (
                  <li key={i}>
                    #{rank + 1} — {guess}
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h3>❌ Incorrect Guesses ({wrongGuesses.length})</h3>
            <ul>
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
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#eee",
              border: "1px solid #999",
              cursor: "pointer",
            }}
          >
            Give Up and Reveal List
          </button>
        )}

        {gameOver && !allowGuessingAfterGameOver && (
          <div
            style={{
              marginTop: "2rem",
              border: "1px solid #ccc",
              padding: "1rem",
            }}
          >
            <p style={{ fontWeight: "bold" }}>
              You&rsquo;re out of lives! Final score: {score}
            </p>
            <button
              onClick={() => setAllowGuessingAfterGameOver(true)}
              style={{ marginRight: "1rem" }}
            >
              Keep Guessing
            </button>
            <button onClick={() => setShowAnswers(true)}>Reveal List</button>
          </div>
        )}
      </div>

      {showAnswers && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Full List:</h3>
          <ol>
            {top100.map((item, i) => {
              const isCorrect = correctGuesses.some(
                (guess) => guess.toLowerCase() === item.toLowerCase()
              );

              return (
                <li
                  key={i}
                  style={{
                    color: isCorrect ? "green" : "red",
                    fontWeight: isCorrect ? "bold" : "normal",
                  }}
                >
                  #{i + 1} — {item}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </main>
  );
}
