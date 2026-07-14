import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// Deduped per-request: generateMetadata and the page component both
// call this for the same id, but the Supabase query only runs once.
export const getProduct = cache(async (id: string) => {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("id", id)
    .single();

  if (error || !product) {
    return null;
  }

  return product;
});
