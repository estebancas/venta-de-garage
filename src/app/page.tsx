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

        // Fetch products
        const productsRes = await fetch("/api/products?status=active");
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
        <div className="container py-8">
          {/* Hero Section */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">
              Encuentra tesoros únicos
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Artículos de segunda mano en excelente estado a precios increíbles
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No hay productos disponibles en esta categoría
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
