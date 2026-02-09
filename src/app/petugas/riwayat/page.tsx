"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  CarFront,
  Eye,
  Printer,
  X,
  Loader2,
  FileSpreadsheet,
} from "lucide-react";
import { formatRupiah, cn } from "@/lib/utils";
import api from "@/lib/axios";
import { useReactToPrint } from "react-to-print";

// Style Constants
const GLASS_CARD =
  "bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-[#71C9CE]/5 rounded-[2rem] overflow-hidden";

/* =========================================
   1. KOMPONEN STRUK (HIDDEN - UNTUK PRINT)
   ========================================= */
const StrukPrintTemplate = ({ data, componentRef }: any) => {
  if (!data) return null;
  return (
    <div className="hidden">
      <div ref={componentRef} className="p-4 font-mono text-xs w-[58mm]">
        <div className="text-center font-bold mb-2 uppercase">
          COACHPRO PARKING
          <br />
          <span className="font-normal capitalize">Smart System Area</span>
        </div>
        <div className="border-b border-dashed border-black my-2" />
        <table className="w-full text-[10px]">
          <tbody>
            <tr>
              <td>ID Tiket</td>
              <td className="text-right font-bold">{data.struk_id}</td>
            </tr>
            <tr>
              <td>Plat No</td>
              <td className="text-right font-bold">{data.plat_nomor}</td>
            </tr>
            <tr>
              <td>Masuk</td>
              <td className="text-right">{data.waktu_masuk}</td>
            </tr>
            <tr>
              <td>Keluar</td>
              <td className="text-right">{data.waktu_keluar || "-"}</td>
            </tr>
            {data.durasi && (
              <tr>
                <td>Durasi</td>
                <td className="text-right">{data.durasi}</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="border-b border-dashed border-black my-2" />
        <div className="flex justify-between font-bold text-sm">
          <span>TOTAL</span>
          <span>{formatRupiah(data.biaya || data.biaya_total || 0)}</span>
        </div>
        <div className="text-center mt-3 text-[9px]">
          TERIMA KASIH ATAS KUNJUNGAN ANDA
        </div>
      </div>
    </div>
  );
};

/* =========================================
   2. KOMPONEN MODAL PREVIEW STRUK (GLASS STYLE)
   ========================================= */
const StrukModal = ({
  data,
  onClose,
  onPrint,
}: {
  data: any;
  onClose: () => void;
  onPrint: () => void;
}) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden scale-100 animate-in zoom-in-95 duration-200 border border-white/50">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-[#E3FDFD] to-white border-b border-[#A6E3E9]/30 p-5 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <div className="p-1.5 bg-white rounded-lg shadow-sm">
              <CarFront className="w-5 h-5 text-[#71C9CE]" />
            </div>
            Digital Receipt
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Struk Simulation */}
        <div className="p-8 bg-slate-50 flex justify-center">
          <div className="bg-white p-5 w-full shadow-sm border border-slate-200 text-sm font-mono leading-relaxed relative rounded-sm">
            {/* Zigzag Top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[linear-gradient(135deg,transparent_5px,#fff_5px),linear-gradient(-135deg,transparent_5px,#fff_5px)] bg-[length:10px_10px] bg-repeat-x -mt-1 transform rotate-180"></div>

            <div className="text-center font-bold mb-6 text-slate-800">
              COACHPRO PARKING
              <br />
              <span className="font-normal text-[10px] text-slate-400 uppercase tracking-widest">
                Official Receipt
              </span>
            </div>

            <div className="space-y-2 border-b-2 border-dashed border-slate-200 pb-4 mb-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Tiket ID</span>{" "}
                <span className="font-bold text-slate-800">
                  {data.struk_id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Plat No</span>{" "}
                <span className="font-bold uppercase text-slate-800 bg-yellow-100 px-1 rounded">
                  {data.plat_nomor}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Masuk</span>{" "}
                <span>{data.waktu_masuk}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Keluar</span>{" "}
                <span>{data.waktu_keluar || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Durasi</span>{" "}
                <span>{data.durasi || "-"}</span>
              </div>
            </div>

            <div className="flex justify-between font-black text-lg text-slate-800">
              <span>TOTAL</span>
              <span>{formatRupiah(data.biaya || data.biaya_total || 0)}</span>
            </div>

            {/* Zigzag Bottom */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-[linear-gradient(135deg,transparent_5px,#fff_5px),linear-gradient(-135deg,transparent_5px,#fff_5px)] bg-[length:10px_10px] bg-repeat-x -mb-1"></div>
          </div>
        </div>

        <div className="p-5 bg-white border-t border-slate-100 flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
            className="border-slate-200"
          >
            Tutup
          </Button>
          <Button
            fullWidth
            onClick={onPrint}
            className="bg-[#71C9CE] hover:bg-[#5dbbc0] text-white shadow-lg shadow-[#71C9CE]/20 gap-2"
          >
            <Printer className="w-4 h-4" /> Cetak
          </Button>
        </div>
      </div>
    </div>
  );
};

/* =========================================
   3. HALAMAN UTAMA RIWAYAT
   ========================================= */
interface Transaksi {
  id_transaksi: number;
  struk_id: string;
  plat_nomor: string;
  jenis_kendaraan: string;
  waktu_masuk: string;
  waktu_keluar?: string;
  status: string;
  biaya_total: number;
  durasi_jam?: number;
  area?: { nama_area: string };
  user?: { nama_lengkap: string };
}

export default function RiwayatPage() {
  const [data, setData] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [strukData, setStrukData] = useState<any>(null);
  const [isLoadingStrukId, setIsLoadingStrukId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const strukRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: strukRef,
    onAfterPrint: () => {},
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/transaksi?limit=500");
      setData(res.data.data || []);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openStrukModal = async (id: number) => {
    setIsLoadingStrukId(id);
    try {
      const res = await api.get(`/transaksi/struk/${id}`);
      setStrukData(res.data.data);
      setShowModal(true);
    } catch (error) {
      console.error("Gagal load detail struk", error);
    } finally {
      setIsLoadingStrukId(null);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1. Filter Search (Plat Nomor)
      const matchesSearch = item.plat_nomor
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // 2. Filter Status
      let matchesStatus = true;
      if (statusFilter === "masuk") matchesStatus = item.status === "parkir";
      else if (statusFilter === "keluar")
        matchesStatus = item.status === "selesai";
      else if (statusFilter === "pending")
        matchesStatus = item.status === "menunggu_bayar";

      // 3. Filter Date Range
      let matchesDate = true;
      if (startDate || endDate) {
        const itemDate = new Date(item.waktu_masuk);
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (itemDate < start) matchesDate = false;
        }
        if (endDate && matchesDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (itemDate > end) matchesDate = false;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [data, searchQuery, statusFilter, startDate, endDate]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // --- EXPORT CSV ---
  const handleExport = () => {
    if (filteredData.length === 0) return;

    const headers = [
      "No",
      "ID Tiket",
      "Plat Nomor",
      "Jenis",
      "Masuk",
      "Keluar",
      "Status",
      "Biaya",
      "Area",
    ];

    const csvRows = filteredData.map((item, index) => {
      const masuk = new Date(item.waktu_masuk).toLocaleString("id-ID");
      const keluar = item.waktu_keluar
        ? new Date(item.waktu_keluar).toLocaleString("id-ID")
        : "-";
      const area = item.area?.nama_area || "-";

      return [
        index + 1,
        item.struk_id,
        `"${item.plat_nomor}"`,
        item.jenis_kendaraan,
        `"${masuk}"`,
        `"${keluar}"`,
        item.status,
        item.biaya_total,
        `"${area}"`,
      ].join(",");
    });

    const csvString = "\uFEFF" + [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    let fileName = "Laporan_Parkir";
    if (startDate && endDate) {
      fileName += `_${startDate}_sd_${endDate}`;
    } else if (startDate) {
      fileName += `_dari_${startDate}`;
    } else {
      fileName += `_${new Date().toISOString().split("T")[0]}`;
    }

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "parkir":
        return (
          <span className="inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#E3FDFD] text-[#71C9CE] border border-[#A6E3E9] uppercase tracking-wide">
            Active
          </span>
        );
      case "selesai":
        return (
          <span className="inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wide">
            Done
          </span>
        );
      case "menunggu_bayar":
        return (
          <span className="inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-wide">
            Unpaid
          </span>
        );
      default:
        return (
          <span className="text-gray-400 text-xs font-bold uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <DashboardLayout requiredRole="petugas">
      <StrukPrintTemplate data={strukData} componentRef={strukRef} />

      {showModal && (
        <StrukModal
          data={strukData}
          onClose={() => setShowModal(false)}
          onPrint={handlePrint}
        />
      )}

      {/* HEADER */}
      <div className="mb-10 relative z-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Riwayat <span className="text-[#71C9CE]">Transaksi</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1 font-medium">
          Arsip data kendaraan masuk dan keluar.
        </p>
      </div>

      {/* === FILTER BAR & EXPORT === */}
      <div
        className={cn(
          GLASS_CARD,
          "p-4 md:p-6 mb-8 flex flex-col lg:flex-row items-stretch lg:items-center gap-4 relative z-10",
        )}
      >
        {/* 1. Search Input (Full width on mobile, Flexible on desktop) */}
        <div className="flex-1 w-full">
          <Input
            placeholder="Cari Plat Nomor..."
            startIcon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white pl-11 h-12 w-full"
          />
        </div>

        {/* 2. Date Range Inputs (Stack on mobile, Side-by-side on md/lg) */}
        <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white h-12 w-full md:w-auto lg:w-40"
            placeholder="Dari Tanggal"
            title="Dari Tanggal"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white h-12 w-full md:w-auto lg:w-40"
            placeholder="Sampai Tanggal"
            title="Sampai Tanggal"
          />
        </div>

        {/* 3. Status Select & Export (Stack on mobile, Side-by-side on md/lg) */}
        <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto">
          <div className="w-full md:w-48 lg:w-48">
            <Select
              options={[
                { value: "all", label: "Semua Status" },
                { value: "masuk", label: "Sedang Parkir" },
                { value: "keluar", label: "Selesai" },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white pl-4 h-12 w-full"
            />
          </div>

          <Button
            onClick={handleExport}
            disabled={filteredData.length === 0}
            className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 h-12 px-6 rounded-2xl flex items-center justify-center gap-2 whitespace-nowrap font-bold"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* DATA CONTAINER */}
      <div
        className={cn(GLASS_CARD, "flex flex-col min-h-[500px] relative z-10")}
      >
        {/* === 1. DESKTOP VIEW (TABLE) === */}
        <div className="hidden md:block overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#E3FDFD]/50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-[#A6E3E9]/30">
              <tr>
                <th className="px-8 py-5">Waktu</th>
                <th className="px-6 py-5">Kendaraan</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Tagihan</th>
                <th className="px-6 py-5 text-center">Struk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse bg-white/30">
                    <td colSpan={5} className="p-6">
                      <div className="h-6 bg-gray-200 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-24 text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                      <Search className="w-10 h-10 text-gray-300" />
                      <p className="font-bold text-sm">Data tidak ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((row) => (
                  <tr
                    key={row.id_transaksi}
                    className="hover:bg-white/60 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                        <Clock className="w-3.5 h-3.5 text-[#71C9CE]" />
                        {new Date(row.waktu_masuk).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-1 uppercase tracking-wide">
                        <Calendar className="w-3 h-3" />
                        {new Date(row.waktu_masuk).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#71C9CE] to-[#A6E3E9] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#71C9CE]/20">
                          <CarFront className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-black block text-slate-800 text-sm">
                            {row.plat_nomor}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                            {row.jenis_kendaraan}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">{getStatusBadge(row.status)}</td>
                    <td className="px-8 py-5 text-right font-black text-slate-700">
                      {row.biaya_total > 0 ? (
                        formatRupiah(row.biaya_total)
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => openStrukModal(row.id_transaksi)}
                        disabled={isLoadingStrukId === row.id_transaksi}
                        className="p-2.5 rounded-xl hover:bg-[#E3FDFD] text-slate-400 hover:text-[#71C9CE] transition-all border border-transparent hover:border-[#A6E3E9]"
                        title="Lihat Struk"
                      >
                        {isLoadingStrukId === row.id_transaksi ? (
                          <Loader2 className="w-4 h-4 animate-spin text-[#71C9CE]" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* === 2. MOBILE VIEW (CARDS) === */}
        <div className="md:hidden flex-1 p-4 space-y-4 bg-slate-50/50">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl animate-pulse space-y-3 shadow-sm"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : currentItems.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Search className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="font-bold text-sm">Data tidak ditemukan</p>
            </div>
          ) : (
            currentItems.map((row) => (
              <div
                key={row.id_transaksi}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 relative overflow-hidden"
              >
                {/* Decorative status bar left */}
                <div
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-1.5",
                    row.status === "selesai"
                      ? "bg-emerald-400"
                      : "bg-[#71C9CE]",
                  )}
                />

                <div className="flex justify-between items-start pl-2">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(row.waktu_masuk).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      })}
                    </div>
                    <div className="font-bold text-slate-600 text-xs mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(row.waktu_masuk).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  {getStatusBadge(row.status)}
                </div>

                <div className="flex items-center gap-3 pl-2">
                  <div className="w-12 h-12 bg-[#E3FDFD] rounded-xl flex items-center justify-center text-[#71C9CE]">
                    <CarFront className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-lg font-black text-slate-800">
                      {row.plat_nomor}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 uppercase">
                      {row.jenis_kendaraan}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 pl-2 mt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">
                      Total Biaya
                    </span>
                    <div className="font-black text-slate-700 text-base">
                      {row.biaya_total > 0
                        ? formatRupiah(row.biaya_total)
                        : "-"}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => openStrukModal(row.id_transaksi)}
                    disabled={isLoadingStrukId === row.id_transaksi}
                    className="bg-white border border-slate-200 text-slate-600 hover:bg-[#E3FDFD] hover:text-[#71C9CE] shadow-sm h-9 px-4"
                  >
                    {isLoadingStrukId === row.id_transaksi ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-1.5" /> Detail
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Pagination */}
        <div className="mt-auto border-t border-[#A6E3E9]/30 p-5 bg-gradient-to-r from-[#E3FDFD]/30 to-white/30 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400">
            Page {currentPage} of {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="h-9 w-9 p-0 bg-white"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-9 w-9 p-0 bg-white"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
