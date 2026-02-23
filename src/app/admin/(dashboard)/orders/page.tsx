import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderActions } from "@/components/admin/order-actions";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";

export default async function OrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, products(name, price, image_urls)")
    .order("created_at", { ascending: false });

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      verified: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    const labels = {
      pending: "Pendiente",
      verified: "Verificado",
      rejected: "Rechazado",
    };
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          styles[status as keyof typeof styles] || ""
        }`}
      >
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/admin/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight">
            Orders
          </h2>
          <p className="text-muted-foreground">
            Manage and verify customer orders
          </p>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>SINPE Ref</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!orders || orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No orders yet
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {format(new Date(order.created_at), "PPp", { locale: es })}
                  </TableCell>
                  <TableCell>
                    {order.products?.name || "Unknown product"}
                  </TableCell>
                  <TableCell>{order.buyer_name}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{order.buyer_phone}</div>
                      <div className="text-muted-foreground">{order.buyer_email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {order.sinpe_reference}
                  </TableCell>
                  <TableCell>
                    ₡{order.products?.price.toLocaleString("es-CR")}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <OrderActions
                      orderId={order.id}
                      productId={order.product_id}
                      currentStatus={order.status}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
