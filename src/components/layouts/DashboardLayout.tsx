"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";

interface User {
  id: number | string;
  nama_lengkap: string;
  role: "admin" | "petugas" | "owner";
}

const BackgroundDecoration = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#E3FDFD]">
    <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#CBF1F5] rounded-full blur-[120px] opacity-60 mix-blend-multiply" />
    <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#71C9CE] rounded-full blur-[140px] opacity-20 mix-blend-multiply" />
    <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-[#A6E3E9] rounded-full blur-[100px] opacity-40 mix-blend-multiply" />
  </div>
);

export const DashboardLayout = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: User["role"];
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        router.replace("/login");
        return;
      }

      const parsedUser: User = JSON.parse(userData);

      if (requiredRole && parsedUser.role !== requiredRole) {
        const redirectPath = `/${parsedUser.role}/dashboard`;

        if (pathname !== redirectPath) {
          router.replace(redirectPath);
        }
        return;
      }

      setUser(parsedUser);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router, pathname, requiredRole]);

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen relative font-sans text-slate-800">
      <BackgroundDecoration />

      <Sidebar role={user.role} />

      <div className="flex min-h-screen flex-col md:ml-[280px]">
        <Navbar user={user} />
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
};
