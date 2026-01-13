"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/axios";

export default function MemberDashboard() {
  const [activeTab, setActiveTab] = useState<"kendaraan" | "history">(
    "kendaraan"
  );
  const [kendaraans, setKendaraans] = useState<any[]>([]);
  const [histories, setHistories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // State Form Input (Sesuai Database)
  const [form, setForm] = useState({
    plat_nomor: "",
    jenis_kendaraan: "motor",
    warna: "",
    pemilik: "",
    merk: "",
  });

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      if (activeTab === "kendaraan") {
        const res = await api.get("/member/kendaraan");
        setKendaraans(res.data.data);
      } else {
        const res = await api.get("/member/history");
        setHistories(res.data.data);
      }
    } catch (err) {
      console.error("Gagal load data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // --- SUBMIT KENDARAAN ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/member/kendaraan", form);
      alert("✅ Kendaraan berhasil didaftarkan!");
      // Reset Form
      setForm({
        plat_nomor: "",
        jenis_kendaraan: "motor",
        warna: "",
        pemilik: "",
        merk: "",
      });
      fetchData(); // Refresh list
    } catch (err: any) {
      alert(
        "❌ Gagal: " + (err.response?.data?.message || "Terjadi kesalahan")
      );
    } finally {
      setLoading(false);
    }
  };

  // --- HAPUS KENDARAAN ---
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus kendaraan ini?")) return;
    try {
      await api.delete(`/member/kendaraan/${id}`);
      fetchData();
    } catch (err) {
      alert("Gagal menghapus");
    }
  };

  return (
    <DashboardLayout requiredRole="owner">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Halo, Member!</h1>
        <p className="text-gray-500">
          Kelola kendaraan dan pantau riwayat parkir anda.
        </p>
      </div>

      {/* --- MENU TAB --- */}
      <div className="flex space-x-6 border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab("kendaraan")}
          className={`pb-3 px-2 font-medium transition-all ${
            activeTab === "kendaraan"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          🚗 Kendaraan Saya
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 px-2 font-medium transition-all ${
            activeTab === "history"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          📜 Riwayat Parkir
        </button>
      </div>

      {/* --- KONTEN TAB: KENDARAAN --- */}
      {activeTab === "kendaraan" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Register Mobil */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">
              Tambah Kendaraan
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Plat Nomor"
                placeholder="B 1234 XY"
                required
                value={form.plat_nomor}
                onChange={(e) =>
                  setForm({ ...form, plat_nomor: e.target.value.toUpperCase() })
                }
              />
              <Input
                label="Merk"
                placeholder="Cth: Honda Jazz"
                value={form.merk}
                onChange={(e) => setForm({ ...form, merk: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Warna"
                  placeholder="Hitam"
                  required
                  value={form.warna}
                  onChange={(e) => setForm({ ...form, warna: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis
                  </label>
                  <select
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary"
                    value={form.jenis_kendaraan}
                    onChange={(e) =>
                      setForm({ ...form, jenis_kendaraan: e.target.value })
                    }
                  >
                    <option value="motor">Motor</option>
                    <option value="mobil">Mobil</option>
                    <option value="truk">Truk</option>
                  </select>
                </div>
              </div>
              <Input
                label="Pemilik (di STNK)"
                placeholder="Nama Pemilik"
                required
                value={form.pemilik}
                onChange={(e) => setForm({ ...form, pemilik: e.target.value })}
              />

              <Button type="submit" isLoading={loading} className="w-full mt-2">
                Simpan Data
              </Button>
            </form>
          </div>

          {/* List Mobil Saya */}
          <div className="lg:col-span-2 space-y-4">
            {kendaraans.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">
                  Belum ada kendaraan yang didaftarkan.
                </p>
              </div>
            )}

            {kendaraans.map((k) => (
              <div
                key={k.id_kendaraan}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl">
                    {k.jenis_kendaraan === "mobil" ? "🚗" : "🏍️"}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">
                      {k.plat_nomor}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {k.merk} ({k.warna})
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      a.n {k.pemilik}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(k.id_kendaraan)}
                  className="text-red-400 hover:text-red-600 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- KONTEN TAB: HISTORY --- */}
      {activeTab === "history" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-700">
              Aktivitas Parkir Kendaraan Anda
            </h3>
            <span className="text-xs text-gray-500">
              Data otomatis berdasarkan Plat Nomor
            </span>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-gray-600 border-b">
              <tr>
                <th className="p-4 font-semibold">Tanggal & Waktu</th>
                <th className="p-4 font-semibold">Plat Nomor</th>
                <th className="p-4 font-semibold">Area Parkir</th>
                <th className="p-4 font-semibold">Durasi</th>
                <th className="p-4 font-semibold text-right">Biaya Parkir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {histories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    Belum ada riwayat transaksi.
                  </td>
                </tr>
              ) : (
                histories.map((h) => (
                  <tr key={h.id_transaksi} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {new Date(h.waktu_masuk).toLocaleDateString("id-ID")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(h.waktu_masuk).toLocaleTimeString("id-ID")}{" "}
                        WIB
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold bg-gray-100 px-2 py-1 rounded text-gray-700">
                        {h.plat_nomor}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {h.area?.nama_area || "-"}
                    </td>
                    <td className="p-4">
                      {h.durasi_jam ? (
                        <span className="text-gray-900">
                          {h.durasi_jam} Jam
                        </span>
                      ) : (
                        <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full animate-pulse">
                          SEDANG PARKIR
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right font-bold text-gray-800">
                      {h.biaya_total
                        ? `Rp ${h.biaya_total.toLocaleString("id-ID")}`
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
