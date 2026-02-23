import { StorefrontHeader } from "@/components/storefront/storefront-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default function CartPage() {
  // For now, this is a placeholder since we're doing direct checkout
  // In the future, this could store multiple items
  return (
    <>
      <StorefrontHeader />
      <main className="min-h-screen">
        <div className="container py-8">
          <h1 className="text-3xl font-heading font-bold mb-6">
            Carrito de compras
          </h1>

          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-muted-foreground mb-6">
              Explora nuestros productos y encuentra algo que te guste
            </p>
            <Button asChild>
              <Link href="/">Ir a la tienda</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
