import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LocationForm } from "@/components/admin/location-form";
import { MapPin } from "lucide-react";

interface StoreLocation {
  id: string;
  provincia: string;
  canton: string;
  distrito: string;
  codigo_postal: string;
  direccion_exacta: string | null;
  map_link: string | null;
  coordenadas: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default async function LocationPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin");
  }

  // Fetch existing location if any
  const { data: location } = (await supabase
    .from("store_location" as any)
    .select("*")
    .eq("is_active", true)
    .maybeSingle()) as { data: StoreLocation | null };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Ubicación de la Tienda
          </h1>
          <p className="text-muted-foreground">
            Configura la ubicación donde los clientes pueden recoger sus productos
          </p>
        </div>
      </div>

      <div className="max-w-3xl">
        <LocationForm
          initialData={
            location
              ? {
                  id: location.id,
                  provincia: location.provincia,
                  canton: location.canton,
                  distrito: location.distrito,
                  codigo_postal: location.codigo_postal,
                  direccion_exacta: location.direccion_exacta || undefined,
                  map_link: location.map_link || undefined,
                  coordenadas: location.coordenadas || undefined,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
