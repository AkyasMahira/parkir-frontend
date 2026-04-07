"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { formatRupiah, cn } from "@/lib/utils";
import api from "@/lib/axios";
import {
  TrendingUp,
  DollarSign,
  Car,
  CalendarDays,
  Wallet,
  ArrowUpRight,
  MapPin,
  Bike,
  LayoutGrid,
} from "lucide-react";

// --- INTERFACES ---
interface AreaStat {
  nama_area: string;
  kapasitas: number;
  terisi: number;
  persentase: number;
}

interface Stats {
  hari_ini: { total: number; pendapatan: number };
  bulan_ini: { total: number; pendapatan: number };
  kendaraan_parkir: number;
  area_stats: AreaStat[];
  jenis_stats: { mobil: number; motor: number };
}

// --- STYLE CONSTANTS ---
const GLASS_CARD =
  "bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-[#71C9CE]/5 rounded-[2rem] overflow-hidden";

// --- COMPONENT: STAT CARD ---
const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  theme = "default",
  delay = 0,
}: any) => {
  const isHighlight = theme === "highlight";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-4xl p-6 shadow-xl transition-all duration-500 hover:-translate-y-1 group",
        isHighlight
          ? "bg-linear-to-br from-[#71C9CE] to-[#4AA3A8] text-white"
          : "bg-white/60 backdrop-blur-xl border border-white/50 text-slate-800",
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background Decor */}
      {isHighlight && (
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
      )}

      <div className="flex justify-between items-start relative z-10">
        <div>
          <p
            className={cn(
              "text-xs font-bold uppercase tracking-widest mb-2",
              isHighlight ? "text-white/80" : "text-gray-400",
            )}
          >
            {title}
          </p>
          <h3 className="text-3xl font-black tracking-tight mb-2">{value}</h3>
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium",
              isHighlight ? "text-white/90" : "text-gray-500",
            )}
          >
            {isHighlight && <ArrowUpRight className="w-3.5 h-3.5" />}
            <span>{subtitle}</span>
          </div>
        </div>

        <div
          className={cn(
            "p-3.5 rounded-2xl shadow-sm transition-transform group-hover:scale-110",
            isHighlight
              ? "bg-white/20 text-white backdrop-blur-md"
              : "bg-white text-[#71C9CE]",
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: AREA PROGRESS ---
const AreaProgress = ({ area }: { area: AreaStat }) => {
  // Warna dinamis berdasarkan okupansi
  let colorClass = "bg-[#71C9CE]"; 
  let textClass = "text-[#71C9CE]";

  if (area.persentase > 85) {
    colorClass = "bg-red-500";
    textClass = "text-red-500";
  } else if (area.persentase > 60) {
    colorClass = "bg-amber-400";
    textClass = "text-amber-500";
  }

  return (
    <div className="mb-5 last:mb-0 group">
      <div className="flex justify-between items-end mb-2">
        <div>
          <span className="text-sm font-bold text-slate-700 block mb-0.5 group-hover:text-[#71C9CE] transition-colors">
            {area.nama_area}
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide bg-slate-100 px-1.5 py-0.5 rounded">
            Max: {area.kapasitas} Unit
          </span>
        </div>
        <div className="text-right">
          <span className={cn("text-lg font-black", textClass)}>
            {area.terisi}
          </span>
          <span className="text-xs font-medium text-gray-400">
            {" "}
            / {area.kapasitas}
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/50">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out shadow-sm relative",
            colorClass,
          )}
          style={{ width: `${area.persentase}%` }}
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

export default function OwnerDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    setCurrentDate(new Date().toLocaleDateString("id-ID", dateOptions));

    const fetchStats = async () => {
      try {
        const res = await api.get("/owner/dashboard");
        setStats(res.data.data);
      } catch (err) {
        console.error("Gagal load dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout requiredRole="owner">
        <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-gray-400 animate-pulse">
          <div className="w-12 h-12 border-4 border-[#71C9CE] border-t-transparent rounded-full animate-spin" />
          <p className="font-medium text-sm">Menyiapkan Laporan...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="owner">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 relative z-10">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            Dashboard{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#71C9CE] to-[#4AA3A8]">
              Owner
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-2 bg-white/50 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/50">
            <CalendarDays className="w-4 h-4 text-[#71C9CE]" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              {currentDate}
            </p>
          </div>
        </div>
      </div>

      {/* 1. KEY METRICS (REVENUE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
        <StatCard
          title="Pendapatan Bulan Ini"
          value={formatRupiah(stats?.bulan_ini?.pendapatan || 0)}
          subtitle={`${stats?.bulan_ini?.total || 0} Total Transaksi`}
          icon={Wallet}
          theme="highlight" // Teal Gradient
          delay={100}
        />
        <StatCard
          title="Pendapatan Hari Ini"
          value={formatRupiah(stats?.hari_ini?.pendapatan || 0)}
          subtitle={`${stats?.hari_ini?.total || 0} Transaksi Selesai`}
          icon={DollarSign}
          delay={200}
        />
        <StatCard
          title="Kendaraan Aktif"
          value={stats?.kendaraan_parkir || 0}
          subtitle="Sedang Parkir Sekarang"
          icon={Car}
          delay={300}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 items-stretch">
        {/* 2. LIVE AREA MONITORING (Left - 2 Cols) */}
        <div className="lg:col-span-2">
          <div className={cn(GLASS_CARD, "p-8 h-full bg-white/60")}>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-[#E3FDFD] rounded-2xl text-[#71C9CE] shadow-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-xl">
                  Okupansi Area
                </h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  Real-time Capacity Monitor
                </p>
              </div>
            </div>

            <div className="space-y-6 pr-2 custom-scrollbar overflow-y-auto max-h-87.5">
              {stats?.area_stats && stats.area_stats.length > 0 ? (
                stats.area_stats.map((area, idx) => (
                  <AreaProgress key={idx} area={area} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400 opacity-60">
                  <LayoutGrid className="w-10 h-10 mb-2" />
                  <p className="text-sm font-medium">
                    Belum ada data area parkir.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. VEHICLE BREAKDOWN (Right - 1 Col) */}
        <div className="lg:col-span-1">
          <div className="bg-[#1E293B] rounded-4xl p-8 text-white shadow-2xl h-full relative overflow-hidden flex flex-col">
            {/* Dark Card Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#71C9CE]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#A6E3E9]/5 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />

            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/5">
                <LayoutGrid className="w-6 h-6 text-[#71C9CE]" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Komposisi</h3>
                <p className="text-xs text-slate-400 font-medium">
                  Jenis Kendaraan Masuk
                </p>
              </div>
            </div>

            <div className="space-y-4 relative z-10 flex-1">
              {/* Card Mobil */}
              <div className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="bg-[#71C9CE]/20 p-3 rounded-2xl text-[#71C9CE] group-hover:scale-110 transition-transform">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      Mobil
                    </p>
                    <p className="font-black text-2xl tracking-tight">
                      {stats?.jenis_stats.mobil || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Motor */}
              <div className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-500/20 p-3 rounded-2xl text-amber-400 group-hover:scale-110 transition-transform">
                    <Bike className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      Motor
                    </p>
                    <p className="font-black text-2xl tracking-tight">
                      {stats?.jenis_stats.motor || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Insight */}
            <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
              <div className="flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
                <TrendingUp className="w-4 h-4 text-[#71C9CE] shrink-0 mt-0.5" />
                <span>
                  Data kendaraan dihitung berdasarkan transaksi masuk hari ini
                  mulai pukul 00:00 WIB.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
