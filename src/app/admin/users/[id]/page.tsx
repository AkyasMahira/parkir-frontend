"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  ChevronLeft,
  Save,
  UserPlus,
  UserCog,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";

// Style Constants
const GLASS_CARD =
  "bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-[#71C9CE]/5 rounded-[2rem] overflow-hidden";

export default function UserFormPage() {
  const router = useRouter();
  const params = useParams();

  // Logic Check Mode
  const isCreateMode = params.id === "create";

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isCreateMode);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    nama_lengkap: "",
    username: "",
    password: "",
    role: "petugas",
  });

  // --- FETCH DATA (EDIT MODE) ---
  useEffect(() => {
    if (!isCreateMode) {
      const fetchUser = async () => {
        try {
          const res = await api.get("/users");
          const usersList = Array.isArray(res.data.data)
            ? res.data.data
            : res.data;

          const foundUser = usersList.find((u: any) => u.id_user == params.id);

          if (foundUser) {
            setForm({
              nama_lengkap: foundUser.nama_lengkap,
              username: foundUser.username,
              password: "", // Kosongkan password demi keamanan
              role: foundUser.role,
            });
          } else {
            throw new Error("User tidak ditemukan");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setErrorMsg("Gagal mengambil data user atau ID tidak ditemukan.");
        } finally {
          setFetching(false);
        }
      };
      fetchUser();
    }
  }, [isCreateMode, params.id]);

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isCreateMode) {
        // CREATE
        await api.post("/users", form);
      } else {
        // UPDATE
        const payload = { ...form };
        if (!payload.password) delete (payload as any).password;
        await api.put(`/users/${params.id}`, payload);
      }

      // Redirect setelah sukses
      router.push("/admin/users");
      router.refresh();
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Terjadi kesalahan pada server.";
      setErrorMsg(msg);
      setLoading(false); // Stop loading only on error
    }
  };

  // --- RENDER: LOADING FETCH ---
  if (fetching) {
    return (
      <DashboardLayout requiredRole="admin">
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#71C9CE]" />
          <p className="text-gray-400 font-medium animate-pulse">
            Mengambil data user...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="admin">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Back */}
        <button
          onClick={() => router.back()}
          className="group flex items-center text-sm font-bold text-gray-400 hover:text-[#71C9CE] mb-6 transition-colors pl-1"
        >
          <div className="p-1 rounded-full bg-white group-hover:bg-[#E3FDFD] mr-2 transition-colors border border-transparent group-hover:border-[#71C9CE]/20 shadow-sm">
            <ChevronLeft className="w-4 h-4" />
          </div>
          Kembali ke Daftar User
        </button>

        {/* MAIN CARD */}
        <div className={GLASS_CARD}>
          {/* HEADER SECTION */}
          <div className="p-8 border-b border-[#A6E3E9]/30 bg-gradient-to-r from-[#E3FDFD]/50 to-white/50">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#71C9CE] to-[#A6E3E9] flex items-center justify-center text-white shadow-lg shadow-[#71C9CE]/30">
                {isCreateMode ? (
                  <UserPlus className="w-7 h-7" />
                ) : (
                  <UserCog className="w-7 h-7" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                  {isCreateMode ? "Tambah User Baru" : "Edit Informasi User"}
                </h1>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  {isCreateMode
                    ? "Isi formulir lengkap untuk memberikan akses sistem."
                    : "Perbarui data profil atau reset password pengguna."}
                </p>
              </div>
            </div>
          </div>

          {/* FORM SECTION */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white/40">
            {/* Error Alert Box */}
            {errorMsg && (
              <div className="p-4 bg-red-50/80 border border-red-100 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-red-600">
                    Gagal Menyimpan
                  </h4>
                  <p className="text-xs text-red-500 mt-1">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Nama Lengkap */}
            <Input
              label="Nama Lengkap"
              placeholder="Contoh: Budi Santoso"
              value={form.nama_lengkap}
              onChange={(e) =>
                setForm({ ...form, nama_lengkap: e.target.value })
              }
              required
              className="bg-white"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <Input
                label="Username Login"
                placeholder="username_pengguna"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                className="bg-white"
              />

              {/* Role Select */}
              <Select
                label="Role / Hak Akses"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="bg-white border-transparent focus:border-[#71C9CE]"
                options={[
                  { value: "petugas", label: "Petugas Parkir" },
                  { value: "admin", label: "Administrator System" },
                  { value: "owner", label: "Owner / Pemilik" },
                ]}
              />
            </div>

            <div className="pt-4 border-t border-gray-100/50">
              <div className="bg-[#E3FDFD]/50 p-6 rounded-2xl border border-[#A6E3E9]/30">
                <Input
                  label={
                    isCreateMode ? "Password Akun" : "Ubah Password (Opsional)"
                  }
                  type="password"
                  placeholder={
                    isCreateMode
                      ? "••••••••"
                      : "Biarkan kosong jika tidak ingin mengubah"
                  }
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required={isCreateMode}
                  className="bg-white"
                  helperText={
                    !isCreateMode
                      ? "Hanya isi field ini jika user meminta reset password."
                      : "Gunakan kombinasi huruf dan angka minimal 6 karakter."
                  }
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                className="border-gray-200"
              >
                Batal
              </Button>
              <Button
                type="submit"
                isLoading={loading}
                className="shadow-lg shadow-[#71C9CE]/30 px-8"
              >
                {!loading && <Save className="w-4 h-4 mr-2" />}
                {isCreateMode ? "Simpan User" : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
