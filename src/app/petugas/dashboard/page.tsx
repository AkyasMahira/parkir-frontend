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
  MoreHorizontal,
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
  metode_bayar?: string;
  area?: { nama_area: string };
}

interface DashboardStats {
  sedangParkir: number;
  transaksiHariIni: number;
  pendapatanTunai: number;
  pendapatanQris: number;
}

// --- STYLE CONSTANTS ---
const GLASS_CARD =
  "bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-[#71C9CE]/5 rounded-[2rem] overflow-hidden";

// --- COMPONENT STAT CARD (GLASS STYLE) ---
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  theme: "teal" | "green" | "orange" | "purple";
  isLoading: boolean;
  description?: string;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  theme,
  isLoading,
  description,
}: StatCardProps) => {
  const styles = {
    teal: {
      bgIcon: "bg-[#E3FDFD]",
      textIcon: "text-[#71C9CE]",
      ring: "ring-[#71C9CE]/20",
    },
    green: {
      bgIcon: "bg-emerald-50",
      textIcon: "text-emerald-500",
      ring: "ring-emerald-500/20",
    },
    orange: {
      bgIcon: "bg-amber-50",
      textIcon: "text-amber-500",
      ring: "ring-amber-500/20",
    },
    purple: {
      bgIcon: "bg-purple-50",
      textIcon: "text-purple-500",
      ring: "ring-purple-500/20",
    },
  };

  const currentStyle = styles[theme];

  return (
    <div
      className={cn(
        GLASS_CARD,
        "p-6 group hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl",
      )}
    >
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            {label}
          </p>
          {isLoading ? (
            <div className="h-9 w-24 bg-gray-200/50 rounded animate-pulse mb-1"></div>
          ) : (
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">
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
            "p-3.5 rounded-2xl shadow-sm transition-transform group-hover:scale-110",
            currentStyle.bgIcon,
            currentStyle.textIcon,
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
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

        // 2. Transaksi Hari Ini
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
          <span className="bg-[#E3FDFD] text-[#71C9CE] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border border-[#A6E3E9]">
            Active
          </span>
        );
      case "selesai":
        return (
          <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border border-emerald-100">
            Done
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <DashboardLayout requiredRole="petugas">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-4 h-4 text-[#71C9CE]" />
            <span className="text-xs font-bold text-[#71C9CE] uppercase tracking-widest">
              {currentDate}
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            Halo,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#71C9CE] to-[#4AA3A8]">
              {user?.nama_lengkap?.split(" ")[0] || "Petugas"}
            </span>{" "}
            👋
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Selamat bertugas! Pantau aktivitas parkir hari ini.
          </p>
        </div>

        <div className="hidden md:block">
          <Link href="/petugas/transaksi">
            <button className="bg-white hover:bg-[#E3FDFD] text-slate-700 hover:text-[#71C9CE] font-bold text-sm px-6 py-3 rounded-2xl shadow-sm border border-gray-100 transition-all flex items-center gap-3 group">
              <span className="bg-[#71C9CE] text-white p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
              Input Kendaraan Baru
            </button>
          </Link>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Sedang Parkir"
          value={stats.sedangParkir}
          icon={Car}
          theme="teal"
          isLoading={loading}
          description="Kendaraan aktif"
        />

        <StatCard
          label="Kendaraan Keluar"
          value={stats.transaksiHariIni}
          icon={CheckCircle2}
          theme="orange"
          isLoading={loading}
          description="Total hari ini"
        />

        {/* PENTING: Uang Tunai */}
        <StatCard
          label="Uang Tunai"
          value={formatRupiah(stats.pendapatanTunai)}
          icon={Banknote}
          theme="green"
          isLoading={loading}
          description="Wajib disetor"
        />

        {/* Info QRIS */}
        <StatCard
          label="Pendapatan QRIS"
          value={formatRupiah(stats.pendapatanQris)}
          icon={QrCode}
          theme="purple"
          isLoading={loading}
          description="Masuk ke Bank"
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: CTA SECTION */}
        <div className="lg:col-span-1 h-full">
          <div className="relative overflow-hidden rounded-[2rem] p-8 text-white shadow-xl shadow-[#71C9CE]/20 h-full flex flex-col justify-between group bg-gradient-to-br from-[#71C9CE] to-[#4AA3A8]">
            {/* Background Blob Animation */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#4AA3A8]/50 to-transparent" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-6 bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-white/20">
                <TrendingUp className="w-3 h-3" />
                Aksi Cepat
              </div>
              <h3 className="text-3xl font-black mb-4 leading-tight">
                Kendaraan <br /> Baru Masuk?
              </h3>
              <p className="text-white/90 text-sm leading-relaxed font-medium mb-8">
                Catat plat nomor kendaraan masuk untuk mencetak tiket QR Code
                secara otomatis.
              </p>
            </div>

            <Link href="/petugas/transaksi" className="relative z-10 mt-auto">
              <button className="w-full py-4 bg-white text-[#71C9CE] font-bold rounded-2xl hover:bg-[#E3FDFD] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3">
                <CarFront className="w-5 h-5" />
                Input Transaksi
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT: RECENT ACTIVITY */}
        <div className="lg:col-span-2">
          <div className={cn(GLASS_CARD, "h-full flex flex-col")}>
            <div className="p-8 border-b border-[#A6E3E9]/30 flex justify-between items-center bg-gradient-to-r from-[#E3FDFD]/30 to-white/30">
              <h3 className="font-black text-slate-800 text-lg">
                Aktivitas Terkini
              </h3>
              <Link
                href="/petugas/riwayat"
                className="text-xs font-bold text-[#71C9CE] hover:text-[#4AA3A8] flex items-center gap-1"
              >
                Lihat Semua <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#E3FDFD]/50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-[#A6E3E9]/30">
                  <tr>
                    <th className="px-8 py-5">Waktu</th>
                    <th className="px-6 py-5">Plat Nomor</th>
                    <th className="px-6 py-5">Status / Metode</th>
                    <th className="px-8 py-5 text-right">Biaya</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50">
                  {loading ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i} className="animate-pulse bg-white/30">
                        <td className="px-8 py-4">
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </td>
                        <td className="px-6">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </td>
                        <td className="px-6">
                          <div className="h-4 bg-gray-200 rounded w-12"></div>
                        </td>
                        <td className="px-8">
                          <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
                        </td>
                      </tr>
                    ))
                  ) : recentData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-12 text-gray-400 italic"
                      >
                        Belum ada aktivitas hari ini.
                      </td>
                    </tr>
                  ) : (
                    recentData.map((row) => (
                      <tr
                        key={row.id_transaksi}
                        className="hover:bg-white/60 transition-colors group"
                      >
                        <td className="px-8 py-5 text-slate-500 flex items-center gap-2 font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#71C9CE]" />
                          {new Date(row.waktu_masuk).toLocaleTimeString(
                            "id-ID",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </td>

                        <td className="px-6 py-5 font-black text-slate-700">
                          {row.plat_nomor}
                        </td>

                        <td className="px-6 py-5">
                          {row.status === "selesai" && row.biaya_total > 0 ? (
                            <span
                              className={cn(
                                "text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border",
                                (row.biaya_total > 0 && !row.metode_bayar) ||
                                  row.metode_bayar === "cash"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  : "bg-purple-50 text-purple-600 border-purple-100",
                              )}
                            >
                              {row.metode_bayar || "CASH"}
                            </span>
                          ) : (
                            getStatusBadge(row.status)
                          )}
                        </td>

                        <td className="px-8 py-5 text-right font-bold text-slate-700">
                          {row.biaya_total > 0 ? (
                            formatRupiah(row.biaya_total)
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
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
