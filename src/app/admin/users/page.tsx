"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  User as UserIcon,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { getInitials, cn } from "@/lib/utils";
import api from "@/lib/axios";

// --- CONSTANTS ---
const GLASS_CARD =
  "bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-[#71C9CE]/5 rounded-[2rem] overflow-hidden";

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

  // Modal States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [processing, setProcessing] = useState(false);

  // --- FETCH DATA ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
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
  const openDeleteModal = (user: UserData) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    setProcessing(true);

    try {
      await api.delete(`/users/${selectedUser.id_user}`);
      setUsers((prev) =>
        prev.filter((u) => u.id_user !== selectedUser.id_user),
      );
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Gagal hapus user", error);
    } finally {
      setProcessing(false);
      setSelectedUser(null);
    }
  };

  // --- FILTERING ---
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  // --- HELPER: ROLE BADGE ---
  const getRoleBadge = (role: string) => {
    const styles = {
      admin:
        "bg-purple-50 text-purple-600 border-purple-200 ring-purple-500/10",
      petugas: "bg-[#E3FDFD] text-[#71C9CE] border-[#A6E3E9] ring-[#71C9CE]/10",
      owner: "bg-amber-50 text-amber-600 border-amber-200 ring-amber-500/10",
    };

    // @ts-ignore
    const style = styles[role] || "bg-gray-100 text-gray-600";

    return (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border ring-1 ring-inset uppercase transition-all cursor-default uppercase tracking-wide",
          style,
        )}
      >
        {role}
      </span>
    );
  };

  return (
    <DashboardLayout requiredRole="admin">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-[#71C9CE]" />
            <span className="text-xs font-bold text-[#71C9CE] uppercase tracking-widest">
              Access Control
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Kelola User
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">
            Total {users.length} pengguna terdaftar.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="w-full sm:w-64">
            <Input
              placeholder="Cari nama / username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startIcon={Search}
              className="bg-white h-11"
            />
          </div>

          <Link href="/admin/users/create" className="w-full sm:w-auto">
            <Button
              size="md"
              fullWidth
              className="h-11 shadow-lg shadow-[#71C9CE]/20 bg-[#71C9CE] hover:bg-[#5dbbc0] border-none"
            >
              <Plus className="w-5 h-5 mr-2" /> User Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className={GLASS_CARD}>
        
        {/* === 1. DESKTOP VIEW (TABLE) === */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#E3FDFD]/50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-[#A6E3E9]/30">
              <tr>
                <th className="px-8 py-5">User Profile</th>
                <th className="px-6 py-5">Role Akses</th>
                <th className="px-6 py-5">Status Akun</th>
                <th className="px-8 py-5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse bg-white/30">
                    <td className="px-8 py-4 flex gap-4 items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                        <div className="h-3 w-20 bg-gray-200 rounded" />
                      </div>
                    </td>
                    <td className="px-6">
                      <div className="h-6 w-20 bg-gray-200 rounded-full" />
                    </td>
                    <td className="px-6">
                      <div className="h-6 w-16 bg-gray-200 rounded-full" />
                    </td>
                    <td className="px-8"></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                      <div className="p-4 bg-gray-100 rounded-full">
                        <UserIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="font-medium">Tidak ada user ditemukan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id_user}
                    className="hover:bg-white/60 transition-colors group"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#71C9CE] to-[#A6E3E9] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#71C9CE]/20">
                          {getInitials(user.nama_lengkap)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">
                            {user.nama_lengkap}
                          </p>
                          <p className="text-xs text-[#71C9CE] font-bold">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-600">
                          Active
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/users/${user.id_user}`}>
                          <button
                            className="p-2 text-slate-400 hover:text-[#71C9CE] hover:bg-[#E3FDFD] rounded-xl transition-all"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Hapus User"
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

        {/* === 2. MOBILE VIEW (CARD LIST) === */}
        <div className="md:hidden flex flex-col p-4 gap-4 bg-slate-50/50">
           {loading ? (
             [...Array(3)].map((_, i) => (
               <div key={i} className="bg-white p-4 rounded-2xl shadow-sm animate-pulse flex items-center gap-4">
                 <div className="w-12 h-12 bg-gray-200 rounded-full" />
                 <div className="space-y-2 flex-1">
                   <div className="h-4 bg-gray-200 rounded w-1/2" />
                   <div className="h-3 bg-gray-200 rounded w-1/3" />
                 </div>
               </div>
             ))
           ) : filteredUsers.length === 0 ? (
             <div className="text-center py-12 text-gray-400">
               <p>Data tidak ditemukan</p>
             </div>
           ) : (
             filteredUsers.map((user) => (
               <div key={user.id_user} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-linear-to-tr from-[#71C9CE] to-[#A6E3E9] flex items-center justify-center text-white font-bold text-base shadow-md shadow-[#71C9CE]/20">
                          {getInitials(user.nama_lengkap)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{user.nama_lengkap}</h3>
                        <p className="text-xs text-[#71C9CE] font-bold">@{user.username}</p>
                      </div>
                    </div>
                    {/* Actions Dropdown / Buttons */}
                    <div className="flex gap-1">
                      <Link href={`/admin/users/${user.id_user}`}>
                        <button className="p-2 text-slate-400 hover:text-[#71C9CE] bg-slate-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button 
                        onClick={() => openDeleteModal(user)}
                        className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    {getRoleBadge(user.role)}
                    <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-600">Active</span>
                    </div>
                  </div>
               </div>
             ))
           )}
        </div>

      </div>

      {/* --- MODAL CONFIRM DELETE --- */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Konfirmasi Hapus"
        maxWidth="max-w-sm"
      >
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto ring-4 ring-red-50">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div>
            <h4 className="font-bold text-slate-800 text-lg">Hapus Akun?</h4>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed px-2">
              Anda akan menghapus user{" "}
              <span className="font-bold text-slate-800">
                @{selectedUser?.username}
              </span>
              . Akses mereka akan dicabut secara permanen.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteOpen(false)}
              fullWidth
            >
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              isLoading={processing}
              fullWidth
            >
              Ya, Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}