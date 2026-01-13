"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar"; 
import { Navbar } from "@/components/ui/Navbar"; 
import { Loader2, AlertTriangle } from "lucide-react";

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

        if (requiredRole && parsedUser.role !== requiredRole) {
          const defaultDashboard = `/${parsedUser.role}/dashboard`;

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
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-sm font-medium">Memuat Dashboard...</p>
      </div>
    );
  }

  if (!isAuthorized || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">

      <Sidebar role={user.role} />

      <Navbar user={user} />

      <main className="pt-16 transition-all duration-300 md:ml-72">
        {/* Container Konten */}
        <div className="p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};
