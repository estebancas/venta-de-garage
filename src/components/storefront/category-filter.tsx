"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <button
        onClick={() => onSelectCategory(null)}
        className={cn(
          "px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ease-out",
          selectedCategory === null
            ? "bg-foreground text-background shadow-lg scale-105"
            : "bg-card hover:bg-accent text-foreground border border-border/50 hover:border-border hover:scale-105"
        )}
      >
        Todos
      </button>
      {categories.map((category, index) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            "px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ease-out opacity-0 animate-fade-in",
            selectedCategory === category.id
              ? "bg-foreground text-background shadow-lg scale-105"
              : "bg-card hover:bg-accent text-foreground border border-border/50 hover:border-border hover:scale-105"
          )}
          style={{
            animationDelay: `${(index + 1) * 60}ms`,
          }}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
