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
  Download,
  MapPin,
  Bike,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// --- INTERFACES BARU ---
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
  area_stats: AreaStat[]; // Array Area
  jenis_stats: { mobil: number; motor: number }; // Breakdown Jenis
}

// --- COMPONENT: STAT CARD ---
const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  delay = 0,
}: any) => {
  const isHighlight = variant === "highlight";
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl p-6 shadow-xl transition-all duration-500 hover:-translate-y-1",
        isHighlight
          ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white"
          : "bg-white/60 backdrop-blur-xl border border-white/50 text-gray-800",
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {isHighlight && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mt-10 -mr-10"></div>
      )}
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p
            className={cn(
              "text-sm font-medium mb-1",
              isHighlight ? "text-blue-100" : "text-gray-500",
            )}
          >
            {title}
          </p>
          <h3 className="text-3xl font-extrabold tracking-tight mb-2">
            {value}
          </h3>
          <div
            className={cn(
              "flex items-center gap-1 text-xs",
              isHighlight ? "text-blue-200" : "text-gray-400",
            )}
          >
            {variant === "highlight" && <ArrowUpRight className="w-3 h-3" />}
            <span>{subtitle}</span>
          </div>
        </div>
        <div
          className={cn(
            "p-3 rounded-2xl shadow-sm",
            isHighlight ? "bg-white/20 text-white" : "bg-white text-blue-600",
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: AREA PROGRESS CARD ---
const AreaProgress = ({ area }: { area: AreaStat }) => {
  // Tentukan warna berdasarkan kepadatan
  let color = "bg-blue-500";
  if (area.persentase > 80) color = "bg-red-500";
  else if (area.persentase > 50) color = "bg-orange-500";

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-end mb-2">
        <div>
          <span className="text-sm font-bold text-gray-700 block">
            {area.nama_area}
          </span>
          <span className="text-xs text-gray-400">
            Kapasitas: {area.kapasitas} Slot
          </span>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-gray-800">{area.terisi}</span>
          <span className="text-xs text-gray-500"> / {area.kapasitas}</span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={cn(
            "h-2.5 rounded-full transition-all duration-1000",
            color,
          )}
          style={{ width: `${area.persentase}%` }}
        ></div>
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
        <div className="h-screen flex items-center justify-center text-gray-400">
          Memuat Data...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="owner">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Dashboard{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Owner
            </span>
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2 font-medium">
            <CalendarDays className="w-4 h-4 text-blue-500" />
            {currentDate}
          </p>
        </div>
      </div>

      {/* 1. KEY METRICS (UANG) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
        <StatCard
          title="Pendapatan Bulan Ini"
          value={formatRupiah(stats?.bulan_ini?.pendapatan || 0)}
          subtitle={`${stats?.bulan_ini?.total || 0} Total Transaksi`}
          icon={Wallet}
          variant="highlight"
        />
        <StatCard
          title="Pendapatan Hari Ini"
          value={formatRupiah(stats?.hari_ini?.pendapatan || 0)}
          subtitle={`${stats?.hari_ini?.total || 0} Transaksi Selesai`}
          icon={DollarSign}
        />
        <StatCard
          title="Total Kendaraan Aktif"
          value={stats?.kendaraan_parkir || 0}
          subtitle="Sedang menempati slot"
          icon={Car}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* 2. LIVE AREA MONITORING (KAPASITAS PER LANTAI) */}
        <div className="lg:col-span-2">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-lg h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  Kepadatan Area Parkir
                </h3>
                <p className="text-xs text-gray-500">
                  Monitoring kapasitas per lokasi secara realtime
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {stats?.area_stats.map((area, idx) => (
                <AreaProgress key={idx} area={area} />
              ))}
              {stats?.area_stats.length === 0 && (
                <p className="text-gray-400 text-sm">Belum ada data area.</p>
              )}
            </div>
          </div>
        </div>

        {/* 3. VEHICLE DISTRIBUTION (MOTOR VS MOBIL) */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl h-full relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <LayoutGrid className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-bold text-lg">Komposisi Kendaraan</h3>
            </div>

            <div className="space-y-6 relative z-10">
              {/* Item Mobil */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Mobil</p>
                    <p className="font-bold text-xl">
                      {stats?.jenis_stats.mobil || 0}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                    Masuk Hari Ini
                  </span>
                </div>
              </div>

              {/* Item Motor */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-500/20 p-2 rounded-lg text-orange-400">
                    <Bike className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Motor</p>
                    <p className="font-bold text-xl">
                      {stats?.jenis_stats.motor || 0}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">
                    Masuk Hari Ini
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Tren kunjungan motor meningkat 15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
