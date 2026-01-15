"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  Car,
  Bike,
  Truck,
  History,
  PlusCircle,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { formatRupiah, cn } from "@/lib/utils";
import api from "@/lib/axios";

// --- TYPES ---
interface Kendaraan {
  id_kendaraan?: number; // Opsional biar gak error kalau null
  plat_nomor: string;
  jenis_kendaraan: "motor" | "mobil" | "truk";
  warna: string;
  merk: string;
  pemilik: string;
}

interface HistoryItem {
  id_transaksi?: number; // Opsional
  waktu_masuk: string;
  waktu_keluar: string | null;
  plat_nomor: string;
  durasi_jam: number;
  biaya_total: number;
  area?: { nama_area: string };
  status: string;
}

export default function MemberDashboard() {
  const [activeTab, setActiveTab] = useState<"kendaraan" | "history">(
    "kendaraan"
  );
  const [dataList, setDataList] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Form Input
  const [form, setForm] = useState({
    plat_nomor: "",
    jenis_kendaraan: "motor",
    warna: "",
    pemilik: "",
    merk: "",
  });

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const endpoint =
        activeTab === "kendaraan" ? "/member/kendaraan" : "/member/history";
      const res = await api.get(endpoint);

      // Safety check: Pastikan data selalu array meskipun API return null/object
      const rawData = Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      setDataList(rawData);
    } catch (err) {
      console.error("Gagal load data", err);
      setDataList([]); // Reset ke array kosong jika error
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // --- SUBMIT KENDARAAN ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/member/kendaraan", form);
      // Reset Form
      setForm({
        plat_nomor: "",
        jenis_kendaraan: "motor",
        warna: "",
        pemilik: "",
        merk: "",
      });
      fetchData();
      alert("✅ Kendaraan berhasil disimpan!");
    } catch (err: any) {
      alert(
        "❌ Gagal: " + (err.response?.data?.message || "Terjadi kesalahan")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- HAPUS KENDARAAN ---
  const handleDelete = async (id?: number) => {
    if (!id) return; // Cegah hapus jika ID null
    if (!confirm("Apakah Anda yakin ingin menghapus data kendaraan ini?"))
      return;
    try {
      await api.delete(`/member/kendaraan/${id}`);
      fetchData();
    } catch (err) {
      alert("Gagal menghapus data.");
    }
  };

  // --- HELPER UI ---
  const getVehicleIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "motor":
        return <Bike className="w-6 h-6" />;
      case "truk":
        return <Truck className="w-6 h-6" />;
      default:
        return <Car className="w-6 h-6" />;
    }
  };

  return (
    <DashboardLayout requiredRole="owner">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Member</h1>
        <p className="text-gray-500 mt-1">
          Kelola data kendaraan dan pantau riwayat parkir Anda di sini.
        </p>
      </div>

      {/* --- MENU TAB --- */}
      <div className="flex items-center gap-2 mb-8 bg-gray-100/50 p-1 rounded-xl w-fit border border-gray-200">
        <button
          onClick={() => setActiveTab("kendaraan")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            activeTab === "kendaraan"
              ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
          )}
        >
          <Car className="w-4 h-4" />
          Kendaraan Saya
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            activeTab === "history"
              ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
          )}
        >
          <History className="w-4 h-4" />
          Riwayat Parkir
        </button>
      </div>

      {/* --- KONTEN TAB: KENDARAAN --- */}
      {activeTab === "kendaraan" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* KOLOM KIRI: FORM (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-800">Registrasi Kendaraan</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Plat Nomor"
                placeholder="B 1234 XYZ"
                required
                value={form.plat_nomor}
                onChange={(e) =>
                  setForm({ ...form, plat_nomor: e.target.value.toUpperCase() })
                }
                className="uppercase font-medium"
                helperText="Contoh: B 1234 XYZ"
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Jenis"
                  value={form.jenis_kendaraan}
                  onChange={(e) =>
                    setForm({ ...form, jenis_kendaraan: e.target.value as any })
                  }
                  options={[
                    { value: "motor", label: "Motor" },
                    { value: "mobil", label: "Mobil" },
                    { value: "truk", label: "Truk/Bus" },
                  ]}
                />
                <Input
                  label="Warna"
                  placeholder="Hitam"
                  required
                  value={form.warna}
                  onChange={(e) => setForm({ ...form, warna: e.target.value })}
                />
              </div>

              <Input
                label="Merk / Tipe"
                placeholder="Honda Jazz RS"
                value={form.merk}
                onChange={(e) => setForm({ ...form, merk: e.target.value })}
              />

              <Input
                label="Pemilik (STNK)"
                placeholder="Nama sesuai STNK"
                required
                value={form.pemilik}
                onChange={(e) => setForm({ ...form, pemilik: e.target.value })}
              />

              <div className="pt-2">
                <Button type="submit" isLoading={isSubmitting} fullWidth>
                  Simpan Kendaraan
                </Button>
              </div>
            </form>
          </div>

          {/* KOLOM KANAN: LIST (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {loadingData ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={`skel-${i}`}
                  className="h-24 bg-gray-100 rounded-xl animate-pulse"
                ></div>
              ))
            ) : dataList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300 text-center">
                <div className="p-4 bg-gray-50 rounded-full mb-4">
                  <Car className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Belum ada kendaraan
                </h3>
                <p className="text-sm text-gray-500 max-w-xs mt-1">
                  Tambahkan kendaraan Anda agar sistem mengenali plat nomor Anda
                  secara otomatis.
                </p>
              </div>
            ) : (
              // FIX: Menambahkan parameter index (i) dan menggunakannya di key
              (dataList as Kendaraan[]).map((k, i) => (
                <div
                  key={`${k.id_kendaraan || "temp"}-${i}`}
                  className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-blue-300 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0",
                        k.jenis_kendaraan === "motor"
                          ? "bg-orange-50 text-orange-600"
                          : "bg-blue-50 text-blue-600"
                      )}
                    >
                      {getVehicleIcon(k.jenis_kendaraan)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg text-gray-900 tracking-tight">
                          {k.plat_nomor}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-600 border border-gray-200">
                          {k.jenis_kendaraan}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {k.merk} <span className="text-gray-300">•</span>{" "}
                        {k.warna}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        milik {k.pemilik}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    // Pastikan ID ada sebelum memanggil handleDelete
                    onClick={() =>
                      k.id_kendaraan && handleDelete(k.id_kendaraan)
                    }
                    disabled={!k.id_kendaraan}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    leftIcon={Trash2}
                  >
                    Hapus
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- KONTEN TAB: HISTORY --- */}
      {activeTab === "history" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="font-bold text-gray-800">Riwayat Aktivitas</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Menampilkan semua transaksi parkir
              </p>
            </div>
            <div className="text-xs font-medium px-3 py-1 bg-white border border-gray-200 rounded-lg text-gray-600">
              Total: {dataList.length} Transaksi
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Waktu Masuk</th>
                  <th className="px-6 py-4">Kendaraan</th>
                  <th className="px-6 py-4">Lokasi</th>
                  <th className="px-6 py-4">Durasi & Status</th>
                  <th className="px-6 py-4 text-right">Biaya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loadingData ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={`h-skel-${i}`} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-12 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : dataList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="w-8 h-8 text-gray-300" />
                        <p>Belum ada riwayat parkir.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // FIX: Menambahkan parameter index (i) dan menggunakannya di key
                  (dataList as HistoryItem[]).map((h, i) => (
                    <tr
                      key={`${h.id_transaksi || "h"}-${i}`}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {new Date(h.waktu_masuk).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(h.waktu_masuk).toLocaleTimeString(
                              "id-ID",
                              { hour: "2-digit", minute: "2-digit" }
                            )}{" "}
                            WIB
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-bold font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                          {h.plat_nomor}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {h.area?.nama_area || "Area Umum"}
                      </td>

                      <td className="px-6 py-4">
                        {h.waktu_keluar ? (
                          <div className="flex flex-col">
                            <span className="text-gray-900 font-medium">
                              {h.durasi_jam} Jam
                            </span>
                            <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded w-fit mt-1 border border-green-100">
                              SELESAI
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 animate-pulse">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            SEDANG PARKIR
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        {h.biaya_total > 0 ? formatRupiah(h.biaya_total) : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
