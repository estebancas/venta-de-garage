"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";

export function StorefrontHeader() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-20 items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 group transition-opacity hover:opacity-70 duration-300"
        >
          <h1 className="text-2xl font-heading font-bold tracking-tight">
            Venta de Garage
          </h1>
        </Link>

        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-12 w-12 rounded-full hover:bg-accent/50 transition-all duration-300"
            asChild
          >
            <Link href="/carrito">
              <ShoppingCart className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-6 w-6 rounded-full bg-foreground text-[11px] font-bold text-background flex items-center justify-center shadow-lg animate-fade-in-scale">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Carrito ({itemCount})</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
