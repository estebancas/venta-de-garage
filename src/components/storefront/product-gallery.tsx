"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const displayImages = images.length > 0 ? images : ["/placeholder-product.png"];

  return (
    <div className="space-y-6 sticky top-24">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted/30 shadow-2xl">
        <Image
          key={selectedImage}
          src={displayImages[selectedImage]}
          alt="Product image"
          fill
          className="object-cover transition-opacity duration-500 ease-out"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnail Grid */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-2xl transition-all duration-300 ease-out",
                selectedImage === index
                  ? "ring-2 ring-foreground ring-offset-4 ring-offset-background scale-105 shadow-lg"
                  : "opacity-60 hover:opacity-100 hover:scale-105 shadow-md"
              )}
            >
              <Image
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
