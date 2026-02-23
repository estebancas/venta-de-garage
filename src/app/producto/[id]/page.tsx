import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { BuyButton } from "@/components/storefront/buy-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  const isSold = product.status === "sold";
  const isReserved = product.status === "reserved";
  const isAvailable = product.status === "active";

  return (
    <>
      <StorefrontHeader />
      <main className="min-h-screen">
        <div className="container py-8">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver a la tienda
            </Link>
          </Button>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Gallery */}
            <div>
              <ProductGallery images={product.image_urls} />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Status Badge */}
              {(isSold || isReserved) && (
                <div className="inline-flex items-center rounded-full bg-muted px-4 py-2 text-sm font-medium">
                  {isSold ? "Vendido" : "Reservado"}
                </div>
              )}

              {/* Title */}
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                  {product.name}
                </h1>
                {product.categories && (
                  <p className="text-muted-foreground">
                    {product.categories.name}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="border-t border-b py-4">
                <p className="text-4xl font-bold text-primary">
                  ₡{product.price.toLocaleString("es-CR")}
                </p>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h2 className="font-heading font-semibold text-lg mb-2">
                    Descripción
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Buy Button */}
              {isAvailable && (
                <BuyButton productId={product.id} productName={product.name} />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
