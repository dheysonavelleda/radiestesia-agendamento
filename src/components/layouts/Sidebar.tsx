"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarPlus,
  User,
  Menu,
  LogOut,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
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
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Meus Agendamentos",
    href: "/appointments",
    icon: CalendarCheck,
  },
  {
    label: "Agendar",
    href: "/booking",
    icon: CalendarPlus,
  },
  {
    label: "Perfil",
    href: "/profile",
    icon: User,
  },
];

function ClientSidebarContent({
  pathname,
  userName,
  userImage,
}: {
  pathname: string;
  userName: string;
  userImage?: string | null;
}) {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-full flex-col">
      {/* Profile */}
      <div className="flex items-center gap-3 px-4 py-6">
        <Avatar size="lg">
          {userImage && <AvatarImage src={userImage} alt={userName} />}
          <AvatarFallback className="bg-copper-100 text-copper-700">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            {userName}
          </span>
          <span className="text-xs text-muted-foreground">Cliente</span>
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
                  ? "bg-copper-600 text-white shadow-md shadow-copper-600/25"
                  : "text-muted-foreground hover:bg-copper-50 hover:text-copper-700"
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

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const userName = session?.user?.name || "Usuário";
  const userImage = session?.user?.image;

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
            <ClientSidebarContent
              pathname={pathname}
              userName={userName}
              userImage={userImage}
            />
          </SheetContent>
        </Sheet>
        <span className="ml-3 text-sm font-semibold text-teal-700">
          Radiestesia Terapêutica
        </span>
      </div>

      {/* Desktop: Fixed sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-sidebar lg:block">
        <ClientSidebarContent
          pathname={pathname}
          userName={userName}
          userImage={userImage}
        />
      </aside>
    </>
  );
}
