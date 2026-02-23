import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_urls: string[];
    status: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.image_urls[0] || "/placeholder-product.png";
  const isSold = product.status === "sold";
  const isReserved = product.status === "reserved";

  const CardContent = (
    <>
      <div className="relative aspect-[3/4] overflow-hidden bg-muted/30 rounded-2xl">
        <Image
          src={firstImage}
          alt={product.name}
          fill
          className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {isSold && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center rounded-full bg-red-500/90 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-white shadow-xl">
              Vendido
            </span>
          </div>
        )}
        {isReserved && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center rounded-full bg-foreground/80 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-background shadow-xl">
              Reservado
            </span>
          </div>
        )}
      </div>
      <div className="pt-5 px-2">
        <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-2xl font-bold text-foreground tracking-tight">
          ₡{product.price.toLocaleString("es-CR")}
        </p>
      </div>
    </>
  );

  // Sold products are not clickable
  if (isSold) {
    return (
      <div className="group block overflow-visible opacity-60 cursor-not-allowed">
        {CardContent}
      </div>
    );
  }

  // Reserved and active products are clickable
  return (
    <Link
      href={`/producto/${product.id}`}
      className="group block overflow-visible transition-all duration-500 ease-out hover:-translate-y-2"
    >
      {CardContent}
    </Link>
  );
}
