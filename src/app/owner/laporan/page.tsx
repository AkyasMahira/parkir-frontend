"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { formatRupiah } from "@/lib/utils";
import api from "@/lib/axios";
import {
  Calendar,
  FileText,
  Search,
  Clock,
  MapPin,
  User,
  Receipt,
} from "lucide-react";

// Antarmuka data transaksi
interface Transaksi {
  id_transaksi: number;
  plat_nomor: string;
  waktu_masuk: string;
  waktu_keluar: string;
  durasi_jam: number;
  biaya_total: number;
  user: { nama_lengkap: string };
  area: { nama_area: string };
}

export default function OwnerLaporan() {
  const [data, setData] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    tanggal_mulai: "",
    tanggal_akhir: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.tanggal_mulai)
        params.append("tanggal_mulai", filters.tanggal_mulai);
      if (filters.tanggal_akhir)
        params.append("tanggal_akhir", filters.tanggal_akhir);

      const res = await api.get(`/owner/laporan?${params}`);
      setData(res.data.data.data || []);
    } catch (err) {
      console.error("Gagal load laporan", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Utility class untuk Glassmorphism
  const glassClass =
    "bg-white/60 backdrop-blur-lg border border-white/40 shadow-xl";

  return (
    <DashboardLayout requiredRole="owner">
      {/* Background Decorator */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Laporan <span className="text-blue-600">Transaksi</span>
        </h1>
        <p className="text-slate-500 mt-1 flex items-center gap-2">
          <Calendar size={16} /> Pantau riwayat aktivitas parkir secara
          real-time
        </p>
      </div>

      {/* Glass Filter Section */}
      <div className={`${glassClass} p-6 rounded-2xl mb-8`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Dari Tanggal
            </label>
            <Input
              type="date"
              className="bg-white/50 border-white/50 focus:bg-white"
              value={filters.tanggal_mulai}
              onChange={(e) =>
                setFilters({ ...filters, tanggal_mulai: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Sampai Tanggal
            </label>
            <Input
              type="date"
              className="bg-white/50 border-white/50 focus:bg-white"
              value={filters.tanggal_akhir}
              onChange={(e) =>
                setFilters({ ...filters, tanggal_akhir: e.target.value })
              }
            />
          </div>
          <button
            onClick={fetchData}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-200"
          >
            <Search size={18} />
            Cari Laporan
          </button>
        </div>
      </div>

      {/* Glass Table Container */}
      <div className={`${glassClass} rounded-2xl overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/40 border-b border-white/40">
                <th className="px-6 py-5 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Kendaraan
                </th>
                <th className="px-6 py-5 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Waktu Keluar
                </th>
                <th className="px-6 py-5 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Durasi
                </th>
                <th className="px-6 py-5 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Detail Area
                </th>
                <th className="px-6 py-5 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Petugas
                </th>
                <th className="px-6 py-5 text-right font-bold text-slate-700 uppercase tracking-wider">
                  Biaya
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-6">
                      <div className="h-8 bg-white/40 rounded-lg w-full" />
                    </td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20">
                    <div className="flex flex-col items-center opacity-40">
                      <FileText size={64} strokeWidth={1} />
                      <p className="mt-4 text-lg font-medium">
                        Data transaksi tidak ditemukan
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((t) => (
                  <tr
                    key={t.id_transaksi}
                    className="hover:bg-white/40 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-slate-800 text-white rounded-md font-mono font-bold tracking-widest text-xs">
                        {t.plat_nomor}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">
                          {new Date(t.waktu_keluar).toLocaleDateString(
                            "id-ID",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </span>
                        <span className="text-xs opacity-70">
                          {new Date(t.waktu_keluar).toLocaleTimeString("id-ID")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock size={14} className="text-blue-500" />
                        {t.durasi_jam} Jam
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin size={14} className="text-red-400" />
                        {t.area.nama_area}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <User size={14} />
                        </div>
                        {t.user.nama_lengkap}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="inline-flex flex-col items-end">
                        <span className="text-base font-bold text-slate-900">
                          {formatRupiah(t.biaya_total)}
                        </span>
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">
                          Lunas
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
