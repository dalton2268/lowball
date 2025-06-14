import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";

type Puzzle = {
  id: string;
  title: string;
  slug: string;
};

export default async function HomePage() {
  const { data: puzzles, error } = await supabase
    .from("Puzzles")
    .select("id, title, slug")
    .order("created_at", { ascending: false });

  if (error) {
    return <div>Error loading puzzles: {error.message}</div>;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>🧩 Available Puzzles</h1>
      {puzzles && puzzles.length > 0 ? (
        <ul style={{ marginTop: "1rem" }}>
          {puzzles.map((puzzle: Puzzle) => (
            <li key={puzzle.id}>
              <Link href={`/play/${puzzle.slug}`}>
                <strong>{puzzle.title}</strong>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No puzzles available yet.</p>
      )}
    </main>
  );
}
