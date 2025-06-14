import { supabase } from "@/utils/supabaseClient";
import { notFound } from "next/navigation";

export default async function PlayPage(props: { params: { slug: string } }) {
  const { params } = await props;
  const { slug } = params;

  const { data: puzzle, error: puzzleError } = await supabase
    .from("Puzzles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (puzzleError || !puzzle) {
    return notFound();
  }

  const { data: entries, error: entriesError } = await supabase
    .from("raw_csv_uploads")
    .select("*")
    .eq("list_name", slug)
    .order("rank");

  if (entriesError) {
    return (
      <div>Error loading entries: {entriesError.message}</div>
    );
  }

  return (
    <div>
      <h1>{puzzle.title}</h1>
      <ul>
        {entries?.map((entry) => (
          <li key={entry.id}>
            #{entry.rank || "?"}: {entry.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
