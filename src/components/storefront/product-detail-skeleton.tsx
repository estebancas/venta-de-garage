import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
      {/* Gallery */}
      <div>
        <Skeleton className="aspect-square w-full rounded-3xl" />
      </div>

      {/* Info */}
      <div className="space-y-8">
        <div>
          <Skeleton className="h-12 md:h-14 w-3/4 mb-4 rounded-xl" />
          <Skeleton className="h-5 w-1/3 rounded-lg" />
        </div>

        <div className="border-t border-b border-border/50 py-6">
          <Skeleton className="h-14 w-1/2 rounded-xl" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-2/3 rounded-lg" />
        </div>

        <div className="pt-4">
          <Skeleton className="h-14 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
