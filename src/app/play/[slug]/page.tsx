import { supabase } from "@/utils/supabaseClient";
import PuzzleGame from "@/components/PuzzleGame";
import { notFound } from "next/navigation";

export default async function PlayPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const { data: puzzle, error } = await supabase
    .from("Puzzles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !puzzle) return notFound();

return (
  <PuzzleGame
    title={puzzle.title}
    correctList={puzzle.correct_list ?? []}
    autocompleteList={puzzle.autocomplete_list ?? []}
    revealTextList={puzzle.revealText_list}
    slug={puzzle.slug}

  />
);
}
