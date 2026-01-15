"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  User as UserIcon,
  MoreVertical,
} from "lucide-react";
import { getInitials, cn } from "@/lib/utils";
import api from "@/lib/axios";

// --- TYPE ---
interface UserData {
  id_user: number;
  nama_lengkap: string;
  username: string;
  role: "admin" | "petugas" | "owner";
  created_at?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // --- FETCH DATA ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      // Handle format response (jika dibungkus data.data)
      const data = Array.isArray(response.data.data)
        ? response.data.data
        : response.data;
      setUsers(data);
    } catch (error) {
      console.error("Gagal ambil data users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- DELETE HANDLER ---
  const handleDelete = async (id: number) => {
    if (!confirm("⚠️ Hapus User?\nTindakan ini tidak dapat dibatalkan."))
      return;

    try {
      await api.delete(`/users/${id}`);
      // Optimistic UI Update (Hapus dari state tanpa reload)
      setUsers((prev) => prev.filter((u) => u.id_user !== id));
    } catch (error) {
      alert("Gagal menghapus user.");
    }
  };

  // --- FILTERING ---
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  // --- HELPER: ROLE BADGE ---
  const getRoleBadge = (role: string) => {
    const styles = {
      admin: "bg-purple-100 text-purple-700 border-purple-200",
      petugas: "bg-blue-100 text-blue-700 border-blue-200",
      owner: "bg-amber-100 text-amber-700 border-amber-200",
    };
    // Fallback style
    const style =
      styles[role as keyof typeof styles] || "bg-gray-100 text-gray-700";

    return (
      <span
        className={cn(
          "px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize",
          style
        )}
      >
        {role}
      </span>
    );
  };

  return (
    <DashboardLayout requiredRole="admin">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola User</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manajemen akun akses untuk Admin, Petugas, dan Member.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama / username..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Link href="/admin/users/create">
            <Button size="md" leftIcon={Plus}>
              User Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[200px]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">User Info</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                // Skeleton Rows
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 flex gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full" />
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                        <div className="h-3 w-16 bg-gray-200 rounded" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-16 bg-gray-200 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-12 bg-gray-200 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-8 w-8 bg-gray-200 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <UserIcon className="w-10 h-10 text-gray-300" />
                      <p>Tidak ada user ditemukan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id_user}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    {/* User Info Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm border border-indigo-100">
                          {getInitials(user.nama_lengkap)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {user.nama_lengkap}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role Column */}
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>

                    {/* Status Column */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Aktif
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/users/${user.id_user}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(user.id_user)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
