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
    const { products, buyer_name, buyer_phone, buyer_email, sinpe_reference } = body;

    // Validate required fields
    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "At least one product is required" },
        { status: 400 }
      );
    }

    if (!buyer_name || !buyer_phone || !buyer_email || !sinpe_reference) {
      return NextResponse.json(
        { error: "All buyer fields are required" },
        { status: 400 }
      );
    }

    // Check if all products exist and are available
    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("id, status")
      .in("id", products);

    if (productError) {
      return NextResponse.json(
        { error: productError.message },
        { status: 500 }
      );
    }

    if (!productData || productData.length !== products.length) {
      return NextResponse.json(
        { error: "One or more products not found" },
        { status: 404 }
      );
    }

    // Check if all products are active
    const unavailableProducts = productData.filter((p) => p.status !== "active");
    if (unavailableProducts.length > 0) {
      return NextResponse.json(
        { error: "One or more products are not available" },
        { status: 400 }
      );
    }

    // Create orders for each product
    const ordersToInsert = products.map((productId) => ({
      product_id: productId,
      buyer_name,
      buyer_phone,
      buyer_email,
      sinpe_reference,
      status: "pending",
    }));

    const { data: orders, error: orderError } = await supabase
      .from("orders")
      .insert(ordersToInsert)
      .select();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // Update all products status to reserved
    const { error: updateError } = await supabase
      .from("products")
      .update({ status: "reserved" })
      .in("id", products);

    if (updateError) {
      // Rollback: delete the orders if product update fails
      const orderIds = orders.map((o) => o.id);
      await supabase.from("orders").delete().in("id", orderIds);
      return NextResponse.json(
        { error: "Failed to reserve products" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: orders }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
