"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  MapPin,
  Car,
  Trash2,
  Plus,
  Maximize,
  AlertCircle,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";

// --- TYPES ---
interface AreaParkir {
  id_area: number;
  nama_area: string;
  kapasitas: number;
  terisi: number;
}

export default function AreaPage() {
  const [areas, setAreas] = useState<AreaParkir[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    nama_area: "",
    kapasitas: "",
  });

  // --- FETCH DATA ---
  const fetchAreas = async () => {
    setLoading(true);
    try {
      const res = await api.get("/areas");
      const data = Array.isArray(res.data.data) ? res.data.data : res.data;
      setAreas(data);
    } catch (error) {
      console.error("Gagal load area:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi sederhana
    if (!form.nama_area || !form.kapasitas) return;
    if (Number(form.kapasitas) < 1) {
      alert("Kapasitas minimal 1 unit.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/areas", form);
      // alert("✅ Area berhasil ditambah");
      setForm({ nama_area: "", kapasitas: "" }); // Reset
      fetchAreas(); // Refresh
    } catch (error: any) {
      alert("Gagal: " + (error.response?.data?.message || "Error server"));
    } finally {
      setSubmitting(false);
    }
  };

  // --- DELETE ---
  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "⚠️ Hapus Area?\nData transaksi terkait mungkin akan terpengaruh."
      )
    )
      return;

    try {
      await api.delete(`/areas/${id}`);
      fetchAreas();
    } catch (error) {
      alert("Gagal menghapus area.");
    }
  };

  // --- HELPER: PROGRESS BAR COLOR ---
  const getProgressColor = (percent: number) => {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 70) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <DashboardLayout requiredRole="admin">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Area Parkir</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manajemen lokasi parkir dan monitoring kapasitas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* --- FORM CARD (STICKY) --- */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-800">Tambah Lokasi</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Area / Lantai"
              placeholder="Contoh: Lantai 2 (VIP)"
              value={form.nama_area}
              onChange={(e) => setForm({ ...form, nama_area: e.target.value })}
              startIcon={LayoutGrid}
              required
            />

            <Input
              label="Kapasitas Maksimal"
              type="number"
              placeholder="50"
              value={form.kapasitas}
              onChange={(e) => setForm({ ...form, kapasitas: e.target.value })}
              startIcon={Maximize}
              min={1}
              required
              helperText="Jumlah slot kendaraan yang tersedia."
            />

            <Button
              type="submit"
              isLoading={submitting}
              fullWidth
              leftIcon={Plus}
            >
              Simpan Area
            </Button>
          </form>
        </div>

        {/* --- TABLE LIST & MONITORING --- */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-gray-700">Status Kapasitas</h3>
            <span className="text-xs font-medium px-2 py-1 bg-white border border-gray-200 rounded text-gray-500">
              Total: {areas.length} Area
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Nama Area</th>
                  <th className="px-6 py-4 w-1/3">Okupansi (Terisi)</th>
                  <th className="px-6 py-4">Detail</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  // Skeleton
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-5 w-32 bg-gray-200 rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-full bg-gray-200 rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-5 w-16 bg-gray-200 rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-8 w-8 bg-gray-200 rounded ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : areas.length === 0 ? (
                  // Empty State
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-10 h-10 text-gray-300" />
                        <p>Belum ada area parkir.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  areas.map((a) => {
                    // Logic Persentase
                    const percentage = Math.min(
                      Math.round((a.terisi / a.kapasitas) * 100),
                      100
                    );
                    const isFull = a.terisi >= a.kapasitas;

                    return (
                      <tr
                        key={a.id_area}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        {/* Nama Area */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-gray-800 text-base">
                              {a.nama_area}
                            </span>
                          </div>
                        </td>

                        {/* Progress Bar Okupansi */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600 font-medium">
                              {percentage}% Penuh
                            </span>
                            {isFull && (
                              <span className="text-red-600 font-bold text-[10px] uppercase">
                                Full
                              </span>
                            )}
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={cn(
                                "h-2.5 rounded-full transition-all duration-500",
                                getProgressColor(percentage)
                              )}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </td>

                        {/* Detail Angka */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800">
                              {a.terisi}{" "}
                              <span className="text-gray-400 font-normal">
                                / {a.kapasitas}
                              </span>
                            </span>
                            <span className="text-xs text-gray-500">
                              Kendaraan
                            </span>
                          </div>
                        </td>

                        {/* Aksi */}
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(a.id_area)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
