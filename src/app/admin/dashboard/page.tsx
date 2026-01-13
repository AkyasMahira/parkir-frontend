"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import api from "@/lib/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    pendapatan: 0,
    parkir_hari_ini: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Kita panggil beberapa API sekaligus
        const [resUser, resParkir] = await Promise.all([
          api.get("/users"),
          api.get("/parking"),
        ]);

        const totalDuit = resParkir.data.data.reduce(
          (sum: number, item: any) => sum + (item.biaya_total || 0),
          0
        );

        setStats({
          users: resUser.data.data.length,
          pendapatan: totalDuit,
          parkir_hari_ini: resParkir.data.data.length,
        });
      } catch (error) {
        console.error("Gagal load stats", error);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout requiredRole="admin">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-sm font-medium">
            Total User System
          </h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.users}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-sm font-medium">
            Total Pendapatan
          </h3>
          <p className="text-3xl font-bold text-primary mt-2">
            Rp {stats.pendapatan.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-sm font-medium">
            Total Transaksi Parkir
          </h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats.parkir_hari_ini}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
