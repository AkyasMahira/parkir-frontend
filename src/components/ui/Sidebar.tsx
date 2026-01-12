"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Definisi Menu untuk setiap Role
const menus = {
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: "🏠" },
    { label: "Kelola User", href: "/admin/users", icon: "👥" },
    { label: "Kelola Tarif", href: "/admin/tarif", icon: "💰" },
    { label: "Area Parkir", href: "/admin/area", icon: "Parking" },
    { label: "Log Aktivitas", href: "/admin/logs", icon: "📜" },
  ],
  petugas: [
    { label: "Dashboard", href: "/petugas/dashboard", icon: "🏠" },
    { label: "Transaksi Parkir", href: "/petugas/transaksi", icon: "🚗" },
    { label: "Riwayat Transaksi", href: "/petugas/riwayat", icon: "clock" },
  ],
  owner: [
    { label: "Laporan Pendapatan", href: "/owner/laporan", icon: "chart" },
  ],
};

interface SidebarProps {
  role: "admin" | "petugas" | "owner";
}

export const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();
  const roleMenus = menus[role] || [];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-primary tracking-tight">
          E-Parking
        </h2>
        <p className="text-xs text-gray-500 mt-1">Sistem Parkir Digital</p>
      </div>

      <nav className="p-4 space-y-1">
        {roleMenus.map((menu) => {
          const isActive = pathname === menu.href;
          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/30"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                }
              `}
            >
              <span>{menu.icon}</span>
              {menu.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
