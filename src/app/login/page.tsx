"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { User, Lock, AlertCircle, Car, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion"; // Import Animation Library

export default function LoginPage() {
  const { login, loading, error } = useAuth();

  // Local state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  // --- ANIMATION VARIANTS ---
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Jeda antar elemen
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">
      {/* --- BAGIAN KIRI: BRANDING / VISUAL (Hidden di Mobile) --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative flex-col justify-between p-12 text-white overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 z-0" />
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[80px]"
          />
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.3, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[20%] -right-[20%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px]"
          />
        </div>

        {/* Logo Area */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">SiParkir</h1>
        </motion.div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-lg">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl font-bold mb-4 leading-tight"
          >
            Kelola Sistem Parkir dengan Lebih{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
              Cerdas
            </span>
            .
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-blue-100 text-lg leading-relaxed"
          >
            Platform manajemen parkir terintegrasi untuk memantau transaksi,
            keamanan, dan pendapatan secara real-time.
          </motion.p>
        </div>

        {/* Footer Branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 flex items-center gap-2 text-sm text-blue-200/80 bg-blue-900/30 w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-blue-500/30"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Sistem Terenkripsi & Aman</span>
        </motion.div>
      </div>

      {/* --- BAGIAN KANAN: FORM LOGIN --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 bg-[#F8FAFC] relative">
        {/* Background Pattern Halus Kanan */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] z-0" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md space-y-8 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/60 relative z-10"
        >
          {/* Header Mobile (Logo hanya muncul di mobile disini) */}
          <motion.div variants={fadeInUp} className="text-center">
            <div className="lg:hidden mx-auto w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/30">
              <Car className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Selamat Datang
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Silakan masukkan kredensial akun Anda.
            </p>
          </motion.div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 overflow-hidden"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm text-red-600">
                <span className="font-semibold block mb-0.5">Gagal Masuk</span>
                {error}
              </div>
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <motion.div variants={fadeInUp} className="space-y-4">
              <Input
                id="username"
                label="Username"
                type="text"
                placeholder="Ex: petugas1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                startIcon={User}
                required
                autoComplete="username"
                className="bg-gray-50/50 focus:bg-white transition-all"
              />

              <div className="space-y-1">
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  startIcon={Lock}
                  required
                  autoComplete="current-password"
                  className="bg-gray-50/50 focus:bg-white transition-all"
                />

                <div className="flex justify-end pt-1">
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    Lupa password?
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={loading}
                className="h-12 text-base font-semibold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-300 rounded-xl"
              >
                Masuk ke Dashboard
              </Button>
            </motion.div>
          </form>

          {/* Footer Copyright */}
          <motion.div
            variants={fadeInUp}
            className="mt-6 text-center border-t border-gray-100 pt-6"
          >
            <p className="text-xs text-gray-400 font-medium">
              &copy; {new Date().getFullYear()} SiParkir System. All rights
              reserved.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
