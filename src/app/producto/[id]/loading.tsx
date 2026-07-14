import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { ProductDetailSkeleton } from "@/components/storefront/product-detail-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <>
      <StorefrontHeader />
      <main className="min-h-screen">
        <div className="container py-8 md:py-12">
          <div className="mb-8">
            <Skeleton className="h-10 w-40 rounded-full" />
          </div>
          <ProductDetailSkeleton />
        </div>
      </main>
    </>
  );
}
