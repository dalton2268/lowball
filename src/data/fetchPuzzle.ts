import { createClient } from "@/utils/supabaseClient";

export async function fetchPuzzleBySlug(slug: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("Puzzles")
    .select("*")
    .eq("slug", slug);

  if (error) {
    console.error("❌ Supabase error:", error);
    return null;
  }

  console.log("✅ Supabase raw data:", data);

  // Safely return the first item
  return data?.[0] ?? null;
}
