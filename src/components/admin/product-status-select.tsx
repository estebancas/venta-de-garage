"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductStatusSelectProps {
  productId: string;
  currentStatus: string;
}

const statusLabels = {
  active: "Active",
  reserved: "Reserved",
  sold: "Sold",
};

const statusColors = {
  active: "text-green-600",
  reserved: "text-yellow-600",
  sold: "text-red-600",
};

export function ProductStatusSelect({
  productId,
  currentStatus,
}: ProductStatusSelectProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleStatusChange(newStatus: string) {
    if (newStatus === currentStatus) return;

    setIsUpdating(true);

    try {
      const response = await fetch(`/api/products/${productId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update status");
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update status");
      router.refresh(); // Refresh to reset the select to current status
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Select
      value={currentStatus}
      onValueChange={handleStatusChange}
      disabled={isUpdating}
    >
      <SelectTrigger className={`w-[130px] ${statusColors[currentStatus as keyof typeof statusColors]}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active" className="text-green-600">
          Active
        </SelectItem>
        <SelectItem value="reserved" className="text-yellow-600">
          Reserved
        </SelectItem>
        <SelectItem value="sold" className="text-red-600">
          Sold
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
