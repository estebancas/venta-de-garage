import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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

// GET active location (public)
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = (await supabase
      .from("store_location" as any)
      .select("*")
      .eq("is_active", true)
      .maybeSingle()) as { data: StoreLocation | null; error: any };

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// POST/PATCH - Create or update location (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      provincia,
      canton,
      distrito,
      codigo_postal,
      direccion_exacta,
      map_link,
      coordenadas,
    } = body;

    // Validate required fields
    if (!provincia || !canton || !distrito || !codigo_postal) {
      return NextResponse.json(
        { error: "Provincia, cantón, distrito y código postal son requeridos" },
        { status: 400 }
      );
    }

    // Use service client to bypass RLS for admin operations
    const serviceSupabase = await createServiceClient();

    // First, check if an active location exists
    const { data: existingLocation } = (await serviceSupabase
      .from("store_location" as any)
      .select("id")
      .eq("is_active", true)
      .maybeSingle()) as { data: { id: string } | null };

    let result;

    if (existingLocation) {
      // Update existing location
      const { data, error } = await serviceSupabase
        .from("store_location" as any)
        .update({
          provincia,
          canton,
          distrito,
          codigo_postal,
          direccion_exacta: direccion_exacta || null,
          map_link: map_link || null,
          coordenadas: coordenadas || null,
        })
        .eq("id", existingLocation.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      result = data;
    } else {
      // Create new location
      const { data, error } = await serviceSupabase
        .from("store_location" as any)
        .insert([
          {
            provincia,
            canton,
            distrito,
            codigo_postal,
            direccion_exacta: direccion_exacta || null,
            map_link: map_link || null,
            coordenadas: coordenadas || null,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      result = data;
    }

    return NextResponse.json(
      { data: result },
      { status: existingLocation ? 200 : 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
