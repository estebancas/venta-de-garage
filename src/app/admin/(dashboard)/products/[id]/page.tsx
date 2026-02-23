import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [productsResult, categoriesResult] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("categories").select("id, name").order("name", { ascending: true }),
  ]);

  if (productsResult.error || !productsResult.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
        <h2 className="text-3xl font-heading font-bold tracking-tight">
          Edit Product
        </h2>
        <p className="text-muted-foreground">
          Update product information
        </p>
      </div>

      <div className="max-w-2xl">
        <ProductForm
          initialData={productsResult.data}
          categories={categoriesResult.data || []}
        />
      </div>
    </div>
  );
}
