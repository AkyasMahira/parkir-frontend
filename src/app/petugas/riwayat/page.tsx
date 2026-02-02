"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import {
  Search,
  Download,
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

/* =========================================
   1. KOMPONEN STRUK (HIDDEN - UNTUK PRINT)
   ========================================= */
const StrukPrintTemplate = ({ data, componentRef }: any) => {
  if (!data) return null;
  return (
    <div className="hidden">
      <div ref={componentRef} className="p-4 font-mono text-xs w-[58mm]">
        <div className="text-center font-bold mb-2 uppercase">
          PARKIRAN CANGGIH
          <br />
          <span className="font-normal capitalize">Jl. Teknologi No. 1</span>
        </div>
        <div className="border-b border-dashed border-black my-2" />
        <table className="w-full text-[10px]">
          <tbody>
            <tr>
              <td>ID Tiket</td>
              <td className="text-right font-bold">{data.struk_id}</td>
            </tr>
            <tr>
              <td>Plat</td>
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
   2. KOMPONEN MODAL PREVIEW STRUK
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
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden scale-100 animate-in zoom-in-95 duration-200 border border-white/40">
        <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <CarFront className="w-5 h-5 text-blue-600" /> Detail Struk
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 bg-gray-100 flex justify-center">
          <div className="bg-white p-4 w-full shadow-sm border border-gray-200 text-sm font-mono leading-relaxed relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[linear-gradient(135deg,transparent_5px,#fff_5px),linear-gradient(-135deg,transparent_5px,#fff_5px)] bg-[length:10px_10px] bg-repeat-x -mt-1 transform rotate-180"></div>

            <div className="text-center font-bold mb-4">
              PARKIRAN CANGGIH
              <br />
              <span className="font-normal text-xs text-gray-500">
                Jl. Teknologi No. 1
              </span>
            </div>

            <div className="space-y-1 border-b border-dashed border-gray-300 pb-3 mb-3">
              <div className="flex justify-between">
                <span>ID Tiket</span>{" "}
                <span className="font-bold">{data.struk_id}</span>
              </div>
              <div className="flex justify-between">
                <span>Plat</span>{" "}
                <span className="font-bold uppercase">{data.plat_nomor}</span>
              </div>
              <div className="flex justify-between">
                <span>Masuk</span> <span>{data.waktu_masuk}</span>
              </div>
              <div className="flex justify-between">
                <span>Keluar</span> <span>{data.waktu_keluar || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span>Durasi</span> <span>{data.durasi || "-"}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>TOTAL</span>
              <span>{formatRupiah(data.biaya || data.biaya_total || 0)}</span>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-[linear-gradient(135deg,transparent_5px,#fff_5px),linear-gradient(-135deg,transparent_5px,#fff_5px)] bg-[length:10px_10px] bg-repeat-x -mb-1"></div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-100 flex gap-3">
          <Button variant="outline" fullWidth onClick={onClose}>
            Tutup
          </Button>
          <Button fullWidth onClick={onPrint} leftIcon={Printer}>
            Cetak Struk
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

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
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
      const matchesSearch = item.plat_nomor
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      let matchesStatus = true;
      if (statusFilter === "masuk") matchesStatus = item.status === "parkir";
      else if (statusFilter === "keluar")
        matchesStatus = item.status === "selesai";
      else if (statusFilter === "pending")
        matchesStatus = item.status === "menunggu_bayar";
      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // --- HANDLE EXPORT CSV ---
  // Fungsi ini otomatis export data sesuai apa yang tampil (Filtered Data)
  const handleExport = () => {
    if (filteredData.length === 0) return;

    // 1. Buat Header CSV
    const headers = [
      "No",
      "ID Tiket",
      "Plat Nomor",
      "Jenis Kendaraan",
      "Waktu Masuk",
      "Waktu Keluar",
      "Status",
      "Biaya Total",
      "Area Parkir",
    ];

    // 2. Map Data ke Format CSV
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
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Laporan_Parkir_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "parkir":
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
            Sedang Parkir
          </span>
        );
      case "selesai":
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
            Selesai
          </span>
        );
      case "menunggu_bayar":
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
            Menunggu Bayar
          </span>
        );
      default:
        return <span className="text-gray-500 text-xs">{status}</span>;
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

      {/* HEADER SIMPLE */}
      <div className="mb-6 relative z-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Riwayat <span className="text-blue-600">Transaksi</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Pantau arus kendaraan dan lihat detail struk.
        </p>
      </div>

      {/* === FILTER BAR & EXPORT (DISATUKAN) === */}
      <div className="bg-white/60 backdrop-blur-xl p-4 rounded-3xl shadow-lg border border-white/50 mb-8 flex flex-col lg:flex-row gap-4 relative z-10">
        {/* Search Input - Expands */}
        <div className="flex-1">
          <Input
            placeholder="Cari Plat Nomor..."
            startIcon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/50 h-11"
          />
        </div>

        {/* Status Select - Fixed Width */}
        <div className="w-full lg:w-56">
          <Select
            options={[
              { value: "all", label: "Semua Status" },
              { value: "masuk", label: "Sedang Parkir" },
              { value: "keluar", label: "Selesai" },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/50 h-11"
          />
        </div>

        {/* Separator Vertical di Desktop */}
        <div className="hidden lg:block w-px h-10 bg-gray-300/50 mx-2"></div>

        {/* Export Button - Compact & Modern */}
        <Button
          onClick={handleExport}
          disabled={filteredData.length === 0}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 h-11 px-6 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden min-h-[400px] flex flex-col relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/40 text-gray-500 font-semibold border-b border-gray-200/50 uppercase text-xs">
              <tr>
                <th className="px-6 py-5">Waktu</th>
                <th className="px-6 py-5">Kendaraan</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Tagihan</th>
                <th className="px-6 py-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="p-4">
                      <div className="h-8 bg-gray-200/50 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-500">
                    <div className="flex flex-col items-center">
                      <Search className="w-10 h-10 text-gray-300 mb-2" />
                      <p>Data tidak ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((row) => (
                  <tr
                    key={row.id_transaksi}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        {new Date(row.waktu_masuk).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {new Date(row.waktu_masuk).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                          <CarFront className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <span className="font-bold block text-gray-900">
                            {row.plat_nomor}
                          </span>
                          <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-bold text-gray-500 uppercase">
                            {row.jenis_kendaraan}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(row.status)}</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                      {row.biaya_total > 0
                        ? formatRupiah(row.biaya_total)
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openStrukModal(row.id_transaksi)}
                        disabled={isLoadingStrukId === row.id_transaksi}
                        className="h-9 w-9 p-0 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-all text-gray-500"
                        title="Lihat Struk"
                      >
                        {isLoadingStrukId === row.id_transaksi ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-auto border-t border-gray-200/50 p-4 bg-white/40 flex justify-between items-center backdrop-blur-sm">
          <span className="text-xs text-gray-500">
            Hal {currentPage} dari {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-white/60"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-white/60"
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
