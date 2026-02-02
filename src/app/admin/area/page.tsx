"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  MapPin,
  Trash2,
  Plus,
  AlertCircle,
  Info,
  Layers,
  Pencil,
  AlertTriangle,
  Car,
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

// Style Constants (Teal Palette)
const GLASS_CARD =
  "bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-[#71C9CE]/5 rounded-[2rem] overflow-hidden";

export default function AreaPage() {
  const [areas, setAreas] = useState<AreaParkir[]>([]);
  const [loading, setLoading] = useState(true);

  // --- STATES ---
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<AreaParkir | null>(null);

  const [form, setForm] = useState({ nama_area: "", kapasitas: "" });
  const [processing, setProcessing] = useState(false);
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

  // --- ACTIONS ---
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
      setErrorMsg("Gagal hapus area. Pastikan tidak ada transaksi aktif.");
      setProcessing(false);
    }
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 90)
      return "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
    if (percent >= 70)
      return "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]";
    return "bg-[#71C9CE] shadow-[0_0_10px_rgba(113,201,206,0.5)]";
  };

  return (
    <DashboardLayout requiredRole="admin">
      {/* HEADER */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2 text-[#71C9CE] font-bold text-xs uppercase tracking-widest">
          <Layers size={14} /> System Infrastructure
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
          Manajemen Area Parkir
        </h1>
        <p className="text-gray-500 font-medium text-sm mt-1">
          Monitor kapasitas dan okupansi lokasi parkir.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* --- FORM CARD (CREATE) --- */}
        <div className={cn(GLASS_CARD, "lg:col-span-1 p-8 sticky top-24")}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#E3FDFD] flex items-center justify-center text-[#71C9CE] shadow-inner">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-lg">Lokasi Baru</h3>
              <p className="text-xs text-gray-500 font-bold">
                Tambah kapasitas parkir
              </p>
            </div>
          </div>

          {errorMsg && !isEditOpen && !isDeleteOpen && (
            <div className="mb-6 p-4 bg-red-50/80 border border-red-100 rounded-2xl flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="text-red-500 w-5 h-5 shrink-0" />
              <p className="text-xs text-red-600 font-bold leading-relaxed">
                {errorMsg}
              </p>
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-5">
            <Input
              label="Nama Area"
              placeholder="Contoh: Gedung A - Lt. 1"
              value={form.nama_area}
              onChange={(e) => setForm({ ...form, nama_area: e.target.value })}
              startIcon={MapPin}
              className="bg-white/60"
              required
            />

            <Input
              label="Kapasitas Maksimal"
              type="number"
              placeholder="0"
              value={form.kapasitas}
              onChange={(e) => setForm({ ...form, kapasitas: e.target.value })}
              startIcon={Car}
              className="bg-white/60"
              required
            />

            <div className="p-4 bg-[#E3FDFD]/50 border border-[#A6E3E9]/30 rounded-2xl flex gap-3 items-start my-4">
              <Info size={18} className="text-[#71C9CE] mt-0.5 shrink-0" />
              <p className="text-[11px] text-[#71C9CE] leading-relaxed font-bold">
                Sistem akan menghitung persentase okupansi secara otomatis
                berdasarkan transaksi masuk.
              </p>
            </div>

            <Button
              type="submit"
              isLoading={processing}
              className="w-full shadow-lg shadow-[#71C9CE]/20"
            >
              Simpan Area
            </Button>
          </form>
        </div>

        {/* --- LIST & MONITORING --- */}
        <div className={cn(GLASS_CARD, "lg:col-span-2 min-h-[400px]")}>
          <div className="p-6 border-b border-[#A6E3E9]/30 bg-gradient-to-r from-[#E3FDFD]/30 to-white/30 flex justify-between items-center">
            <h3 className="font-black text-slate-800 text-lg">
              Status Kapasitas
            </h3>
            <div className="px-3 py-1 bg-white rounded-xl text-xs font-bold text-[#71C9CE] shadow-sm">
              {areas.length} Lokasi
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-[#E3FDFD]/50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-[#A6E3E9]/30">
                <tr>
                  <th className="px-8 py-5">Informasi Lokasi</th>
                  <th className="px-8 py-5">Okupansi Real-time</th>
                  <th className="px-8 py-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse bg-white/30">
                      <td colSpan={3} className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                          <div className="space-y-2 w-full">
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                            <div className="h-2 w-full bg-gray-200 rounded" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : areas.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-24 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <AlertCircle
                          size={48}
                          strokeWidth={1}
                          className="text-slate-300"
                        />
                        <p className="mt-4 font-bold text-slate-400">
                          Data area parkir belum tersedia
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  areas.map((a) => {
                    const percentage =
                      a.kapasitas > 0
                        ? Math.min(
                            Math.round((a.terisi / a.kapasitas) * 100),
                            100,
                          )
                        : 0;
                    const isFull = a.terisi >= a.kapasitas;

                    return (
                      <tr
                        key={a.id_area}
                        className="group hover:bg-white/60 transition-all duration-300"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#71C9CE] to-[#A6E3E9] flex items-center justify-center text-white shadow-md shadow-[#71C9CE]/20 group-hover:scale-110 transition-transform">
                              <MapPin size={20} />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-slate-800 text-lg tracking-tight">
                                {a.nama_area}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                Max: {a.kapasitas} Unit
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-2 min-w-[180px]">
                            <div className="flex justify-between items-end">
                              <span
                                className={cn(
                                  "text-sm font-black",
                                  isFull ? "text-red-500" : "text-slate-700",
                                )}
                              >
                                {a.terisi}{" "}
                                <span className="text-[10px] text-slate-400 font-bold">
                                  / {a.kapasitas}
                                </span>
                              </span>
                              <span className="text-[10px] font-bold text-slate-500">
                                {percentage}%
                              </span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full transition-all duration-700 ease-out rounded-full",
                                  getProgressColor(percentage),
                                )}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditModal(a)}
                              className="p-2 text-slate-400 hover:text-[#71C9CE] hover:bg-[#E3FDFD] rounded-xl transition-all"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(a)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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
      <Modal
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

          <div className="space-y-4">
            <Input
              label="Nama Area"
              value={form.nama_area}
              onChange={(e) => setForm({ ...form, nama_area: e.target.value })}
              startIcon={MapPin}
              className="bg-white"
            />
            <Input
              label="Kapasitas Maksimal"
              type="number"
              value={form.kapasitas}
              onChange={(e) => setForm({ ...form, kapasitas: e.target.value })}
              startIcon={Car}
              className="bg-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={resetState}
              className="w-1/3"
            >
              Batal
            </Button>
            <Button
              type="submit"
              isLoading={processing}
              className="w-2/3 shadow-lg shadow-[#71C9CE]/20"
            >
              Update Area
            </Button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL DELETE --- */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={resetState}
        title="Hapus Area?"
        maxWidth="max-w-sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-red-50">
            <Trash2 size={28} />
          </div>
          <p className="text-slate-600 mb-2">
            Hapus data{" "}
            <span className="font-bold text-slate-900">
              {selectedArea?.nama_area}
            </span>
            ?
          </p>
          <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6 px-4">
            Data transaksi yang terkait mungkin akan kehilangan referensi
            lokasi. Tindakan ini permanen.
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 rounded-xl text-xs text-red-600 font-bold">
              {errorMsg}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={resetState}
              fullWidth
            >
              Batal
            </Button>
            <Button
              onClick={confirmDelete}
              isLoading={processing}
              variant="danger"
              fullWidth
            >
              Ya, Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
