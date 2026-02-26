"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCart } from "@/contexts/cart-context";
import { AlertCircle, ShoppingCart } from "lucide-react";

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    status: string;
    image_urls: string[];
    reserved_by?: string | null;
  };
}

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const { addItem, items } = useCart();

  const isSold = product.status === "sold";
  const isReserved = product.status === "reserved";
  const isInCart = items.some((item) => item.id === product.id);

  function handleAddToCart() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_urls[0] || "",
    });
    router.push("/carrito");
  }

  // Sold product
  if (isSold) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Este producto ya fue vendido y no está disponible.
        </AlertDescription>
      </Alert>
    );
  }

  // Reserved product
  if (isReserved) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Este producto está reservado. Para reservar productos, agrégalos al carrito.
        </AlertDescription>
      </Alert>
    );
  }

  // Active product
  return (
    <Button
      size="lg"
      className="w-full text-lg"
      onClick={handleAddToCart}
      disabled={isInCart}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {isInCart ? "Ya está en el carrito" : "Agregar al carrito"}
    </Button>
  );
}
