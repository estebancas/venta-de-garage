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

  return (
    <Link
      href={`/producto/${product.id}`}
      className="group block overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={firstImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {(isSold || isReserved) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
              {isSold ? "Vendido" : "Reservado"}
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
    </Link>
  );
}
