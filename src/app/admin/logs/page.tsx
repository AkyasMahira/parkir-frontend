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
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  History,
  Clock,
  User as UserIcon,
} from "lucide-react";
import { getInitials, cn } from "@/lib/utils";
import api from "@/lib/axios";

interface LogData {
  id_log: number;
  aktivitas: string;
  waktu_aktivitas: string;
  user: {
    nama_lengkap: string;
    role: "admin" | "petugas" | "owner";
  } | null;
}

const GLASS_STYLE =
  "bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-blue-900/5";

export default function LogPage() {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(true);
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
      setLogs(data); // Backend sudah mengurutkan berdasarkan DESC
    } catch (error) {
      console.error("Gagal ambil logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

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

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter]);

  const getActivityStyle = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes("hapus") || t.includes("delete"))
      return {
        icon: Trash2,
        color: "text-rose-600 bg-rose-50 border-rose-100 ring-rose-500/20",
      };
    if (
      t.includes("tambah") ||
      t.includes("create") ||
      t.includes("check-in") ||
      t.includes("masuk")
    )
      return {
        icon: PlusCircle,
        color:
          "text-emerald-600 bg-emerald-50 border-emerald-100 ring-emerald-500/20",
      };
    if (
      t.includes("edit") ||
      t.includes("update") ||
      t.includes("checkout") ||
      t.includes("keluar")
    )
      return {
        icon: Edit,
        color: "text-sky-600 bg-sky-50 border-sky-100 ring-sky-500/20",
      };
    if (t.includes("login"))
      return {
        icon: LogIn,
        color:
          "text-indigo-600 bg-indigo-50 border-indigo-100 ring-indigo-500/20",
      };

    return {
      icon: FileText,
      color: "text-slate-600 bg-slate-50 border-slate-100 ring-slate-500/20",
    };
  };

  return (
    <DashboardLayout requiredRole="admin">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-purple-400/5 rounded-full blur-[120px]" />
      </div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2 text-indigo-600 font-bold text-xs uppercase tracking-[0.2em]">
            <ShieldCheck size={16} /> Audit Trail & System Security
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            Log{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Aktivitas
            </span>
          </h1>
        </div>

        <Button
          onClick={fetchLogs}
          disabled={loading}
          className="bg-white/50 backdrop-blur-md border border-slate-200 text-slate-700 hover:bg-white rounded-2xl px-6 py-6 shadow-sm flex items-center gap-2 font-bold"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          Refresh Audit
        </Button>
      </div>

      {/* FILTER BOX */}
      <div
        className={cn(
          GLASS_STYLE,
          "p-6 rounded-3xl mb-8 flex flex-col md:flex-row gap-4",
        )}
      >
        <div className="flex-1 relative">
          <Input
            placeholder="Cari aktivitas atau nama petugas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/50 border-white/60 focus:bg-white rounded-2xl pl-12 h-12"
          />
          <Search
            className="absolute left-4 top-3.5 text-slate-400"
            size={18}
          />
        </div>
        <div className="w-full md:w-56">
          <Select
            options={[
              { value: "all", label: "Semua Jabatan" },
              { value: "admin", label: "Administrator" },
              { value: "petugas", label: "Petugas Lapangan" },
              { value: "owner", label: "Pemilik (Owner)" },
            ]}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-2xl h-12"
          />
        </div>
      </div>

      {/* LOG TABLE */}
      <div
        className={cn(
          GLASS_STYLE,
          "rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px]",
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-white/40 text-slate-400 font-bold text-[10px] uppercase tracking-[0.15em] border-b border-white/40">
                <th className="px-8 py-5 flex items-center gap-2">
                  <Clock size={12} /> Waktu Kejadian
                </th>
                <th className="px-8 py-5">
                  <UserIcon size={12} className="inline mr-2" />
                  Pelaku Sistem
                </th>
                <th className="px-8 py-5">Detail Deskripsi Aktivitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={3} className="px-8 py-8">
                      <div className="h-10 bg-white/40 rounded-2xl w-full" />
                    </td>
                  </tr>
                ))
              ) : currentLogs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-32 text-center">
                    <div className="flex flex-col items-center opacity-30 italic">
                      <History size={64} strokeWidth={1} />
                      <p className="mt-4 text-lg font-bold">
                        Belum ada rekaman aktivitas hari ini
                      </p>
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
                      className="group hover:bg-white/40 transition-all duration-300"
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-800 text-base italic tracking-tight">
                            {new Date(log.waktu_aktivitas).toLocaleTimeString(
                              "id-ID",
                              { hour: "2-digit", minute: "2-digit" },
                            )}{" "}
                            WIB
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                            {new Date(log.waktu_aktivitas).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              "w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black text-white shadow-lg shadow-indigo-100",
                              log.user?.role === "admin"
                                ? "bg-indigo-600"
                                : log.user?.role === "petugas"
                                  ? "bg-sky-600"
                                  : log.user?.role === "owner"
                                    ? "bg-amber-500"
                                    : "bg-slate-400",
                            )}
                          >
                            {getInitials(log.user?.nama_lengkap || "?")}
                          </div>
                          <div>
                            <div className="font-black text-slate-800 tracking-tight leading-none mb-1">
                              {log.user?.nama_lengkap || (
                                <span className="text-rose-500 italic">
                                  User Terhapus
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/60 border border-slate-100 text-slate-500 uppercase">
                              {log.user?.role || "unknown"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              "p-2.5 rounded-xl border-2 ring-4",
                              style.color,
                            )}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <p className="text-slate-700 font-bold leading-relaxed max-w-xl">
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

        {/* PAGINATION FOOTER */}
        <div className="mt-auto border-t border-white/40 p-6 bg-white/30 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing <span className="text-slate-800">{currentLogs.length}</span>{" "}
            of {filteredLogs.length} entries
          </p>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="rounded-xl border-slate-200 bg-white/50 px-4 py-2 hover:bg-white"
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="text-xs font-black text-slate-800 px-3 py-1 bg-white rounded-lg shadow-sm">
              {currentPage} / {totalPages || 1}
            </div>
            <Button
              variant="outline"
              disabled={currentPage >= totalPages || loading}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="rounded-xl border-slate-200 bg-white/50 px-4 py-2 hover:bg-white"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
