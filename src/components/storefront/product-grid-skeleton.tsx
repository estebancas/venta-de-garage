import { Skeleton } from "@/components/ui/skeleton";

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <Skeleton
          key={i}
          className="aspect-[3/4] rounded-2xl"
          style={{ animationDelay: `${i * 50}ms` }}
        />
      ))}
    </div>
  );
}
