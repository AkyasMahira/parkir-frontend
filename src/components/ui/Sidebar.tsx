"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Wallet,
  MapPin,
  ScrollText,
  History,
  Car,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  Command,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Role = "admin" | "petugas" | "owner";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const ROLE_MENUS: Record<Role, MenuItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Kelola User", href: "/admin/users", icon: Users },
    { label: "Kelola Tarif", href: "/admin/tarif", icon: Wallet },
    { label: "Area Parkir", href: "/admin/area", icon: MapPin },
    { label: "Log Aktivitas", href: "/admin/logs", icon: ScrollText },
  ],
  petugas: [
    { label: "Dashboard", href: "/petugas/dashboard", icon: LayoutDashboard },
    { label: "Transaksi Parkir", href: "/petugas/transaksi", icon: Car },
    { label: "Riwayat Transaksi", href: "/petugas/riwayat", icon: History },
  ],
  owner: [
    { label: "Dashboard", href: "/owner/dashboard", icon: BarChart3 },
    { label: "Laporan Pendapatan", href: "/owner/laporan", icon: Wallet },
  ],
};

const SidebarLink = ({
  item,
  isActive,
}: {
  item: MenuItem;
  isActive: boolean;
}) => (
  <Link
    href={item.href}
    className={cn(
      "group relative flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300",
      isActive
        ? "text-white shadow-lg shadow-[#71C9CE]/30 translate-x-1"
        : "text-gray-500 hover:bg-white/50 hover:text-[#71C9CE]",
    )}
  >
    {isActive && (
      <div className="absolute inset-0 rounded-2xl bg-[#71C9CE] -z-10" />
    )}

    <item.icon
      className={cn(
        "w-5 h-5 transition-transform duration-300",
        isActive ? "text-white" : "opacity-70 group-hover:scale-110",
      )}
    />

    <span className="flex-1">{item.label}</span>

    {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
  </Link>
);

export const Sidebar = ({ role }: { role: Role }) => {
  const pathname = usePathname();
  const menuItems = ROLE_MENUS[role];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-md"
      >
        <Menu className="text-gray-600" />
      </button>

      {/* Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col",
          "bg-white/60 backdrop-blur-2xl border-r border-white/50 p-6 transition-transform duration-500",
          isOpen
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Header + Menu */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-[#71C9CE] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#71C9CE]/30">
              <Command className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <h1 className="text-xl font-black text-slate-800 tracking-tight">
                SiParkir
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Parking System
              </p>
            </div>

            <button onClick={() => setIsOpen(false)} className="md:hidden">
              <X />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <SidebarLink
                key={item.href}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </nav>
        </div>

        {/* Footer */}
        <footer className="pt-6 mt-6 border-t border-white/40 text-center">
          <p className="text-xs font-semibold text-gray-500">
            © {new Date().getFullYear()} SiParkir
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            Parking Management System
          </p>
        </footer>
      </aside>
    </>
  );
};
