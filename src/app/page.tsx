import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { StorefrontClient } from "@/components/storefront/storefront-client";
import { ProductGridSkeleton } from "@/components/storefront/product-grid-skeleton";

export default function Home() {
  return (
    <>
      <StorefrontHeader />
      <main className="min-h-screen">
        <div className="container py-12 md:py-16">
          {/* Hero Section — renders instantly, doesn't wait on data */}
          <div className="mb-16 text-center opacity-0 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 tracking-tight leading-[1.1]">
              Objetos con historia
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              Artículos de segunda mano en excelente estado a buenos precios
            </p>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <Storefront />
          </Suspense>
        </div>
      </main>
    </>
  );
}

async function Storefront() {
  const supabase = await createClient();

  // Fetch categories and products in parallel — no waterfall.
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("*").order("name", { ascending: true }),
    supabase
      .from("products")
      .select("*, categories(name, slug)")
      .order("created_at", { ascending: false }),
  ]);

  const normalizedProducts = (products || []).map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    status: product.status || "active",
    category_id: product.category_id,
    image_urls: product.image_urls || [],
    created_at: product.created_at || "",
  }));

  return (
    <StorefrontClient
      categories={categories || []}
      products={normalizedProducts}
    />
  );
}
