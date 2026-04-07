"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import {
  Users,
  Wallet,
  Activity,
  Plus,
  Settings,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";
import { formatRupiah, cn } from "@/lib/utils";
import api from "@/lib/axios";

// Style Constants
const GLASS_CARD =
  "bg-white/60 backdrop-blur-xl border border-white/80 shadow-xl shadow-[#71C9CE]/5 rounded-[2rem]";

// --- COMPONENT: STAT WIDGET ---
const StatWidget = ({
  label,
  value,
  subValue,
  icon: Icon,
  loading,
}: {
  label: string;
  value: string | number;
  subValue?: string;
  icon: any;
  loading: boolean;
}) => (
  <div className={cn(GLASS_CARD, "p-6 relative overflow-hidden group")}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-[#E3FDFD] rounded-2xl text-[#71C9CE] group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6" />
      </div>
      <button className="text-gray-400 hover:text-[#71C9CE]">
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>

    <div className="space-y-1">
      <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">
        {label}
      </h3>
      {loading ? (
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
      ) : (
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 wrap-break-word">
          {typeof value === "number" ? value.toLocaleString("id-ID") : value}
        </h2>
      )}
    </div>

    {/* Progress Bar Visual Decoration */}
    <div className="mt-6">
      <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
        <span>GROWTH</span>
        <span>{subValue || "Stabil"}</span>
      </div>
      <div className="h-1.5 w-full bg-[#E3FDFD] rounded-full overflow-hidden">
        <div className="h-full bg-[#71C9CE] w-[70%] rounded-full shadow-[0_0_10px_#71C9CE]" />
      </div>
    </div>
  </div>
);

// --- MAIN PAGE ---
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    pendapatan: 0,
    totalTransaksi: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/dashboard-stats");
        setStats({
          pendapatan: res.data.data?.pendapatan || 0,
          totalTransaksi: res.data.data?.total_transaksi || 0,
          users: res.data.data?.total_users || 0,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout requiredRole="admin">
      {/* HEADER SECTION */}
      <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-1">
            Dashboard
          </h1>
          <p className="text-gray-500 font-medium text-sm md:text-base">
            Welcome back, Admin 👋
          </p>
        </div>

        {/* Status Badge (Hidden on very small screens if needed, kept for now) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="px-4 py-2 bg-white/50 rounded-full border border-white shadow-sm text-xs font-bold text-[#71C9CE]">
            Daily Report Available
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 h-full">
        {/* LEFT COLUMN (2/3 Width on Desktop) */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Main Hero Card */}
          <div
            className={cn(
              GLASS_CARD,
              "p-6 md:p-10 relative overflow-hidden bg-linear-to-br from-white/80 to-[#E3FDFD]/50",
            )}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
              <div className="space-y-4 max-w-md w-full text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-[#71C9CE] font-bold text-xs uppercase tracking-widest">
                  <Activity className="w-4 h-4" /> System Overview
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-slate-800 leading-tight">
                  Pantau Transaksi <br className="hidden md:block" />{" "}
                  <span className="text-[#71C9CE]">Real-Time</span>
                </h2>
                <p className="text-gray-500 font-medium text-sm md:text-base">
                  Kelola tarif parkir, monitor pendapatan, dan manajemen user
                  dalam satu panel terintegrasi.
                </p>
                <div className="pt-2">
                  <Link href="/admin/logs" className="block md:inline-block">
                    <button className="w-full md:w-auto px-8 py-3 bg-[#71C9CE] hover:bg-[#5dbbc0] text-white rounded-xl font-bold shadow-lg shadow-[#71C9CE]/30 transition-all">
                      Lihat Log Aktivitas
                    </button>
                  </Link>
                </div>
              </div>

              {/* Abstract 3D Shapes (Wallet Icon) - HIDDEN ON MOBILE */}
              <div className="hidden md:flex w-32 h-32 md:w-48 md:h-48 bg-linear-to-tr from-[#71C9CE] to-[#A6E3E9] rounded-4xl shadow-2xl rotate-12 items-center justify-center shrink-0">
                <Wallet className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          {/* Stats Grid (Pendapatan & Transaksi) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <StatWidget
              label="Total Pendapatan"
              value={formatRupiah(stats.pendapatan)}
              subValue="+12% from last week"
              icon={Wallet} // Icon kecil di dalam widget tetap ada
              loading={loading}
            />
            <StatWidget
              label="Total Transaksi"
              value={stats.totalTransaksi}
              subValue="Kendaraan Masuk/Keluar"
              icon={TrendingUp}
              loading={loading}
            />
          </div>
        </div>

        {/* RIGHT COLUMN (1/3 Width on Desktop) */}
        <div className="space-y-6">
          {/* Profile / User Card */}
          <div className={cn(GLASS_CARD, "p-6 md:p-8 text-center")}>
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-linear-to-br from-[#71C9CE] to-[#A6E3E9] rounded-full p-1 shadow-lg mb-4">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-[#71C9CE]" />
              </div>
            </div>

            {loading ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mx-auto mb-1" />
            ) : (
              <h3 className="text-xl font-black text-slate-800">
                {stats.users} Users
              </h3>
            )}

            <p className="text-gray-400 text-sm font-medium mb-6">
              Registered Officers
            </p>

            <Link href="/admin/users/create">
              <button className="w-full py-3 rounded-xl border-2 border-[#71C9CE] text-[#71C9CE] font-bold hover:bg-[#71C9CE] hover:text-white transition-all flex items-center justify-center gap-2 text-sm">
                <Plus className="w-4 h-4" /> Add New User
              </button>
            </Link>
          </div>

          {/* Quick Config Card */}
          <div className={cn(GLASS_CARD, "p-6 bg-[#71C9CE] text-white")}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-lg">Konfigurasi</h3>
            </div>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              Sesuaikan tarif per jam dan kapasitas area parkir.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/admin/tarif"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-3 rounded-xl text-center text-xs font-bold transition-colors"
              >
                Tarif Parkir
              </Link>
              <Link
                href="/admin/area"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-3 rounded-xl text-center text-xs font-bold transition-colors"
              >
                Area Parkir
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
