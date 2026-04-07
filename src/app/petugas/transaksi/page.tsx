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
  Banknote,
  ScanLine,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { formatRupiah, cn } from "@/lib/utils";
import api from "@/lib/axios";
import { QRCodeSVG } from "qrcode.react";
import { Scanner } from "@yudiel/react-qr-scanner";

const GLASS_CARD =
  "bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-[#71C9CE]/5 rounded-[2rem] overflow-hidden";

// --- Components ---

const BackgroundDecoration = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#F0FBFC]">
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#71C9CE]/20 rounded-full blur-[100px] mix-blend-multiply animate-blob" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#A6E3E9]/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000" />
    <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] bg-[#CBF1F5]/30 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-4000" />
  </div>
);

const StrukParkir = ({ data, componentRef }: any) => {
  if (!data) return null;
  return (
    <div className="hidden">
      <div
        ref={componentRef}
        className="p-4 font-mono w-[58mm] leading-tight text-black bg-white"
      >
        <div className="text-center mb-4">
          <h2 className="font-bold text-[14px] uppercase mb-1">SiParkir</h2>
          <p className="text-[10px] uppercase tracking-wider">
            Smart System Area
          </p>
        </div>
        <div className="flex flex-col items-center justify-center mb-3">
          <QRCodeSVG value={data.struk_id} size={110} level="H" />
          <p className="font-bold text-[11px] mt-2 tracking-widest">
            {data.struk_id}
          </p>
        </div>
        <div className="border-b-[1.5px] border-dashed border-black my-3" />
        <table className="w-full text-[10px]">
          <tbody>
            <tr>
              <td className="py-1 align-top w-[40%]">Plat No</td>
              <td className="font-bold py-1 text-right">{data.plat_nomor}</td>
            </tr>
            <tr>
              <td className="py-1 align-top">Masuk</td>
              <td className="py-1 text-right">{data.waktu_masuk}</td>
            </tr>
          </tbody>
        </table>
        <div className="border-b-[1.5px] border-dashed border-black my-3" />
        <div className="text-center mt-5 text-[9px]">
          <p>Terima Kasih</p>
          <p>Simpan tiket ini sebagai bukti parkir</p>
          <p className="font-bold mt-1">HILANG TIKET DENDA RP 50.000</p>
        </div>
      </div>
    </div>
  );
};

const QrisModal = ({ data, onClose }: { data: any; onClose: () => void }) => {
  if (!data) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95">
        <div className="p-5 bg-gradient-to-r from-[#E3FDFD] to-white border-b border-[#A6E3E9]/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <div className="p-1.5 bg-white rounded-lg shadow-sm">
              <QrCode className="w-5 h-5 text-[#71C9CE]" />
            </div>
            Scan QRIS
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8 flex flex-col items-center text-center">
          <div className="bg-white p-4 border border-slate-100 rounded-3xl shadow-inner mb-6 relative">
            <img
              src={data.qr_image}
              alt="QR Code"
              className="w-48 h-48 object-contain mix-blend-multiply"
            />
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            Total Tagihan
          </div>
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#71C9CE] to-[#4AA3A8] mb-8">
            {formatRupiah(data.amount || 0)}
          </div>
          <div className="flex items-center gap-3 text-[#71C9CE] bg-[#E3FDFD] px-6 py-3 rounded-2xl text-sm font-bold animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            Menunggu Pembayaran...
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page ---

export default function TransaksiPage() {
  const [tarifs, setTarifs] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const [formIn, setFormIn] = useState({ plat: "", jenis: "", area: "" });
  const [formOut, setFormOut] = useState({
    strukId: "",
    metode: "cash",
    foto: null as File | null,
  });

  const [modalQris, setModalQris] = useState<any>(null);
  const [strukData, setStrukData] = useState<any>(null);
  const strukRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const handlePrint = useReactToPrint({ contentRef: strukRef });

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
      if (resTarif.data.data.length)
        setFormIn((f) => ({
          ...f,
          jenis: resTarif.data.data[0].jenis_kendaraan,
        }));
      if (resArea.data.data.length)
        setFormIn((f) => ({ ...f, area: resArea.data.data[0].id_area }));
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
      setTimeout(() => handlePrint?.(), 500);
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
      cetakStruk(res.data.data.id_transaksi); // Tetap cetak saat masuk
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
        // cetakStruk dihapus dari sini
      } else {
        const totalBayar = res.data.nominal || res.data.data?.biaya_total || 0;
        setModalQris({ ...res.data, amount: totalBayar });
        startPolling(res.data.order_id);
      }
    } catch (err: any) {
      showNotif("error", err.response?.data?.message || "Checkout gagal");
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (orderId: string) => {
    stopPolling();
    pollingRef.current = setInterval(async () => {
      try {
        const res = await api.get(`/transaksi/status/${orderId}`);
        if (res.data.status === "paid") {
          stopPolling();
          setModalQris(null);
          setFormOut({ strukId: "", metode: "cash", foto: null });
          showNotif("success", "Pembayaran QRIS Berhasil!");
          // cetakStruk dihapus dari sini
        }
      } catch (error) {
        console.error(error);
      }
    }, 3000);
  };

  const stopPolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
  };

  const handleScanResult = (result: any) => {
    if (result?.length > 0) {
      setFormOut({ ...formOut, strukId: result[0].rawValue });
      setIsScanning(false);
      showNotif("success", "Berhasil scan struk!");
    }
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
            "fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border animate-in slide-in-from-right backdrop-blur-xl",
            notification.type === "success"
              ? "bg-[#E3FDFD]/90 border-[#A6E3E9] text-[#4AA3A8]"
              : "bg-red-50/90 border-red-100 text-red-600",
          )}
        >
          <div
            className={cn(
              "p-2 rounded-full shadow-sm",
              notification.type === "success"
                ? "bg-white text-[#71C9CE]"
                : "bg-white text-red-500",
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
              {notification.type === "success" ? "Sukses" : "Gagal"}
            </p>
            <p className="text-xs font-medium opacity-90">{notification.msg}</p>
          </div>
        </div>
      )}

      <div className="relative mb-10 z-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Transaksi <span className="text-[#71C9CE]">Kendaraan</span>
        </h1>
        <p className="text-gray-500 mt-1 font-medium text-sm">
          Input kedatangan dan proses pembayaran parkir.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 items-start">
        {/* Check-In Card */}
        <div
          className={cn(
            GLASS_CARD,
            "p-1 bg-gradient-to-br from-[#71C9CE]/10 to-transparent",
          )}
        >
          <div className="relative p-8 bg-white/40 backdrop-blur-xl rounded-[1.8rem]">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-gradient-to-br from-[#71C9CE] to-[#A6E3E9] p-3.5 rounded-2xl text-white shadow-lg shadow-[#71C9CE]/30">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-black text-xl text-slate-800">Check-In</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                  Kendaraan Masuk
                </p>
              </div>
            </div>
            <form onSubmit={handleCheckIn} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">
                  PLAT NOMOR
                </label>
                <Input
                  placeholder="B 1234 XYZ"
                  value={formIn.plat}
                  onChange={(e) =>
                    setFormIn({ ...formIn, plat: e.target.value.toUpperCase() })
                  }
                  required
                  className="uppercase text-lg font-bold tracking-widest bg-white h-14"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                  className="bg-white h-12"
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
                  className="bg-white h-12"
                />
              </div>
              <Button
                type="submit"
                isLoading={loading}
                className="w-full bg-[#71C9CE] hover:bg-[#5dbbc0] text-white h-14 rounded-2xl font-bold"
              >
                Cetak Tiket Masuk
              </Button>
            </form>
          </div>
        </div>

        {/* Check-Out Card */}
        <div
          className={cn(
            GLASS_CARD,
            "p-1 bg-gradient-to-br from-slate-200 to-transparent",
          )}
        >
          <div className="relative p-8 bg-white/40 backdrop-blur-xl rounded-[1.8rem]">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-gradient-to-br from-slate-700 to-slate-800 p-3.5 rounded-2xl text-white shadow-lg shadow-slate-500/30">
                <LogOut className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-black text-xl text-slate-800">Check-Out</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                  Pembayaran & Keluar
                </p>
              </div>
            </div>
            <form onSubmit={handleCheckOut} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">
                  SCAN TIKET / ID
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Scan disini..."
                    value={formOut.strukId}
                    onChange={(e) =>
                      setFormOut({
                        ...formOut,
                        strukId: e.target.value.toUpperCase(),
                      })
                    }
                    className="font-mono text-lg bg-white h-14 w-full"
                  />
                  <Button
                    type="button"
                    onClick={() => setIsScanning(!isScanning)}
                    className={cn(
                      "h-14 w-14 rounded-2xl",
                      isScanning ? "bg-red-500" : "bg-slate-800",
                    )}
                  >
                    {isScanning ? (
                      <X className="w-6 h-6" />
                    ) : (
                      <ScanLine className="w-6 h-6" />
                    )}
                  </Button>
                </div>
                {isScanning && (
                  <div className="mt-4 rounded-xl overflow-hidden border-2 border-[#71C9CE] shadow-lg animate-in zoom-in-95">
                    <Scanner
                      onScan={handleScanResult}
                      components={{ audio: false, finder: true }}
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormOut({ ...formOut, metode: "cash" })}
                  className={cn(
                    "flex flex-col items-center py-4 rounded-2xl border",
                    formOut.metode === "cash"
                      ? "bg-[#E3FDFD] border-[#71C9CE] text-[#71C9CE]"
                      : "bg-white text-slate-400",
                  )}
                >
                  <Banknote className="w-6 h-6 mb-1" />{" "}
                  <span className="font-bold text-sm">Tunai</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormOut({ ...formOut, metode: "qris" })}
                  className={cn(
                    "flex flex-col items-center py-4 rounded-2xl border",
                    formOut.metode === "qris"
                      ? "bg-slate-100 border-slate-600 text-slate-800"
                      : "bg-white text-slate-400",
                  )}
                >
                  <QrCode className="w-6 h-6 mb-1" />{" "}
                  <span className="font-bold text-sm">QRIS</span>
                </button>
              </div>
              <Button
                type="submit"
                isLoading={loading}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white h-14 rounded-2xl font-bold"
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
