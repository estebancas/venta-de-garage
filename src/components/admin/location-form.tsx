"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

const locationFormSchema = z.object({
  provincia: z.string().min(1, "La provincia es requerida"),
  canton: z.string().min(1, "El cantón es requerido"),
  distrito: z.string().min(1, "El distrito es requerido"),
  codigo_postal: z.string().min(1, "El código postal es requerido"),
  direccion_exacta: z.string().optional(),
  map_link: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Debe ser una URL válida" }
    ),
  coordenadas: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        // Validate format: lat,lng (e.g., 9.9281,-84.0907)
        const regex = /^-?\d+\.?\d*,-?\d+\.?\d*$/;
        return regex.test(val);
      },
      { message: "Formato debe ser: latitud,longitud (ej: 9.9281,-84.0907)" }
    ),
});

type LocationFormValues = z.infer<typeof locationFormSchema>;

interface LocationFormProps {
  initialData?: {
    id?: string;
    provincia?: string;
    canton?: string;
    distrito?: string;
    codigo_postal?: string;
    direccion_exacta?: string;
    map_link?: string;
    coordenadas?: string;
  };
}

export function LocationForm({ initialData }: LocationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      provincia: initialData?.provincia || "",
      canton: initialData?.canton || "",
      distrito: initialData?.distrito || "",
      codigo_postal: initialData?.codigo_postal || "",
      direccion_exacta: initialData?.direccion_exacta || "",
      map_link: initialData?.map_link || "",
      coordenadas: initialData?.coordenadas || "",
    },
  });

  async function onSubmit(values: LocationFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al guardar la ubicación");
      }

      router.push("/admin/location");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Provincia */}
          <FormField
            control={form.control}
            name="provincia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provincia</FormLabel>
                <FormControl>
                  <Input
                    placeholder="San José"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provincia de Costa Rica (ej: San José, Alajuela)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cantón */}
          <FormField
            control={form.control}
            name="canton"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantón</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Central"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Cantón dentro de la provincia</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Distrito */}
          <FormField
            control={form.control}
            name="distrito"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distrito</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Carmen"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Distrito dentro del cantón</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Código Postal */}
          <FormField
            control={form.control}
            name="codigo_postal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código Postal</FormLabel>
                <FormControl>
                  <Input
                    placeholder="10101"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Código postal de 5 dígitos</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Dirección Exacta */}
        <FormField
          control={form.control}
          name="direccion_exacta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección Exacta / Señas (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="100 metros norte de la iglesia, edificio azul..."
                  disabled={isLoading}
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Señas detalladas para facilitar la ubicación
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Link de Mapa */}
          <FormField
            control={form.control}
            name="map_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link de Mapa (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://maps.app.goo.gl/..."
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Link de Google Maps o Waze
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Coordenadas */}
          <FormField
            control={form.control}
            name="coordenadas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coordenadas GPS (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="9.9281,-84.0907"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Formato: latitud,longitud</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Actualizar Ubicación" : "Guardar Ubicación"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
