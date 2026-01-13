"use client";

import { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select"; 
import { Button } from "@/components/ui/Button";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
} from "lucide-react";
import { formatRupiah, cn } from "@/lib/utils";
import api from "@/lib/axios";
import { Transaksi } from "@/types/api"; 

export default function RiwayatPage() {
  // --- STATE ---
  const [data, setData] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/parking?limit=500");

      const rawData = Array.isArray(res.data.data) ? res.data.data : res.data;

      const sortedData = rawData.sort(
        (a: any, b: any) =>
          new Date(b.waktu_masuk).getTime() - new Date(a.waktu_masuk).getTime()
      );

      setData(sortedData);
    } catch (error) {
      console.error("Gagal memuat data riwayat:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = item.plat_nomor
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all"
          ? true
          : item.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // --- HELPERS ---
  const getStatusBadge = (status: string) => {
    if (status.toLowerCase() === "masuk") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
          Masih Parkir
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
        Selesai
      </span>
    );
  };

  return (
    <DashboardLayout requiredRole="petugas">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Riwayat Transaksi
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Pantau arus kendaraan masuk dan keluar secara real-time.
          </p>
        </div>

        <Button variant="outline" size="sm" leftIcon={Download}>
          Export Data
        </Button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-end md:items-center">
        <div className="w-full md:w-72">
          <Input
            placeholder="Cari Plat Nomor..."
            startIcon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full md:w-48">
          <Select
            options={[
              { value: "all", label: "Semua Status" },
              { value: "masuk", label: "Masih Parkir" },
              { value: "keluar", label: "Selesai (Keluar)" },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>

        <div className="flex-1 text-right text-xs text-gray-500 hidden md:block">
          Menampilkan {filteredData.length} data
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[500px]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Plat Nomor</th>
                <th className="px-6 py-4">Lokasi</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Tagihan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                // SKELETON LOADING
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : currentItems.length === 0 ? (
                // EMPTY STATE
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Filter className="w-12 h-12 mb-3 text-gray-200" />
                      <p className="font-medium text-gray-500">
                        Data tidak ditemukan.
                      </p>
                      <p className="text-xs">
                        Coba ubah filter pencarian Anda.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // DATA ROWS
                currentItems.map((row) => (
                  <tr
                    key={row.id_transaksi}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Kolom Waktu */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-gray-900 font-medium">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(row.waktu_masuk).toLocaleTimeString(
                            "id-ID",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(row.waktu_masuk).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "short", year: "numeric" }
                          )}
                        </div>
                        {row.waktu_keluar && (
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            Keluar:{" "}
                            {new Date(row.waktu_keluar).toLocaleTimeString(
                              "id-ID",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Kolom Plat */}
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-800 text-base">
                        {row.plat_nomor}
                      </span>
                      <p className="text-xs text-gray-500 capitalize">
                        {row.jenis_kendaraan}
                      </p>
                    </td>

                    {/* Kolom Lokasi */}
                    <td className="px-6 py-4">
                      <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                        {row.area?.nama_area || "Area Umum"}
                      </span>
                    </td>

                    {/* Kolom Status */}
                    <td className="px-6 py-4">{getStatusBadge(row.status)}</td>

                    {/* Kolom Biaya */}
                    <td className="px-6 py-4 text-right">
                      {row.biaya_total > 0 ? (
                        <span className="font-bold text-gray-900">
                          {formatRupiah(row.biaya_total)}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs italic">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER: PAGINATION */}
        <div className="mt-auto border-t border-gray-100 p-4 bg-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Halaman {currentPage} dari {totalPages || 1}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || loading}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
