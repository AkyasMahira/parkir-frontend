"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CarFront,
  QrCode,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
/* =========================
   BACKGROUND BLOBS (Untuk Efek Glass)
   ========================= */
const BackgroundBlobs = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Blob Biru Atas */}
    <motion.div
      animate={{
        x: [0, 100, 0],
        y: [0, -50, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-blue-400/30 rounded-full blur-[100px]"
    />

    {/* Blob Emerald Bawah Kanan */}
    <motion.div
      animate={{
        x: [0, -100, 0],
        y: [0, 50, 0],
        scale: [1, 1.3, 1],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] bg-emerald-400/20 rounded-full blur-[120px]"
    />

    {/* Blob Ungu Tengah Kecil */}
    <motion.div
      animate={{
        rotate: 360,
        scale: [1, 1.5, 1],
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-0 left-[20%] w-[40vw] h-[40vw] bg-indigo-400/20 rounded-full blur-[100px]"
    />
  </div>
);

/* =========================
   COMPONENTS
   ========================= */

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-white/70 backdrop-blur-xl border-white/40 shadow-sm"
          : "bg-transparent border-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/30">
            <CarFront size={22} />
          </div>
          <span className="tracking-tight">
            Si<span className="text-blue-600">Parkir</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          {["Fitur", "Cara Kerja", "Harga"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="hover:text-blue-600 transition relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button
              variant="ghost"
              className="hidden sm:flex hover:bg-white/50 text-gray-700"
            >
              Masuk Petugas
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-blue-600/90 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 backdrop-blur-md border border-white/20 rounded-full px-6">
              Mulai Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section className="relative pt-40 pb-20 px-6 overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/50 text-blue-700 text-sm font-bold mb-8 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Sistem Parkir QRIS 2026
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-[1.1]"
        >
          Kelola Parkir{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 relative">
            Cerdas
            {/* Underline decoration */}
            <svg
              className="absolute w-full h-3 -bottom-1 left-0 text-blue-400 opacity-60"
              viewBox="0 0 200 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.00025 6.99997C2.00025 6.99997 18.0004 2.99997 101.5 2.49997C184.999 1.99997 197.999 5.49996 197.999 5.49996"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          <br className="hidden md:block" />
          tanpa{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
            Uang Tunai
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed bg-white/30 backdrop-blur-sm p-4 rounded-2xl border border-white/20"
        >
          Platform manajemen parkir modern dengan dukungan pembayaran QRIS
          instan, monitoring real-time, dan laporan pendapatan yang akurat.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/dashboard">
            <Button className="h-14 px-8 text-lg rounded-full bg-gray-900 hover:bg-gray-800 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              Coba Demo Gratis <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Button
            variant="outline"
            className="h-14 px-8 text-lg rounded-full border-gray-300/50 bg-white/50 backdrop-blur-md text-gray-700 hover:bg-white/80"
          >
            Pelajari Lebih Lanjut
          </Button>
        </motion.div>

        {/* Glass Mockup */}
        <motion.div
          style={{ y: y1 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >

         {/* Glass Card Container */}
          <div className="relative rounded-3xl p-2 bg-gradient-to-b from-white/40 to-white/10 backdrop-blur-xl border border-white/50 shadow-2xl">
            <div className="absolute inset-0 bg-white/5 rounded-3xl" />
            
            {/* Bagian Image Container */}
            <div className="relative bg-white/80 rounded-2xl overflow-hidden aspect-[16/9] border border-gray-100/50 group">
              
              {/* IMAGE COMPONENT */}
              <Image 
                src="/dashboard-preview.png" // Pastikan nama file sesuai di folder public
                alt="Dashboard Parkiran Canggih"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority
              />

              {/* Overlay Glare Effect (Opsional - biar makin kaca) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/20 pointer-events-none" />
            </div>
          </div>

          {/* Floating Element Decoration */}
          <motion.div
            style={{ y: y2 }}
            className="absolute -right-10 -top-10 bg-white/60 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/40 animate-bounce-slow hidden md:block"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pembayaran Berhasil</p>
                <p className="font-bold text-gray-800">Rp 15.000</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="group p-8 rounded-3xl border border-white/40 bg-white/40 backdrop-blur-md shadow-lg hover:shadow-xl hover:bg-white/60 transition-all duration-300"
  >
    <div
      className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 shadow-sm group-hover:scale-110",
        color,
      )}
    >
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
  </motion.div>
);

const FeaturesSection = () => (
  <section id="fitur" className="py-32 relative">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="text-center mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-gray-900 mb-6"
        >
          Kenapa Memilih Kami?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 max-w-2xl mx-auto text-lg"
        >
          Kami menggabungkan perangkat keras yang handal dengan perangkat lunak
          berbasis cloud untuk efisiensi maksimal.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          delay={0.1}
          icon={QrCode}
          color="bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
          title="Integrasi QRIS Otomatis"
          desc="Pembayaran non-tunai yang cepat dan aman. Terintegrasi langsung dengan payment gateway untuk verifikasi instan."
        />
        <FeatureCard
          delay={0.2}
          icon={BarChart3}
          color="bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
          title="Laporan Real-Time"
          desc="Pantau pendapatan harian, mingguan, hingga bulanan. Analisa kepadatan parkir langsung dari dashboard."
        />
        <FeatureCard
          delay={0.3}
          icon={ShieldCheck}
          color="bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
          title="Keamanan Terjamin"
          desc="Sistem validasi tiket ganda dan pencatatan plat nomor digital meminimalisir risiko kehilangan kendaraan."
        />
      </div>
    </div>
  </section>
);

const StepItem = ({ number, title, desc, index }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.2 }}
    className="flex gap-6 relative"
  >
    {/* Line connector */}
    {index !== 3 && (
      <div className="absolute left-5 top-12 bottom-[-20px] w-0.5 bg-gray-200" />
    )}

    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-200 z-10">
      {number}
    </div>
    <div className="pb-8">
      <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-500 leading-relaxed bg-white/50 p-4 rounded-xl border border-white/60 shadow-sm backdrop-blur-sm">
        {desc}
      </p>
    </div>
  </motion.div>
);

const HowItWorks = () => (
  <section id="cara-kerja" className="py-32 relative">
    {/* Background Glass container for this section */}
    <div className="absolute inset-0 bg-white/30 backdrop-blur-3xl z-0" />

    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
      <div>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-8"
        >
          Alur Parkir yang <br />{" "}
          <span className="text-blue-600">Sederhana & Cepat</span>
        </motion.h2>

        <div className="space-y-2 mt-12">
          <StepItem
            index={1}
            number="1"
            title="Check-In Masuk"
            desc="Petugas menginput plat nomor. Tiket dicetak dengan QR Code unik yang menyimpan waktu masuk."
          />
          <StepItem
            index={2}
            number="2"
            title="Scan Tiket Keluar"
            desc="Saat keluar, scan struk parkir. Sistem otomatis menghitung durasi dan total biaya."
          />
          <StepItem
            index={3}
            number="3"
            title="Bayar dengan QRIS"
            desc="Pengunjung scan QRIS yang muncul di layar. Gate otomatis terbuka setelah pembayaran sukses."
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Glass Effect Card for Phone/Struk */}
        <div className="relative bg-gradient-to-br from-white/60 to-white/20 p-8 rounded-[3rem] shadow-2xl border border-white/50 backdrop-blur-xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl -z-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl -z-10" />

          {/* Simulasi UI Struk */}
          <div className="bg-white/80 rounded-2xl p-6 mb-6 shadow-inner border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b border-dashed border-gray-300 pb-4">
              <span className="font-bold text-gray-800 text-lg">
                Mobil
              </span>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CarFront size={16} className="text-blue-600" />
              </div>
            </div>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Masuk</span> <span className="font-mono">10:00 WIB</span>
              </div>
              <div className="flex justify-between">
                <span>Keluar</span> <span className="font-mono">13:15 WIB</span>
              </div>
              <div className="flex justify-between">
                <span>Durasi</span>{" "}
                <span className="font-mono">3 Jam 15 Mnt</span>
              </div>
              <div className="my-4 border-t border-gray-200" />
              <div className="flex justify-between items-end">
                <span className="text-gray-500">Total Tagihan</span>
                <span className="text-2xl font-bold text-gray-900">
                  Rp 15.000
                </span>
              </div>
            </div>
          </div>

          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 rounded-xl text-lg font-bold shadow-lg hover:shadow-blue-500/40 transition-all">
            Bayar Sekarang
          </Button>

          <div className="mt-6 flex justify-center text-gray-400 text-xs">
            Powered by SiParkir System
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-white/80 backdrop-blur-xl pt-20 pb-10 border-t border-white/20 relative z-10">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 font-bold text-xl mb-6 text-gray-900">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <CarFront size={20} />
          </div>
          <span>SiParkir</span>
        </div>
        <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
          Solusi manajemen parkir masa depan. Menggabungkan estetika modern dan
          teknologi pembayaran terdepan.
        </p>
      </div>

      <div>
        <h4 className="font-bold mb-6 text-gray-900">Produk</h4>
        <ul className="space-y-4 text-sm text-gray-500">
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              Fitur Utama
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              Hardware
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              Integrasi API
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-6 text-gray-900">Perusahaan</h4>
        <ul className="space-y-4 text-sm text-gray-500">
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              Tentang Kami
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              Hubungi Sales
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600 transition">
              Privasi
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
      &copy; 2026 SiParkir. All rights reserved.
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <main className="min-h-screen font-sans bg-[#F8FAFC] relative overflow-hidden">
      <BackgroundBlobs />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <Footer />
    </main>
  );
}
