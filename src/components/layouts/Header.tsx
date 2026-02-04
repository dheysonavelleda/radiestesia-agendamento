"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  User,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/servico", label: "Serviço" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-copper-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="Joana Savi"
            width={40}
            height={40}
            className="rounded-full shadow-sm transition-shadow group-hover:shadow-md"
          />
          <span className="text-lg font-semibold text-teal-800 hidden sm:inline">
            Joana Savi
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-teal-700 bg-teal-50"
                  : "text-gray-600 hover:text-teal-700 hover:bg-teal-50/50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-teal-700 hover:bg-teal-50"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-copper-100">
                    <User className="h-4 w-4 text-copper-600" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">
                    {session.user?.name?.split(" ")[0] || "Menu"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium">{session.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="cursor-pointer">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Painel Admin
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/appointments" className="cursor-pointer">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Meus Agendamentos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/booking" className="hidden md:block">
              <Button className="bg-copper-600 hover:bg-copper-700 text-white shadow-sm">
                Agendar
              </Button>
            </Link>
          )}

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-teal-700">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-12">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "text-teal-700 bg-teal-50"
                        : "text-gray-600 hover:text-teal-700 hover:bg-teal-50/50"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-3 h-px bg-copper-100" />
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-teal-700 hover:bg-teal-50/50"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/appointments"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-teal-700 hover:bg-teal-50/50"
                    >
                      Meus Agendamentos
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-teal-700 hover:bg-teal-50/50"
                    >
                      Perfil
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 rounded-lg text-sm font-medium text-copper-600 hover:bg-copper-50"
                      >
                        Painel Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 text-left"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-teal-700 hover:bg-teal-50/50"
                    >
                      Entrar
                    </Link>
                    <Link href="/booking" onClick={() => setOpen(false)} className="px-4">
                      <Button className="w-full bg-copper-600 hover:bg-copper-700 text-white">
                        Agendar Sessão
                      </Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
