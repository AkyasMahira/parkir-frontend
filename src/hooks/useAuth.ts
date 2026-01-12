import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { LoginResponse } from "@/types/auth";

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      // Kita tetapkan tipe return response axios sesuai interface LoginResponse
      const response = await api.post<LoginResponse>("/login", {
        username,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;

        // Simpan sesi
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect Strategy
        const dashboardRoutes = {
          admin: "/admin/dashboard",
          petugas: "/petugas/transaksi",
          owner: "/owner/laporan",
        };

        router.push(dashboardRoutes[user.role] || "/");
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Terjadi kesalahan pada server.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
