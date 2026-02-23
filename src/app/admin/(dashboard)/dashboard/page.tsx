import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, Clock } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch dashboard stats
  const [productsResult, ordersResult, activeProductsResult, pendingOrdersResult] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const stats = [
    {
      title: "Total Products",
      value: productsResult.count ?? 0,
      icon: Package,
      description: `${activeProductsResult.count ?? 0} active`,
    },
    {
      title: "Total Orders",
      value: ordersResult.count ?? 0,
      icon: ShoppingCart,
      description: `${pendingOrdersResult.count ?? 0} pending`,
    },
    {
      title: "Revenue",
      value: "₡0",
      icon: DollarSign,
      description: "Coming soon",
    },
    {
      title: "Recent Activity",
      value: "0",
      icon: Clock,
      description: "Last 24 hours",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-heading font-bold tracking-tight">
          Dashboard
        </h2>
        <p className="text-muted-foreground">
          Overview of your garage sale performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/admin/products/new"
              className="block p-3 rounded-md border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Add New Product</div>
              <div className="text-sm text-muted-foreground">
                List a new item for sale
              </div>
            </a>
            <a
              href="/admin/orders"
              className="block p-3 rounded-md border hover:bg-accent transition-colors"
            >
              <div className="font-medium">View Pending Orders</div>
              <div className="text-sm text-muted-foreground">
                Verify SINPE payments
              </div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              No recent activity to display
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
