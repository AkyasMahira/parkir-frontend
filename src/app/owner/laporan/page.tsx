"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { formatRupiah, cn } from "@/lib/utils";
import api from "@/lib/axios";
import {
  Calendar,
  FileText,
  Clock,
  MapPin,
  User,
  Receipt,
  Filter,
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

  // FETCH DATA
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

    const response = await api.get(
      `/owner/laporan/export?${params}`,
      {
        responseType: "blob", // penting!
      }
    );

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
      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-5 h-5 text-[#71C9CE]" />
            <span className="text-xs font-bold text-[#71C9CE] uppercase tracking-widest">
              Financial Report
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-800">
            Laporan <span className="text-[#71C9CE]">Pendapatan</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Rekapitulasi pendapatan dan aktivitas parkir.
          </p>
        </div>

        {/* EXPORT BUTTON */}
        <button
          onClick={exportData}
          className="h-12 px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* FILTER */}
      <div className={cn(GLASS_CARD, "p-6 mb-8")}>
        <div className="flex flex-col lg:flex-row gap-4">
          <Input
            type="date"
            value={filters.tanggal_mulai}
            onChange={(e) =>
              setFilters({ ...filters, tanggal_mulai: e.target.value })
            }
          />
          <Input
            type="date"
            value={filters.tanggal_akhir}
            onChange={(e) =>
              setFilters({ ...filters, tanggal_akhir: e.target.value })
            }
          />
          <button
            onClick={fetchData}
            className="h-12 px-6 bg-[#71C9CE] text-white rounded-xl flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className={cn(GLASS_CARD, "overflow-hidden")}>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#E3FDFD] text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Plat</th>
                <th>Waktu Keluar</th>
                <th>Durasi</th>
                <th>Lokasi</th>
                <th>Petugas</th>
                <th className="text-right px-6">Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                data.map((t) => (
                  <tr key={t.id_transaksi} className="border-t">
                    <td className="px-6 py-4">{t.plat_nomor}</td>
                    <td>{new Date(t.waktu_keluar).toLocaleString("id-ID")}</td>
                    <td>{t.durasi_jam} Jam</td>
                    <td>{t.area.nama_area}</td>
                    <td>{t.user.nama_lengkap}</td>
                    <td className="text-right px-6 font-bold">
                      {formatRupiah(t.biaya_total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden p-4 space-y-3">
          {data.map((t) => (
            <div
              key={t.id_transaksi}
              className="bg-white p-4 rounded-xl shadow"
            >
              <div className="flex justify-between">
                <span>{t.plat_nomor}</span>
                <span className="font-bold">{formatRupiah(t.biaya_total)}</span>
              </div>
              <div className="text-xs text-gray-500">
                {t.area.nama_area} • {t.user.nama_lengkap}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
