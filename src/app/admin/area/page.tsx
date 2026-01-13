"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/axios";

export default function AreaPage() {
  const [areas, setAreas] = useState<any[]>([]);
  const [form, setForm] = useState({ nama_area: "", kapasitas: "" });
  const [loading, setLoading] = useState(false);

  const fetchAreas = async () => {
    const res = await api.get("/areas");
    setAreas(res.data.data);
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/areas", form);
      alert("✅ Area berhasil ditambah");
      setForm({ nama_area: "", kapasitas: "" });
      fetchAreas();
    } catch (error) {
      alert("Gagal menambah area");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus area ini?")) return;
    await api.delete(`/areas/${id}`);
    fetchAreas();
  };

  return (
    <DashboardLayout requiredRole="admin">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Kelola Area Parkir
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h3 className="font-bold mb-4">Tambah Area</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Area"
              placeholder="Lantai 2"
              value={form.nama_area}
              onChange={(e) => setForm({ ...form, nama_area: e.target.value })}
              required
            />
            <Input
              label="Kapasitas (Unit)"
              type="number"
              placeholder="50"
              value={form.kapasitas}
              onChange={(e) => setForm({ ...form, kapasitas: e.target.value })}
              required
            />
            <Button type="submit" isLoading={loading}>
              Simpan
            </Button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4">Nama Area</th>
                <th className="px-6 py-4">Kapasitas</th>
                <th className="px-6 py-4">Terisi</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((a) => (
                <tr key={a.id_area} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold">{a.nama_area}</td>
                  <td className="px-6 py-4">{a.kapasitas} Unit</td>
                  <td className="px-6 py-4 text-blue-600">{a.terisi} Unit</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(a.id_area)}
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
