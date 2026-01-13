"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import {
  Car,
  History,
  Wallet,
  ArrowRight,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import { formatRupiah, cn } from "@/lib/utils";
import api from "@/lib/axios";

interface DashboardStats {
  sedangParkir: number;
  transaksiHariIni: number;
  pendapatanHariIni: number;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: "blue" | "green" | "orange";
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
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    orange: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
          ) : (
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
              {value}
            </h3>
          )}
          {description && (
            <p className="text-xs text-gray-400 mt-2">{description}</p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg border", colorStyles[color])}>
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
    pendapatanHariIni: 0,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ nama_lengkap: string } | null>(null);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setUser(JSON.parse(userStr));

    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    setCurrentDate(new Date().toLocaleDateString("id-ID", dateOptions));

    const fetchData = async () => {
      try {
        const res = await api.get("/parking?limit=100");
        const rawData = Array.isArray(res.data.data) ? res.data.data : res.data;
        console.log("Data Mentah API:", rawData);
        const todayStr = new Date().toLocaleDateString("id-ID");
        const active = rawData.filter(
          (t: any) => t.status?.toLowerCase() === "masuk"
        ).length;

        const todaysTx = rawData.filter((t: any) => {
          // Hanya ambil yang sudah keluar
          if (t.status?.toLowerCase() !== "keluar" || !t.waktu_keluar)
            return false;

          const txDate = new Date(t.waktu_keluar).toLocaleDateString("id-ID");

          // Bandingkan tanggalnya
          return txDate === todayStr;
        });

        const totalDuit = todaysTx.reduce(
          (sum: number, t: any) => sum + (Number(t.biaya_total) || 0),
          0
        );

        console.log("Hasil Filter:", {
          active,
          jumlahTx: todaysTx.length,
          totalDuit,
        });

        setStats({
          sedangParkir: active,
          transaksiHariIni: todaysTx.length,
          pendapatanHariIni: totalDuit,
        });
      } catch (error) {
        console.error("Gagal memuat statistik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout requiredRole="petugas">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Halo, {user?.nama_lengkap?.split(" ")[0] || "Petugas"}! 👋
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
            <CalendarDays className="w-4 h-4" />
            {currentDate}
          </p>
        </div>

        {/* Tombol Input Cepat (Hanya muncul di desktop, di mobile sudah ada di card bawah) */}
        <div className="hidden md:block">
          <Link href="/petugas/transaksi">
            <Button size="md" rightIcon={ArrowRight}>
              Input Kendaraan
            </Button>
          </Link>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Sedang Parkir */}
        <StatCard
          label="Sedang Parkir"
          value={stats.sedangParkir}
          icon={Car}
          color="blue"
          isLoading={loading}
          description="Kendaraan aktif di area"
        />

        {/* Card 2: Transaksi Hari Ini */}
        <StatCard
          label="Kendaraan Keluar"
          value={stats.transaksiHariIni}
          icon={History}
          color="orange"
          isLoading={loading}
          description="Total checkout hari ini"
        />

        {/* Card 3: Pendapatan */}
        <StatCard
          label="Pendapatan Shift"
          value={formatRupiah(stats.pendapatanHariIni)}
          icon={Wallet}
          color="green"
          isLoading={loading}
          description="Akumulasi tunai hari ini"
        />
      </div>

      {/* CTA SECTION / SHORTCUT */}
      {/* Desain dibuat menonjol agar petugas mudah mengakses menu utama */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-lg shadow-blue-500/20">
        {/* Background Pattern Decoration */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2 bg-blue-500/30 w-fit px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-blue-400/30">
              <TrendingUp className="w-3 h-3" />
              Prioritas Utama
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2">
              Ada kendaraan baru masuk?
            </h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Pastikan input plat nomor dengan benar sesuai STNK. Sistem akan
              otomatis mencatat waktu masuk dan menghitung durasi.
            </p>
          </div>

          <Link href="/petugas/transaksi" className="w-full md:w-auto">
            <button className="w-full md:w-auto px-6 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-gray-50 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2">
              <Car className="w-5 h-5" />
              Input Transaksi Baru
            </button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
