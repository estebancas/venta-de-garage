"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/contexts/cart-context";
import { AlertCircle, ShoppingCart, BookmarkPlus, BookmarkMinus } from "lucide-react";
import { ReserveInfoAlert } from "@/components/storefront/reserve-info-alert";
import { getReservationToken, isReservedByMe } from "@/lib/reservation-token";

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
  const [isReserveDialogOpen, setIsReserveDialogOpen] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [reservedByCurrentUser, setReservedByCurrentUser] = useState(false);

  const isSold = product.status === "sold";
  const isReserved = product.status === "reserved";
  const isActive = product.status === "active";
  const enableReserve = process.env.NEXT_PUBLIC_ENABLE_RESERVE === "true";
  const isInCart = items.some((item) => item.id === product.id);

  useEffect(() => {
    if (isReserved && product.reserved_by) {
      setReservedByCurrentUser(isReservedByMe(product.reserved_by));
    }
  }, [isReserved, product.reserved_by]);

  async function handleReserveToggle() {
    setIsReserving(true);

    try {
      const token = getReservationToken();
      const response = await fetch(`/api/products/${product.id}/reserve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reservation_token: token }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al reservar");
      }

      setIsReserveDialogOpen(false);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al reservar");
    } finally {
      setIsReserving(false);
    }
  }

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
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {reservedByCurrentUser
              ? "Has reservado este producto."
              : "Este producto está reservado por alguien más."}
          </AlertDescription>
        </Alert>

        {enableReserve && reservedByCurrentUser && (
          <>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={() => setIsReserveDialogOpen(true)}
            >
              <BookmarkMinus className="mr-2 h-5 w-5" />
              Cancelar Reserva
            </Button>

            <Dialog open={isReserveDialogOpen} onOpenChange={setIsReserveDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancelar Reserva</DialogTitle>
                  <DialogDescription>
                    ¿Estás seguro que deseas cancelar la reserva de este producto?
                    El producto volverá a estar disponible para todos.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsReserveDialogOpen(false)}
                    disabled={isReserving}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleReserveToggle}
                    disabled={isReserving}
                  >
                    {isReserving ? "Cancelando..." : "Sí, cancelar reserva"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    );
  }

  // Active product
  return (
    <div className="space-y-3">
      <Button
        size="lg"
        className="w-full text-lg"
        onClick={handleAddToCart}
        disabled={isInCart}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {isInCart ? "Ya está en el carrito" : "Agregar al carrito"}
      </Button>

      {enableReserve && (
        <>
          <ReserveInfoAlert />

          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => setIsReserveDialogOpen(true)}
          >
            <BookmarkPlus className="mr-2 h-5 w-5" />
            Reservar
          </Button>

          <Dialog open={isReserveDialogOpen} onOpenChange={setIsReserveDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reservar Producto</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro que deseas reservar este producto? Otros usuarios
                  no podrán comprarlo mientras esté reservado.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsReserveDialogOpen(false)}
                  disabled={isReserving}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleReserveToggle}
                  disabled={isReserving}
                >
                  {isReserving ? "Reservando..." : "Sí, reservar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
