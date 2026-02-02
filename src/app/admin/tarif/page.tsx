"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  Wallet,
  Trash2,
  Coins,
  Car,
  Bike,
  Truck,
  Plus,
  AlertTriangle,
  Pencil,
  Info,
  Tag,
} from "lucide-react";
import { formatRupiah, cn } from "@/lib/utils";
import api from "@/lib/axios";

// Style Constants
const GLASS_CARD =
  "bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-[#71C9CE]/5 rounded-[2rem] overflow-hidden";

// --- TYPES ---
interface Tarif {
  id_tarif: number;
  jenis_kendaraan: string;
  tarif_per_jam: number | string;
}

export default function TarifPage() {
  const [rates, setRates] = useState<Tarif[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // --- MODAL STATES ---
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState<Tarif | null>(null);

  // State Error
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({ jenis_kendaraan: "", tarif_per_jam: "" });

  // --- FETCH DATA ---
  const fetchRates = async () => {
    setLoading(true);
    try {
      const res = await api.get("/rates");
      setRates(Array.isArray(res.data.data) ? res.data.data : res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // --- HANDLERS: CREATE ---
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      await api.post("/rates", form);
      setForm({ jenis_kendaraan: "", tarif_per_jam: "" }); // Reset
      fetchRates();
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setSubmitting(false);
    }
  };

  // --- HANDLERS: EDIT ---
  const openEditModal = (rate: Tarif) => {
    setSelectedRate(rate);
    setForm({
      jenis_kendaraan: rate.jenis_kendaraan,
      tarif_per_jam: rate.tarif_per_jam.toString(),
    });
    setErrorMsg(null);
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRate) return;

    setSubmitting(true);
    try {
      await api.put(`/rates/${selectedRate.id_tarif}`, form);
      setIsEditOpen(false);
      fetchRates();
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Gagal update tarif");
    } finally {
      setSubmitting(false);
    }
  };

  // --- HANDLERS: DELETE ---
  const openDeleteModal = (rate: Tarif) => {
    setSelectedRate(rate);
    setErrorMsg(null);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRate) return;

    setSubmitting(true);
    try {
      await api.delete(`/rates/${selectedRate.id_tarif}`);
      setIsDeleteOpen(false);
      fetchRates();
    } catch (error: any) {
      setErrorMsg("Gagal menghapus data. Pastikan tidak ada transaksi aktif.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- HELPER: ICONS ---
  const getIconByType = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("motor") || t.includes("bike"))
      return <Bike className="w-5 h-5" />;
    if (t.includes("truk") || t.includes("bus"))
      return <Truck className="w-5 h-5" />;
    return <Car className="w-5 h-5" />;
  };

  return (
    <DashboardLayout requiredRole="admin">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-5 h-5 text-[#71C9CE]" />
            <span className="text-xs font-bold text-[#71C9CE] uppercase tracking-widest">
              Pricing Management
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Kelola Tarif Parkir
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">
            Atur harga per jam untuk setiap jenis kendaraan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* --- FORM CREATE (STICKY) --- */}
        <div className={cn(GLASS_CARD, "lg:col-span-1 p-8 sticky top-24")}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#E3FDFD] flex items-center justify-center text-[#71C9CE] shadow-inner">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-lg">Tarif Baru</h3>
              <p className="text-xs text-gray-500 font-bold">
                Tambah kategori kendaraan
              </p>
            </div>
          </div>

          {errorMsg && !isEditOpen && !isDeleteOpen && (
            <div className="mb-6 p-4 bg-red-50/80 border border-red-100 rounded-2xl flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-xs text-red-600 font-bold">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-5">
            <Input
              label="Jenis Kendaraan"
              placeholder="Contoh: Mobil Box"
              value={form.jenis_kendaraan}
              onChange={(e) =>
                setForm({ ...form, jenis_kendaraan: e.target.value })
              }
              startIcon={Car}
              required
              className="bg-white/60"
            />
            <Input
              label="Harga per Jam"
              type="number"
              placeholder="5000"
              value={form.tarif_per_jam}
              onChange={(e) =>
                setForm({ ...form, tarif_per_jam: e.target.value })
              }
              startIcon={Coins}
              min={0}
              required
              className="bg-white/60"
            />

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={submitting}
                fullWidth
                className="shadow-lg shadow-[#71C9CE]/20"
              >
                Simpan Tarif
              </Button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-[#E3FDFD]/50 rounded-2xl border border-[#A6E3E9]/30 flex gap-3">
            <Info className="w-5 h-5 text-[#71C9CE] shrink-0" />
            <p className="text-[11px] text-[#71C9CE] font-bold leading-relaxed">
              Tarif yang ditambahkan akan langsung berlaku untuk transaksi
              parkir baru.
            </p>
          </div>
        </div>

        {/* --- TABLE LIST --- */}
        <div className={cn(GLASS_CARD, "lg:col-span-2 min-h-[300px]")}>
          <div className="p-6 border-b border-[#A6E3E9]/30 bg-gradient-to-r from-[#E3FDFD]/30 to-white/30 flex justify-between items-center">
            <h3 className="font-black text-slate-800 text-lg">
              Daftar Tarif Aktif
            </h3>
            <span className="px-3 py-1 bg-white rounded-xl text-xs font-bold text-[#71C9CE] shadow-sm">
              {rates.length} Kategori
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#E3FDFD]/50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-[#A6E3E9]/30">
                <tr>
                  <th className="px-8 py-5">Jenis Kendaraan</th>
                  <th className="px-6 py-5">Tarif / Jam</th>
                  <th className="px-8 py-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse bg-white/30">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                          <div className="h-4 w-24 bg-gray-200 rounded" />
                        </div>
                      </td>
                      <td className="px-6">
                        <div className="h-6 w-20 bg-gray-200 rounded" />
                      </td>
                      <td className="px-8"></td>
                    </tr>
                  ))
                ) : rates.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-20 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                        <Wallet className="w-10 h-10 text-gray-300" />
                        <p className="font-bold text-sm">
                          Belum ada tarif yang diatur.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rates.map((r) => (
                    <tr
                      key={r.id_tarif}
                      className="hover:bg-white/60 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#71C9CE] to-[#A6E3E9] flex items-center justify-center text-white shadow-md shadow-[#71C9CE]/20 group-hover:scale-110 transition-transform duration-300">
                            {getIconByType(r.jenis_kendaraan)}
                          </div>
                          <span className="font-bold text-slate-800 capitalize text-base">
                            {r.jenis_kendaraan}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-xl bg-[#E3FDFD] text-[#71C9CE] font-bold text-sm border border-[#A6E3E9]">
                          {formatRupiah(Number(r.tarif_per_jam))}
                          <span className="text-[10px] opacity-70 ml-1 font-normal text-slate-500">
                            / jam
                          </span>
                        </span>
                      </td>

                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(r)}
                            className="p-2 text-slate-400 hover:text-[#71C9CE] hover:bg-[#E3FDFD] rounded-xl transition-all"
                            title="Edit Tarif"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(r)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Hapus Tarif"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL EDIT --- */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Perbarui Tarif"
      >
        <form onSubmit={handleUpdate} className="space-y-6">
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl flex gap-2 items-center">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Jenis Kendaraan"
              value={form.jenis_kendaraan}
              onChange={(e) =>
                setForm({ ...form, jenis_kendaraan: e.target.value })
              }
              startIcon={Car}
              required
              className="bg-white"
            />
            <Input
              label="Harga per Jam"
              type="number"
              value={form.tarif_per_jam}
              onChange={(e) =>
                setForm({ ...form, tarif_per_jam: e.target.value })
              }
              startIcon={Coins}
              required
              className="bg-white"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => setIsEditOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              isLoading={submitting}
              fullWidth
              className="shadow-lg shadow-[#71C9CE]/20"
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL DELETE --- */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Hapus Tarif"
        maxWidth="max-w-sm"
      >
        <div className="text-center space-y-5">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto ring-4 ring-red-50/50">
            <Trash2 className="w-8 h-8" />
          </div>

          <div>
            <h4 className="font-bold text-slate-800 text-lg">
              Konfirmasi Penghapusan
            </h4>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed px-4">
              Anda akan menghapus tarif untuk{" "}
              <span className="font-bold text-slate-800">
                "{selectedRate?.jenis_kendaraan}"
              </span>
              . Data transaksi lama mungkin akan kehilangan referensi nama tarif
              ini.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 rounded-xl text-red-600 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setIsDeleteOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              isLoading={submitting}
              fullWidth
              onClick={confirmDelete}
            >
              Ya, Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
