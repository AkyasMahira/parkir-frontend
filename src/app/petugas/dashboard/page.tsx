"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import {
  Car,
  CarFront,
  CheckCircle2,
  Wallet,
  ArrowRight,
  CalendarDays,
  TrendingUp,
  QrCode,
  Banknote,
  Clock,
} from "lucide-react";
import { formatRupiah, cn } from "@/lib/utils";
import api from "@/lib/axios";

// --- INTERFACES ---
interface Transaksi {
  id_transaksi: number;
  plat_nomor: string;
  jenis_kendaraan: string;
  waktu_masuk: string;
  waktu_keluar?: string;
  status: string;
  biaya_total: number;
  metode_bayar?: string; // Tambahkan ini
  area?: { nama_area: string };
}

interface DashboardStats {
  sedangParkir: number;
  transaksiHariIni: number;
  pendapatanTunai: number; // Uang di Laci
  pendapatanQris: number; // Uang di Bank
}

// --- COMPONENT STAT CARD (GLASS STYLE) ---
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: "blue" | "green" | "orange" | "purple";
  isLoading: boolean;
  description?: string;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  isLoading,
  description,
}: StatCardProps) => {
  const styles = {
    blue: { bgIcon: "bg-blue-100", textIcon: "text-blue-600" },
    green: { bgIcon: "bg-emerald-100", textIcon: "text-emerald-600" }, // Cash
    orange: { bgIcon: "bg-amber-100", textIcon: "text-amber-600" }, // Keluar
    purple: { bgIcon: "bg-purple-100", textIcon: "text-purple-600" }, // QRIS
  };

  const currentStyle = styles[color];

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/50 bg-white/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:bg-white/70 hover:-translate-y-1">
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-200/50 rounded animate-pulse mb-1"></div>
          ) : (
            <h3 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              {value}
            </h3>
          )}
          {description && (
            <p className="text-xs text-gray-400 mt-2 font-medium">
              {description}
            </p>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-2xl shadow-sm transition-transform group-hover:scale-110",
            currentStyle.bgIcon,
            currentStyle.textIcon,
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* Decorative Gradient Background */}
      <div
        className={cn(
          "absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 blur-xl",
          currentStyle.bgIcon,
        )}
      />
    </div>
  );
};

export default function PetugasDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    sedangParkir: 0,
    transaksiHariIni: 0,
    pendapatanTunai: 0,
    pendapatanQris: 0,
  });

  const [recentData, setRecentData] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ nama_lengkap: string } | null>(null);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // 1. Load User Local
    const userStr = localStorage.getItem("user");
    if (userStr) setUser(JSON.parse(userStr));

    // 2. Set Tanggal
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    setCurrentDate(new Date().toLocaleDateString("id-ID", dateOptions));

    // 3. Fetch Data API
    const fetchData = async () => {
      try {
        const res = await api.get("/transaksi?limit=300"); // Ambil lebih banyak data
        const rawData: Transaksi[] = res.data.data || [];

        // Update Tabel Recent Activity (ambil 5 teratas)
        setRecentData(rawData.slice(0, 5));

        const todayStr = new Date().toLocaleDateString("id-ID");

        // --- FILTER LOGIC ---

        // 1. Sedang Parkir
        const active = rawData.filter(
          (t) => t.status === "parkir" || t.status === "masuk",
        ).length;

        // 2. Transaksi Hari Ini (Status Selesai/Keluar & Tanggal Hari Ini)
        const todaysTx = rawData.filter((t) => {
          if (
            (t.status !== "selesai" && t.status !== "keluar") ||
            !t.waktu_keluar
          )
            return false;
          const txDate = new Date(t.waktu_keluar).toLocaleDateString("id-ID");
          return txDate === todayStr;
        });

        // 3. Pisahkan Uang Tunai & QRIS
        const tunai = todaysTx
          .filter((t) => t.metode_bayar === "cash")
          .reduce((sum, t) => sum + (Number(t.biaya_total) || 0), 0);

        const qris = todaysTx
          .filter((t) => t.metode_bayar === "qris")
          .reduce((sum, t) => sum + (Number(t.biaya_total) || 0), 0);

        setStats({
          sedangParkir: active,
          transaksiHariIni: todaysTx.length,
          pendapatanTunai: tunai,
          pendapatanQris: qris,
        });
      } catch (error) {
        console.error("Gagal memuat statistik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper Badge untuk Tabel
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "parkir":
        return (
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border border-blue-200">
            Parkir
          </span>
        );
      case "selesai":
        return (
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border border-green-200">
            Selesai
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <DashboardLayout requiredRole="petugas">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Halo,{" "}
            <span className="text-blue-600">
              {user?.nama_lengkap?.split(" ")[0] || "Petugas"}!
            </span>{" "}
            👋
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm font-medium">
            <CalendarDays className="w-4 h-4 text-blue-500" />
            {currentDate}
          </p>
        </div>

        <div className="hidden md:block">
          <Link href="/petugas/transaksi">
            <div className="bg-white/80 backdrop-blur-md p-1 pr-4 rounded-full border border-white/60 shadow-sm flex items-center gap-3 hover:shadow-md transition-all group cursor-pointer">
              <div className="bg-blue-600 text-white p-2 rounded-full group-hover:scale-110 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600">
                Input Kendaraan
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* STATS GRID (4 KOLOM) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
        <StatCard
          label="Sedang Parkir"
          value={stats.sedangParkir}
          icon={Car}
          color="blue"
          isLoading={loading}
          description="Kendaraan aktif"
        />

        <StatCard
          label="Kendaraan Keluar"
          value={stats.transaksiHariIni}
          icon={CheckCircle2}
          color="orange"
          isLoading={loading}
          description="Total hari ini"
        />

        {/* PENTING: Uang Tunai */}
        <StatCard
          label="Uang Tunai"
          value={formatRupiah(stats.pendapatanTunai)}
          icon={Banknote}
          color="green"
          isLoading={loading}
          description="Wajib disetor"
        />

        {/* Info QRIS */}
        <StatCard
          label="Pendapatan QRIS"
          value={formatRupiah(stats.pendapatanQris)}
          icon={QrCode}
          color="purple"
          isLoading={loading}
          description="Otomatis ke Bank"
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* LEFT: CTA SECTION */}
        <div className="lg:col-span-1">
          <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-blue-500/20 group h-full flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 transition-all duration-500 group-hover:scale-105"></div>
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/20">
                <TrendingUp className="w-3 h-3" />
                Aksi Cepat
              </div>
              <h3 className="text-2xl font-bold mb-3 leading-tight">
                Kendaraan Baru Masuk?
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                Input plat nomor segera untuk mencetak tiket dan QR Code parkir.
              </p>
            </div>

            <Link href="/petugas/transaksi" className="relative z-10 mt-auto">
              <button className="w-full py-4 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
                <CarFront className="w-5 h-5" />
                Input Transaksi
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT: RECENT ACTIVITY */}
        <div className="lg:col-span-2">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden h-full">
            <div className="p-6 border-b border-gray-100/50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Aktivitas Terkini</h3>
              <Link
                href="/petugas/riwayat"
                className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/40 text-gray-500 font-semibold border-b border-gray-200/50 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4">Waktu</th>
                    <th className="px-6 py-4">Plat Nomor</th>
                    <th className="px-6 py-4">Metode</th>
                    <th className="px-6 py-4 text-right">Biaya</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50">
                  {loading ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-200/50 rounded w-16"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-200/50 rounded w-24"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-200/50 rounded w-12"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-200/50 rounded w-16 ml-auto"></div>
                        </td>
                      </tr>
                    ))
                  ) : recentData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 text-gray-500 italic"
                      >
                        Belum ada aktivitas.
                      </td>
                    </tr>
                  ) : (
                    recentData.map((row) => (
                      <tr
                        key={row.id_transaksi}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(row.waktu_masuk).toLocaleTimeString(
                            "id-ID",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-800">
                          {row.plat_nomor}
                        </td>
                        <td className="px-6 py-4">
                          {row.status === "selesai" && row.biaya_total > 0 ? (
                            <span
                              className={cn(
                                "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                                (row.biaya_total > 0 && !row.metode_bayar) ||
                                  row.metode_bayar === "cash"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-purple-100 text-purple-700",
                              )}
                            >
                              {row.metode_bayar || "CASH"}
                            </span>
                          ) : (
                            getStatusBadge(row.status)
                          )}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-emerald-600">
                          {row.biaya_total > 0
                            ? formatRupiah(row.biaya_total)
                            : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
