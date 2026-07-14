import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { ProductGridSkeleton } from "@/components/storefront/product-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <>
      <StorefrontHeader />
      <main className="min-h-screen">
        <div className="container py-12 md:py-16">
          <div className="mb-16 flex flex-col items-center gap-4">
            <Skeleton className="h-12 md:h-16 w-2/3 max-w-xl rounded-xl" />
            <Skeleton className="h-6 w-1/2 max-w-md rounded-lg" />
          </div>
          <div className="mb-12 flex justify-center gap-3">
            <Skeleton className="h-11 w-24 rounded-full" />
            <Skeleton className="h-11 w-28 rounded-full" />
            <Skeleton className="h-11 w-24 rounded-full" />
          </div>
          <ProductGridSkeleton />
        </div>
      </main>
    </>
  );
}
