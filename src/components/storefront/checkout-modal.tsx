"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const checkoutFormSchema = z.object({
  buyer_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  buyer_phone: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
  buyer_email: z.string().email("Ingrese un correo electrónico válido"),
  sinpe_reference: z.string().min(4, "Ingrese el número de referencia de SINPE"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

export function CheckoutModal({
  isOpen,
  onClose,
  productId,
  productName,
}: CheckoutModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
          product_id: productId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al procesar la orden");
      }

      setIsSuccess(true);
      form.reset();

      // Close modal and refresh after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        router.refresh();
      }, 3000);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al procesar la orden");
    } finally {
      setIsSubmitting(false);
    }
  }

  const sinpePhone = process.env.NEXT_PUBLIC_SINPE_PHONE || "";
  const sinpeName = process.env.NEXT_PUBLIC_SINPE_NAME || "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-heading font-bold mb-2">
              ¡Orden recibida!
            </h3>
            <p className="text-muted-foreground">
              Verificaremos tu pago y te contactaremos pronto.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading">
                Completar compra
              </DialogTitle>
              <DialogDescription>
                {productName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* SINPE Instructions */}
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <h3 className="font-semibold text-sm">
                  1. Realiza el pago por SINPE Móvil
                </h3>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Número:</span> {sinpePhone}
                  </p>
                  <p>
                    <span className="font-medium">Nombre:</span> {sinpeName}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Envía el monto exacto del producto
                </p>
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

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isSubmitting} className="flex-1">
                        {isSubmitting ? "Enviando..." : "Confirmar orden"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
