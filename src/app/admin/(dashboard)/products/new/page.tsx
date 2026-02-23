import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewProductPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

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
          Add New Product
        </h2>
        <p className="text-muted-foreground">
          Create a new product listing for your garage sale
        </p>
      </div>

      <div className="max-w-2xl">
        <ProductForm categories={categories || []} />
      </div>
    </div>
  );
}
