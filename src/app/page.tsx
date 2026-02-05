"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CarFront,
  QrCode,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  CreditCard,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";

const BackgroundBlobs = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#F0FBFC]">
    {/* Blob Teal Kiri Atas */}
    <motion.div
      animate={{
        x: [0, 100, 0],
        y: [0, -50, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-[#71C9CE]/20 rounded-full blur-[100px]"
    />

    {/* Blob Cyan Bawah Kanan */}
    <motion.div
      animate={{
        x: [0, -100, 0],
        y: [0, 50, 0],
        scale: [1, 1.3, 1],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] bg-[#A6E3E9]/30 rounded-full blur-[120px]"
    />

    {/* Blob Soft Center */}
    <motion.div
      animate={{
        rotate: 360,
        scale: [1, 1.5, 1],
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-0 left-[20%] w-[40vw] h-[40vw] bg-[#CBF1F5]/40 rounded-full blur-[100px]"
    />
  </div>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          ? "bg-white/80 backdrop-blur-xl border-white/40 shadow-sm shadow-[#71C9CE]/5"
          : "bg-transparent border-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center gap-3 font-black text-xl text-slate-800 tracking-tight">
          <div className="bg-gradient-to-tr from-[#71C9CE] to-[#A6E3E9] text-white p-2.5 rounded-2xl shadow-lg shadow-[#71C9CE]/30">
            <CarFront size={24} />
          </div>
          <span>
            Si<span className="text-[#71C9CE]">Parkir</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
          {["Fitur", "Cara Kerja", "Keunggulan"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="hover:text-[#71C9CE] transition-colors relative group py-2"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#71C9CE] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block">
            <Button
              variant="secondary"
              className="bg-white/50 hover:bg-white text-slate-700 border border-white shadow-sm"
            >
              Masuk Petugas
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-[#71C9CE] hover:bg-[#5dbbc0] text-white shadow-lg shadow-[#71C9CE]/30 border border-white/20 rounded-full px-8 h-12">
              Mulai Sekarang
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -80]);

  return (
    <section className="relative pt-48 pb-20 px-6 overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-sm mb-10 group cursor-default hover:bg-white transition-colors"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#71C9CE] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#71C9CE]"></span>
          </span>
          <span className="text-[#71C9CE] text-xs font-black tracking-widest uppercase">
            New System 2026
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl md:text-8xl font-black text-slate-800 tracking-tight mb-8 leading-[1.1]"
        >
          Smart Parking <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#71C9CE] to-[#4AA3A8] relative">
            Solution.
            {/* Underline decoration */}
            <svg
              className="absolute w-full h-4 -bottom-2 left-0 text-[#CBF1F5] -z-10"
              viewBox="0 0 200 9"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2.00025 6.99997C2.00025 6.99997 18.0004 2.99997 101.5 2.49997C184.999 1.99997 197.999 5.49996 197.999 5.49996" />
            </svg>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
        >
          Transformasi area parkir Anda dengan sistem manajemen berbasis cloud,
          integrasi QRIS instan, dan analitik pendapatan real-time.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/dashboard">
            <Button className="h-14 px-10 text-lg rounded-full bg-slate-800 hover:bg-slate-900 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              Live Demo <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Button
            variant="outline"
            className="h-14 px-10 text-lg rounded-full border-slate-200 bg-white/60 backdrop-blur-xl text-slate-700 hover:bg-white hover:border-[#71C9CE] hover:text-[#71C9CE]"
          >
            Hubungi Sales
          </Button>
        </motion.div>

        {/* Glass Mockup Area */}
        <motion.div
          style={{ y: y1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-24 relative mx-auto max-w-6xl"
        >
          {/* Glow Effect Behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#71C9CE]/20 rounded-full blur-[100px] -z-10" />

          {/* Main Glass Container */}
          <div className="relative rounded-[2.5rem] p-3 bg-gradient-to-b from-white/60 to-white/20 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-[#71C9CE]/10">
            <div className="bg-slate-100 rounded-[2rem] overflow-hidden aspect-[16/10] relative group border border-slate-200/50">
              {/* Placeholder Image - Ganti src dengan screenshot dashboard Anda */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#E3FDFD] to-white flex items-center justify-center">
                <div className="text-center p-10">
                  <Image
                    src="/admin-dashboard.png" // Pastikan ada file ini atau ganti
                    alt="Dashboard Admin Preview"
                    fill
                    className="object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Fallback Text jika image error/loading */}
                  <p className="text-[#71C9CE] font-bold opacity-0">
                    Dashboard Preview
                  </p>
                </div>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          </div>

          {/* Floating Card: Transaksi Sukses */}
          <motion.div
            style={{ y: y2 }}
            className="absolute -right-8 -top-12 bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-xl shadow-[#71C9CE]/10 border border-white animate-float hidden md:block"
          >
            <div className="flex items-center gap-4">
              <div className="bg-[#E3FDFD] p-3 rounded-full text-[#71C9CE] ring-4 ring-white">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Payment Success
                </p>
                <p className="text-xl font-black text-slate-800">Rp 25.000</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -10 }}
    className="group p-8 rounded-[2.5rem] bg-white/50 backdrop-blur-xl border border-white/60 hover:bg-white hover:border-[#A6E3E9] shadow-lg hover:shadow-2xl hover:shadow-[#71C9CE]/10 transition-all duration-300"
  >
    <div className="w-16 h-16 rounded-2xl bg-[#E3FDFD] flex items-center justify-center mb-6 text-[#71C9CE] group-hover:scale-110 group-hover:bg-[#71C9CE] group-hover:text-white transition-all duration-300 shadow-inner">
      <Icon size={32} />
    </div>
    <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">
      {title}
    </h3>
    <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

const FeaturesSection = () => (
  <section id="fitur" className="py-32 relative">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="text-center mb-20 max-w-3xl mx-auto">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[#71C9CE] font-bold tracking-widest uppercase text-sm mb-2 block"
        >
          Powerful Features
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black text-slate-800 mb-6"
        >
          Teknologi Parkir <br /> Masa Depan.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 text-lg font-medium"
        >
          Sistem end-to-end yang dirancang untuk meningkatkan efisiensi
          operasional dan pengalaman pengunjung Anda.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          delay={0.1}
          icon={QrCode}
          title="QRIS Integration"
          desc="Pembayaran instan tanpa uang tunai. Support semua e-wallet mayoritas di Indonesia."
        />
        <FeatureCard
          delay={0.2}
          icon={BarChart3}
          title="Live Analytics"
          desc="Dashboard interaktif untuk memantau traffic kendaraan dan revenue stream secara real-time."
        />
        <FeatureCard
          delay={0.3}
          icon={ShieldCheck}
          title="Secure Gate"
          desc="Sistem validasi tiket digital ganda meminimalisir kecurangan dan kehilangan kendaraan."
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
    className="flex gap-8 relative group"
  >
    {/* Line Connector */}
    {index !== 3 && (
      <div className="absolute left-7 top-16 bottom-[-40px] w-0.5 bg-slate-200 group-hover:bg-[#A6E3E9] transition-colors" />
    )}

    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white border border-[#A6E3E9] text-[#71C9CE] flex items-center justify-center text-xl font-black shadow-lg shadow-[#71C9CE]/10 z-10 group-hover:bg-[#71C9CE] group-hover:text-white transition-all duration-300">
      {number}
    </div>
    <div className="pb-10 pt-2">
      <h4 className="text-2xl font-bold text-slate-800 mb-3">{title}</h4>
      <p className="text-slate-500 leading-relaxed font-medium max-w-md">
        {desc}
      </p>
    </div>
  </motion.div>
);

const HowItWorks = () => (
  <section id="cara-kerja" className="py-32 relative overflow-hidden">
    {/* Decorative Background */}
    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-[#E3FDFD] to-transparent rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
      <div>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[#71C9CE] font-bold tracking-widest uppercase text-sm mb-2 block"
        >
          Workflow
        </motion.span>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl md:text-5xl font-black text-slate-800 mb-12"
        >
          Simpel, Cepat, <br />{" "}
          <span className="text-[#71C9CE]">Terotomatisasi.</span>
        </motion.h2>

        <div className="space-y-4">
          <StepItem
            index={1}
            number="01"
            title="Digital Check-In"
            desc="Petugas menginput data kendaraan. Sistem menghasilkan tiket QR unik yang terenkripsi."
          />
          <StepItem
            index={2}
            number="02"
            title="Auto Calculation"
            desc="Saat keluar, tiket di-scan. Sistem menghitung durasi dan biaya akurat hingga detik."
          />
          <StepItem
            index={3}
            number="03"
            title="Cashless Payment"
            desc="Pengunjung membayar via QRIS. Gate terbuka otomatis setelah verifikasi pembayaran sukses."
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8 }}
        className="relative perspective-1000"
      >
        {/* Floating Card UI */}
        <div className="relative bg-white/60 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl shadow-[#71C9CE]/20 border border-white">
          {/* UI Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-[#E3FDFD] rounded-full flex items-center justify-center text-[#71C9CE]">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Payment Gate</p>
                <p className="text-xs text-slate-400 font-bold">
                  Terminal A-01
                </p>
              </div>
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">
              Online
            </div>
          </div>

          {/* Struk Simulation */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
            {/* Ticket Cut Decoration */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#F5F7FA] rounded-full" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#F5F7FA] rounded-full" />

            <div className="text-center mb-6">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                Total Tagihan
              </p>
              <h3 className="text-4xl font-black text-slate-800">Rp 15.000</h3>
            </div>

            <div className="space-y-3 text-sm font-medium text-slate-600">
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                <span>Plat Nomor</span>
                <span className="font-bold text-slate-800">B 1234 XYZ</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                <span>Durasi</span>
                <span className="font-bold text-slate-800">2 Jam 45 Menit</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button className="w-full h-16 bg-[#71C9CE] hover:bg-[#5dbbc0] text-white rounded-2xl text-lg font-bold shadow-xl shadow-[#71C9CE]/30 flex items-center justify-center gap-3 group">
            <Zap className="fill-white group-hover:scale-110 transition-transform" />
            Proses Pembayaran
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-white/80 backdrop-blur-3xl pt-24 pb-12 border-t border-white/60 relative z-10">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-3 font-black text-2xl mb-6 text-slate-800">
          <div className="bg-[#71C9CE] p-2.5 rounded-xl text-white shadow-lg shadow-[#71C9CE]/30">
            <CarFront size={24} />
          </div>
          <span>SiParkir</span>
        </div>
        <p className="text-slate-500 max-w-sm text-base leading-relaxed font-medium">
          Membangun ekosistem parkir cerdas yang aman, nyaman, dan transparan
          untuk masa depan perkotaan.
        </p>
      </div>

      <div>
        <h4 className="font-bold mb-6 text-slate-800 text-lg">Platform</h4>
        <ul className="space-y-4 text-sm font-medium text-slate-500">
          {["Fitur Utama", "Hardware Support", "Integrasi API", "Pricing"].map(
            (item) => (
              <li key={item}>
                <a href="#" className="hover:text-[#71C9CE] transition-colors">
                  {item}
                </a>
              </li>
            ),
          )}
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-6 text-slate-800 text-lg">Perusahaan</h4>
        <ul className="space-y-4 text-sm font-medium text-slate-500">
          {["Tentang Kami", "Karir", "Hubungi Kami", "Kebijakan Privasi"].map(
            (item) => (
              <li key={item}>
                <a href="#" className="hover:text-[#71C9CE] transition-colors">
                  {item}
                </a>
              </li>
            ),
          )}
        </ul>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-200 text-center">
      <p className="text-sm font-bold text-slate-400">
        &copy; {new Date().getFullYear()} SiParkir Parking System. All rights
        reserved.
      </p>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <main className="min-h-screen font-sans bg-[#F8FAFC] relative overflow-hidden selection:bg-[#71C9CE] selection:text-white">
      <BackgroundBlobs />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <Footer />
    </main>
  );
}
