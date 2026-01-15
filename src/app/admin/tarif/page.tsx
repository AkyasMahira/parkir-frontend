"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Wallet,
  Trash2,
  Coins,
  Car,
  Bike,
  Truck,
  Plus,
  AlertCircle,
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

  const [form, setForm] = useState({
    jenis_kendaraan: "",
    tarif_per_jam: "",
  });

  // --- FETCH DATA ---
  const fetchRates = async () => {
    setLoading(true);
    try {
      const res = await api.get("/rates");
      const data = Array.isArray(res.data.data) ? res.data.data : res.data;
      setRates(data);
    } catch (error) {
      console.error("Gagal load tarif:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.jenis_kendaraan || !form.tarif_per_jam) return;

    setSubmitting(true);
    try {
      await api.post("/rates", form);
      // alert("✅ Tarif berhasil ditambah"); -> Ganti toast library nanti
      setForm({ jenis_kendaraan: "", tarif_per_jam: "" }); // Reset
      fetchRates(); // Refresh
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
        "⚠️ Apakah Anda yakin ingin menghapus tarif ini?\nTarif yang dihapus tidak bisa dikembalikan."
      )
    )
      return;

    try {
      await api.delete(`/rates/${id}`);
      fetchRates();
    } catch (error) {
      alert("Gagal menghapus tarif.");
    }
  };

  // --- HELPER: ICON MATCHING ---
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Kelola Tarif Parkir
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Atur harga per jam untuk setiap jenis kendaraan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* --- FORM CARD (STICKY) --- */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-800">Tambah Tarif</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Jenis Kendaraan"
              placeholder="Contoh: Mobil Box"
              value={form.jenis_kendaraan}
              onChange={(e) =>
                setForm({ ...form, jenis_kendaraan: e.target.value })
              }
              startIcon={Car}
              required
              helperText="Gunakan nama yang jelas (Mobil, Motor, dll)"
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
              helperText="Masukkan angka saja tanpa titik/koma"
            />

            <Button
              type="submit"
              isLoading={submitting}
              fullWidth
              leftIcon={Plus}
            >
              Simpan Tarif
            </Button>
          </form>
        </div>

        {/* --- TABLE LIST --- */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[200px]">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-gray-700">Daftar Tarif Aktif</h3>
            <span className="text-xs font-medium px-2 py-1 bg-white border border-gray-200 rounded text-gray-500">
              {rates.length} Jenis
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Jenis Kendaraan</th>
                  <th className="px-6 py-4">Tarif / Jam</th>
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
                        <div className="h-5 w-24 bg-gray-200 rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-8 w-8 bg-gray-200 rounded ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : rates.length === 0 ? (
                  // Empty State
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-10 h-10 text-gray-300" />
                        <p>Belum ada tarif yang diatur.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rates.map((r) => (
                    <tr
                      key={r.id_tarif}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            {getIconByType(r.jenis_kendaraan)}
                          </div>
                          <span className="font-bold text-gray-800 capitalize text-base">
                            {r.jenis_kendaraan}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-green-50 text-green-700 font-bold border border-green-100">
                          {formatRupiah(Number(r.tarif_per_jam))}
                          <span className="text-xs font-normal text-green-600 ml-1">
                            /jam
                          </span>
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(r.id_tarif)}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
