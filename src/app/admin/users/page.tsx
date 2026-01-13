"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import api from "@/lib/axios";

// Definisikan tipe data User sesuai database
interface User {
  id_user: number;
  nama_lengkap: string;
  username: string;
  role: "admin" | "petugas" | "owner";
  status_aktif: string | number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fungsi ambil data dari API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      setUsers(response.data.data);
    } catch (error) {
      console.error("Gagal ambil data users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Hapus User
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;

    try {
      await api.delete(`/users/${id}`);
      fetchUsers(); // Refresh tabel setelah hapus
    } catch (error) {
      alert("Gagal menghapus user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DashboardLayout requiredRole="admin">
      {/* Header Halaman */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola User</h1>
          <p className="text-gray-500 text-sm">Daftar pengguna sistem parkir</p>
        </div>

        {/* Tombol Tambah (Link ke halaman Create) */}
        <Link href="/admin/users/create">
          <div className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer shadow-sm">
            + Tambah User
          </div>
        </Link>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Nama Lengkap</th>
              <th className="px-6 py-4">Username</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  Loading data...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  Belum ada data user.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id_user}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.nama_lengkap}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.username}</td>
                  <td className="px-6 py-4">
                    {/* Badge Role dengan Warna Beda-beda */}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "petugas"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                      Aktif
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    {/* Tombol Edit (Link ke Dynamic Route) */}
                    <Link
                      href={`/admin/users/${user.id_user}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Edit
                    </Link>

                    {/* Tombol Hapus */}
                    <button
                      onClick={() => handleDelete(user.id_user)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
