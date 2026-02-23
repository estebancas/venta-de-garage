"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckoutModal } from "@/components/storefront/checkout-modal";

interface BuyButtonProps {
  productId: string;
  productName: string;
}

export function BuyButton({ productId, productName }: BuyButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        size="lg"
        className="w-full text-lg"
        onClick={() => setIsModalOpen(true)}
      >
        Comprar ahora
      </Button>

      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        productName={productName}
      />
    </>
  );
}
