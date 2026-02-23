import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST toggle reserve status
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();
    const { reservation_token } = body;

    if (!reservation_token) {
      return NextResponse.json(
        { error: "Reservation token is required" },
        { status: 400 }
      );
    }

    // Get current product status
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("status, reserved_by")
      .eq("id", id)
      .single();

    if (fetchError || !product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Don't allow reserving sold products
    if (product.status === "sold") {
      return NextResponse.json(
        { error: "Cannot reserve a sold product" },
        { status: 400 }
      );
    }

    // If product is reserved, check if this user can unreserve it
    if (product.status === "reserved") {
      if (product.reserved_by !== reservation_token) {
        return NextResponse.json(
          { error: "You can only cancel your own reservations" },
          { status: 403 }
        );
      }

      // Unreserve: set to active and clear reserved_by
      const { error: updateError } = await supabase
        .from("products")
        .update({ status: "active", reserved_by: null })
        .eq("id", id);

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ status: "active" }, { status: 200 });
    }

    // Reserve: set to reserved and save token
    const { error: updateError } = await supabase
      .from("products")
      .update({ status: "reserved", reserved_by: reservation_token })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "reserved" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
