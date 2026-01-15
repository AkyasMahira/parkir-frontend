"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select"; // Komponen Select kita
import { ChevronLeft, Save, UserPlus, UserCog } from "lucide-react";
import api from "@/lib/axios";

export default function UserFormPage() {
  const router = useRouter();
  const params = useParams();

  // Logic Cek Mode: jika id == 'create', berarti mode tambah baru
  const isCreateMode = params.id === "create";
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isCreateMode); // Loading fetch data awal (hanya mode edit)

  const [form, setForm] = useState({
    nama_lengkap: "",
    username: "",
    password: "",
    role: "petugas",
  });

  useEffect(() => {
    if (!isCreateMode) {
      const fetchUser = async () => {
        try {
          const res = await api.get("/users");

          // Ambil array datanya
          const usersList = Array.isArray(res.data.data)
            ? res.data.data
            : res.data;

          const foundUser = usersList.find((u: any) => u.id_user == params.id);

          if (foundUser) {
            setForm({
              nama_lengkap: foundUser.nama_lengkap,
              username: foundUser.username,
              password: "", // Password kosongkan untuk keamanan
              role: foundUser.role,
            });
          } else {
            throw new Error("User tidak ditemukan");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          alert("Gagal mengambil data user atau ID tidak ditemukan.");
          router.push("/admin/users");
        } finally {
          setFetching(false);
        }
      };
      fetchUser();
    }
  }, [isCreateMode, params.id, router]);

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isCreateMode) {
        // --- CREATE ---
        await api.post("/users", form);
        alert("✅ User berhasil ditambahkan!");
      } else {
        // --- UPDATE ---
        // Filter form: Jangan kirim password jika kosong (biar password lama gak ketimpa string kosong)
        const payload = { ...form };
        if (!payload.password) delete (payload as any).password;

        await api.put(`/users/${params.id}`, payload);
        alert("✅ Data user berhasil diperbarui!");
      }

      router.push("/admin/users");
      router.refresh(); // Refresh server component jika ada
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Terjadi kesalahan pada server.";
      alert(`❌ Gagal: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // Render Loading saat Fetch Data Edit
  if (fetching) {
    return (
      <DashboardLayout requiredRole="admin">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="admin">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb / Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Kembali ke Daftar User
        </button>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              {isCreateMode ? (
                <UserPlus className="w-6 h-6" />
              ) : (
                <UserCog className="w-6 h-6" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {isCreateMode ? "Tambah User Baru" : "Edit Data User"}
              </h1>
              <p className="text-sm text-gray-500">
                {isCreateMode
                  ? "Lengkapi formulir di bawah untuk mendaftarkan user baru."
                  : "Perbarui informasi user. Kosongkan password jika tidak ingin menggantinya."}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Nama Lengkap"
              placeholder="Contoh: Budi Santoso"
              value={form.nama_lengkap}
              onChange={(e) =>
                setForm({ ...form, nama_lengkap: e.target.value })
              }
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Username"
                placeholder="username_login"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />

              <Select
                label="Role / Hak Akses"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                options={[
                  { value: "petugas", label: "Petugas Parkir" },
                  { value: "admin", label: "Administrator" },
                  { value: "owner", label: "Owner / Member" },
                ]}
              />
            </div>

            <div className="pt-2">
              <Input
                label={isCreateMode ? "Password" : "Password Baru"}
                type="password"
                placeholder={
                  isCreateMode ? "••••••••" : "Biarkan kosong jika tidak diubah"
                }
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={isCreateMode} // Wajib hanya saat create
                helperText={
                  !isCreateMode
                    ? "Hanya isi jika ingin mereset password user ini."
                    : "Minimal 6 karakter."
                }
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-50">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
              >
                Batal
              </Button>
              <Button type="submit" isLoading={loading} leftIcon={Save}>
                {isCreateMode ? "Simpan User" : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
