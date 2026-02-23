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
          <div className="container py-16">
            <div className="max-w-md mx-auto flex flex-col items-center justify-center py-24 text-center opacity-0 animate-fade-in-scale">
              <div className="mb-8 p-6 rounded-full bg-green-50">
                <CheckCircle2 className="h-20 w-20 text-green-500" />
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 tracking-tight">
                ¡Orden recibida!
              </h2>
              <p className="text-lg text-muted-foreground mb-3 leading-relaxed">
                Verificaremos tu pago y te contactaremos pronto.
              </p>
              <p className="text-sm text-muted-foreground font-medium">
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
          <div className="container py-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-12 tracking-tight opacity-0 animate-fade-in">
              Carrito de compras
            </h1>

            <div className="flex flex-col items-center justify-center py-24 text-center opacity-0 animate-fade-in delay-200">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/50 mb-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">
                Tu carrito está vacío
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-md">
                Explora nuestros productos y encuentra algo que te guste
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
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
        <div className="container py-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-12 tracking-tight opacity-0 animate-fade-in">
            Carrito de compras
          </h1>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Cart Items */}
            <div className="space-y-6 opacity-0 animate-fade-in delay-100">
              <h2 className="text-2xl font-heading font-semibold mb-6">
                Productos ({items.length})
              </h2>

              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex gap-5 p-5 border border-border/50 rounded-3xl bg-card hover:shadow-lg transition-all duration-300 opacity-0 animate-fade-in-scale"
                  style={{
                    animationDelay: `${(index + 2) * 80}ms`,
                  }}
                >
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-muted/30 flex-shrink-0">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted/50" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-lg mb-2 leading-snug">{item.name}</h3>
                    <p className="text-2xl font-bold text-foreground tracking-tight">
                      ₡{item.price.toLocaleString("es-CR")}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-red-50 hover:text-red-500 transition-all duration-300"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}

              <div className="border-t border-border/50 pt-6 space-y-4 mt-8">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span>Total:</span>
                  <span className="text-foreground text-3xl tracking-tight">
                    ₡{total.toLocaleString("es-CR")}
                  </span>
                </div>

                {enableReserve && (
                  <>
                    <ReserveInfoAlert />

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full rounded-full border-2 hover:bg-accent transition-all duration-300"
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
            <div className="space-y-8 opacity-0 animate-fade-in delay-200">
              <div>
                <h2 className="text-2xl font-heading font-semibold mb-6">
                  Completar compra
                </h2>

                {/* SINPE Instructions */}
                <div className="rounded-3xl bg-accent/50 p-6 space-y-4 mb-8 border border-border/30">
                  <h3 className="font-semibold text-base">
                    1. Realiza el pago por SINPE Móvil
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-background px-5 py-4 rounded-2xl shadow-sm">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium mb-1">Número</p>
                        <p className="font-mono font-semibold text-lg">{sinpePhone}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyToClipboard}
                        className="rounded-full hover:bg-accent transition-all duration-300"
                      >
                        {copied ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                    <div className="bg-background px-5 py-4 rounded-2xl shadow-sm">
                      <p className="text-xs text-muted-foreground font-medium mb-1">Nombre</p>
                      <p className="font-semibold text-lg">{sinpeName}</p>
                    </div>
                    <div className="bg-background px-5 py-4 rounded-2xl shadow-sm">
                      <p className="text-xs text-muted-foreground font-medium mb-1">Monto</p>
                      <p className="font-bold text-2xl text-foreground tracking-tight">
                        ₡{total.toLocaleString("es-CR")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Form */}
                <div>
                  <h3 className="font-semibold text-base mb-6">
                    2. Completa tus datos
                  </h3>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <FormField
                        control={form.control}
                        name="buyer_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Nombre completo</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Juan Pérez"
                                {...field}
                                disabled={isSubmitting}
                                className="h-12 rounded-xl border-border/50 focus:border-foreground transition-colors"
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
                            <FormLabel className="text-sm font-medium">Teléfono</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="88888888"
                                {...field}
                                disabled={isSubmitting}
                                className="h-12 rounded-xl border-border/50 focus:border-foreground transition-colors"
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
                            <FormLabel className="text-sm font-medium">Correo electrónico</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="juan@ejemplo.com"
                                {...field}
                                disabled={isSubmitting}
                                className="h-12 rounded-xl border-border/50 focus:border-foreground transition-colors"
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
                            <FormLabel className="text-sm font-medium">Número de referencia SINPE</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="1234567890"
                                {...field}
                                disabled={isSubmitting}
                                className="h-12 rounded-xl border-border/50 focus:border-foreground transition-colors"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-14 rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mt-6"
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
