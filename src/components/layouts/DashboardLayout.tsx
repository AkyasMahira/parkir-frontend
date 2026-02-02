"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { Loader2 } from "lucide-react";

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

export const DashboardLayout = ({
  children,
  requiredRole,
}: DashboardLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

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

  return (
    <div className="min-h-screen relative font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Background Layer (Paling Bawah) */}
      <BackgroundDecoration />

      {/* 2. Sidebar (Fixed Position) */}
      <Sidebar role={user.role} />

      {/* 3. Main Wrapper */}
      <div className="flex flex-col min-h-screen">
        {/* Navbar (Sticky Top) */}
        <Navbar user={user} />

        {/* Content Area */}
        <main className="flex-1 transition-all duration-300 md:ml-72">
          <div className="p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
