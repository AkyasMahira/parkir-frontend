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
    { label: "Laporan Pendapatan", href: "/owner/laporan", icon: BarChart3 },
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
      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
      isActive
        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
    )}
  >
    <item.icon
      className={cn(
        "w-5 h-5 transition-colors",
        isActive ? "text-white" : "text-gray-400 group-hover:text-blue-600"
      )}
    />
    <span>{item.label}</span>
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
      {/* Mobile Trigger Button (Hanya muncul di layar kecil) */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 bg-white rounded-md shadow-sm border border-gray-200 md:hidden"
        aria-label="Toggle Menu"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Overlay Gelap untuk Mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0",
          // Logika responsive: Hide di mobile kecuali ditoggle
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              E-Parking
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Sistem Manajemen Parkir
            </p>
          </div>
          {/* Close button hanya di mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
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

        {/* Footer / User Profile Section */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs uppercase">
              {role.substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 capitalize truncate">
                {role} System
              </p>
              <p className="text-xs text-gray-500 truncate">Online</p>
            </div>
          </div>

          <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
};
