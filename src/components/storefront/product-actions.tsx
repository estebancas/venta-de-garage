"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCart } from "@/contexts/cart-context";
import { AlertCircle, ShoppingCart, Calendar, Loader2 } from "lucide-react";
import { toast } from "@/lib/toast-utils";
import { isReservedByMe, getReservationToken } from "@/lib/reservation-token";
import { ReserveModal } from "./reserve-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ReserveInfoAlert } from "./reserve-info-alert";

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
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const enableReserve = process.env.NEXT_PUBLIC_ENABLE_RESERVE === "true";
  const isSold = product.status === "sold";
  const isReserved = product.status === "reserved";
  const isReservedByCurrentUser = isReserved && isReservedByMe(product.reserved_by ?? null);
  const isInCart = items.some((item) => item.id === product.id);

  function handleAddToCart() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_urls[0] || "",
    });
    toast.success("Producto agregado al carrito");
    router.push("/carrito");
  }

  async function handleCancelReservation() {
    setIsCancelling(true);

    try {
      const response = await fetch("/api/orders", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: product.id,
          reservation_token: getReservationToken(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Error al cancelar la reserva");
        return;
      }

      toast.success("Reserva cancelada exitosamente");
      setIsCancelDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast.error("Error al cancelar la reserva");
    } finally {
      setIsCancelling(false);
    }
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

  // Reserved by someone else
  if (isReserved && !isReservedByCurrentUser) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Este producto está reservado por otra persona.
        </AlertDescription>
      </Alert>
    );
  }

  // Reserved by current user - show cancel button
  if (isReservedByCurrentUser) {
    return (
      <>
        <div className="space-y-3">
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              Has reservado este producto. Te contactaremos pronto.
            </AlertDescription>
          </Alert>
          <Button
            size="lg"
            variant="outline"
            className="w-full text-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => setIsCancelDialogOpen(true)}
          >
            Cancelar Reserva
          </Button>
        </div>

        <ConfirmDialog
          open={isCancelDialogOpen}
          onOpenChange={setIsCancelDialogOpen}
          title="¿Cancelar reserva?"
          description={`¿Estás seguro de que deseas cancelar tu reserva de "${product.name}"? El producto volverá a estar disponible para otros usuarios.`}
          confirmText="Sí, cancelar reserva"
          cancelText="No, mantener reserva"
          onConfirm={handleCancelReservation}
          isLoading={isCancelling}
          variant="destructive"
        />
      </>
    );
  }

  // Active product - show add to cart and reserve buttons
  return (
    <>
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
            <Button
              size="lg"
              variant="outline"
              className="w-full text-lg"
              onClick={() => setIsReserveModalOpen(true)}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Reservar
            </Button>
            <ReserveInfoAlert />
          </>
        )}
      </div>

      <ReserveModal
        open={isReserveModalOpen}
        onOpenChange={setIsReserveModalOpen}
        productId={product.id}
        productName={product.name}
      />
    </>
  );
}
