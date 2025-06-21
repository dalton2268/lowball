"use client";
import GameOverModal from "./GameOverModal";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import TextField from "@mui/material/TextField";
import type { AutocompleteProps } from "@mui/material/Autocomplete";
import "@fontsource/inter";
import Image from "next/image";
import { ArrowLeft, HelpCircle } from "lucide-react";
import HowToPlayModal from "./HowToPlayModal";
import { supabase } from "@/utils/supabaseClient";

type PuzzleGameProps = {
  title: string;
  slug: string;
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

export default function PuzzleGame({ title, slug, correctList, autocompleteList, revealTextList }: PuzzleGameProps) {
  const [isClient, setIsClient] = useState(false);
  const [guess, setGuess] = useState("");
  const [playCount, setPlayCount] = useState<number | null>(null);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [correctGuesses, setCorrectGuesses] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [lastGuessCorrect, setLastGuessCorrect] = useState<null | boolean>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [allowGuessingAfterGameOver, setAllowGuessingAfterGameOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  const [lastGuessDisplay, setLastGuessDisplay] = useState<{
    text: string;
    correct: boolean;
  } | null>(null);
  useEffect(() => {
    setIsClient(true);
    }, []);

    useEffect(() => {
    console.log("gameOver changed:", gameOver);
  }, [gameOver]);

    useEffect(() => {
      if (gameOver && !allowGuessingAfterGameOver) {
        // Only run once at game end

    const sendScore = async () => {
      // ✅ 1. Insert the player's score
      await supabase.from("scores").insert({
        puzzle_id: slug,
        score,
      });

      // ✅ 2. Wait briefly so Supabase can update
      await new Promise((res) => setTimeout(res, 150));

      // ✅ 3. Fetch all scores to calculate the average
      const { data, error: avgError } = await supabase
        .from("scores")
        .select("score")
        .eq("puzzle_id", slug);

      if (avgError) {
        console.error("Error fetching scores:", avgError.message);
        return;
      }

      if (data && data.length > 0) {
        const total = data.reduce((sum, row) => sum + row.score, 0);
        const avg = total / data.length;
        setAverageScore(Math.round(avg));
        setPlayCount(data.length);
      }

      // ✅ 4. Show the Game Over modal once all data is ready
      setShowGameOverModal(true);
    };

      sendScore(); // ✅ just this

      }
    }, [gameOver, allowGuessingAfterGameOver]);

  const sortedOptions = [...autocompleteList].sort((a, b) => a.localeCompare(b));

  const handleSubmit = () => {
    handleGuess(guess);
  };

  const handleGuess = (input: string) => {
    console.log("handleGuess called with:", input);

    const cleaned = input.trim();
    inputRef.current?.blur();

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
      setLastGuessDisplay({ text: correctList[matchIndex], correct: true });

      // ✅ Only update score if the user is allowed to guess
      if (!gameOver || allowGuessingAfterGameOver) {
        setScore((prev) => prev + (matchIndex + 1));
      }

      setLastGuessCorrect(true); // ✅ correct
    }
 else {
      setWrongGuesses((prev) => [...prev, cleaned]);
      setLastGuessDisplay({ text: cleaned, correct: false });
      setLastGuessCorrect(false); // ❌ wrong

      if (!gameOver && !allowGuessingAfterGameOver) {
        setLives((prev) => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            console.log("Setting gameOver to true");

            setGameOver(true);
            setShowGameOverModal(true); // 👈 this line shows the modal
            
          }
          return newLives;
        });
      }
    }

    setGuess("");
    setTimeout(() => inputRef.current?.focus(), 500);
    setTimeout(() => setLastGuessCorrect(null), 800); // reset glow after 800ms

  };
  if (!isClient) return null; // ⛔ prevent hydration mismatch

  return (
  <>
    {/* ✅ Top bar */}
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
        onClick={() => (window.location.href = "/")}
        style={{
          background: "none",
          border: "none",
          color: "#4B5563", // tailwind slate-600 — matches logo text
          fontWeight: 500,
          fontSize: "1rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
          <ArrowLeft size={18} /> Other Puzzles
      </button>

      <button
        onClick={() =>
          setShowHowToPlay(true)
        }
        style={{
          background: "none",
          border: "none",
          fontSize: "1.25rem",
          cursor: "pointer",
          color: "#4B5563", // 👈 update here to match logo
        }}
        title="How to play"
      >
        <HelpCircle size={22} />

      </button>
      </div>

      {/* ✅ Main game area */}
      
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
        src="/LogoWhite.svg"
        alt="LowBall logo"
        width={300}
        height={80}
        style={{ width: "100%", height: "auto" }}
        priority
      />
    </div>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#111" }}>{title}</h1>
      <p style={{ color: "#555", marginBottom: "0.75rem" }}>Try to guess as many as you can!</p>
      {!showAnswers && (
        <>

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
              inputRef={inputRef}  
              placeholder="Start typing..."
              variant="outlined"
              sx={{
                width: "100%",
                mb: 2,
                backgroundColor: "#fafafa",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor:
                      lastGuessCorrect === true
                        ? "#22C55E"
                        : lastGuessCorrect === false
                        ? "#EF4444"
                        : "#ccc",
                    borderWidth:
                      lastGuessCorrect === true || lastGuessCorrect === false ? "2px" : "1px",
                    transition: "all 0.15s ease",
                  },
                  "&:hover fieldset": { borderColor: "#888" },
                  "&.Mui-focused fieldset": {
                    borderColor:
                      lastGuessCorrect === true
                        ? "#22C55E"
                        : lastGuessCorrect === false
                        ? "#EF4444"
                        : "#3b82f6",
                    borderWidth:
                      lastGuessCorrect === true || lastGuessCorrect === false ? "2px" : "1px",
                  },
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
 </>
)}
      <div style={{ marginTop: "1.5rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#1e40af" }}>
          Score: {score}
        </h2>
  
    {allowGuessingAfterGameOver && !showAnswers && (
      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={() => {
            setShowAnswers(true);
            setLastGuessDisplay(null);
          }}
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
                .map(({ guess, rank }, i) => {
                  const isLastGuess = lastGuessDisplay?.text?.toLowerCase() === guess.toLowerCase();

                  return (
                    <li
                      key={i}
                      style={{
                        color: isLastGuess ? "#15803d" : undefined, // green if last
                        fontWeight: isLastGuess ? "bold" : undefined,
                      }}
                    >
                      #{rank + 1} —{" "}
                      {revealTextList && revealTextList[rank]
                        ? revealTextList[rank]
                        : guess}
                    </li>
                  );
                })
              }
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

              const isLastGuess = lastGuessDisplay?.text?.toLowerCase() === g.toLowerCase();

              return (
                <li
                  key={i}
                  style={{
                    color: isLastGuess ? "#b91c1c" : undefined, // red if it's the last incorrect guess
                    fontWeight: isLastGuess ? "bold" : undefined,
                  }}
                >
                  {displayText}
                </li>
              );
            })}

            </ul>
          </div>
        </div>
      </div>
      {/* {gameOver && !allowGuessingAfterGameOver && (
          <div style={{ marginTop: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", color: "#111" }}>
              🧠 Your Final Score: {score}
            </h2>
            {averageScore !== null && (
              <p style={{ fontSize: "1rem", color: "#666", marginBottom: "1rem" }}>
                (Average score for this puzzle: {averageScore})
              </p>
              
            )}
              {playCount !== null && (
              <p style={{ fontSize: "0.95rem", color: "#666", marginBottom: "1rem" }}>
                Played {playCount} {playCount === 1 ? "time" : "times"}
              </p>
            )}

          </div>
        )} */}


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
          <HowToPlayModal open={showHowToPlay} onClose={() => setShowHowToPlay(false)} />

        {showGameOverModal && (
          
          <GameOverModal
            open={showGameOverModal}
            onClose={() => setShowGameOverModal(false)}
            score={score}
            averageScore={averageScore}
            playCount={playCount}
            onKeepGuessing={() => {
              setAllowGuessingAfterGameOver(true);
              setShowGameOverModal(false);
            }}
            onReveal={() => {
              setShowAnswers(true);
              setLastGuessDisplay(null);
              setShowGameOverModal(false);
            }}
          />
        )}

  </>

  );
}
