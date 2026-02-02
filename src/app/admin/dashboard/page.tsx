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
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { formatRupiah, cn } from "@/lib/utils";
import api from "@/lib/axios";

// Variabel styling glassmorphism yang konsisten
const GLASS_STYLE =
  "bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-blue-900/5";

// --- SUB-COMPONENT: STAT CARD ---
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: "blue" | "green" | "purple";
  isLoading: boolean;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  isLoading,
}: StatCardProps) => {
  const iconStyles = {
    blue: "bg-blue-500/10 text-blue-600 border-blue-200/50",
    green: "bg-emerald-500/10 text-emerald-600 border-emerald-200/50",
    purple: "bg-purple-500/10 text-purple-600 border-purple-200/50",
  };

  return (
    <div
      className={cn(
        GLASS_STYLE,
        "p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/80",
      )}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {label}
          </p>
          {isLoading ? (
            <div className="h-9 w-32 bg-slate-200/50 rounded-lg animate-pulse"></div>
          ) : (
            <h3 className="text-3xl font-black text-slate-800 tracking-tight italic">
              {value}
            </h3>
          )}
        </div>
        <div
          className={cn(
            "p-4 rounded-2xl border-2 shadow-inner",
            iconStyles[color],
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {!isLoading && (
        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400">
          <div className="flex -space-x-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-slate-200 border border-white"
              />
            ))}
          </div>
          <span className="uppercase tracking-tighter">
            Live Updates Enabled
          </span>
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
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Selamat Pagi");
    else if (hour < 18) setGreeting("Selamat Siang");
    else setGreeting("Selamat Malam");

    const fetchData = async () => {
      setLoading(true);
      try {
        // Memanggil endpoint tunggal yang kita buat di DashboardController
        const res = await api.get("/admin/dashboard-stats");
        const result = res.data.data;

        setStats({
          pendapatan: result.pendapatan || 0,
          totalTransaksi: result.total_transaksi || 0,
          users: result.total_users || 0,
        });
      } catch (error: any) {
        // Jika masih 404, berarti route di backend belum didaftarkan
        console.error(
          "Gagal load stats:",
          error.response?.status === 404
            ? "Endpoint /admin/dashboard-stats tidak ditemukan!"
            : error.message,
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout requiredRole="admin">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-blue-400/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-purple-400/20 rounded-full blur-[120px]" />
      </div>

      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
              Dashboard Overview
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            {greeting},{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-black">
              Admin!
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl self-start">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">
            System Status: Optimal
          </span>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatCard
          label="Pendapatan"
          value={formatRupiah(stats.pendapatan)}
          icon={Wallet}
          color="green"
          isLoading={loading}
        />
        <StatCard
          label="Total Transaksi"
          value={stats.totalTransaksi}
          icon={Activity}
          color="blue"
          isLoading={loading}
        />
        <StatCard
          label="User Terdaftar"
          value={stats.users}
          icon={Users}
          color="purple"
          isLoading={loading}
        />
      </div>

      {/* QUICK ACTIONS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Card */}
        <div className={cn(GLASS_STYLE, "p-8 rounded-[2rem] group")}>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-800">
              Manajemen User
            </h3>
          </div>
          <p className="text-slate-500 mb-8 leading-relaxed font-medium">
            Atur aksesibilitas tim Anda. Tambahkan petugas parkir baru atau edit
            status keanggotaan dalam satu panel kontrol.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin/users/create" className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-xl">
                <PlusCircle className="w-5 h-5" />
                User Baru
              </button>
            </Link>
            <Link href="/admin/users" className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white/50 text-slate-700 border border-slate-200 rounded-2xl text-sm font-bold hover:bg-white transition-all">
                Direktori
              </button>
            </Link>
          </div>
        </div>

        {/* Config Card */}
        <div className={cn(GLASS_STYLE, "p-8 rounded-[2rem] group")}>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-slate-800 rounded-2xl text-white shadow-lg shadow-slate-200">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-800">Konfigurasi</h3>
          </div>
          <p className="text-slate-500 mb-8 leading-relaxed font-medium">
            Kustomisasi tarif dasar dan alokasi ruang parkir. Pastikan kapasitas
            area sesuai dengan kebutuhan operasional.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin/tarif" className="flex-1">
              <button className="w-full group/btn flex items-center justify-center gap-2 px-6 py-4 bg-white/50 border-2 border-slate-100 text-slate-800 rounded-2xl text-sm font-bold hover:border-blue-200 transition-all">
                Atur Tarif
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/admin/area" className="flex-1">
              <button className="w-full group/btn flex items-center justify-center gap-2 px-6 py-4 bg-white/50 border-2 border-slate-100 text-slate-800 rounded-2xl text-sm font-bold hover:border-blue-200 transition-all">
                Kelola Area
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
