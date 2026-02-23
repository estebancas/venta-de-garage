"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "garage-sale-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addItem = (item: CartItem) => {
    setItems((current) => {
      // Check if item already in cart
      const exists = current.find((i) => i.id === item.id);
      if (exists) {
        // Item already in cart, don't add duplicate
        return current;
      }
      return [...current, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const itemCount = items.length;

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
