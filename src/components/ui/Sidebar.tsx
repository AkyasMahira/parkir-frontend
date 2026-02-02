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
  LogOut,
  Menu,
  X,
  ChevronRight,
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

// Komponen Link Menu Modern
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
      "group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
      isActive
        ? "text-white shadow-lg shadow-blue-500/25"
        : "text-gray-600 hover:bg-white/50 hover:text-blue-600",
    )}
  >
    {/* Background Gradient untuk Active State */}
    {isActive && (
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 -z-10" />
    )}

    <item.icon
      className={cn(
        "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
        isActive ? "text-white" : "text-gray-400 group-hover:text-blue-600",
      )}
    />
    <span className="flex-1">{item.label}</span>

    {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
  </Link>
);

interface SidebarProps {
  role: Role;
}

export const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();
  const menuItems = ROLE_MENUS[role] || [];
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Trigger (Floating Button) */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2.5 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/50 md:hidden hover:bg-white transition-colors"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Overlay Gelap Mobile */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden",
          isMobileOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none",
        )}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar Container (Glass Effect) */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-72 flex flex-col transition-transform duration-300 ease-out",
          "bg-white/70 backdrop-blur-xl border-r border-white/50 shadow-2xl md:shadow-none",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Header Logo */}
        <div className="flex items-center justify-between p-6 mb-2">
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              E-Parking
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
              Management System
            </p>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="px-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            Menu Utama
          </div>
          {menuItems.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        {/* Footer Profile Mini */}
        <div className="p-4 mx-4 mb-4 rounded-2xl bg-gradient-to-br from-white/50 to-white/10 border border-white/60 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-sm shadow-inner">
              {role.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 capitalize truncate">
                {role} System
              </p>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <p className="text-xs text-green-600 font-medium">Online</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
