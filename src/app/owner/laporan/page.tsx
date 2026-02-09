"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { formatRupiah, cn } from "@/lib/utils";
import api from "@/lib/axios";
import {
  Calendar,
  FileText,
  Search,
  Clock,
  MapPin,
  User,
  Receipt,
  Filter,
  CarFront,
} from "lucide-react";

// --- INTERFACE ---
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

// Style Constants
const GLASS_CARD =
  "bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-[#71C9CE]/5 rounded-[2rem] overflow-hidden";

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

  return (
    <DashboardLayout requiredRole="owner">
      {/* HEADER SECTION */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-5 h-5 text-[#71C9CE]" />
            <span className="text-xs font-bold text-[#71C9CE] uppercase tracking-widest">
              Financial Report
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Laporan <span className="text-[#71C9CE]">Transaksi</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">
            Rekapitulasi pendapatan dan aktivitas parkir.
          </p>
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className={cn(GLASS_CARD, "p-6 md:p-8 mb-8 relative z-10")}>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4 md:gap-6">
          <div className="w-full lg:flex-1 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">
              Dari Tanggal
            </label>
            <Input
              type="date"
              className="bg-white"
              value={filters.tanggal_mulai}
              onChange={(e) =>
                setFilters({ ...filters, tanggal_mulai: e.target.value })
              }
            />
          </div>

          <div className="w-full lg:flex-1 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">
              Sampai Tanggal
            </label>
            <Input
              type="date"
              className="bg-white"
              value={filters.tanggal_akhir}
              onChange={(e) =>
                setFilters({ ...filters, tanggal_akhir: e.target.value })
              }
            />
          </div>

          <button
            onClick={fetchData}
            className="w-full lg:w-auto h-12 px-8 bg-gradient-to-r from-[#71C9CE] to-[#4AA3A8] hover:from-[#5dbbc0] hover:to-[#3b8c91] text-white rounded-2xl font-bold shadow-lg shadow-[#71C9CE]/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <Filter className="w-4 h-4" />
            <span className="lg:hidden">Terapkan</span>
            <span className="hidden lg:inline">Terapkan Filter</span>
          </button>
        </div>
      </div>

      {/* DATA DISPLAY SECTION */}
      <div
        className={cn(GLASS_CARD, "flex flex-col min-h-[500px] relative z-10")}
      >
        {/* === 1. DESKTOP VIEW (TABLE) === */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#E3FDFD]/50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-[#A6E3E9]/30">
              <tr>
                <th className="px-8 py-5">Kendaraan</th>
                <th className="px-6 py-5">Waktu Keluar</th>
                <th className="px-6 py-5">Durasi</th>
                <th className="px-6 py-5">Lokasi Parkir</th>
                <th className="px-6 py-5">Petugas</th>
                <th className="px-8 py-5 text-right">Total Biaya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse bg-white/30">
                    <td colSpan={6} className="px-8 py-6">
                      <div className="h-8 bg-gray-200/50 rounded-xl w-full" />
                    </td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-24 text-gray-400">
                    <div className="flex flex-col items-center opacity-50 gap-4">
                      <div className="p-4 bg-slate-100 rounded-full">
                        <FileText className="w-10 h-10 text-slate-300" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-600">
                          Data tidak ditemukan
                        </p>
                        <p className="text-xs text-slate-400">
                          Coba ubah filter tanggal pencarian
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((t) => (
                  <tr
                    key={t.id_transaksi}
                    className="hover:bg-white/60 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <span className="px-3 py-1.5 bg-slate-800 text-white rounded-lg font-mono font-bold tracking-widest text-xs shadow-md">
                        {t.plat_nomor}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 text-sm">
                          {new Date(t.waktu_keluar).toLocaleDateString(
                            "id-ID",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                          {new Date(t.waktu_keluar).toLocaleTimeString(
                            "id-ID",
                            { hour: "2-digit", minute: "2-digit" },
                          )}{" "}
                          WIB
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-600 font-medium bg-slate-50 w-fit px-3 py-1 rounded-lg border border-slate-100">
                        <Clock className="w-3.5 h-3.5 text-[#71C9CE]" />
                        {t.durasi_jam} Jam
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-700 font-bold">
                        <MapPin className="w-4 h-4 text-red-400" />
                        {t.area.nama_area}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#E3FDFD] rounded-full flex items-center justify-center text-[#71C9CE] border border-[#A6E3E9]">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm">
                          {t.user.nama_lengkap}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-5 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-base font-black text-slate-800">
                          {formatRupiah(t.biaya_total)}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wide mt-1">
                          Paid
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* === 2. MOBILE VIEW (CARDS) === */}
        <div className="md:hidden flex flex-col p-4 gap-4 bg-slate-50/50">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow-sm animate-pulse space-y-3"
              >
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-1 bg-gray-100 rounded w-full my-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))
          ) : data.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="p-4 bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <FileText className="w-8 h-8 text-slate-300" />
              </div>
              <p className="font-bold text-slate-600">Data tidak ditemukan</p>
              <p className="text-xs mt-1">Sesuaikan filter tanggal anda.</p>
            </div>
          ) : (
            data.map((t) => (
              <div
                key={t.id_transaksi}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden flex flex-col gap-3 group"
              >
                {/* Decorative Left Border */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#71C9CE]" />

                {/* Header Card: Plat & Harga */}
                <div className="flex justify-between items-start pl-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {new Date(t.waktu_keluar).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <span className="px-2 py-1 bg-slate-800 text-white rounded font-mono font-bold text-sm tracking-wider">
                      {t.plat_nomor}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-lg font-black text-slate-800">
                      {formatRupiah(t.biaya_total)}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase">
                      Paid
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100 my-1 ml-3" />

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 pl-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">
                      Waktu Keluar
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs font-bold">
                      <Clock className="w-3.5 h-3.5 text-[#71C9CE]" />
                      {new Date(t.waktu_keluar).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      WIB
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">
                      Durasi
                    </span>
                    <span className="text-slate-700 text-xs font-bold bg-slate-50 px-2 py-1 rounded w-fit">
                      {t.durasi_jam} Jam
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">
                      Lokasi
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      {t.area.nama_area}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">
                      Petugas
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {t.user.nama_lengkap.split(" ")[0]}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}