// 👇 These two must be first
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Database } from "@/types/supabase";

type Props = {
  params: { slug: string };
};

export default async function PlayPage({ params }: Props) {
  console.log("🔍 SLUG PARAM:", params.slug);

  const supabase = createServerComponentClient<Database>({ cookies });

  const { data, error } = await supabase
    .from("Puzzles")
    .select("*")
    .eq("slug", params.slug)
    .single();

  console.log("📦 SUPABASE DATA:", data);
  console.log("❌ SUPABASE ERROR:", error);

  if (error || !data) {
    return notFound();
  }

  return (
    <div>
      <h1>{data.title}</h1>
      <p>Slug: {data.slug}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
