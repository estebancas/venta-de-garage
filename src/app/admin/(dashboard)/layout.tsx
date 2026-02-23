import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex flex-col sm:flex-row sm:h-16 py-3 sm:py-0 gap-3 sm:gap-0 items-start sm:items-center justify-between">
          <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-6">
            <h1 className="text-lg sm:text-xl font-heading font-bold">
              Venta de Garage
            </h1>
            <div className="sm:hidden">
              <LogoutButton />
            </div>
          </div>

          <AdminNav />

          <div className="hidden sm:flex items-center gap-4">
            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-4 sm:py-6">{children}</main>
    </div>
  );
}
