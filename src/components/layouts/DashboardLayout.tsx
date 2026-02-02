"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Loader2 } from "lucide-react";

/* =========================
   1. GLOBAL BACKGROUND (THE GLASS CANVAS)
   Ini ditaruh di sini agar efek backgroundnya 
   konsisten/menyambung di semua halaman.
   ========================= */
const BackgroundDecoration = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-50/50">
    {/* Blob Biru (Kiri Atas) */}
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply opacity-80 animate-blob" />

    {/* Blob Emerald (Kanan Bawah) */}
    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[100px] mix-blend-multiply opacity-80 animate-blob animation-delay-2000" />

    {/* Blob Indigo (Tengah) */}
    <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-[100px] mix-blend-multiply opacity-80 animate-blob animation-delay-4000" />
  </div>
);

/* =========================
   TYPES & INTERFACES
   ========================= */
interface User {
  id: number | string;
  nama_lengkap: string;
  role: "admin" | "petugas" | "owner";
  email?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: User["role"];
}

/* =========================
   MAIN LAYOUT COMPONENT
   ========================= */
export const DashboardLayout = ({
  children,
  requiredRole,
}: DashboardLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // --- AUTH CHECK LOGIC ---
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userDataString = localStorage.getItem("user");

        if (!token || !userDataString) {
          throw new Error("No session found");
        }

        const parsedUser: User = JSON.parse(userDataString);

        // Cek Role Access
        if (requiredRole && parsedUser.role !== requiredRole) {
          const defaultDashboard = `/${parsedUser.role}/dashboard`;
          // Prevent infinite redirect loop
          if (pathname !== defaultDashboard) {
            router.replace(defaultDashboard);
          }
          return;
        }

        setUser(parsedUser);
        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth Error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, requiredRole, pathname]);

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-sm font-medium animate-pulse">Memuat System...</p>
      </div>
    );
  }

  if (!isAuthorized || !user) {
    return null;
  }

  // --- RENDER LAYOUT ---
  return (
    <div className="min-h-screen relative font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Background Layer (Paling Bawah) */}
      <BackgroundDecoration />

      {/* 2. Sidebar (Fixed Position) */}
      <Sidebar role={user.role} />

      {/* 3. Main Wrapper */}
      <div className="flex flex-col min-h-screen">
        {/* Navbar (Sticky Top) */}
        {/* Navbar component sudah menghandle margin-left (md:ml-72) sendiri di kodenya */}
        <Navbar user={user} />

        {/* Content Area */}
        {/* Perlu margin-left (md:ml-72) agar tidak tertutup Sidebar di Desktop */}
        <main className="flex-1 transition-all duration-300 md:ml-72">
          <div className="p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
