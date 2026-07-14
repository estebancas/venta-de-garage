import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <>
      <StorefrontHeader />
      <main className="min-h-screen">
        <div className="container py-12">
          <Skeleton className="h-10 md:h-12 w-64 mb-12 rounded-xl" />
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-3xl" />
              ))}
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 rounded-3xl" />
              <Skeleton className="h-96 rounded-3xl" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
