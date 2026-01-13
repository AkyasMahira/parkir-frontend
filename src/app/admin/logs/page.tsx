"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import api from "@/lib/axios";

interface LogData {
  id_log: number;
  aktivitas: string;
  waktu_aktivitas: string; 
  user: {
    nama_lengkap: string;
    role: string;
  } | null; 
}

export default function LogPage() {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil data dari API
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/logs");
      setLogs(response.data.data);
    } catch (error) {
      console.error("Gagal ambil logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <DashboardLayout requiredRole="admin">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Log Aktivitas</h1>
          <p className="text-gray-500 text-sm">
            Rekaman jejak aktivitas sistem parkir.
          </p>
        </div>

        {/* Tombol Refresh Manual */}
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors shadow-sm"
        >
          🔄 Refresh Data
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Waktu</th>
              <th className="px-6 py-4">Pelaku (User)</th>
              <th className="px-6 py-4">Detail Aktivitas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-12 text-gray-400">
                  Sedang memuat data log...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-12 text-gray-400">
                  Belum ada aktivitas tercatat.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id_log}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {/* Format Waktu Indonesia (Tgl Bulan Jam:Menit) */}
                    {new Date(log.waktu_aktivitas).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    WIB
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar Inisial */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
                        ${
                          log.user?.role === "admin"
                            ? "bg-purple-500"
                            : log.user?.role === "petugas"
                            ? "bg-blue-500"
                            : "bg-gray-400"
                        }`}
                      >
                        {log.user?.nama_lengkap.charAt(0) || "?"}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {log.user?.nama_lengkap || (
                            <span className="text-red-400 italic">
                              User Terhapus
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 capitalize">
                          {log.user?.role || "-"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {log.aktivitas}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
