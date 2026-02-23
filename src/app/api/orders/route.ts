import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET all orders (admin only)
export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*, products(name, price, image_urls)")
      .order("created_at", { ascending: false });

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

// POST new order (public)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { product_id, buyer_name, buyer_phone, buyer_email, sinpe_reference } = body;

    if (!product_id || !buyer_name || !buyer_phone || !buyer_email || !sinpe_reference) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if product exists and is available
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, status")
      .eq("id", product_id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.status !== "active") {
      return NextResponse.json(
        { error: "Product is not available" },
        { status: 400 }
      );
    }

    // Create order and update product status in a transaction
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          product_id,
          buyer_name,
          buyer_phone,
          buyer_email,
          sinpe_reference,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // Update product status to reserved
    const { error: updateError } = await supabase
      .from("products")
      .update({ status: "reserved" })
      .eq("id", product_id);

    if (updateError) {
      // Rollback: delete the order if product update fails
      await supabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { error: "Failed to reserve product" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
