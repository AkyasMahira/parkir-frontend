"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/axios";
import { Transaksi, AreaParkir, Tarif } from "@/types/api";

export default function TransaksiPage() {
  // --- STATE ---
  const [dataParkir, setDataParkir] = useState<Transaksi[]>([]);
  const [areas, setAreas] = useState<AreaParkir[]>([]);
  const [tarifs, setTarifs] = useState<Tarif[]>([]);
  const [loading, setLoading] = useState(false);

  // State Form Check-in
  const [platNomor, setPlatNomor] = useState("");
  const [selectedArea, setSelectedArea] = useState<number | "">("");
  const [selectedJenis, setSelectedJenis] = useState("");

  // --- FETCH DATA AWAL ---
  const fetchInitialData = async () => {
    try {
      const [resArea, resTarif, resParkir] = await Promise.all([
        api.get("/areas"),
        api.get("/rates"),
        api.get("/parking?status=masuk"), // Ambil yg sedang parkir saja
      ]);

      setAreas(resArea.data.data);
      setTarifs(resTarif.data.data);
      setDataParkir(resParkir.data.data);
      
      // Auto select area pertama jika ada
      if (resArea.data.data.length > 0) setSelectedArea(resArea.data.data[0].id_area);
      // Auto select jenis pertama
      if (resTarif.data.data.length > 0) setSelectedJenis(resTarif.data.data[0].jenis_kendaraan);

    } catch (error) {
      console.error("Gagal load data", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // --- HANDLER CHECK-IN (MASUK) ---
  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platNomor || !selectedArea || !selectedJenis) return;

    setLoading(true);
    try {
      await api.post("/parking/in", {
        plat_nomor: platNomor,
        id_area: selectedArea,
        jenis_kendaraan: selectedJenis,
      });

      // Reset Form & Refresh Data
      setPlatNomor("");
      fetchInitialData(); 
      alert("✅ Berhasil Check-in!");
    } catch (error: any) {
      alert("❌ Gagal: " + (error.response?.data?.message || "Error Server"));
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER CHECK-OUT (KELUAR) ---
  const handleCheckOut = async (plat: string) => {
    if (!confirm(`Checkout kendaraan ${plat}?`)) return;

    try {
      const res = await api.post("/parking/out", { plat_nomor: plat });
      const { biaya_total, durasi_jam } = res.data.data;
      
      // Tampilkan Kembalian / Tagihan Sederhana
      alert(`🚗 CHECKOUT BERHASIL!\n\nDurasi: ${durasi_jam} Jam\nTagihan: Rp ${biaya_total.toLocaleString('id-ID')}`);
      
      fetchInitialData(); // Refresh list
    } catch (error: any) {
      alert("❌ Gagal Checkout: " + error.response?.data?.message);
    }
  };

  return (
    <DashboardLayout requiredRole="petugas">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- KOLOM KIRI: FORM INPUT --- */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Kendaraan Masuk</h2>
            
            <form onSubmit={handleCheckIn} className="space-y-4">
              <Input
                label="Plat Nomor"
                placeholder="cth: B 1234 XYZ"
                value={platNomor}
                onChange={(e) => setPlatNomor(e.target.value.toUpperCase())}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kendaraan</label>
                <select
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary outline-none"
                  value={selectedJenis}
                  onChange={(e) => setSelectedJenis(e.target.value)}
                >
                  {tarifs.map((t) => (
                    <option key={t.id_tarif} value={t.jenis_kendaraan}>
                      {t.jenis_kendaraan.toUpperCase()} (Rp {t.tarif_per_jam}/jam)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area Parkir</label>
                <select
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary outline-none"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(Number(e.target.value))}
                >
                  {areas.map((a) => (
                    <option key={a.id_area} value={a.id_area}>
                      {a.nama_area} (Sisa: {a.kapasitas - a.terisi})
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" isLoading={loading}>
                Simpan (Check In)
              </Button>
            </form>
          </div>
        </div>

        {/* --- KOLOM KANAN: TABEL MONITOR --- */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Sedang Parkir ({dataParkir.length})</h2>
            <button 
              onClick={fetchInitialData} 
              className="text-sm text-primary hover:underline"
            >
              Refresh Data
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                <tr>
                  <th className="px-6 py-4">Plat Nomor</th>
                  <th className="px-6 py-4">Jenis</th>
                  <th className="px-6 py-4">Masuk</th>
                  <th className="px-6 py-4">Lokasi</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dataParkir.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">
                      Tidak ada kendaraan parkir saat ini.
                    </td>
                  </tr>
                ) : (
                  dataParkir.map((row) => (
                    <tr key={row.id_transaksi} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-gray-800">{row.plat_nomor}</td>
                      <td className="px-6 py-4 capitalize">{row.jenis_kendaraan}</td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(row.waktu_masuk).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} WIB
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                          {row.area?.nama_area}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleCheckOut(row.plat_nomor)}
                          className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        >
                          Keluar (Bayar)
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}