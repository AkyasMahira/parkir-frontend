"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  MapPin,
  Trash2,
  Plus,
  AlertCircle,
  Info,
  Layers,
  Pencil,
  X,
  AlertTriangle,
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

const GLASS_STYLE =
  "bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-blue-900/5";

const GlassModal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-white/90 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-[2rem] w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200",
          maxWidth,
        )}
      >
        <div className="flex justify-between items-center px-2 py-1.5 border-b border-gray-100/50">
          {/* <h3 className="font-black text-slate-800 text-lg">{title}</h3> */}
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            {/* <X size={18} /> */}
          </button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default function AreaPage() {
  const [areas, setAreas] = useState<AreaParkir[]>([]);
  const [loading, setLoading] = useState(true);

  // --- STATES UNTUK MODAL & EDIT ---
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<AreaParkir | null>(null);

  // State untuk form create/edit
  const [form, setForm] = useState({ nama_area: "", kapasitas: "" });

  // State loading saat submit/delete
  const [processing, setProcessing] = useState(false);

  // State Error Message (pengganti alert)
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  // --- RESET HANDLER ---
  const resetState = () => {
    setForm({ nama_area: "", kapasitas: "" });
    setSelectedArea(null);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setErrorMsg(null);
    setProcessing(false);
  };

  // --- CREATE ---
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama_area || !form.kapasitas) return;

    setProcessing(true);
    setErrorMsg(null);

    try {
      await api.post("/areas", form);
      resetState();
      fetchAreas();
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Gagal membuat area");
      setProcessing(false);
    }
  };

  // --- EDIT ---
  const openEditModal = (area: AreaParkir) => {
    setSelectedArea(area);
    setForm({
      nama_area: area.nama_area,
      kapasitas: area.kapasitas.toString(),
    });
    setErrorMsg(null);
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArea) return;

    setProcessing(true);
    try {
      await api.put(`/areas/${selectedArea.id_area}`, form);
      resetState();
      fetchAreas();
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Gagal update area");
      setProcessing(false);
    }
  };

  // --- DELETE ---
  const openDeleteModal = (area: AreaParkir) => {
    setSelectedArea(area);
    setErrorMsg(null);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedArea) return;

    setProcessing(true);
    try {
      await api.delete(`/areas/${selectedArea.id_area}`);
      resetState();
      fetchAreas();
    } catch (error: any) {
      setErrorMsg("Gagal menghapus area. Pastikan tidak ada transaksi aktif.");
      setProcessing(false);
    }
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return "bg-gradient-to-r from-red-500 to-rose-600";
    if (percent >= 70) return "bg-gradient-to-r from-amber-400 to-orange-500";
    return "bg-gradient-to-r from-emerald-400 to-teal-500";
  };

  return (
    <DashboardLayout requiredRole="admin">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] left-[-5%] w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-[100px]" />
      </div>

      {/* HEADER */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
          <Layers size={14} /> System Infrastructure
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
          Manajemen{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
            Area Parkir
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* --- FORM CARD (CREATE ONLY) --- */}
        <div
          className={cn(
            GLASS_STYLE,
            "lg:col-span-1 p-8 rounded-[2.5rem] sticky top-24",
          )}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-lg">Lokasi Baru</h3>
              <p className="text-xs text-slate-500 font-medium">
                Tambah kapasitas parkir
              </p>
            </div>
          </div>

          {errorMsg && !isEditOpen && !isDeleteOpen && (
            <div className="mb-6 p-4 bg-red-50/80 border border-red-100 rounded-2xl flex gap-3 items-start">
              <AlertCircle className="text-red-500 w-5 h-5 shrink-0" />
              <p className="text-xs text-red-600 font-bold leading-relaxed">
                {errorMsg}
              </p>
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                Nama Area
              </label>
              <Input
                placeholder="Contoh: Gedung A - Lt. 1"
                value={form.nama_area}
                onChange={(e) =>
                  setForm({ ...form, nama_area: e.target.value })
                }
                className="bg-white/50 border-white/60 focus:bg-white rounded-2xl h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                Kapasitas Maksimal
              </label>
              <Input
                type="number"
                placeholder="0"
                value={form.kapasitas}
                onChange={(e) =>
                  setForm({ ...form, kapasitas: e.target.value })
                }
                className="bg-white/50 border-white/60 focus:bg-white rounded-2xl h-12"
              />
            </div>

            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-3 items-start mb-4">
              <Info size={18} className="text-blue-600 mt-0.5" />
              <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                Sistem akan menghitung persentase okupansi secara otomatis.
              </p>
            </div>

            <Button
              type="submit"
              isLoading={processing}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-14 font-bold shadow-xl transition-all active:scale-95"
            >
              Simpan Perubahan
            </Button>
          </form>
        </div>

        {/* --- LIST & MONITORING --- */}
        <div
          className={cn(
            GLASS_STYLE,
            "lg:col-span-2 rounded-[2.5rem] overflow-hidden",
          )}
        >
          <div className="p-8 border-b border-white/40 bg-white/30 flex justify-between items-center">
            <h3 className="font-black text-slate-800 text-xl tracking-tight">
              Status Kapasitas
            </h3>
            <div className="px-4 py-1.5 bg-white/80 rounded-full border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
              {areas.length} Total Area
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-white/40 text-slate-400 font-bold text-[10px] uppercase tracking-[0.15em]">
                <tr>
                  <th className="px-8 py-5">Informasi Lokasi</th>
                  <th className="px-8 py-5">Okupansi Real-time</th>
                  <th className="px-8 py-5 text-right font-black">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={3} className="px-8 py-8">
                        <div className="h-12 bg-white/40 rounded-2xl w-full" />
                      </td>
                    </tr>
                  ))
                ) : areas.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-24 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <AlertCircle size={48} strokeWidth={1} />
                        <p className="mt-4 font-bold">
                          Data area parkir belum tersedia
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  areas.map((a) => {
                    const percentage = Math.min(
                      Math.round((a.terisi / a.kapasitas) * 100),
                      100,
                    );
                    const isFull = a.terisi >= a.kapasitas;

                    return (
                      <tr
                        key={a.id_area}
                        className="group hover:bg-white/40 transition-all duration-300"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                              <MapPin size={20} />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-slate-800 text-lg tracking-tight">
                                {a.nama_area}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Kapasitas: {a.kapasitas} Slot
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-2 min-w-[180px]">
                            <div className="flex justify-between items-end">
                              <span
                                className={cn(
                                  "text-xs font-black italic",
                                  isFull ? "text-red-600" : "text-slate-800",
                                )}
                              >
                                {a.terisi}{" "}
                                <span className="text-[10px] text-slate-400 font-bold not-italic">
                                  / {a.kapasitas} UNIT
                                </span>
                              </span>
                              <span className="text-[10px] font-bold text-slate-500">
                                {percentage}%
                              </span>
                            </div>
                            <div className="h-2.5 w-full bg-white/50 rounded-full overflow-hidden border border-white/60">
                              <div
                                className={cn(
                                  "h-full transition-all duration-700 ease-out",
                                  getProgressColor(percentage),
                                )}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(a)}
                              className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all active:scale-90"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(a)}
                              className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
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

      {/* --- MODAL EDIT --- */}
      <GlassModal
        isOpen={isEditOpen}
        onClose={resetState}
        title="Edit Area Parkir"
      >
        <form onSubmit={handleUpdate} className="space-y-6">
          {errorMsg && (
            <div className="p-4 bg-red-50/80 border border-red-100 rounded-2xl flex gap-3 items-start">
              <AlertTriangle className="text-red-500 w-5 h-5 shrink-0" />
              <p className="text-xs text-red-600 font-bold leading-relaxed">
                {errorMsg}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">
              Nama Area
            </label>
            <Input
              value={form.nama_area}
              onChange={(e) => setForm({ ...form, nama_area: e.target.value })}
              className="bg-slate-50/50 border-slate-200 focus:bg-white rounded-2xl h-12"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">
              Kapasitas Maksimal
            </label>
            <Input
              type="number"
              value={form.kapasitas}
              onChange={(e) => setForm({ ...form, kapasitas: e.target.value })}
              className="bg-slate-50/50 border-slate-200 focus:bg-white rounded-2xl h-12"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={resetState}
              className="w-1/3 rounded-2xl h-12 border-slate-200"
            >
              Batal
            </Button>
            <Button
              type="submit"
              isLoading={processing}
              className="w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 font-bold shadow-lg shadow-indigo-200"
            >
              Update Area
            </Button>
          </div>
        </form>
      </GlassModal>

      {/* --- MODAL DELETE --- */}
      <GlassModal
        isOpen={isDeleteOpen}
        onClose={resetState}
        title="Hapus Area?"
        maxWidth="max-w-sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={28} />
          </div>
          <p className="text-slate-600 mb-2">
            Anda akan menghapus{" "}
            <span className="font-bold text-slate-900">
              {selectedArea?.nama_area}
            </span>
            .
          </p>
          <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
            Tindakan ini tidak dapat dibatalkan. Pastikan tidak ada kendaraan
            yang sedang parkir di area ini.
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 rounded-xl text-xs text-red-600 font-bold">
              {errorMsg}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={resetState}
              className="w-1/2 rounded-2xl h-12 border-slate-200"
            >
              Batal
            </Button>
            <Button
              onClick={confirmDelete}
              isLoading={processing}
              className="w-1/2 bg-red-600 hover:bg-red-700 text-white rounded-2xl h-12 font-bold shadow-lg shadow-red-200"
            >
              Ya, Hapus
            </Button>
          </div>
        </div>
      </GlassModal>
    </DashboardLayout>
  );
}
