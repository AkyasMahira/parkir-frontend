"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import {
  Users,
  Wallet,
  Activity,
  ArrowRight,
  PlusCircle,
  Settings,
  TrendingUp,
} from "lucide-react";
import { formatRupiah, cn } from "@/lib/utils";
import api from "@/lib/axios";

// --- SUB-COMPONENT: STAT CARD ---
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: "blue" | "green" | "purple";
  isLoading: boolean;
  trend?: string; // Opsional: misal "+5% dari kemarin"
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  isLoading,
  trend,
}: StatCardProps) => {
  const styles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          {isLoading ? (
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
              {value}
            </h3>
          )}
        </div>
        <div className={cn("p-3 rounded-xl border", styles[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* Optional Trend Indicator */}
      {!isLoading && (
        <div className="mt-4 flex items-center gap-1 text-xs font-medium text-gray-400">
          <TrendingUp className="w-3 h-3 text-green-500" />
          <span className="text-green-600">Update Realtime</span>
          <span>• Data Keseluruhan</span>
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    pendapatan: 0,
    totalTransaksi: 0,
  });
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // 1. Set Greeting Time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Selamat Pagi");
    else if (hour < 18) setGreeting("Selamat Siang");
    else setGreeting("Selamat Malam");

    // 2. Fetch Data
    const fetchData = async () => {
      try {
        const [resUser, resParkir] = await Promise.all([
          api.get("/users"),
          api.get("/parking?limit=10000"), // Pastikan ambil banyak data untuk kalkulasi total
        ]);

        // Handle array structure data
        const parkingData = Array.isArray(resParkir.data.data)
          ? resParkir.data.data
          : resParkir.data;
        const usersData = Array.isArray(resUser.data.data)
          ? resUser.data.data
          : resUser.data;

        // Hitung Total Pendapatan (Client Side Calculation)
        // Note: Idealnya ini dilakukan di backend (SELECT SUM(biaya) FROM transactions) agar ringan.
        const totalDuit = parkingData.reduce(
          (sum: number, item: any) => sum + (Number(item.biaya_total) || 0),
          0
        );

        setStats({
          users: usersData.length,
          pendapatan: totalDuit,
          totalTransaksi: parkingData.length,
        });
      } catch (error) {
        console.error("Gagal load stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout requiredRole="admin">
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}, Admin! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Berikut adalah ringkasan kinerja sistem parkir hari ini.
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          label="Total Pendapatan"
          value={formatRupiah(stats.pendapatan)}
          icon={Wallet}
          color="green"
          isLoading={loading}
        />
        <StatCard
          label="Total Transaksi"
          value={`${stats.totalTransaksi} Kendaraan`}
          icon={Activity}
          color="blue"
          isLoading={loading}
        />
        <StatCard
          label="Total Pengguna"
          value={`${stats.users} User`}
          icon={Users}
          color="purple"
          isLoading={loading}
        />
      </div>

      {/* QUICK ACTIONS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Action Card: User Management */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-800">Manajemen User</h3>
          </div>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Kelola akun petugas parkir, admin lain, atau member. Anda dapat
            menambah, mengedit, atau menonaktifkan akun.
          </p>
          <div className="flex gap-3">
            <Link href="/admin/users/create" className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                <PlusCircle className="w-4 h-4" />
                Tambah User
              </button>
            </Link>
            <Link href="/admin/users" className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Lihat Semua
              </button>
            </Link>
          </div>
        </div>

        {/* Action Card: System Config */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
              <Settings className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-800">Konfigurasi Sistem</h3>
          </div>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Atur tarif parkir per jam untuk setiap jenis kendaraan dan kelola
            kapasitas area parkir (lantai/blok).
          </p>
          <div className="flex gap-3">
            <Link href="/admin/tarif" className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors group">
                Atur Tarif
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
              </button>
            </Link>
            <Link href="/admin/area" className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors group">
                Kelola Area
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
