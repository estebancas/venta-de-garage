"use client";

import { StorefrontHeader } from "@/components/storefront/storefront-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Copy, CheckCircle2, BookmarkPlus } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { getReservationToken } from "@/lib/reservation-token";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ReserveInfoAlert } from "@/components/storefront/reserve-info-alert";

const checkoutFormSchema = z.object({
  buyer_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  buyer_phone: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
  buyer_email: z.string().email("Ingrese un correo electrónico válido"),
  sinpe_reference: z.string().min(4, "Ingrese el número de referencia de SINPE"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, clearCart, total } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isReserving, setIsReserving] = useState(false);

  const sinpePhone = process.env.NEXT_PUBLIC_SINPE_PHONE || "";
  const sinpeName = process.env.NEXT_PUBLIC_SINPE_NAME || "";
  const enableReserve = process.env.NEXT_PUBLIC_ENABLE_RESERVE === "true";

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      buyer_name: "",
      buyer_phone: "",
      buyer_email: "",
      sinpe_reference: "",
    },
  });

  async function onSubmit(values: CheckoutFormValues) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          products: items.map((item) => item.id),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al procesar la orden");
      }

      setIsSuccess(true);
      form.reset();
      clearCart();

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al procesar la orden");
    } finally {
      setIsSubmitting(false);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(sinpePhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleBulkReserve() {
    if (!confirm(`¿Estás seguro que deseas reservar ${items.length} producto${items.length > 1 ? 's' : ''}?`)) {
      return;
    }

    setIsReserving(true);

    try {
      const token = getReservationToken();
      const response = await fetch("/api/products/reserve-bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_ids: items.map((item) => item.id),
          reservation_token: token,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al reservar productos");
      }

      clearCart();
      alert("Productos reservados exitosamente");
      router.push("/");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al reservar productos");
    } finally {
      setIsReserving(false);
    }
  }

  if (isSuccess) {
    return (
      <>
        <StorefrontHeader />
        <main className="min-h-screen">
          <div className="container py-8">
            <div className="max-w-md mx-auto flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-3xl font-heading font-bold mb-2">
                ¡Orden recibida!
              </h2>
              <p className="text-muted-foreground mb-4">
                Verificaremos tu pago y te contactaremos pronto.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirigiendo a la tienda...
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (items.length === 0) {
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

  return (
    <>
      <StorefrontHeader />
      <main className="min-h-screen">
        <div className="container py-8">
          <h1 className="text-3xl font-heading font-bold mb-8">
            Carrito de compras
          </h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Cart Items */}
            <div className="space-y-4">
              <h2 className="text-xl font-heading font-semibold mb-4">
                Productos ({items.length})
              </h2>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border rounded-lg bg-card"
                >
                  <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    <p className="text-lg font-bold text-primary">
                      ₡{item.price.toLocaleString("es-CR")}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-primary">
                    ₡{total.toLocaleString("es-CR")}
                  </span>
                </div>

                {enableReserve && (
                  <>
                    <ReserveInfoAlert />

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={handleBulkReserve}
                      disabled={isReserving || isSubmitting}
                    >
                      <BookmarkPlus className="mr-2 h-5 w-5" />
                      {isReserving ? "Reservando..." : `Reservar ${items.length} producto${items.length > 1 ? 's' : ''}`}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Checkout Form */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading font-semibold mb-4">
                  Completar compra
                </h2>

                {/* SINPE Instructions */}
                <div className="rounded-lg bg-muted p-4 space-y-3 mb-6">
                  <h3 className="font-semibold text-sm">
                    1. Realiza el pago por SINPE Móvil
                  </h3>
                  <div className="text-sm space-y-2">
                    <div className="flex items-center justify-between bg-background px-3 py-2 rounded">
                      <div>
                        <p className="text-xs text-muted-foreground">Número</p>
                        <p className="font-mono font-medium">{sinpePhone}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyToClipboard}
                      >
                        {copied ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="bg-background px-3 py-2 rounded">
                      <p className="text-xs text-muted-foreground">Nombre</p>
                      <p className="font-medium">{sinpeName}</p>
                    </div>
                    <div className="bg-background px-3 py-2 rounded">
                      <p className="text-xs text-muted-foreground">Monto</p>
                      <p className="font-bold text-primary">
                        ₡{total.toLocaleString("es-CR")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Form */}
                <div>
                  <h3 className="font-semibold text-sm mb-4">
                    2. Completa tus datos
                  </h3>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="buyer_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre completo</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Juan Pérez"
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="buyer_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="88888888"
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="buyer_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correo electrónico</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="juan@ejemplo.com"
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sinpe_reference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de referencia SINPE</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="1234567890"
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Procesando..." : "Confirmar orden"}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
