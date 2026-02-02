"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import {
  Users,
  Wallet,
  Activity,
  ArrowRight,
  Plus,
  Settings,
  TrendingUp,
  CreditCard,
  MoreHorizontal,
} from "lucide-react";
import { formatRupiah, cn } from "@/lib/utils";
import api from "@/lib/axios";

const GLASS_CARD =
  "bg-white/60 backdrop-blur-xl border border-white/80 shadow-xl shadow-[#71C9CE]/5 rounded-[2rem]";

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
        <h2 className="text-3xl font-black text-slate-800">{value}</h2>
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

const ActionCard = ({ title, desc, href, btnText, colorClass }: any) => (
  <div
    className={cn(
      GLASS_CARD,
      "p-8 flex flex-col justify-between h-full relative overflow-hidden",
    )}
  >
    {/* Decorative Blob */}
    <div
      className={cn(
        "absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-30",
        colorClass,
      )}
    />

    <div className="relative z-10">
      <h3 className="text-xl font-black text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
        {desc}
      </p>
    </div>

    <Link href={href} className="relative z-10">
      <button className="w-full py-4 rounded-2xl bg-slate-800 text-white font-bold text-sm shadow-lg hover:shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2 group">
        {btnText}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </Link>
  </div>
);

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
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-1">
            Dashboard
          </h1>
          <p className="text-gray-500 font-medium">Welcome back, Admin 👋</p>
        </div>

        {/* Search Bar Visual (Non-functional, for layout match) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="px-4 py-2 bg-white/50 rounded-full border border-white shadow-sm text-xs font-bold text-[#71C9CE]">
            Daily Report Available
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        {/* LEFT COLUMN (2/3 Width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Hero Card (Mirip "Next Game") */}
          <div
            className={cn(
              GLASS_CARD,
              "p-8 md:p-10 relative overflow-hidden bg-gradient-to-br from-white/80 to-[#E3FDFD]/50",
            )}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
              <div className="space-y-4 max-w-md">
                <div className="flex items-center gap-2 text-[#71C9CE] font-bold text-xs uppercase tracking-widest">
                  <Activity className="w-4 h-4" /> System Overview
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight">
                  Pantau Transaksi <br />{" "}
                  <span className="text-[#71C9CE]">Real-Time</span>
                </h2>
                <p className="text-gray-500 font-medium">
                  Kelola tarif parkir, monitor pendapatan, dan manajemen user
                  dalam satu panel terintegrasi.
                </p>
                <Link href="/admin/logs">
                  <button className="mt-2 px-8 py-3 bg-[#71C9CE] hover:bg-[#5dbbc0] text-white rounded-xl font-bold shadow-lg shadow-[#71C9CE]/30 transition-all">
                    Lihat Log Aktivitas
                  </button>
                </Link>
              </div>
              {/* Abstract 3D Shapes (CSS) */}
              <div className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-tr from-[#71C9CE] to-[#A6E3E9] rounded-[2rem] shadow-2xl rotate-12 flex items-center justify-center">
                <Wallet className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatWidget
              label="Total Pendapatan"
              value={formatRupiah(stats.pendapatan)}
              subValue="+12% from last week"
              icon={Wallet}
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

        {/* RIGHT COLUMN (1/3 Width) */}
        <div className="space-y-6">
          {/* Profile / User Card */}
          <div className={cn(GLASS_CARD, "p-8 text-center")}>
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#71C9CE] to-[#A6E3E9] rounded-full p-1 shadow-lg mb-4">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-[#71C9CE]" />
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-800">
              {stats.users} Users
            </h3>
            <p className="text-gray-400 text-sm font-medium mb-6">
              Registered Officers
            </p>

            <Link href="/admin/users/create">
              <button className="w-full py-3 rounded-xl border-2 border-[#71C9CE] text-[#71C9CE] font-bold hover:bg-[#71C9CE] hover:text-white transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add New User
              </button>
            </Link>
          </div>

          {/* Quick Config */}
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
