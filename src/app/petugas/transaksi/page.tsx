"use client";

import { useEffect, useState, useRef } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  LogOut,
  Ticket,
  X,
  QrCode,
  CarFront,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { formatRupiah, cn } from "@/lib/utils";
import api from "@/lib/axios";

/* =========================
   BACKGROUND DECORATION (Untuk Efek Glass)
   ========================= */
const BackgroundDecoration = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Gradient Blob Kiri Atas */}
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply animate-blob" />
    {/* Gradient Blob Kanan Bawah */}
    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000" />
    {/* Gradient Blob Tengah */}
    <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-4000" />
  </div>
);

/* =========================
   1. KOMPONEN STRUK PARKIR
   ========================= */
const StrukParkir = ({ data, componentRef }: any) => {
  if (!data) return null;

  return (
    <div className="hidden">
      <div
        ref={componentRef}
        className="p-2 font-mono text-[10px] w-[58mm] leading-tight"
      >
        <div className="text-center font-bold mb-2 uppercase">
          PARKIRAN CANGGIH
          <br />
          <span className="font-normal capitalize">Jl. Teknologi No. 1</span>
        </div>
        <div className="border-b border-dashed border-black my-2" />
        <table className="w-full">
          <tbody>
            <tr>
              <td className="py-0.5">ID Tiket</td>
              <td className="font-bold py-0.5 text-right">{data.struk_id}</td>
            </tr>
            <tr>
              <td className="py-0.5">Plat</td>
              <td className="font-bold py-0.5 text-right">{data.plat_nomor}</td>
            </tr>
            <tr>
              <td className="py-0.5">Masuk</td>
              <td className="py-0.5 text-right">{data.waktu_masuk}</td>
            </tr>
            {data.waktu_keluar && (
              <>
                <tr>
                  <td className="py-0.5">Keluar</td>
                  <td className="py-0.5 text-right">{data.waktu_keluar}</td>
                </tr>
                <tr>
                  <td className="py-0.5">Durasi</td>
                  <td className="py-0.5 text-right">{data.durasi}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
        <div className="border-b border-dashed border-black my-2" />
        {(data.biaya !== undefined || data.biaya_total !== undefined) && (
          <div className="flex justify-between font-bold text-sm mb-2">
            <span>TOTAL</span>
            <span>{formatRupiah(data.biaya || data.biaya_total || 0)}</span>
          </div>
        )}
        <div className="text-center mt-4 text-[8px] text-gray-600">
          TERIMA KASIH ATAS KUNJUNGAN ANDA
          <br />
          HARAP TIKET JANGAN HILANG
        </div>
      </div>
    </div>
  );
};

/* =========================
   2. KOMPONEN MODAL QRIS (GLASS STYLE)
   ========================= */
const QrisModal = ({ data, onClose }: { data: any; onClose: () => void }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop Blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        <div className="p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-white/20 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-600" />
            Scan QRIS
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-black/5 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center text-center">
          <div className="bg-white p-3 border rounded-2xl shadow-inner mb-4">
            {data.qr_image ? (
              <img
                src={data.qr_image}
                alt="QR Code"
                className="w-48 h-48 object-contain mix-blend-multiply"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-xs rounded-xl">
                [QR Code Image Here]
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500 mb-1 font-medium">
            Total Pembayaran
          </div>
          <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
            {formatRupiah(data.amount || 0)}
          </div>

          <div className="flex items-center gap-2 text-blue-700 bg-blue-100/50 px-5 py-2.5 rounded-full text-sm font-semibold animate-pulse border border-blue-200/50">
            <Loader2 className="w-4 h-4 animate-spin" />
            Menunggu Pembayaran...
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================
   3. HALAMAN UTAMA (TRANSAKSI)
   ========================= */
export default function TransaksiPage() {
  const [tarifs, setTarifs] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const [formIn, setFormIn] = useState({
    plat: "",
    jenis: "",
    area: "",
  });

  const [formOut, setFormOut] = useState({
    strukId: "",
    metode: "cash",
    foto: null as File | null,
  });

  const [modalQris, setModalQris] = useState<any>(null);
  const [strukData, setStrukData] = useState<any>(null);
  const strukRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const handlePrint = useReactToPrint({
    contentRef: strukRef,
  });

  useEffect(() => {
    fetchInitialData();
    return () => stopPolling();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [resTarif, resArea] = await Promise.all([
        api.get("/rates"),
        api.get("/areas"),
      ]);
      setTarifs(resTarif.data.data);
      setAreas(resArea.data.data);

      if (resTarif.data.data.length && !formIn.jenis) {
        setFormIn((f) => ({
          ...f,
          jenis: resTarif.data.data[0].jenis_kendaraan,
        }));
      }
      if (resArea.data.data.length && !formIn.area) {
        setFormIn((f) => ({ ...f, area: resArea.data.data[0].id_area }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showNotif = (type: "success" | "error", msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4000);
  };

  const cetakStruk = async (id: number) => {
    try {
      const res = await api.get(`/transaksi/struk/${id}`);
      setStrukData(res.data.data);
      setTimeout(() => {
        handlePrint?.();
      }, 500);
    } catch {
      showNotif("error", "Gagal load struk");
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/parking/in", {
        plat_nomor: formIn.plat,
        jenis_kendaraan: formIn.jenis,
        id_area: formIn.area,
      });
      showNotif("success", "Kendaraan berhasil Check-in");
      setFormIn({ ...formIn, plat: "" });
      cetakStruk(res.data.data.id_transaksi);
    } catch (err: any) {
      showNotif("error", err.response?.data?.message || "Check-in gagal");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      if (formOut.strukId) fd.append("struk_id", formOut.strukId);
      if (formOut.foto) fd.append("foto_identitas", formOut.foto);
      fd.append("metode_bayar", formOut.metode);

      const res = await api.post("/parking/out", fd);

      if (!res.data.is_qris) {
        showNotif("success", "Transaksi Selesai.");
        setFormOut({ strukId: "", metode: "cash", foto: null });
        cetakStruk(res.data.data.id_transaksi);
      } else {
        const totalBayar = res.data.nominal || res.data.data?.biaya_total || 0;
        setModalQris({ ...res.data, amount: totalBayar });
        startPolling(res.data.order_id, res.data.data.id_transaksi);
      }
    } catch (err: any) {
      showNotif("error", err.response?.data?.message || "Checkout gagal");
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (orderId: string, trxId: number) => {
    stopPolling();
    pollingRef.current = setInterval(async () => {
      try {
        const res = await api.get(`/transaksi/status/${orderId}`);
        if (res.data.status === "paid") {
          stopPolling();
          setModalQris(null);
          showNotif("success", "Pembayaran QRIS Berhasil!");
          cetakStruk(trxId);
        }
      } catch (error) {
        console.error(error);
      }
    }, 3000);
  };

  const stopPolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
  };

  return (
    <DashboardLayout requiredRole="petugas">
      <BackgroundDecoration />
      <StrukParkir data={strukData} componentRef={strukRef} />

      {modalQris && (
        <QrisModal
          data={modalQris}
          onClose={() => {
            setModalQris(null);
            stopPolling();
          }}
        />
      )}

      {notification && (
        <div
          className={cn(
            "fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border animate-in slide-in-from-right duration-300 backdrop-blur-md",
            notification.type === "success"
              ? "bg-green-50/90 border-green-200 text-green-700"
              : "bg-red-50/90 border-red-200 text-red-700",
          )}
        >
          <div
            className={cn(
              "p-2 rounded-full shadow-sm",
              notification.type === "success"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600",
            )}
          >
            {notification.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
          </div>
          <div>
            <p className="font-bold text-sm">
              {notification.type === "success" ? "Berhasil" : "Gagal"}
            </p>
            <p className="text-sm opacity-90">{notification.msg}</p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="relative mb-8 z-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Transaksi <span className="text-blue-600">Parkir</span>
        </h1>
        <p className="text-gray-500 mt-1 font-medium">
          Dashboard petugas untuk manajemen kendaraan keluar/masuk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* === CARD CHECK-IN (GLASS STYLE) === */}
        <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-1 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:bg-white/70">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5" />

          <div className="relative p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200/50">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/30">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-800">Check-In</h2>
                <p className="text-xs text-gray-500 font-medium">
                  Input kendaraan masuk
                </p>
              </div>
            </div>

            <form onSubmit={handleCheckIn} className="space-y-6">
              <div className="space-y-1">
                <Input
                  label="Nomor Polisi"
                  placeholder="B 1234 XYZ"
                  value={formIn.plat}
                  onChange={(e) =>
                    setFormIn({ ...formIn, plat: e.target.value.toUpperCase() })
                  }
                  required
                  className="uppercase text-lg font-semibold tracking-wide bg-white/50 border-white/50 backdrop-blur-sm focus:bg-white/80 h-12"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Jenis Kendaraan"
                  value={formIn.jenis}
                  onChange={(e) =>
                    setFormIn({ ...formIn, jenis: e.target.value })
                  }
                  options={tarifs.map((t) => ({
                    value: t.jenis_kendaraan,
                    label: t.jenis_kendaraan.toUpperCase(),
                  }))}
                  className="bg-white/50 border-white/50 h-11"
                />
                <Select
                  label="Area Parkir"
                  value={formIn.area}
                  onChange={(e) =>
                    setFormIn({ ...formIn, area: e.target.value })
                  }
                  options={areas.map((a) => ({
                    value: a.id_area,
                    label: a.nama_area,
                  }))}
                  className="bg-white/50 border-white/50 h-11"
                />
              </div>

              <div className="bg-blue-50/50 border border-blue-100/50 p-4 rounded-2xl flex items-center gap-3 backdrop-blur-sm">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <CarFront className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tarif per jam</p>
                  <p className="font-bold text-gray-800 text-lg">
                    {formatRupiah(
                      tarifs.find((t) => t.jenis_kendaraan === formIn.jenis)
                        ?.tarif_per_jam || 0,
                    )}
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                isLoading={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 h-12 rounded-xl text-base font-semibold transition-all hover:scale-[1.02]"
              >
                Cetak Tiket Masuk
              </Button>
            </form>
          </div>
        </div>

        {/* === CARD CHECK-OUT (GLASS STYLE) === */}
        <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-1 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:bg-white/70">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5" />

          <div className="relative p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200/50">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl text-white shadow-lg shadow-emerald-500/30">
                <LogOut className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-800">Check-Out</h2>
                <p className="text-xs text-gray-500 font-medium">
                  Pembayaran & Keluar
                </p>
              </div>
            </div>

            <form onSubmit={handleCheckOut} className="space-y-6">
              <div>
                <Input
                  label="Scan Barcode / ID Struk"
                  placeholder="Scan disini..."
                  value={formOut.strukId}
                  onChange={(e) =>
                    setFormOut({
                      ...formOut,
                      strukId: e.target.value.toUpperCase(),
                    })
                  }
                  className="font-mono text-lg bg-white/50 border-white/50 backdrop-blur-sm focus:bg-white/80 h-12"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormOut({ ...formOut, metode: "cash" })}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border transition-all duration-300",
                      formOut.metode === "cash"
                        ? "bg-emerald-50/80 border-emerald-500 text-emerald-700 shadow-md ring-1 ring-emerald-500"
                        : "bg-white/40 border-gray-200 text-gray-500 hover:bg-white/60 hover:border-emerald-300",
                    )}
                  >
                    <Zap
                      className={cn(
                        "w-6 h-6",
                        formOut.metode === "cash" ? "fill-current" : "",
                      )}
                    />
                    <span className="font-bold text-sm">Tunai</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormOut({ ...formOut, metode: "qris" })}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border transition-all duration-300",
                      formOut.metode === "qris"
                        ? "bg-blue-50/80 border-blue-500 text-blue-700 shadow-md ring-1 ring-blue-500"
                        : "bg-white/40 border-gray-200 text-gray-500 hover:bg-white/60 hover:border-blue-300",
                    )}
                  >
                    <QrCode className="w-6 h-6" />
                    <span className="font-bold text-sm">QRIS</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Foto Identitas (Opsional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) =>
                      setFormOut({
                        ...formOut,
                        foto: e.target.files ? e.target.files[0] : null,
                      })
                    }
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-xl file:border-0
                        file:text-sm file:font-semibold
                        file:bg-emerald-50 file:text-emerald-700
                        hover:file:bg-emerald-100
                        cursor-pointer bg-white/50 border border-white/50 rounded-xl"
                  />
                </div>
              </div>

              <Button
                type="submit"
                isLoading={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 h-12 rounded-xl text-base font-semibold transition-all hover:scale-[1.02] mt-2"
              >
                Proses Checkout
              </Button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
