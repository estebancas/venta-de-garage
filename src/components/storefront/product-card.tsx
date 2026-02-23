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
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={firstImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isSold && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
              Vendido
            </span>
          </div>
        )}
        {isReserved && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center rounded-full bg-gray-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
              Reservado
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-2xl font-bold text-primary">
          ₡{product.price.toLocaleString("es-CR")}
        </p>
      </div>
    </>
  );

  // Sold products are not clickable
  if (isSold) {
    return (
      <div className="group block overflow-hidden rounded-lg border bg-card opacity-75 cursor-not-allowed">
        {CardContent}
      </div>
    );
  }

  // Reserved and active products are clickable
  return (
    <Link
      href={`/producto/${product.id}`}
      className="group block overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
    >
      {CardContent}
    </Link>
  );
}
