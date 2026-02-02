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
} from "lucide-react";
import { formatRupiah, cn } from "@/lib/utils";
import api from "@/lib/axios";

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

  // State Error (Pengganti alert)
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State (Dipakai untuk Create & Edit)
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
      setIsEditOpen(false); // Tutup modal
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
      setErrorMsg("Gagal menghapus data. Coba lagi.");
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Kelola Tarif Parkir
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Atur harga per jam kendaraan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* --- FORM CREATE (STICKY) --- */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-800">Tambah Baru</h3>
          </div>

          {/* Error Message Inline (bukan alert browser) */}
          {errorMsg && !isEditOpen && !isDeleteOpen && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {errorMsg}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Jenis Kendaraan"
              placeholder="Contoh: Sepeda Listrik"
              value={form.jenis_kendaraan}
              onChange={(e) =>
                setForm({ ...form, jenis_kendaraan: e.target.value })
              }
              startIcon={Car}
              required
            />
            <Input
              label="Harga per Jam"
              type="number"
              value={form.tarif_per_jam}
              onChange={(e) =>
                setForm({ ...form, tarif_per_jam: e.target.value })
              }
              startIcon={Coins}
              min={0}
              required
            />
            <Button type="submit" isLoading={submitting} fullWidth>
              Simpan Tarif
            </Button>
          </form>
        </div>

        {/* --- TABLE LIST --- */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Table */}
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-gray-700">Tarif Aktif</h3>
            <span className="text-xs bg-white border px-2 py-1 rounded text-gray-500">
              {rates.length} Item
            </span>
          </div>

          <table className="w-full text-sm text-left">
            <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Kendaraan</th>
                <th className="px-6 py-4">Harga</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : rates.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-400">
                    Data kosong.
                  </td>
                </tr>
              ) : (
                rates.map((r) => (
                  <tr
                    key={r.id_tarif}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded text-gray-600">
                        {getIconByType(r.jenis_kendaraan)}
                      </div>
                      <span className="font-semibold text-gray-700 capitalize">
                        {r.jenis_kendaraan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-green-600 font-bold">
                      {formatRupiah(Number(r.tarif_per_jam))}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(r)}
                      >
                        <Pencil className="w-4 h-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteModal(r)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL EDIT --- */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Tarif"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {errorMsg}
            </div>
          )}

          <Input
            label="Jenis Kendaraan"
            value={form.jenis_kendaraan}
            onChange={(e) =>
              setForm({ ...form, jenis_kendaraan: e.target.value })
            }
            startIcon={Car}
            required
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
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setIsEditOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" isLoading={submitting} fullWidth>
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL DELETE CONFIRMATION --- */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Konfirmasi Hapus"
        maxWidth="max-w-sm"
      >
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <Trash2 className="w-6 h-6" />
          </div>

          <div className="text-gray-600 text-sm">
            Apakah Anda yakin ingin menghapus tarif untuk <br />
            <span className="font-bold text-gray-800">
              "{selectedRate?.jenis_kendaraan}"
            </span>
            ?
            <br />
            Tindakan ini tidak dapat dibatalkan.
          </div>

          {errorMsg && (
            <p className="text-red-500 text-xs font-medium">{errorMsg}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setIsDeleteOpen(false)}
            >
              Batal
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
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
