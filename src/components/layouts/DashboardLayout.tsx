"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { User } from "@/types/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "petugas" | "owner";
}

export const DashboardLayout = ({
  children,
  requiredRole,
}: DashboardLayoutProps) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 1. Ambil data dari LocalStorage
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // cek Role
    if (requiredRole && parsedUser.role !== requiredRole) {
      router.back();
    }
  }, [router, requiredRole]);

  if (!mounted || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar role={user.role} />

      {/* Navbar */}
      <Navbar user={user} />

      {/* Main Content Area */}
      <main className="pl-64 pt-16">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};
