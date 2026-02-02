"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import {
  LogOut,
  Bell,
  ChevronDown,
  User,
  Settings,
  Loader2,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserData {
  id?: number | string;
  nama_lengkap: string;
  role: string;
  username?: string;
}

interface NavbarProps {
  user: UserData;
  onMenuClick?: () => void;
}

export const Navbar = ({ user }: NavbarProps) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "U"
    );
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full transition-all duration-300",
        // Note: Margin kiri (ml-72) dihapus karena DashboardLayout sudah menangani offset sidebar
      )}
    >
      {/* Container Glass Effect */}
      <div className="h-20 px-6 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-sm shadow-[#71C9CE]/5">
        {/* KIRI: Search Bar / Greeting */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <h3 className="text-xs font-bold text-[#71C9CE] uppercase tracking-widest mb-0.5">
              Dashboard Overview
            </h3>
            <p className="text-slate-800 font-black text-lg leading-tight truncate">
              Hi, {user?.nama_lengkap?.split(" ")[0] || "Admin"} 👋
            </p>
          </div>
        </div>

        {/* KANAN: Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Mobile Trigger (Optional) */}
          <button className="md:hidden p-2.5 text-gray-400 hover:text-[#71C9CE] transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* Tombol Notifikasi */}
          <button className="relative p-2.5 bg-white/60 hover:bg-white rounded-xl text-gray-400 hover:text-[#71C9CE] transition-all shadow-sm border border-white/60 group">
            <Bell className="w-5 h-5 group-hover:animate-swing" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                "flex items-center gap-3 p-1.5 pr-3 rounded-full border shadow-sm transition-all duration-300",
                isDropdownOpen
                  ? "bg-white border-[#71C9CE] ring-2 ring-[#71C9CE]/20"
                  : "bg-white/60 hover:bg-white border-white/60",
              )}
            >
              {/* Avatar dengan Gradient Palette */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#71C9CE] to-[#A6E3E9] flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-[#71C9CE]/20">
                {getInitials(user?.nama_lengkap)}
              </div>

              <div className="hidden sm:flex flex-col items-start text-left mr-1">
                <span className="text-xs font-bold text-slate-700 capitalize">
                  {user?.role}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-gray-400 transition-transform duration-300",
                  isDropdownOpen && "rotate-180 text-[#71C9CE]",
                )}
              />
            </button>

            {/* Dropdown Menu Glass */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-4 w-64 origin-top-right rounded-2xl bg-white/90 backdrop-blur-2xl shadow-2xl shadow-[#71C9CE]/10 ring-1 ring-white/60 border border-white/50 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Header User Info */}
                <div className="px-6 py-5 border-b border-gray-100/50 bg-gradient-to-b from-white/50 to-transparent">
                  <p className="text-sm font-black text-slate-800 truncate">
                    {user?.nama_lengkap}
                  </p>
                  <p className="text-xs text-[#71C9CE] font-bold mt-0.5">
                    @{user?.username || user?.role}
                  </p>
                </div>

                <div className="p-2 space-y-1">
                  <a
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 rounded-xl hover:bg-[#E3FDFD] hover:text-[#71C9CE] transition-all group"
                  >
                    <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Profile Saya
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 rounded-xl hover:bg-[#E3FDFD] hover:text-[#71C9CE] transition-all group"
                  >
                    <Settings className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Pengaturan
                  </a>
                </div>

                <div className="p-2 border-t border-gray-100/50">
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all group"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    )}
                    {isLoading ? "Keluar..." : "Logout"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
