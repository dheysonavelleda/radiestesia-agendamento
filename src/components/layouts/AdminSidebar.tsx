"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Clock,
  DollarSign,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Agendamentos",
    href: "/admin/appointments",
    icon: Calendar,
  },
  {
    label: "Clientes",
    href: "/admin/clients",
    icon: Users,
  },
  {
    label: "Disponibilidade",
    href: "/admin/availability",
    icon: Clock,
  },
  {
    label: "Financeiro",
    href: "/admin/financeiro",
    icon: DollarSign,
  },
  {
    label: "Configurações",
    href: "/admin/settings",
    icon: Settings,
  },
];

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo / Profile */}
      <div className="flex items-center gap-3 px-4 py-6">
        <Avatar size="lg">
          <AvatarImage src="/joana-photo.jpg" alt="Joana Savi" />
          <AvatarFallback className="bg-teal-600 text-white">
            JS
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            Joana Savi
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Image src="/logo.png" alt="" width={12} height={12} className="rounded-full" />
            Administradora
          </span>
        </div>
      </div>

      <Separator className="mb-2" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/25"
                  : "text-muted-foreground hover:bg-teal-50 hover:text-teal-700"
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator className="mt-2" />

      {/* Logout */}
      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="size-5" />
          Sair
        </Button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile: Sheet trigger */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center border-b bg-white/80 px-4 backdrop-blur-sm lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            <SidebarContent pathname={pathname} />
          </SheetContent>
        </Sheet>
        <span className="ml-3 text-sm font-semibold text-teal-700">
          Radiestesia Terapêutica
        </span>
      </div>

      {/* Desktop: Fixed sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-sidebar lg:block">
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  );
}
