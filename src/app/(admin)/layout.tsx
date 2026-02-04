import AdminSidebar from "@/components/layouts/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      {/* Main content area - offset by sidebar width on desktop, top padding for mobile header */}
      <main className="pt-14 lg:pl-64 lg:pt-0">
        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
