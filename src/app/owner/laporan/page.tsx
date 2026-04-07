"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { formatRupiah, cn } from "@/lib/utils";
import api from "@/lib/axios";
import {
  FileText,
  Filter,
  Receipt,
  Inbox,
  Loader2,
  MapPin,
  Clock,
  User,
} from "lucide-react";

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

// Glass card yang lebih soft shadow-nya
const GLASS_CARD =
  "bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem]";

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

  const exportData = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.tanggal_mulai)
        params.append("tanggal_mulai", filters.tanggal_mulai);
      if (filters.tanggal_akhir)
        params.append("tanggal_akhir", filters.tanggal_akhir);

      const response = await api.get(`/owner/laporan/export?${params}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "laporan-pendapatan.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export gagal", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout requiredRole="owner">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-[#E3FDFD] rounded-lg">
              <Receipt className="w-5 h-5 text-[#71C9CE]" />
            </div>
            <span className="text-xs font-bold text-[#71C9CE] uppercase tracking-wider">
              Financial Report
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
            Laporan <span className="text-[#71C9CE]">Pendapatan</span>
          </h1>
          <p className="text-slate-500 mt-1">
            Rekapitulasi pendapatan dan aktivitas parkir area Anda.
          </p>
        </div>

        <button
          onClick={exportData}
          className="h-12 px-6 bg-slate-800 hover:bg-slate-900 active:scale-95 transition-all text-white rounded-2xl font-semibold flex items-center gap-2 shadow-lg shadow-slate-200"
        >
          <FileText className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className={cn(GLASS_CARD, "p-6 mb-8")}>
        <div className="flex flex-col lg:flex-row items-end gap-4">
          <div className="w-full lg:w-1/3 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 px-1">
              Dari Tanggal
            </label>
            <Input
              type="date"
              value={filters.tanggal_mulai}
              onChange={(e) =>
                setFilters({ ...filters, tanggal_mulai: e.target.value })
              }
              className="w-full bg-slate-50/50 border-slate-200"
            />
          </div>
          <div className="w-full lg:w-1/3 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 px-1">
              Sampai Tanggal
            </label>
            <Input
              type="date"
              value={filters.tanggal_akhir}
              onChange={(e) =>
                setFilters({ ...filters, tanggal_akhir: e.target.value })
              }
              className="w-full bg-slate-50/50 border-slate-200"
            />
          </div>
          <button
            onClick={fetchData}
            className="w-full lg:w-auto h-11 px-8 bg-[#71C9CE] hover:bg-[#5bbbc0] active:scale-95 transition-all text-white rounded-xl flex items-center justify-center gap-2 font-medium shadow-md shadow-[#71C9CE]/20"
          >
            <Filter className="w-4 h-4" />
            Filter Data
          </button>
        </div>
      </div>

      <div className={cn(GLASS_CARD, "overflow-hidden")}>
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-5">Plat Nomor</th>
                <th className="px-6 py-5">Waktu Keluar</th>
                <th className="px-6 py-5">Durasi</th>
                <th className="px-6 py-5">Lokasi</th>
                <th className="px-6 py-5">Petugas</th>
                <th className="text-right px-6 py-5">Total Biaya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#71C9CE] mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">
                      Memuat data laporan...
                    </p>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">
                      Tidak ada data transaksi
                    </p>
                  </td>
                </tr>
              ) : (
                data.map((t) => (
                  <tr
                    key={t.id_transaksi}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {t.plat_nomor}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(t.waktu_keluar).toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#E3FDFD] text-[#34888C] px-2.5 py-1 rounded-md text-xs font-semibold">
                        {t.durasi_jam} Jam
                      </span>
                    </td>
                    <td className="px-6 py-4">{t.area.nama_area}</td>
                    <td className="px-6 py-4">{t.user.nama_lengkap}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800">
                      {formatRupiah(t.biaya_total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden p-4 space-y-4">
          {loading ? (
            <div className="py-10 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#71C9CE] mx-auto mb-2" />
              <span className="text-sm text-slate-400">Memuat data...</span>
            </div>
          ) : data.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">
              Data kosong.
            </div>
          ) : (
            data.map((t) => (
              <div
                key={t.id_transaksi}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#71C9CE]"></div>

                <div className="flex justify-between items-start mb-4 border-b border-dashed border-slate-200 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                      Plat Nomor
                    </span>
                    <span className="font-black text-slate-800 text-lg">
                      {t.plat_nomor}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                      Total Biaya
                    </span>
                    <span className="font-black text-[#71C9CE] text-lg">
                      {formatRupiah(t.biaya_total)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{t.area.nama_area}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>
                      {new Date(t.waktu_keluar).toLocaleString("id-ID")} •{" "}
                      <span className="font-semibold text-slate-700">
                        {t.durasi_jam} Jam
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{t.user.nama_lengkap}</span>
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
