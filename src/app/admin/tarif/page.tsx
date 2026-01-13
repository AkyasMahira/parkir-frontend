"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/axios";

export default function TarifPage() {
  const [rates, setRates] = useState<any[]>([]);
  const [form, setForm] = useState({ jenis_kendaraan: "", tarif_per_jam: "" });
  const [loading, setLoading] = useState(false);

  const fetchRates = async () => {
    const res = await api.get("/rates");
    setRates(res.data.data);
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/rates", form);
      alert("✅ Tarif berhasil ditambah");
      setForm({ jenis_kendaraan: "", tarif_per_jam: "" });
      fetchRates();
    } catch (error) {
      alert("Gagal menambah tarif");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus tarif ini?")) return;
    await api.delete(`/rates/${id}`);
    fetchRates();
  };

  return (
    <DashboardLayout requiredRole="admin">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Kelola Tarif Parkir
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Tambah */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h3 className="font-bold mb-4">Tambah Tarif Baru</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Jenis Kendaraan"
              placeholder="misal: Bus"
              value={form.jenis_kendaraan}
              onChange={(e) =>
                setForm({ ...form, jenis_kendaraan: e.target.value })
              }
              required
            />
            <Input
              label="Harga per Jam (Rp)"
              type="number"
              placeholder="5000"
              value={form.tarif_per_jam}
              onChange={(e) =>
                setForm({ ...form, tarif_per_jam: e.target.value })
              }
              required
            />
            <Button type="submit" isLoading={loading}>
              Simpan
            </Button>
          </form>
        </div>

        {/* Tabel List */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4">Jenis</th>
                <th className="px-6 py-4">Harga / Jam</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((r) => (
                <tr key={r.id_tarif} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 capitalize font-bold">
                    {r.jenis_kendaraan}
                  </td>
                  <td className="px-6 py-4">
                    Rp {parseInt(r.tarif_per_jam).toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(r.id_tarif)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
