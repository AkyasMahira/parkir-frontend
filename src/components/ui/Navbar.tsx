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
        "sticky top-0 z-30 h-20 transition-all duration-300",
        "md:ml-72", // Memberi margin kiri agar tidak tertutup sidebar di desktop
      )}
    >
      <div className="h-full px-6 flex items-center justify-between bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-sm">
        {/* KIRI: Salam (Disembunyikan di Mobile kecil agar tidak sempit) */}
        <div className="hidden md:block pl-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Dashboard Overview
          </h3>
          <p className="text-gray-800 font-bold text-lg leading-tight truncate">
            Halo, {user?.nama_lengkap?.split(" ")[0] || "Admin"} 👋
          </p>
        </div>
        <div className="md:hidden" /> {/* Spacer mobile */}
        {/* KANAN: Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Tombol Notifikasi */}
          <button className="p-2.5 bg-white/50 hover:bg-white rounded-full text-gray-500 hover:text-blue-600 transition-all shadow-sm border border-white/60">
            <div className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-white/50 hover:bg-white border border-white/60 shadow-sm transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                {getInitials(user?.nama_lengkap)}
              </div>

              <div className="hidden sm:flex flex-col items-start text-left mr-1">
                <span className="text-xs font-bold text-gray-700 capitalize">
                  {user?.role}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Glass Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-60 origin-top-right rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 border border-white/50 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-5 py-4 border-b border-gray-100/50">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user?.nama_lengkap}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">
                    {user?.username}
                  </p>
                </div>

                <div className="p-2">
                  <a
                    href="/profile"
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-blue-50/80 hover:text-blue-600 transition-colors"
                  >
                    <User className="w-4 h-4" /> Profile Saya
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-blue-50/80 hover:text-blue-600 transition-colors"
                  >
                    <Settings className="w-4 h-4" /> Pengaturan
                  </a>
                </div>

                <div className="p-2 border-t border-gray-100/50">
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50/80 transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4" />
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
