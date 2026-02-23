import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StorefrontHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-heading font-bold">Venta de Garage</h1>
        </Link>

        <nav className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/carrito">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Carrito</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
