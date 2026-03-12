"use client";

import { useState, useEffect } from "react";
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
import { toast } from "@/lib/toast-utils";
import { getReservationToken } from "@/lib/reservation-token";
import { loadUserInfo, saveUserInfo } from "@/lib/user-storage";
import { Loader2 } from "lucide-react";

const reserveFormSchema = z.object({
  buyer_name: z.string().min(1, "El nombre es requerido"),
  buyer_phone: z.string().min(1, "El teléfono es requerido"),
  buyer_email: z.string().email("Email inválido"),
});

type ReserveFormValues = z.infer<typeof reserveFormSchema>;

interface ReserveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  onSuccess?: () => void;
}

export function ReserveModal({
  open,
  onOpenChange,
  productId,
  productName,
  onSuccess,
}: ReserveModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReserveFormValues>({
    resolver: zodResolver(reserveFormSchema),
    defaultValues: {
      buyer_name: "",
      buyer_phone: "",
      buyer_email: "",
    },
  });

  // Load saved user info when modal opens
  useEffect(() => {
    if (open) {
      const savedInfo = loadUserInfo();
      if (savedInfo) {
        form.reset(savedInfo);
      }
    }
  }, [open, form]);

  async function onSubmit(values: ReserveFormValues) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          buyer_name: values.buyer_name,
          buyer_phone: values.buyer_phone,
          buyer_email: values.buyer_email,
          order_type: "reservation",
          reservation_token: getReservationToken(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Error al crear la reserva");
        return;
      }

      // Save user info for future use
      saveUserInfo(values);

      toast.success(`¡Reserva confirmada para "${productName}"!`);
      onOpenChange(false);
      form.reset();

      // Refresh the page to show updated product status
      router.refresh();

      // Call success callback if provided
      onSuccess?.();
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast.error("Error al procesar la reserva");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] gap-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-semibold">
            Reservar Producto
          </DialogTitle>
          <DialogDescription className="text-base">
            Completa tus datos para reservar <strong>{productName}</strong>. Te
            contactaremos pronto para coordinar la entrega.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                      className="h-11"
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
                      placeholder="8888-8888"
                      {...field}
                      disabled={isSubmitting}
                      className="h-11"
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="juan@ejemplo.com"
                      {...field}
                      disabled={isSubmitting}
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="flex-1 h-11"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-11"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Confirmar Reserva"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
