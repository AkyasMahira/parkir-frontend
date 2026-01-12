"use client";

import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export const Navbar = ({ user }: { user: any }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Request ke Backend untuk hapus token
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      // Hapus sesi di Frontend
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect ke Login
      router.push("/login");
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-8">
      <div>
        <h3 className="text-gray-800 font-medium">
          Halo,{" "}
          <span className="text-primary font-bold">{user?.nama_lengkap}</span>
        </h3>
        <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-0.5 rounded-full">
          {user?.role}
        </span>
      </div>

      <button
        onClick={handleLogout}
        className="text-sm text-red-600 hover:text-red-700 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
      >
        Logout
      </button>
    </header>
  );
};
