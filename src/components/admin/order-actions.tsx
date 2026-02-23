"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react";

interface OrderActionsProps {
  orderId: string;
  productId: string;
  currentStatus: string;
}

export function OrderActions({
  orderId,
  productId,
  currentStatus,
}: OrderActionsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  async function updateOrderStatus(newStatus: "verified" | "rejected") {
    if (!confirm(`Are you sure you want to mark this order as ${newStatus}?`)) {
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update order");
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update order");
    } finally {
      setIsUpdating(false);
    }
  }

  if (currentStatus !== "pending") {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isUpdating}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => updateOrderStatus("verified")}>
          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
          Verify Payment
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateOrderStatus("rejected")}>
          <XCircle className="mr-2 h-4 w-4 text-red-600" />
          Reject Order
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
