import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST bulk reserve products
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { product_ids, reservation_token } = body;

    if (!product_ids || !Array.isArray(product_ids) || product_ids.length === 0) {
      return NextResponse.json(
        { error: "At least one product ID is required" },
        { status: 400 }
      );
    }

    if (!reservation_token) {
      return NextResponse.json(
        { error: "Reservation token is required" },
        { status: 400 }
      );
    }

    // Get current products status
    const { data: products, error: fetchError } = await supabase
      .from("products")
      .select("id, status")
      .in("id", product_ids);

    if (fetchError || !products) {
      return NextResponse.json(
        { error: "Products not found" },
        { status: 404 }
      );
    }

    // Check if any products are sold
    const soldProducts = products.filter((p) => p.status === "sold");
    if (soldProducts.length > 0) {
      return NextResponse.json(
        { error: "Cannot reserve sold products" },
        { status: 400 }
      );
    }

    // Reserve all active products with the reservation token
    const { error: updateError } = await supabase
      .from("products")
      .update({ status: "reserved", reserved_by: reservation_token })
      .in("id", product_ids)
      .eq("status", "active");

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
