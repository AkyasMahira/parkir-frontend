"use client";

import { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select"; // Gunakan komponen Select kita
import {
  RefreshCw,
  Search,
  Trash2,
  PlusCircle,
  Edit,
  LogIn,
  LogOut,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getInitials, cn } from "@/lib/utils";
import api from "@/lib/axios";

// --- TYPES ---
interface LogData {
  id_log: number;
  aktivitas: string;
  waktu_aktivitas: string;
  user: {
    nama_lengkap: string;
    role: "admin" | "petugas" | "owner";
  } | null;
}

export default function LogPage() {
  // --- STATE ---
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Pagination State
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Jumlah data per halaman

  // --- FETCH DATA ---
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/logs");
      // Handle response structure
      const data = Array.isArray(response.data.data)
        ? response.data.data
        : response.data;

      // Sort: Paling baru di atas
      const sortedData = data.sort(
        (a: LogData, b: LogData) =>
          new Date(b.waktu_aktivitas).getTime() -
          new Date(a.waktu_aktivitas).getTime()
      );

      setLogs(sortedData);
    } catch (error) {
      console.error("Gagal ambil logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // --- LOGIC FILTER & PAGINATION (Client Side) ---
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // 1. Filter Search (Cari di aktivitas atau nama user)
      const matchesSearch =
        log.aktivitas.toLowerCase().includes(search.toLowerCase()) ||
        log.user?.nama_lengkap.toLowerCase().includes(search.toLowerCase());

      // 2. Filter Role
      const matchesRole =
        roleFilter === "all" ? true : log.user?.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [logs, search, roleFilter]);

  // Hitung Slice Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page jika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter]);

  // --- HELPER: ICON & COLOR BY ACTIVITY ---
  const getActivityStyle = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes("hapus") || t.includes("delete"))
      return { icon: Trash2, color: "text-red-600 bg-red-50 border-red-100" };
    if (t.includes("tambah") || t.includes("create") || t.includes("input"))
      return {
        icon: PlusCircle,
        color: "text-green-600 bg-green-50 border-green-100",
      };
    if (t.includes("edit") || t.includes("update") || t.includes("ubah"))
      return {
        icon: Edit,
        color: "text-amber-600 bg-amber-50 border-amber-100",
      };
    if (t.includes("login"))
      return { icon: LogIn, color: "text-blue-600 bg-blue-50 border-blue-100" };
    if (t.includes("logout"))
      return {
        icon: LogOut,
        color: "text-gray-600 bg-gray-50 border-gray-100",
      };

    return {
      icon: FileText,
      color: "text-gray-600 bg-gray-50 border-gray-100",
    };
  };

  return (
    <DashboardLayout requiredRole="admin">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Log Aktivitas</h1>
          <p className="text-gray-500 text-sm mt-1">
            Rekaman jejak digital dan audit sistem.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchLogs}
          disabled={loading}
          leftIcon={RefreshCw}
          className={loading ? "animate-pulse" : ""}
        >
          Refresh Data
        </Button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Cari aktivitas atau nama user..."
            startIcon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            options={[
              { value: "all", label: "Semua Role" },
              { value: "admin", label: "Admin" },
              { value: "petugas", label: "Petugas" },
              { value: "owner", label: "Owner" },
            ]}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[250px]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-[20%]">Waktu</th>
                <th className="px-6 py-4 w-[25%]">Pelaku (User)</th>
                <th className="px-6 py-4 w-[55%]">Detail Aktivitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                // Skeleton
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-10 w-40 bg-gray-200 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-64 bg-gray-200 rounded" />
                    </td>
                  </tr>
                ))
              ) : currentLogs.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={3} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-10 h-10 text-gray-300" />
                      <p>Tidak ada aktivitas ditemukan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentLogs.map((log) => {
                  const style = getActivityStyle(log.aktivitas);
                  const Icon = style.icon;

                  return (
                    <tr
                      key={log.id_log}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Kolom Waktu */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {new Date(log.waktu_aktivitas).toLocaleTimeString(
                              "id-ID",
                              { hour: "2-digit", minute: "2-digit" }
                            )}{" "}
                            WIB
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(log.waktu_aktivitas).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Kolom User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase",
                              log.user?.role === "admin"
                                ? "bg-purple-500"
                                : log.user?.role === "petugas"
                                ? "bg-blue-500"
                                : log.user?.role === "owner"
                                ? "bg-amber-500"
                                : "bg-gray-400"
                            )}
                          >
                            {getInitials(log.user?.nama_lengkap || "?")}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {log.user?.nama_lengkap || (
                                <span className="text-red-400 italic">
                                  User Terhapus
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                              {log.user?.role || "-"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Kolom Aktivitas */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn("p-2 rounded-lg border", style.color)}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-gray-700 font-medium">
                            {log.aktivitas}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="mt-auto border-t border-gray-100 p-4 bg-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Halaman {currentPage} dari {totalPages || 1} • Total{" "}
            {filteredLogs.length} Entri
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
