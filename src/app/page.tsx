"use client";

import { useState, useEffect } from "react";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { CategoryFilter } from "@/components/storefront/category-filter";
import { ProductCard } from "@/components/storefront/product-card";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  status: string;
  category_id: string | null;
  image_urls: string[];
  created_at: string;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch categories
        const categoriesRes = await fetch("/api/categories");
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.data || []);

        // Fetch all products (including sold and reserved)
        const productsRes = await fetch("/api/products");
        const productsData = await productsRes.json();
        setProducts(productsData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  return (
    <>
      <StorefrontHeader />
      <main className="min-h-screen">
        <div className="container py-12 md:py-16">
          {/* Hero Section */}
          <div className="mb-16 text-center opacity-0 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 tracking-tight leading-[1.1]">
              Encuentra tesoros únicos
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              Artículos de segunda mano en excelente estado a precios increíbles
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-12 opacity-0 animate-fade-in delay-200">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-muted/50 animate-pulse rounded-2xl"
                  style={{
                    animationDelay: `${i * 50}ms`,
                  }}
                />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24 opacity-0 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <svg
                  className="w-10 h-10 text-muted-foreground"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-3">
                No hay productos disponibles
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Vuelve pronto para descubrir nuevos artículos en esta categoría
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="opacity-0 animate-fade-in-scale"
                  style={{
                    animationDelay: `${(index % 8) * 80}ms`,
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
