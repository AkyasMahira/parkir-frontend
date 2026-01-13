"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/axios";

export default function UserFormPage() {
  const router = useRouter();
  const params = useParams();
  const isEdit = params.id !== "create"; // Cek apakah mode Edit atau Create
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nama_lengkap: "",
    username: "",
    password: "",
    role: "petugas", // Default
  });

  // Jika Edit, Ambil Data Lama
  useEffect(() => {
    if (isEdit) {
      const fetchUser = async () => {
        try {
          const res = await api.get(`/users`); // Note: Harusnya get by ID, tapi kalau API list kirim semua, kita filter aja di client biar cepat (atau buat endpoint show di backend)
          // Cara malas (filter dari list):
          const found = res.data.data.find((u: any) => u.id_user == params.id);
          if (found) {
            setForm({
              nama_lengkap: found.nama_lengkap,
              username: found.username,
              password: "", // Password kosongkan (opsional di edit)
              role: found.role,
            });
          }
        } catch (error) {
          alert("Gagal ambil data user");
        }
      };
      fetchUser();
    }
  }, [isEdit, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        // Mode Update
        await api.put(`/users/${params.id}`, form);
        alert("✅ User berhasil diupdate!");
      } else {
        // Mode Create
        await api.post("/users", form);
        alert("✅ User berhasil dibuat!");
      }
      router.push("/admin/users"); // Balik ke tabel
    } catch (error: any) {
      alert("❌ Gagal: " + (error.response?.data?.message || "Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-xl font-bold mb-6 text-gray-800">
          {isEdit ? "Edit User" : "Tambah User Baru"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap"
            value={form.nama_lengkap}
            onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
            required
          />
          <Input
            label="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <Input
            label={isEdit ? "Password (Isi jika ingin mengganti)" : "Password"}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!isEdit} // Wajib jika create, opsional jika edit
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="petugas">Petugas</option>
              <option value="owner">Owner (Member)</option>
            </select>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Batal
            </Button>
            <Button type="submit" isLoading={loading}>
              Simpan Data
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
