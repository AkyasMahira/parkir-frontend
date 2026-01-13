"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select"; // Komponen baru di atas
import { RefreshCcw, CarFront, Ticket, Crown, LogOut, Search } from "lucide-react";
import { formatRupiah, cn } from "@/lib/utils";
import api from "@/lib/axios";
import { Transaksi, AreaParkir, Tarif } from "@/types/api";

export default function TransaksiPage() {
  // --- STATE DATA ---
  const [dataParkir, setDataParkir] = useState<Transaksi[]>([]);
  const [areas, setAreas] = useState<AreaParkir[]>([]);
  const [tarifs, setTarifs] = useState<Tarif[]>([]);
  
  // --- STATE UI ---
  const [loadingData, setLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // --- STATE FORM ---
  const [platNomor, setPlatNomor] = useState("");
  const [selectedArea, setSelectedArea] = useState<number | "">("");
  const [selectedJenis, setSelectedJenis] = useState("");

  // --- FETCH DATA ---
  const fetchInitialData = async () => {
    setLoadingData(true);
    try {
      const [resArea, resTarif, resParkir] = await Promise.all([
        api.get("/areas"),
        api.get("/rates"),
        api.get("/parking?status=masuk"),
      ]);

      const areaList = resArea.data.data;
      const tarifList = resTarif.data.data;

      setAreas(areaList);
      setTarifs(tarifList);
      setDataParkir(resParkir.data.data);

      // Auto-select defaults jika form masih kosong
      if (!selectedArea && areaList.length > 0) setSelectedArea(areaList[0].id_area);
      if (!selectedJenis && tarifList.length > 0) setSelectedJenis(tarifList[0].jenis_kendaraan);

    } catch (error) {
      console.error("Gagal load data", error);
      showNotification("error", "Gagal memuat data dari server.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // --- HELPER UI ---
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    // Auto hide notif setelah 5 detik
    setTimeout(() => setNotification(null), 5000);
  };

  // --- HANDLER CHECK-IN ---
  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    if (!platNomor || !selectedArea || !selectedJenis) return;

    setIsSubmitting(true);
    try {
      await api.post("/parking/in", {
        plat_nomor: platNomor,
        id_area: selectedArea,
        jenis_kendaraan: selectedJenis,
      });

      setPlatNomor(""); // Reset plat saja, area/jenis biasanya tetap sama
      showNotification("success", `Kendaraan ${platNomor} berhasil Check-In!`);
      fetchInitialData(); // Refresh tabel
    } catch (error: any) {
      const msg = error.response?.data?.message || "Terjadi kesalahan sistem.";
      showNotification("error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- HANDLER CHECK-OUT ---
  const handleCheckOut = async (plat: string) => {
    if (!confirm(`Konfirmasi Checkout untuk kendaraan ${plat}?`)) return;

    try {
      const res = await api.post("/parking/out", { plat_nomor: plat });
      const { biaya_total, durasi_jam } = res.data.data;

      // Note: Idealnya ini pakai Modal, tapi untuk MVP alert sudah informatif jika di-format
      alert(
        `✅ CHECKOUT SUKSES\n\n` +
        `Kendaraan: ${plat}\n` +
        `Durasi: ${durasi_jam} Jam\n` +
        `Total Tagihan: ${formatRupiah(biaya_total)}`
      );

      fetchInitialData();
    } catch (error: any) {
      alert("❌ Gagal Checkout: " + (error.response?.data?.message || "Error"));
    }
  };

  // --- FILTERING ---
  const filteredData = dataParkir.filter(item => 
    item.plat_nomor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout requiredRole="petugas">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- SECTION KIRI: FORM INPUT (4 Kolom) --- */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
          
          {/* Card Input */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Check-In Baru</h2>
                <p className="text-xs text-gray-500">Input kendaraan masuk</p>
              </div>
            </div>

            {/* Notification Banner */}
            {notification && (
              <div className={cn(
                "mb-4 p-3 rounded-lg text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2",
                notification.type === 'success' ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
              )}>
                {notification.message}
              </div>
            )}

            <form onSubmit={handleCheckIn} className="space-y-5">
              <Input
                label="Plat Nomor"
                placeholder="B 1234 XYZ"
                value={platNomor}
                onChange={(e) => setPlatNomor(e.target.value.toUpperCase())}
                startIcon={CarFront}
                required
                className="uppercase tracking-wider font-semibold"
                helperText="Pastikan plat nomor sesuai STNK"
              />

              <Select
                label="Jenis Kendaraan"
                value={selectedJenis}
                onChange={(e) => setSelectedJenis(e.target.value)}
                options={tarifs.map(t => ({
                  value: t.jenis_kendaraan,
                  label: `${t.jenis_kendaraan.toUpperCase()} — ${formatRupiah(t.tarif_per_jam)}/jam`
                }))}
              />

              <Select
                label="Area Parkir"
                value={selectedArea}
                onChange={(e) => setSelectedArea(Number(e.target.value))}
                options={areas.map(a => ({
                  value: a.id_area,
                  label: `${a.nama_area} (Sisa: ${a.kapasitas - a.terisi})`
                }))}
              />

              <div className="pt-2">
                <Button type="submit" isLoading={isSubmitting} fullWidth size="lg">
                  Check In Masuk
                </Button>
              </div>
            </form>
          </div>

          {/* Info Card (Optional) */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h3 className="text-sm font-bold text-blue-800 mb-1">Status Area</h3>
            <p className="text-xs text-blue-600 mb-3">Kapasitas area parkir saat ini:</p>
            <div className="space-y-2">
              {areas.map(area => (
                <div key={area.id_area} className="flex justify-between text-xs">
                  <span className="text-gray-600">{area.nama_area}</span>
                  <span className="font-bold text-gray-900">{area.kapasitas - area.terisi} Kosong</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- SECTION KANAN: TABEL MONITOR (8 Kolom) --- */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col min-h-[600px]">
            
            {/* Header Table */}
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Monitor Parkir</h2>
                <p className="text-xs text-gray-500">Kendaraan yang sedang parkir saat ini</p>
              </div>
              
              <div className="flex items-center gap-2">
                 {/* Search Box Kecil */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Cari Plat..." 
                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 w-40 sm:w-56"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchInitialData}
                  isLoading={loadingData}
                  leftIcon={RefreshCcw}
                >
                  Refresh
                </Button>
              </div>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 whitespace-nowrap">Kendaraan</th>
                    <th className="px-6 py-4 whitespace-nowrap">Waktu Masuk</th>
                    <th className="px-6 py-4 whitespace-nowrap">Lokasi</th>
                    <th className="px-6 py-4 text-right whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loadingData ? (
                    // Skeleton Loading Rows
                    [...Array(3)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                        <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-20 ml-auto"></div></td>
                      </tr>
                    ))
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <CarFront className="w-10 h-10 text-gray-300" />
                          <p>Tidak ada data kendaraan {searchQuery && "yang cocok"}.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row) => (
                      <tr key={row.id_transaksi} className="hover:bg-gray-50/80 transition-colors group">
                        
                        {/* Kolom Kendaraan */}
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-md text-gray-600">
                              <CarFront className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-base tracking-wide">
                                {row.plat_nomor}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500 capitalize bg-gray-100 px-1.5 py-0.5 rounded">
                                  {row.jenis_kendaraan}
                                </span>
                                {row.kendaraan && (
                                  <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                                    <Crown className="w-3 h-3" />
                                    MEMBER
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Kolom Waktu */}
                        <td className="px-6 py-4">
                          <p className="text-gray-900 font-medium">
                            {new Date(row.waktu_masuk).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(row.waktu_masuk).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                          </p>
                        </td>

                        {/* Kolom Lokasi */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {row.area?.nama_area || "-"}
                          </span>
                        </td>

                        {/* Kolom Aksi */}
                        <td className="px-6 py-4 text-right">
                          <Button 
                            variant="danger" 
                            size="sm"
                            leftIcon={LogOut}
                            onClick={() => handleCheckOut(row.plat_nomor)}
                            className="shadow-none opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100" // Tombol muncul saat hover baris
                          >
                            Checkout
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Footer Table (Count) */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 text-center">
              Menampilkan {filteredData.length} kendaraan
            </div>
            
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}