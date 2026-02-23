import { CategoryForm } from "@/components/admin/category-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/admin/categories">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Link>
        </Button>
        <h2 className="text-3xl font-heading font-bold tracking-tight">
          Add New Category
        </h2>
        <p className="text-muted-foreground">
          Create a new product category
        </p>
      </div>

      <div className="max-w-2xl">
        <CategoryForm />
      </div>
    </div>
  );
}
