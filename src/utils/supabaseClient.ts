"use client";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

export const createClient = () => createBrowserSupabaseClient<Database>();

export const createServerClient = () =>
  createServerComponentClient<Database>({ cookies });
