import HomePageClient from './HomePageClient';
import { supabase } from "@/utils/supabaseClient";

export default async function HomePage() {
  const { data: puzzles, error } = await supabase
    .from("Puzzles")
    .select("id, title, slug")
    .order("created_at", { ascending: false });

  return <HomePageClient puzzles={puzzles || []} error={error?.message || null} />;
}
