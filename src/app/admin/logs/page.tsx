"use client";

import { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  RefreshCw,
  Search,
  Trash2,
  PlusCircle,
  Edit,
  LogIn,
  LogOut,
  FileText,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  History,
  Clock,
  Filter,
} from "lucide-react";
import { getInitials, cn } from "@/lib/utils";
import api from "@/lib/axios";

// Style Constants
const GLASS_CARD =
  "bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-[#71C9CE]/5 rounded-[2rem] overflow-hidden";

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
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtering & Pagination
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/logs");
      const data = Array.isArray(response.data.data)
        ? response.data.data
        : response.data;
      setLogs(data);
    } catch (error) {
      console.error("Gagal ambil logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter Logic
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.aktivitas.toLowerCase().includes(search.toLowerCase()) ||
        log.user?.nama_lengkap.toLowerCase().includes(search.toLowerCase());
      const matchesRole =
        roleFilter === "all" ? true : log.user?.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [logs, search, roleFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter]);

  // Helper: Activity Icon & Color
  const getActivityStyle = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes("hapus") || t.includes("delete"))
      return {
        icon: Trash2,
        color: "text-rose-500 bg-rose-50 border-rose-100",
      };
    if (t.includes("tambah") || t.includes("create") || t.includes("check-in"))
      return {
        icon: PlusCircle,
        color: "text-emerald-500 bg-emerald-50 border-emerald-100",
      };
    if (t.includes("edit") || t.includes("update"))
      return {
        icon: Edit,
        color: "text-sky-500 bg-sky-50 border-sky-100",
      };
    if (t.includes("login") || t.includes("masuk"))
      return {
        icon: LogIn,
        color: "text-indigo-500 bg-indigo-50 border-indigo-100",
      };
    if (t.includes("logout") || t.includes("keluar"))
      return {
        icon: LogOut,
        color: "text-slate-500 bg-slate-50 border-slate-200",
      };

    return {
      icon: FileText,
      color: "text-slate-500 bg-slate-50 border-slate-200",
    };
  };

  return (
    <DashboardLayout requiredRole="admin">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-[#71C9CE]" />
            <span className="text-xs font-bold text-[#71C9CE] uppercase tracking-widest">
              Audit Trail
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Log Aktivitas Transaksi
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">
            Rekaman jejak digital operasional.
          </p>
        </div>

        <Button
          onClick={fetchLogs}
          disabled={loading}
          variant="secondary"
          className="shadow-sm border-gray-200 w-full md:w-auto"
        >
          <RefreshCw
            className={cn("w-4 h-4 mr-2", loading && "animate-spin")}
          />
          Refresh Data
        </Button>
      </div>

      {/* FILTER BAR */}
      <div className={cn(GLASS_CARD, "p-6 mb-8")}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#71C9CE] transition-colors" />
            <Input
              placeholder="Cari aktivitas atau nama user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white pl-12 h-12"
            />
          </div>

          {/* <div className="w-full md:w-64 relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
            <Select
              options={[
                { value: "all", label: "Semua Role" },
                { value: "admin", label: "Admin" },
                { value: "petugas", label: "Petugas" },
                { value: "owner", label: "Owner" },
              ]}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white pl-10 h-12"
            />
          </div> */}
        </div>
      </div>

      {/* LOG LIST CARD */}
      <div className={cn(GLASS_CARD, "flex flex-col min-h-[500px]")}>
        {/* === 1. DESKTOP VIEW (TABLE) === */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#E3FDFD]/50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-[#A6E3E9]/30">
              <tr>
                <th className="px-8 py-5 flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Timestamp
                </th>
                <th className="px-8 py-5">User / Aktor</th>
                <th className="px-8 py-5">Detail Aktivitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse bg-white/30">
                    <td className="px-8 py-6">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                    </td>
                    <td className="px-8">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </td>
                    <td className="px-8">
                      <div className="h-4 w-64 bg-gray-200 rounded" />
                    </td>
                  </tr>
                ))
              ) : currentLogs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-24 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                      <History className="w-8 h-8 text-slate-300" />
                      <p>Tidak ada log ditemukan</p>
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
                      className="group hover:bg-white/60 transition-all duration-200"
                    >
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 text-sm">
                            {new Date(log.waktu_aktivitas).toLocaleTimeString(
                              "id-ID",
                              { hour: "2-digit", minute: "2-digit" },
                            )}{" "}
                            WIB
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                            {new Date(log.waktu_aktivitas).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#71C9CE] to-[#A6E3E9] flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-[#71C9CE]/20">
                            {getInitials(log.user?.nama_lengkap || "?")}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm leading-tight">
                              {log.user?.nama_lengkap || (
                                <span className="italic text-slate-400">
                                  Deleted User
                                </span>
                              )}
                            </p>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#E3FDFD] text-[#71C9CE] border border-[#A6E3E9] uppercase mt-0.5">
                              {log.user?.role || "UNKNOWN"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-5">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "p-2 rounded-lg border shrink-0 mt-0.5",
                              style.color,
                            )}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed font-medium pt-1">
                            {log.aktivitas}
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* === 2. MOBILE VIEW (CARD LIST) === */}
        <div className="md:hidden flex flex-col p-4 gap-4 bg-slate-50/50">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-2xl animate-pulse space-y-3"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-6 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))
          ) : currentLogs.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>Tidak ada log ditemukan</p>
            </div>
          ) : (
            currentLogs.map((log) => {
              const style = getActivityStyle(log.aktivitas);
              const Icon = style.icon;

              return (
                <div
                  key={log.id_log}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 relative"
                >
                  {/* Activity Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-lg text-[10px] font-bold border uppercase",
                        style.color,
                      )}
                    >
                      {log.user?.role || "SYSTEM"}
                    </span>
                  </div>

                  {/* User Info & Time */}
                  <div className="flex items-center gap-3 pr-16">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#71C9CE] to-[#A6E3E9] flex items-center justify-center text-white text-xs font-bold shadow-md shadow-[#71C9CE]/20 shrink-0">
                      {getInitials(log.user?.nama_lengkap || "?")}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        {log.user?.nama_lengkap || "Deleted User"}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(log.waktu_aktivitas).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Activity Content */}
                  <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Icon
                      className={cn(
                        "w-4 h-4 mt-0.5 shrink-0",
                        style.color.split(" ")[0],
                      )}
                    />
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      {log.aktivitas}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER PAGINATION */}
        <div className="mt-auto border-t border-[#A6E3E9]/30 p-4 md:p-6 bg-gradient-to-r from-[#E3FDFD]/30 to-white/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-400">
            Showing <span className="text-slate-800">{currentLogs.length}</span>{" "}
            of {filteredLogs.length} records
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="px-3 py-2 bg-white rounded-lg text-xs font-black text-slate-700 border border-gray-100 shadow-sm">
              {currentPage} / {totalPages || 1}
            </span>

            <Button
              variant="secondary"
              disabled={currentPage >= totalPages || loading}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-9 w-9 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
