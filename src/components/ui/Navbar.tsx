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
// --- TYPES ---
interface UserData {
  id?: number | string;
  nama_lengkap: string;
  role: string;
  email?: string; 
}

interface NavbarProps {
  user: UserData;
  onMenuClick?: () => void;
}

export const Navbar = ({ user, onMenuClick }: NavbarProps) => {
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

  // Mendapatkan inisial nama untuk Avatar
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
        "fixed top-0 right-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all duration-300",
        "left-0 md:left-72"
      )}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* KIRI: Salam Sapaan */}
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Selamat Datang,
            </h3>
            <p className="text-gray-900 font-bold text-lg leading-tight truncate max-w-[150px] sm:max-w-xs">
              {user?.nama_lengkap || "Pengguna"}
            </p>
          </div>
        </div>

        {/* KANAN: Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Tombol Notifikasi */}
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
            >
              {/* Avatar Circle */}
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {getInitials(user?.nama_lengkap)}
              </div>

              {/* User Info & Chevron (Hidden on strict mobile to save space) */}
              <div className="hidden sm:flex flex-col items-start text-left">
                <span className="text-xs font-semibold text-gray-700 capitalize">
                  {user?.role}
                </span>
                <span className="text-[10px] text-gray-500">Kelola Akun</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.nama_lengkap}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role}
                  </p>
                </div>

                <a
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4" /> Profile
                </a>
                <a
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4" /> Settings
                </a>

                <div className="my-1 border-t border-gray-100"></div>

                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  {isLoading ? "Keluar..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
