import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductActions } from "@/components/storefront/product-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("id", id)
    .single();

  if (error || !product) {
    return {
      title: 'Producto no encontrado - Venta de Garage',
      description: 'El producto que buscas no está disponible.',
    };
  }

  const productImage = product.image_urls?.[0];
  const title = `${product.name} - ₡${product.price.toLocaleString("es-CR")}`;
  const description = product.description || `${product.name} disponible en Venta de Garage`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: productImage ? [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.name,
        }
      ] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: productImage ? [productImage] : undefined,
    },
  };
}

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

  const isReserved = product.status === "reserved";
  const isSold = product.status === "sold";

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || `${product.name} disponible en Venta de Garage`,
    "image": product.image_urls || [],
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "CRC",
      "availability": isSold
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      "itemCondition": "https://schema.org/UsedCondition",
      "url": `https://estebanybiankavendensustiliches.com/producto/${id}`,
    },
    ...(product.categories && {
      "category": product.categories.name,
    }),
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <StorefrontHeader />
      <main className="min-h-screen">
        <div className="container py-8 md:py-12">
          {/* Back Button */}
          <div className="mb-8 opacity-0 animate-fade-in">
            <Button
              variant="ghost"
              asChild
              className="hover:bg-accent/50 transition-all duration-300 -ml-3 rounded-full"
            >
              <Link href="/">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Volver a la tienda
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Gallery */}
            <div className="opacity-0 animate-fade-in delay-100">
              <ProductGallery images={product.image_urls || []} />
            </div>

            {/* Product Info */}
            <div className="space-y-8 opacity-0 animate-fade-in delay-200">
              {/* Status Badge */}
              {(isSold || isReserved) && (
                <div className="inline-flex items-center rounded-full bg-foreground/90 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-background shadow-lg">
                  {isSold ? "Vendido" : "Reservado"}
                </div>
              )}

              {/* Title */}
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 tracking-tight leading-[1.1]">
                  {product.name}
                </h1>
                {product.categories && (
                  <p className="text-lg text-muted-foreground font-medium">
                    {product.categories.name}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="border-t border-b border-border/50 py-6">
                <p className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
                  ₡{product.price.toLocaleString("es-CR")}
                </p>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h2 className="font-heading font-semibold text-xl mb-4">
                    Descripción
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Product Actions */}
              <div className="pt-4">
                <ProductActions
                  product={{
                    ...product,
                    status: product.status || "active",
                    image_urls: product.image_urls || [],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
